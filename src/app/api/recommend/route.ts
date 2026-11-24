import { NextRequest, NextResponse } from "next/server";
import {
  ChatWizardPreferences,
  rankPlansByPreferences,
  RankedPlan,
  Operator
} from "@/lib/telecom";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
const LOCAL_MODEL = process.env.OLLAMA_LOCAL_MODEL || "llama3.2";
const CLOUD_MODEL = process.env.OLLAMA_CLOUD_MODEL || "gpt-oss:20b-cloud";

interface RawExtractedIntent {
  operator?: string | null;
  budget?: number | null;
  daily_data?: number | null;
  validity_days?: number | null;
  ott?: boolean | null;
  ott_platform?: string | null;
  five_g?: boolean | null;
  priority?: string | null;
}

export interface PlanExplanation {
  best_plan_reason: string;
  why_second: string;
  why_third: string;
  tradeoff: string;
}

const EXTRACTION_SYSTEM_PROMPT = `You are a precise telecom parameter extraction engine.
Analyze the user's natural language request and extract telecom preferences as a clean JSON object.

Rules:
1. "operator": "Jio" | "Airtel" | "Vi" | "BSNL" | null. Set ONLY if explicitly named.
2. "budget": number (max budget in INR) | null. Set ONLY if user explicitly specifies an amount or ceiling (e.g. 500, under 600, rs 400). Words like "cheap" or "affordable" mean priority="Lowest Cost" and budget=null. NEVER invent a number.
3. "daily_data": number (in GB) | null. Set ONLY if user explicitly mentions a numeric GB requirement (e.g. 2, 1.5, 3). Words like "lots of data" mean priority="Maximum Data" and daily_data=null. NEVER invent a number.
4. "validity_days": number | null. Explicit validity in days (e.g. 28, 56, 84, 365). Words like "1 month" mean 28, "3 months" mean 84, "annual" or "yearly" mean 365.
5. "ott": boolean | null. true if user asks for OTT, streaming, entertainment. false if user says "no ott" or "no entertainment".
6. "ott_platform": string | null. If user specifies a particular OTT platform (e.g. "Hotstar", "Netflix", "Prime Video", "SonyLIV", "JioCinema"), return that exact string, otherwise null.
7. "five_g": boolean | null. true if 5G is requested, false if explicitly not needed.
8. "priority": "Lowest Cost" | "Maximum Data" | "OTT Benefits" | "Long Validity" | "Best Value" | null.

Output ONLY valid JSON adhering to this schema. No markdown wrapping.`;

function sanitizePreferences(
  raw: RawExtractedIntent,
  existing?: Partial<ChatWizardPreferences>
): ChatWizardPreferences {
  const validOperators: Operator[] = ["Jio", "Airtel", "Vi", "BSNL"];
  const op = raw.operator && validOperators.includes(raw.operator as Operator)
    ? raw.operator
    : (existing?.currentOperator || "");

  let budgetRange = existing?.budgetRange || "";
  if (typeof raw.budget === "number" && !isNaN(raw.budget) && raw.budget > 0) {
    budgetRange = `₹${Math.round(raw.budget)}`;
  }

  let dailyData = existing?.dailyData || "";
  if (typeof raw.daily_data === "number" && !isNaN(raw.daily_data) && raw.daily_data > 0) {
    dailyData = `${raw.daily_data} GB`;
  }

  let validityPreference = existing?.validityPreference || "";
  if (typeof raw.validity_days === "number" && !isNaN(raw.validity_days) && raw.validity_days > 0) {
    validityPreference = `${Math.round(raw.validity_days)} Days`;
  }

  let fiveGRequired = existing?.fiveGRequired || "";
  if (raw.five_g === true) fiveGRequired = "Yes";
  else if (raw.five_g === false) fiveGRequired = "No";

  const validPriorities = ["Lowest Cost", "Maximum Data", "OTT Benefits", "Long Validity", "Best Value"];
  let priority = existing?.priority || "Best Value";
  if (raw.priority && validPriorities.includes(raw.priority)) {
    priority = raw.priority;
  }

  let ottPlatforms = existing?.ottPlatforms || [];
  if (raw.ott_platform) {
    ottPlatforms = [raw.ott_platform];
  } else if (raw.ott === true) {
    // Generic OTT: in telecom.ts, ["No Preference"] bypasses the "No OTT" check and yields targetOtts = [],
    // which assigns ottFit = 100 to all plans containing bundled OTT benefits.
    ottPlatforms = ["No Preference"];
    if (!raw.priority || raw.priority === "Best Value") {
      priority = "OTT Benefits";
    }
  } else if (raw.ott === false) {
    ottPlatforms = ["No OTT"];
  }

  return {
    currentOperator: op,
    budgetRange,
    dailyData,
    validityPreference,
    persona: existing?.persona || "Student",
    purpose: existing?.purpose || "Mixed Usage",
    fiveGRequired,
    ottPlatforms,
    priority,
    addonRequested: false,
    isInternationalRoaming: false,
  };
}

function parseJsonCleanly(rawStr: string): any {
  if (!rawStr) return null;
  let cleaned = rawStr.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return JSON.parse(cleaned);
}

function generateFallbackExplanation(
  prefs: ChatWizardPreferences,
  plans: any[]
): PlanExplanation {
  const p1 = plans[0];
  const p2 = plans[1];
  const p3 = plans[2];

  return {
    best_plan_reason: p1
      ? `${p1.operator} ${p1.planName} (₹${p1.price}) is the highest-ranked match (${Math.round(
          p1.finalScore * 100
        )}% score) satisfying your ${prefs.budgetRange || "budget"} and ${prefs.dailyData || "data"} criteria.`
      : "No matching plan found.",
    why_second: p2
      ? `${p2.operator} ${p2.planName} (₹${p2.price}) ranked second due to differences in bundled features or price.`
      : "Alternative not available.",
    why_third: p3
      ? `${p3.operator} ${p3.planName} (₹${p3.price}) was ranked third as it matches fewer specific requirements.`
      : "Alternative not available.",
    tradeoff: p1 && p2
      ? `${p1.planName} best satisfies your core requirements, while ${p2.planName} presents an alternate price/benefit balance.`
      : "Compare the candidate plans above.",
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userMessage: string = body.message || "";
    const existingPreferences: Partial<ChatWizardPreferences> = body.existingPreferences || {};

    if (!userMessage.trim()) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    // 1. Call Local Ollama (Edge AI) for parameter extraction
    let rawIntent: RawExtractedIntent = {};
    let localOllamaSuccess = false;

    try {
      const localRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: LOCAL_MODEL,
          prompt: `${EXTRACTION_SYSTEM_PROMPT}\n\nUser Message: "${userMessage}"\nJSON:`,
          format: "json",
          stream: false,
          options: {
            temperature: 0.1,
          },
        }),
      });

      if (localRes.ok) {
        const localData = await localRes.json();
        rawIntent = parseJsonCleanly(localData.response) || {};
        localOllamaSuccess = true;
      }
    } catch (localErr) {
      console.warn("Local Ollama extraction failed:", localErr);
      return NextResponse.json(
        {
          error: "Local Ollama service unavailable on localhost:11434. Ensure Ollama is running.",
          details: String(localErr),
        },
        { status: 503 }
      );
    }

    // 2. Validate and sanitize extracted preferences
    const sanitizedPrefs = sanitizePreferences(rawIntent, existingPreferences);

    // 3. Run existing deterministic recommendation engine (rankPlansByPreferences) unchanged
    const allRankedPlans: RankedPlan[] = rankPlansByPreferences(sanitizedPrefs);

    // Filter top 3 candidates to give to Cloud LLM for explainability
    const topCandidates = allRankedPlans.slice(0, 3).map((plan) => ({
      id: plan.id,
      operator: plan.operator,
      planName: plan.planName,
      price: plan.price,
      validityDays: plan.validityDays,
      dataPerDayGb: plan.dataPerDayGb,
      totalDataGb: plan.totalDataGb,
      fiveG: plan.fiveG,
      ott: plan.ott,
      highlight: plan.highlight,
      category: plan.category,
      finalScore: plan.finalScore,
      candidateScore: plan.candidateScore,
      budgetFit: plan.budgetFit,
      dataFit: plan.dataFit,
      ottFit: plan.ottFit,
      validityFit: plan.validityFit,
      operatorFit: plan.operatorFit,
      reason: plan.reason,
    }));

    // 4. Call Cloud Ollama (gpt-oss:20b-cloud) for comparative explainability & trade-off critique
    let explanation: PlanExplanation = generateFallbackExplanation(sanitizedPrefs, topCandidates);
    let cloudOllamaSuccess = false;

    if (topCandidates.length > 0) {
      const candidatesPromptSummary = topCandidates
        .map(
          (c, idx) =>
            `${idx + 1}. Plan ID: "${c.id}" | Name: "${c.operator} ${c.planName}" | Price: ₹${c.price} | Validity: ${
              c.validityDays
            } Days | Data: ${
              c.dataPerDayGb ? `${c.dataPerDayGb} GB/day` : `${c.totalDataGb || 0} GB Total`
            } | 5G: ${c.fiveG ? "Yes" : "No"} | Bundled OTTs: [${c.ott.join(", ")}]`
        )
        .join("\n");

      const explainPrompt = `You are a strict telecom plan analyst. Analyze these real candidate plans against the user's requirements and output structured explainability in JSON format.

User Requirements:
- Operator: ${sanitizedPrefs.currentOperator || "Any"}
- Budget: ${sanitizedPrefs.budgetRange || "Flexible"}
- Daily Data: ${sanitizedPrefs.dailyData || "Standard"}
- Validity: ${sanitizedPrefs.validityPreference || "Flexible"}
- OTT Requirement: ${sanitizedPrefs.ottPlatforms.length ? sanitizedPrefs.ottPlatforms.join(", ") : "None"}

Top Candidate Plans (Ground Truth from Catalog):
${candidatesPromptSummary}

Strict Grounding Rules:
- NEVER assume or infer that different OTT names are equivalent. For example, if a plan lists "JioHotstar Mobile", refer to it strictly as "JioHotstar Mobile" and do not claim it is Disney+ Hotstar or vice-versa unless explicitly identical in text.
- Refer strictly to the exact prices, data quantities, and OTT names listed in the candidate plans. Never hallucinate or assume unlisted benefits.
- Output ONLY valid JSON with these exact keys:
  "best_plan_reason": string (why plan 1 is ranked highest),
  "why_second": string (why plan 2 is second and its key differences or trade-offs),
  "why_third": string (why plan 3 is third or its primary limitation),
  "tradeoff": string (summary of the trade-off between the top choices)

JSON:`;

      try {
        const cloudRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: CLOUD_MODEL,
            prompt: explainPrompt,
            format: "json",
            stream: false,
            options: {
              temperature: 0.1, // Lower temperature for strict factual grounding
            },
          }),
        });

        if (cloudRes.ok) {
          const cloudData = await cloudRes.json();
          const parsedExplanation = parseJsonCleanly(cloudData.response);
          if (
            parsedExplanation &&
            typeof parsedExplanation.best_plan_reason === "string" &&
            typeof parsedExplanation.why_second === "string"
          ) {
            explanation = {
              best_plan_reason: parsedExplanation.best_plan_reason,
              why_second: parsedExplanation.why_second,
              why_third: parsedExplanation.why_third || "Not enough data for third plan.",
              tradeoff: parsedExplanation.tradeoff || "No major trade-offs detected.",
            };
            cloudOllamaSuccess = true;
          }
        }
      } catch (cloudErr) {
        console.warn("Cloud Ollama analyst call failed, using verified fallback:", cloudErr);
      }
    }

    return NextResponse.json({
      success: true,
      models: {
        local: LOCAL_MODEL,
        cloud: CLOUD_MODEL,
      },
      executionStatus: {
        localOllamaSuccess,
        cloudOllamaSuccess,
      },
      extracted: {
        raw: rawIntent,
        sanitized: sanitizedPrefs,
      },
      topPlans: topCandidates,
      explanation,
      totalCatalogEvaluated: allRankedPlans.length,
    });
  } catch (error: any) {
    console.error("API error in /api/recommend:", error);
    return NextResponse.json(
      { error: "Failed to process recommendation", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}
