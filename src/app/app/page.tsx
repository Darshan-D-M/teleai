"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  analyzeUsage,
  compareMetric,
  explainRecommendation,
  getCityOptions,
  getCoverageForCity,
  rankPlans,
  rankPlansByPreferences,
  savingsSummary,
  searchKnowledgeBase,
  usagePresets,
  planCatalog as initialPlanCatalog,
  operators,
  getOperatorCoverageScore,
  extractIntentFromQuery,
  parseNumericValue,
  isAddonPack,
  type RankedPlan,
  type UsageProfile,
  type Plan,
  type Operator,
  type ChatWizardPreferences,
} from "@/lib/telecom";

const mainNavigationItems = [
  { name: "AI Advisor", icon: "💬" },
  { name: "Dashboard", icon: "📊" },
  { name: "Plan Comparison", icon: "⚖️" },
  { name: "Plan Catalog", icon: "📖" },
  { name: "AI Analytics", icon: "📈" },
  { name: "Savings Analyzer", icon: "💰" },
  { name: "Profile & Preferences", icon: "👤" },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getDisplayPlanName(operator: string, planName: string) {
  if (planName.toLowerCase().startsWith(operator.toLowerCase())) {
    return planName;
  }
  return `${operator} ${planName}`;
}

function getNextUnfilledStep(
  op: string,
  validity: string,
  budget: string,
  data: string,
  persona: string,
  ottAnswered: boolean,
  fiveG: string,
  priority: string
): number {
  if (!op) return 1;
  if (!validity) return 2;
  if (!budget) return 3;
  if (!data) return 4;
  if (!persona) return 5;
  if (!ottAnswered) return 6;
  if (!fiveG) return 7;
  if (!priority) return 8;
  return 9;
}

function formatPlanData(plan: Plan) {
  if (typeof plan.dataPerDayGb === "number") {
    return `${plan.dataPerDayGb} GB/day`;
  }

  if (typeof plan.totalDataGb === "number") {
    return `${plan.totalDataGb} GB total`;
  }

  return "Voice focused";
}

function budgetRangeLabel(monthlySpend: number) {
  if (monthlySpend < 300) return "Under ₹300";
  if (monthlySpend <= 500) return "₹300–500";
  if (monthlySpend <= 800) return "₹500–800";
  return "₹800+";
}

// Circular progress ring matching the value score UI
function CircularProgress({ value }: { value: number }) {
  const radius = 18;
  const stroke = 3;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 10) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
        {/* Track */}
        <circle
          stroke="#F1F5F9"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Value circle */}
        <circle
          stroke="#10B981"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[10px] font-extrabold text-slate-800">{value.toFixed(1)}</span>
      </div>
    </div>
  );
}

function renderUserBubbleContent(content: string) {
  const lower = content.toLowerCase();
  if (lower.includes("airtel")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="h-5 w-5 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white shrink-0 font-black">A</span>
        {content}
      </span>
    );
  }
  if (lower.includes("jio")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] text-white shrink-0 font-black">J</span>
        {content}
      </span>
    );
  }
  if (lower.includes("vi")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="h-5 w-5 rounded-full bg-[#E21C24] flex items-center justify-center text-[10px] text-white shrink-0 font-black">V</span>
        {content}
      </span>
    );
  }
  if (lower.includes("bsnl")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center text-[10px] text-white shrink-0 font-black">B</span>
        {content}
      </span>
    );
  }
  if (lower.includes("₹") || lower.includes("budget") || lower.includes("spend")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-sm">👛</span>
        {content}
      </span>
    );
  }
  if (lower.includes("gb") || lower.includes("data") || lower.includes("unlimited")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-sm">📶</span>
        {content}
      </span>
    );
  }
  if (lower.includes("day") || lower.includes("month") || lower.includes("year") || lower.includes("validity")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-sm">📅</span>
        {content}
      </span>
    );
  }
  if (lower.includes("yes") || lower.includes("no")) {
    return (
      <span className="flex items-center gap-1.5 font-bold">
        <span className="text-sm">⚡</span>
        {content}
      </span>
    );
  }
  return <span className="font-bold">{content}</span>;
}

export default function Home() {
  const router = useRouter();
  // --- States ---
  const [showLandingPage, setShowLandingPage] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("AI Advisor");
  const [localCatalog, setLocalCatalog] = useState<Plan[]>(initialPlanCatalog);
  const [city, setCity] = useState("Bangalore");
  
  // Custom Profile settings state
  const [profilePreset, setProfilePreset] = useState<string>("creator");
  const [monthlySpend, setMonthlySpend] = useState(599);
  const [dataUsageGb, setDataUsageGb] = useState(60);
  const [callMinutes, setCallMinutes] = useState(1200);
  const [ottUsage, setOttUsage] = useState(true);
  const [preferredOperator, setPreferredOperator] = useState<Operator>("Jio");

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");
  const [catalogOperatorFilter, setCatalogOperatorFilter] = useState<string>("All");
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>("All");
  const [catalogFeedback, setCatalogFeedback] = useState("");
  
  // Compare state
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>(["jio-399", "airtel-838", "vi-399", "bsnl-347"]);
  
  // Catalog Form state
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanOperator, setNewPlanOperator] = useState<Operator>("Jio");
  const [newPlanPrice, setNewPlanPrice] = useState(399);
  const [newPlanValidity, setNewPlanValidity] = useState(28);
  const [newPlanDataPerDay, setNewPlanDataPerDay] = useState(2);
  const [newPlanOtt, setNewPlanOtt] = useState("");
  const [newPlan5G, setNewPlan5G] = useState(true);

  // Interactive Weights state for Recommendation Analytics
  const [weightBudget, setWeightBudget] = useState<number>(35);
  const [weightData, setWeightData] = useState<number>(25);
  const [weightOtt, setWeightOtt] = useState<number>(15);
  const [weightValidity, setWeightValidity] = useState<number>(15);
  const [weightOperator, setWeightOperator] = useState<number>(10);

  // Chat Advisor Messages pre-loaded for guided questionnaire
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState<boolean>(false);
  const [isReasoningOpen, setIsReasoningOpen] = useState<boolean>(true);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "assistant" | "user"; content: string; time: string; citations?: string[] }>>([
    {
      role: "assistant",
      content: "👋 Welcome to TeleAI!\n\nI'll help you find the best prepaid plan based on your budget, data usage, validity, and preferences.\n\nShall we begin? 🚀",
      time: "11:20 AM",
    }
  ]);

  // Chat Advisor step state
  // 0: Welcome / Let's Start
  // 1: Operator Currently Used (Q1)
  // 2: Monthly Budget (Q2)
  // 3: Daily Data Usage (Q3)
  // 4: Preferred Validity (Q4)
  // 5: Usage Persona (Q5)
  // 6: Primary Purpose (Q6)
  // 7: 5G Required? (Q7)
  // 8: OTT Platforms (Q8)
  // 9: What matters most? (Q9)
  // 10: Recommendation Generated
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Profile builder answers
  const [wizardOperator, setWizardOperator] = useState<string>("");
  const [wizardBudget, setWizardBudget] = useState<string>("");
  const [wizardData, setWizardData] = useState<string>("");
  const [wizardValidityPreference, setWizardValidityPreference] = useState<string>("");
  const [wizardPersona, setWizardPersona] = useState<string>("");
  const [wizardPurpose, setWizardPurpose] = useState<string>("");
  const [wizardFiveGRequired, setWizardFiveGRequired] = useState<string>("");
  const [wizardOttPlatforms, setWizardOttPlatforms] = useState<string[]>([]);
  const [wizardPriority, setWizardPriority] = useState<string>("");
  const [selectedOttPlatforms, setSelectedOttPlatforms] = useState<string[]>([]);
  const [wizardIsInternationalRoaming, setWizardIsInternationalRoaming] = useState<boolean>(false);
  const [isOttAnswered, setIsOttAnswered] = useState<boolean>(false);
  const [inferenceLogs, setInferenceLogs] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiLoadingPhase, setAiLoadingPhase] = useState<string>("");
  const [aiExplanation, setAiExplanation] = useState<{
    best_plan_reason: string;
    why_second: string;
    why_third: string;
    tradeoff: string;
  } | null>(null);
  const [whatIfChangeBanner, setWhatIfChangeBanner] = useState<string | null>(null);
  const [previousBestPlan, setPreviousBestPlan] = useState<{ id: string; name: string; price: number; operator: string } | null>(null);

  const operatorOptions = ["Jio", "Airtel", "Vi", "BSNL", "No Preference"];
  const frequencyOptions = ["Monthly (28-30 days)", "Quarterly (84 days)", "Annual (365 days)"];

  const getBudgetOptionsForFrequency = (frequency: string) => {
    if (frequency.includes("Monthly") || frequency === "28 Days") {
      return ["Under ₹300", "₹300-500", "₹500-800", "₹800+"];
    } else if (frequency.includes("Quarterly") || frequency === "84 Days") {
      return ["Under ₹700", "₹700-1000", "₹1000-1500", "₹1500+"];
    } else if (frequency.includes("Annual") || frequency === "365 Days") {
      return ["Under ₹2000", "₹2000-3000", "₹3000-4000", "₹4000+"];
    }
    return ["Under ₹300", "₹300-500", "₹500-800", "₹800+"];
  };

  const getOttPlatformOptionsForOperator = (operator: string) => {
    const defaultOtts = ["Hotstar", "Prime Video", "SonyLIV", "Zee5", "Netflix", "No OTT"];
    if (operator === "Airtel" || operator === "Vi" || operator === "BSNL") {
      return defaultOtts.filter(o => o !== "JioCinema");
    }
    if (operator === "Jio") {
      return ["Hotstar", "Prime Video", "SonyLIV", "Zee5", "Netflix", "JioCinema", "No OTT"];
    }
    return defaultOtts;
  };

  const dataOptions = ["<1 GB", "1.5 GB", "2 GB", "3 GB+"];
  const personaOptions = [
    "👨‍🎓 Student",
    "👨‍💼 Working Professional",
    "🏠 Homemaker",
    "👴 Senior Citizen",
    "💼 Business Owner",
    "👤 Other"
  ];
  const yesNoOptions = ["Yes", "No"];
  const priorityOptions = ["Lowest Cost", "Maximum Data", "Best Value", "OTT Benefits", "Long Validity"];

  const completionPercentage = useMemo(() => {
    const steps = [!!wizardOperator, !!wizardValidityPreference, !!wizardBudget, !!wizardData, !!wizardPersona, isOttAnswered, !!wizardFiveGRequired, !!wizardPriority];
    const filled = steps.filter(Boolean).length;
    return (filled / steps.length) * 100;
  }, [wizardOperator, wizardValidityPreference, wizardBudget, wizardData, wizardPersona, isOttAnswered, wizardFiveGRequired, wizardPriority]);

  const textProgressBar = useMemo(() => {
    const filled = Math.round(completionPercentage / 10);
    const empty = 10 - filled;
    return `[${"■".repeat(filled)}${"□".repeat(empty)}] ${Math.round(completionPercentage)}%`;
  }, [completionPercentage]);

  const getNextUnfilledStep = (op: string, val: string, bud: string, dat: string, per: string, ott: boolean, fiveG: string, pri: string) => {
    if (!op) return 1;
    if (!val) return 2;
    if (!bud) return 3;
    if (!dat) return 4;
    if (!per) return 5;
    if (!ott) return 6;
    if (!fiveG) return 7;
    if (!pri) return 8;
    return 9;
  };



  const generateRecommendation = (
    op: string,
    validity: string,
    budget: string,
    data: string,
    persona: string,
    otts: string[],
    fiveG: string,
    priority: string
  ) => {
    const askTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    let budgetVal = 599;
    const parsedBudgetNum = parseNumericValue(budget);
    if (parsedBudgetNum !== null) {
      budgetVal = parsedBudgetNum;
    } else {
      if (validity === "84 Days") {
        if (budget === "Under ₹700") budgetVal = 599;
        else if (budget === "₹700-1000") budgetVal = 850;
        else if (budget === "₹1000-1500") budgetVal = 1299;
        else if (budget === "₹1500+") budgetVal = 1799;
      } else if (validity === "365 Days") {
        if (budget === "Under ₹2000") budgetVal = 1799;
        else if (budget === "₹2000-3000") budgetVal = 2499;
        else if (budget === "₹3000-4000") budgetVal = 3499;
        else if (budget === "₹4000+") budgetVal = 4499;
      } else {
        // Monthly
        if (budget === "Under ₹300") budgetVal = 250;
        else if (budget === "₹300-500") budgetVal = 399;
        else if (budget === "₹500-800") budgetVal = 699;
        else if (budget === "₹800+") budgetVal = 899;
      }
    }
    setMonthlySpend(budgetVal);

    let dataVal = 60;
    const parsedDataNum = parseNumericValue(data);
    if (parsedDataNum !== null) {
      dataVal = parsedDataNum * 30; // convert daily to monthly usage
    } else {
      if (data === "<1 GB") dataVal = 15;
      else if (data === "1.5 GB") dataVal = 45;
      else if (data === "2 GB") dataVal = 60;
      else if (data === "3 GB+") dataVal = 90;
    }
    setDataUsageGb(dataVal);

    const opVal = (["Jio", "Airtel", "Vi", "BSNL"].includes(op) ? op : "Jio") as Operator;
    setPreferredOperator(opVal);
    setCity("Bangalore");
    setOttUsage(otts.length > 0 && !otts.includes("No OTT"));
    setWizardPriority(priority);

    const prefs: ChatWizardPreferences = {
      currentOperator: op,
      budgetRange: budget,
      dailyData: data,
      validityPreference: validity || "No Preference",
      persona: persona || "Mixed Usage",
      purpose: persona === "Gamer" ? "Gaming" : persona === "OTT Lover" ? "Streaming" : "Mixed Usage",
      fiveGRequired: fiveG || "No/Doesn't Matter",
      ottPlatforms: otts && otts.length > 0 ? otts : ["No OTT"],
      priority: priority || "Best Value",
      isInternationalRoaming: wizardIsInternationalRoaming
    };

    const ranked = rankPlansByPreferences(prefs, {
      budgetWeight: weightBudget,
      dataWeight: weightData,
      ottWeight: weightOtt,
      validityWeight: weightValidity,
      operatorWeight: weightOperator,
    });
    const bestMatch = ranked[0] || initialPlanCatalog[0];
    const alt1 = ranked[1] || ranked[0] || initialPlanCatalog[1];
    const alt2 = ranked[2] || ranked[1] || initialPlanCatalog[2];

    const reasonsList = bestMatch.reason.map(r => `✓ ${r}`);

    // Construct explainability table
    const factorWeightsText = `
**AI Recommendation Diagnostics**:
- **Budget Fit**: ${Math.round(bestMatch.budgetFit)}% (Weight: 35%)
- **Data Fit**: ${Math.round(bestMatch.dataFit)}% (Weight: 25%)
- **OTT Fit**: ${Math.round(bestMatch.ottFit)}% (Weight: 15%)
- **Validity Fit**: ${Math.round(bestMatch.validityFit)}% (Weight: 15%)
- **Operator Loyalty**: ${Math.round(bestMatch.operatorFit)}% (Weight: 10%)
`;

    setChatMessages(prev => [...prev, {
      role: "assistant",
      content: `Recommended: **${getDisplayPlanName(bestMatch.operator, bestMatch.planName)} (₹${bestMatch.price})**\n\nReasoning:\n${reasonsList.join("\n")}\n\nMatch Score: **${Math.round(bestMatch.finalScore * 100)}%**\n\n${factorWeightsText}\n\n---\n\n**Alternative plan reasoning**:\n\n1. **#2 Option: ${getDisplayPlanName(alt1.operator, alt1.planName)} (₹${alt1.price})**\n   Match Score: ${Math.round(alt1.finalScore * 100)}%\n   *Why?* ${alt1.reason[0] || "Fits budget"} & ${alt1.reason[2] || "Matches data consumption"}.\n\n2. **#3 Option: ${getDisplayPlanName(alt2.operator, alt2.planName)} (₹${alt2.price})**\n   Match Score: ${Math.round(alt2.finalScore * 100)}%\n   *Why?* ${alt2.reason[0] || "Fits budget"} & ${alt2.reason[2] || "Matches data consumption"}.`,
      time: askTime,
      citations: [bestMatch.id, alt1.id, alt2.id]
    }]);
  };

  const askQuestion = (step: number, validityVal: string, delay: number = 500) => {
    setTimeout(() => {
      const askTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      if (step === 1) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 1\nWhich operator do you currently use?", time: askTime }]);
      } else if (step === 2) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 2\nWhat is your preferred recharge frequency?\n(Monthly / Quarterly / Annual)", time: askTime }]);
      } else if (step === 3) {
        setChatMessages(prev => [...prev, { role: "assistant", content: `Question 3\nWhat is your recharge budget for ${validityVal || "this frequency"} plans?`, time: askTime }]);
      } else if (step === 4) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 4\nHow much data do you use daily?", time: askTime }]);
      } else if (step === 5) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 5\nWhat best describes you?", time: askTime }]);
      } else if (step === 6) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 6\nSelect the OTT streaming platforms you prefer:", time: askTime }]);
      } else if (step === 7) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 7\nDo you require high-speed 5G connectivity?", time: askTime }]);
      } else if (step === 8) {
        setChatMessages(prev => [...prev, { role: "assistant", content: "Question 8\nWhat matters most to you in a plan?", time: askTime }]);
      }
    }, delay);
  };

  const handleWizardAnswer = (answer: string | string[]) => {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    
    let op = wizardOperator;
    let validity = wizardValidityPreference;
    let budget = wizardBudget;
    let data = wizardData;
    let persona = wizardPersona;
    let ottFilled = isOttAnswered;
    let fiveG = wizardFiveGRequired;
    let priority = wizardPriority;
    let newOtts = wizardOttPlatforms;

    if (currentStep === 0) {
      const userText = typeof answer === "string" ? answer : "Let's start! 🚀";
      setChatMessages(prev => [...prev, { role: "user", content: userText, time: currentTime }]);
      const nextStep = getNextUnfilledStep("", "", "", "", "", false, "", "");
      setCurrentStep(nextStep);
      askQuestion(nextStep, "", 500);
      return;
    }
    else if (currentStep === 1) {
      op = answer as string;
      setWizardOperator(op);
      setChatMessages(prev => [...prev, { role: "user", content: op, time: currentTime }]);
    }
    else if (currentStep === 2) {
      const freq = answer as string;
      let valPref = "28 Days";
      if (freq.includes("Quarterly") || freq.includes("84")) valPref = "84 Days";
      else if (freq.includes("Annual") || freq.includes("365")) valPref = "365 Days";
      validity = valPref;
      setWizardValidityPreference(valPref);
      setChatMessages(prev => [...prev, { role: "user", content: freq, time: currentTime }]);
    }
    else if (currentStep === 3) {
      budget = answer as string;
      setWizardBudget(budget);
      setChatMessages(prev => [...prev, { role: "user", content: budget, time: currentTime }]);
    }
    else if (currentStep === 4) {
      data = answer as string;
      setWizardData(data);
      setChatMessages(prev => [...prev, { role: "user", content: data, time: currentTime }]);
    }
    else if (currentStep === 5) {
      persona = answer as string;
      setWizardPersona(persona);
      setChatMessages(prev => [...prev, { role: "user", content: persona, time: currentTime }]);
    }
    else if (currentStep === 6) {
      const selected = answer as string[];
      setWizardOttPlatforms(selected);
      newOtts = selected;
      ottFilled = true;
      setIsOttAnswered(true);
      const displayContent = selected.length > 0 ? selected.join(", ") : "No Preference";
      setChatMessages(prev => [...prev, { role: "user", content: displayContent, time: currentTime }]);
    }
    else if (currentStep === 7) {
      fiveG = answer as string;
      setWizardFiveGRequired(fiveG);
      setChatMessages(prev => [...prev, { role: "user", content: fiveG, time: currentTime }]);
    }
    else if (currentStep === 8) {
      priority = answer as string;
      setWizardPriority(priority);
      setChatMessages(prev => [...prev, { role: "user", content: priority, time: currentTime }]);
    }

    const nextStep = getNextUnfilledStep(
      op,
      validity,
      budget,
      data,
      persona,
      ottFilled,
      fiveG,
      priority
    );
    setCurrentStep(nextStep);

    if (nextStep === 9) {
      setTimeout(() => {
        generateRecommendation(op, validity, budget, data, persona, newOtts, fiveG, priority);
      }, 800);
    } else {
      askQuestion(nextStep, validity, 500);
    }
  };

  const renderMessageContent = (content: string, isUser: boolean) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className={isUser ? "font-black text-white" : "font-black text-slate-950"}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };


  // Coverage explorer zone
  const [selectedZone, setSelectedZone] = useState("Central");

  // Carousel scroll reference
  const carouselRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Helper to scroll the chat container to the last message's top
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (lastMessageRef.current && chatContainerRef.current) {
      const container = chatContainerRef.current;
      const element = lastMessageRef.current;
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      container.scrollTo({
        top: Math.max(0, relativeTop - 12),
        behavior,
      });
    } else if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    } else {
      chatBottomRef.current?.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    scrollToBottom("auto");
    const timeoutId = setTimeout(() => {
      scrollToBottom("smooth");
    }, 80);
    return () => clearTimeout(timeoutId);
  }, [chatMessages, currentStep]);

  // --- Dynamic Memos ---
  const profile = useMemo<UsageProfile>(() => ({
    userId: "custom-user",
    monthlySpend,
    dataUsageGb,
    callMinutes,
    smsUsage: 100,
    ottUsage,
    preferredOperator,
    city,
  }), [monthlySpend, dataUsageGb, callMinutes, ottUsage, preferredOperator, city]);

  const prefs = useMemo<ChatWizardPreferences>(() => {
    const budgetRange = wizardBudget || budgetRangeLabel(monthlySpend);
    const dailyData = wizardData || (dataUsageGb >= 90 ? "3 GB+" : dataUsageGb >= 60 ? "2 GB" : dataUsageGb >= 45 ? "1.5 GB" : "<1 GB");
    const validityPreference = wizardValidityPreference || "No Preference";
    const persona = wizardPersona || (profilePreset === "student" ? "Student" : profilePreset === "gamer" ? "Gamer" : profilePreset === "ott_lover" ? "OTT Lover" : profilePreset === "family" ? "Family" : "Mixed Usage");
    const purpose = wizardPurpose || (profilePreset === "gamer" ? "Gaming" : profilePreset === "ott_lover" ? "Streaming" : "Mixed Usage");
    const fiveGRequired = wizardFiveGRequired || (profilePreset === "gamer" || profilePreset === "student" ? "Yes" : "No/Doesn't Matter");
    const ottPlatforms = wizardOttPlatforms.length > 0 ? wizardOttPlatforms : (ottUsage ? ["Hotstar", "Prime Video"] : ["No OTT"]);
    const priority = wizardPriority || (profilePreset === "student" ? "Lowest Cost" : profilePreset === "gamer" ? "Maximum Data" : profilePreset === "ott_lover" ? "OTT Benefits" : profilePreset === "family" ? "Long Validity" : "Best Value");

    return {
      currentOperator: wizardOperator || preferredOperator,
      budgetRange,
      dailyData,
      validityPreference,
      persona,
      purpose,
      fiveGRequired,
      ottPlatforms,
      priority,
      isInternationalRoaming: wizardIsInternationalRoaming
    };
  }, [
    wizardOperator, preferredOperator,
    wizardBudget, monthlySpend,
    wizardData, dataUsageGb,
    wizardValidityPreference,
    wizardPersona, profilePreset,
    wizardPurpose,
    wizardFiveGRequired,
    wizardOttPlatforms, ottUsage,
    wizardPriority,
    wizardIsInternationalRoaming
  ]);

  const rankedPlans = useMemo(() => {
    return rankPlansByPreferences(prefs, {
      budgetWeight: weightBudget,
      dataWeight: weightData,
      ottWeight: weightOtt,
      validityWeight: weightValidity,
      operatorWeight: weightOperator
    });
  }, [prefs, weightBudget, weightData, weightOtt, weightValidity, weightOperator]);

  const bestPlan = useMemo(() => rankedPlans[0] || localCatalog[0], [rankedPlans, localCatalog]);
  const insights = useMemo(() => analyzeUsage(profile), [profile]);
  const savings = useMemo(() => savingsSummary(profile.monthlySpend, bestPlan.price), [bestPlan.price, profile.monthlySpend]);
  
  const coverage = useMemo(() => getCoverageForCity(city), [city]);
  const cityOptions = useMemo(() => getCityOptions(), []);
  const locationOptions = cityOptions;
  
  const topThreePlans = useMemo(() => {
    return rankedPlans.slice(0, 3);
  }, [rankedPlans]);

  useEffect(() => {
    if (!rankedPlans || rankedPlans.length === 0) return;
    
    const logs: string[] = [];
    const now = new Date().toLocaleTimeString();
    
    logs.push(`[${now}] [SYS] Initializing AI Inference Engine...`);
    logs.push(`[${now}] [SYS] Loaded ${initialPlanCatalog.length} plans from active catalog database.`);
    logs.push(`[${now}] [SYS] Parsing active wizard profile slots:`);
    logs.push(`      - Current Operator: "${prefs.currentOperator || "No Preference"}"`);
    logs.push(`      - Monthly Budget Target: "${prefs.budgetRange || "No Preference"}"`);
    logs.push(`      - Daily Data Target: "${prefs.dailyData || "No Preference"}"`);
    logs.push(`      - Validity Preference: "${prefs.validityPreference || "No Preference"}"`);
    logs.push(`      - OTT Preference: [${(prefs.ottPlatforms || []).join(", ") || "No Preference"}]`);
    logs.push(`      - 5G Required: "${prefs.fiveGRequired || "No/Doesn't Matter"}"`);
    logs.push(`      - Addon/Booster Requested: "${prefs.addonRequested ? "Yes" : "No"}"`);
    
    logs.push(`[${now}] [ALG] Applying MAUT weights:`);
    logs.push(`      - Budget Weight: ${Math.round(weightBudget)}%`);
    logs.push(`      - Data Weight: ${Math.round(weightData)}%`);
    logs.push(`      - OTT Weight: ${Math.round(weightOtt)}%`);
    logs.push(`      - Validity Weight: ${Math.round(weightValidity)}%`);
    logs.push(`      - Operator Weight: ${Math.round(weightOperator)}%`);
    
    logs.push(`[${now}] [ALG] Executing continuous & exact value utility matching...`);
    if (prefs.addonRequested) {
      logs.push(`[${now}] [ALG] Outgoing service validity rules: Boosting data add-on packs.`);
    } else {
      logs.push(`[${now}] [ALG] Standalone plan constraint: Penalizing voice-less data boosters.`);
    }
    
    const top3 = rankedPlans.slice(0, 3);
    logs.push(`[${now}] [ALG] Computed candidate match matrix:`);
    top3.forEach((plan, idx) => {
      logs.push(`      Candidate #${idx + 1}: ${plan.operator} ${plan.planName} (₹${plan.price})`);
      logs.push(`        * Budget Match: ${Math.round(plan.budgetFit)}%`);
      logs.push(`        * Data Match: ${Math.round(plan.dataFit)}%`);
      logs.push(`        * OTT Match: ${Math.round(plan.ottFit)}%`);
      logs.push(`        * Validity Match: ${Math.round(plan.validityFit)}%`);
      logs.push(`        * Operator Match: ${Math.round(plan.operatorFit)}%`);
      logs.push(`        * Raw Weighted Fit: ${Math.round(plan.candidateScore * 100)}%`);
      logs.push(`        * Final Score (Clamped & Boosted): ${Math.round(plan.finalScore * 100)}%`);
    });
    
    logs.push(`[${now}] [SYS] Best Recommendation Selected: ${top3[0]?.operator} ${top3[0]?.planName} (${Math.round(top3[0]?.finalScore * 100)}% Match)`);
    logs.push(`[${now}] [SYS] Inference execution complete.`);
    
    setInferenceLogs(logs);
  }, [rankedPlans, prefs, weightBudget, weightData, weightOtt, weightValidity, weightOperator]);
  
  const operatorComparisonPlans = useMemo(() => {
    return operators
      .map((operator) => rankedPlans.find((plan) => plan.operator === operator))
      .filter(Boolean) as RankedPlan[];
  }, [rankedPlans]);

  const recommendationReasons = useMemo(() => {
    return explainRecommendation(bestPlan, profile, city);
  }, [bestPlan, profile, city]);

  const questionnaireAnswers = useMemo(() => {
    let count = 0;
    if (wizardOperator) count++;
    if (wizardBudget) count++;
    if (wizardData) count++;
    if (wizardValidityPreference) count++;
    if (wizardPersona) count++;
    if (wizardPurpose) count++;
    if (wizardFiveGRequired) count++;
    if (wizardOttPlatforms.length > 0) count++;
    if (wizardPriority) count++;
    return count;
  }, [
    wizardOperator,
    wizardBudget,
    wizardData,
    wizardValidityPreference,
    wizardPersona,
    wizardPurpose,
    wizardFiveGRequired,
    wizardOttPlatforms,
    wizardPriority,
  ]);

  const advisorRequirements = useMemo(() => {
    return [
      { label: "Current Operator", value: wizardOperator || profile.preferredOperator },
      { label: "Validity / Freq", value: wizardValidityPreference || "No Preference" },
      { label: "Recharge Budget", value: wizardBudget || budgetRangeLabel(profile.monthlySpend) },
      { label: "Daily Data", value: wizardData || "1.5 GB" },
      { label: "Demographic Persona", value: wizardPersona || "Mixed Usage" },
      { label: "OTT Platforms", value: wizardOttPlatforms.includes("No Preference") ? "Any Bundled OTT" : wizardOttPlatforms.length > 0 ? wizardOttPlatforms.join(", ") : "No Preference" },
      { label: "5G Required", value: wizardFiveGRequired || "No" },
      { label: "What Matters Most", value: wizardPriority || "Best Value" },
    ];
  }, [
    profile.preferredOperator,
    profile.monthlySpend,
    wizardOperator,
    wizardBudget,
    wizardData,
    wizardValidityPreference,
    wizardPersona,
    wizardFiveGRequired,
    wizardOttPlatforms,
    wizardPriority,
  ]);

  const savingsCandidates = useMemo(() => {
    const cheaperPlans = rankedPlans.filter((plan) => plan.price <= profile.monthlySpend);
    return (cheaperPlans.length > 0 ? cheaperPlans : topThreePlans).slice(0, 3);
  }, [profile.monthlySpend, rankedPlans, topThreePlans]);

  const analyticsSummary = useMemo(() => {
    const totalCount = localCatalog.length;
    let budgetMatchCount = 0;
    let dataMatchCount = 0;
    let ottMatchCount = 0;
    let candidateCount = 0;

    for (const plan of rankedPlans) {
      if (plan.budgetFit >= 80) budgetMatchCount++;
      if (plan.dataFit >= 80) dataMatchCount++;
      if (plan.ottFit >= 80) ottMatchCount++;
      if (plan.finalScore >= 0.75) candidateCount++;
    }

    return {
      totalCount,
      budgetMatchCount,
      dataMatchCount,
      ottMatchCount,
      candidateCount
    };
  }, [rankedPlans, localCatalog]);

  // --- Handlers ---
  const applyPreset = (presetName: string) => {
    setProfilePreset(presetName);
    setCity("Bangalore");

    if (presetName === "student") {
      setMonthlySpend(299);
      setDataUsageGb(60);
      setCallMinutes(1000);
      setOttUsage(false);
      setPreferredOperator("Jio");
      
      // Update wizard answers for synchronization
      setWizardOperator("Jio");
      setWizardBudget("Under ₹300");
      setWizardData("2 GB");
      setWizardValidityPreference("28 Days");
      setWizardPersona("Student");
      setWizardPurpose("Social Media");
      setWizardFiveGRequired("Yes");
      setWizardOttPlatforms(["No OTT"]);
      setWizardPriority("Lowest Cost");
    } else if (presetName === "gamer") {
      setMonthlySpend(699);
      setDataUsageGb(90);
      setCallMinutes(1000);
      setOttUsage(false);
      setPreferredOperator("Airtel");

      setWizardOperator("Airtel");
      setWizardBudget("₹500-800");
      setWizardData("3 GB+");
      setWizardValidityPreference("56 Days");
      setWizardPersona("Gamer");
      setWizardPurpose("Gaming");
      setWizardFiveGRequired("Yes");
      setWizardOttPlatforms(["No OTT"]);
      setWizardPriority("Maximum Data");
    } else if (presetName === "ott_lover") {
      setMonthlySpend(899);
      setDataUsageGb(90);
      setCallMinutes(1200);
      setOttUsage(true);
      setPreferredOperator("Jio");

      setWizardOperator("Jio");
      setWizardBudget("₹800+");
      setWizardData("3 GB+");
      setWizardValidityPreference("84 Days");
      setWizardPersona("OTT Lover");
      setWizardPurpose("Streaming");
      setWizardFiveGRequired("Yes");
      setWizardOttPlatforms(["Hotstar", "Prime Video", "SonyLIV"]);
      setWizardPriority("OTT Benefits");
    } else if (presetName === "family") {
      setMonthlySpend(499);
      setDataUsageGb(45);
      setCallMinutes(2000);
      setOttUsage(false);
      setPreferredOperator("Airtel");

      setWizardOperator("Airtel");
      setWizardBudget("₹300-500");
      setWizardData("1.5 GB");
      setWizardValidityPreference("365 Days");
      setWizardPersona("Family");
      setWizardPurpose("Mixed Usage");
      setWizardFiveGRequired("No/Doesn't Matter");
      setWizardOttPlatforms(["No OTT"]);
      setWizardPriority("Long Validity");
    }
  };

  const handleCustomPlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    const newPlan: Plan = {
      id: `custom-${Date.now()}`,
      operator: newPlanOperator,
      planName: newPlanName,
      price: newPlanPrice,
      validityDays: newPlanValidity,
      voice: "Unlimited",
      fiveG: newPlan5G,
      ott: newPlanOtt ? newPlanOtt.split(",").map(item => item.trim()) : [],
      roaming: true,
      category: "Custom Mobile",
      source: "uploaded",
      highlight: `${newPlanOperator} Custom ${newPlanDataPerDay}GB/d Plan.`,
      dataPerDayGb: newPlanDataPerDay,
      existingPlanRequired: isAddonPack({
        id: "",
        operator: newPlanOperator,
        planName: newPlanName,
        price: newPlanPrice,
        validityDays: newPlanValidity,
        voice: "Unlimited",
        fiveG: newPlan5G,
        ott: newPlanOtt ? newPlanOtt.split(",").map(item => item.trim()) : [],
        roaming: true,
        category: "Custom Mobile",
        source: "uploaded",
        highlight: "",
        dataPerDayGb: newPlanDataPerDay,
      })
    };

    setLocalCatalog(prev => [newPlan, ...prev]);
    setIsAddPlanOpen(false);
    setCatalogFeedback(`${newPlanOperator} ${newPlanName} added to the catalog and ready for comparison.`);
    
    setNewPlanName("");
    setNewPlanOtt("");
  };

  const processSlotFilling = (text: string, parsed: Partial<ChatWizardPreferences>) => {
    const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    
    // Add user's message to chat
    setChatMessages(prev => [...prev, { role: "user", content: text, time: currentTime }]);
    setChatInput("");

    // Local variables to find the next unfilled question
    const newOperator = parsed.currentOperator || wizardOperator;
    const newValidity = parsed.validityPreference || wizardValidityPreference;
    const newBudget = parsed.budgetRange || wizardBudget;
    const newData = parsed.dailyData || wizardData;
    const newPersona = parsed.persona || wizardPersona || "Mixed Usage";
    const newFiveG = parsed.fiveGRequired || wizardFiveGRequired || "Yes";
    const newOtts = (parsed.ottPlatforms && parsed.ottPlatforms.length > 0) ? parsed.ottPlatforms : (wizardOttPlatforms.length > 0 ? wizardOttPlatforms : ["No OTT"]);
    const newPriority = parsed.priority || wizardPriority || "Best Value";
    const newRoaming = parsed.isInternationalRoaming !== undefined ? parsed.isInternationalRoaming : wizardIsInternationalRoaming;

    const isOttExtracted = (parsed.ottPlatforms && parsed.ottPlatforms.length > 0) || isOttAnswered;

    // Set React States
    if (parsed.currentOperator) setWizardOperator(parsed.currentOperator);
    if (parsed.budgetRange) setWizardBudget(parsed.budgetRange);
    if (parsed.dailyData) setWizardData(parsed.dailyData);
    if (parsed.validityPreference) setWizardValidityPreference(parsed.validityPreference);
    if (parsed.persona) setWizardPersona(parsed.persona);
    if (parsed.fiveGRequired) setWizardFiveGRequired(parsed.fiveGRequired);
    if (parsed.ottPlatforms) {
      setWizardOttPlatforms(parsed.ottPlatforms);
      setIsOttAnswered(true);
    }
    if (parsed.priority) setWizardPriority(parsed.priority);
    if (parsed.isInternationalRoaming !== undefined) {
      setWizardIsInternationalRoaming(parsed.isInternationalRoaming);
    }

    // Check if the query is a comprehensive / multi-parameter request
    const isComprehensiveQuery =
      (!!newOperator && !!newValidity && (!!newData || !!newBudget)) ||
      Object.keys(parsed).length >= 3;

    let nextStep = 9;

    if (isComprehensiveQuery) {
      // User provided full requirements; bypass optional questions and recommend directly
      setWizardPersona(newPersona);
      setWizardPriority(newPriority);
      setWizardFiveGRequired(newFiveG);
      if (!isOttAnswered && (!wizardOttPlatforms || wizardOttPlatforms.length === 0)) {
        setWizardOttPlatforms(newOtts);
        setIsOttAnswered(true);
      }
      nextStep = 9;
    } else {
      nextStep = getNextUnfilledStep(
        newOperator,
        newValidity,
        newBudget,
        newData,
        newPersona,
        isOttExtracted,
        newFiveG,
        newPriority
      );
    }

    setCurrentStep(nextStep);

    if (nextStep === 9) {
      setTimeout(() => {
        generateRecommendation(newOperator, newValidity, newBudget, newData, newPersona, newOtts, newFiveG, newPriority);
      }, 500);
    } else {
      askQuestion(nextStep, newValidity, 500);
    }
  };

  const handleChatTextSubmit = () => {
    const text = chatInput.trim();
    if (!text) return;

    // If user enters natural sentence or keyword requirement, route directly to Dual-LLM API
    if (
      currentStep >= 9 ||
      text.split(" ").length >= 3 ||
      /jio|airtel|vi|bsnl|budget|plan|data|gb|ott|validity|month|under|cheap|recommend|what if/i.test(text)
    ) {
      handleChatSend(text);
      return;
    }

    if (currentStep < 9) {
      const parsed = extractIntentFromQuery(text);
      if (Object.keys(parsed).length > 0) {
        processSlotFilling(text, parsed);
        return;
      }
    }

    const query = text.toLowerCase();
    let matchedChoice: string | string[] = "";

    if (currentStep === 0) {
      matchedChoice = "Let's start!";
    }
    else if (currentStep === 1) {
      if (query.includes("jio")) matchedChoice = "Jio";
      else if (query.includes("airtel")) matchedChoice = "Airtel";
      else if (query.includes("vi") || query.includes("voda")) matchedChoice = "Vi";
      else if (query.includes("bsnl")) matchedChoice = "BSNL";
      else matchedChoice = "No Preference";
    }
    else if (currentStep === 2) {
      if (query.includes("month") || query.includes("28") || query.includes("30")) matchedChoice = "Monthly (28-30 days)";
      else if (query.includes("quarter") || query.includes("84") || query.includes("3 months")) matchedChoice = "Quarterly (84 days)";
      else if (query.includes("year") || query.includes("365") || query.includes("annual")) matchedChoice = "Annual (365 days)";
      else matchedChoice = "Monthly (28-30 days)";
    }
    else if (currentStep === 3) {
      const nums = query.match(/\d+/g);
      if (nums && nums.length > 0) {
        matchedChoice = `₹${nums[0]}`;
      } else {
        matchedChoice = "₹300-500";
      }
    }
    else if (currentStep === 4) {
      if (query.includes("1.5") || query.includes("1.5gb")) matchedChoice = "1.5 GB/Day";
      else if (query.includes("2") || query.includes("2gb")) matchedChoice = "2 GB/Day";
      else if (query.includes("3") || query.includes("3gb")) matchedChoice = "3 GB/Day";
      else matchedChoice = "2 GB/Day";
    }
    else if (currentStep === 5) {
      if (query.includes("pro") || query.includes("work")) matchedChoice = "Working Professional";
      else if (query.includes("creator") || query.includes("stream")) matchedChoice = "Content Creator";
      else if (query.includes("heavy") || query.includes("game")) matchedChoice = "Heavy Data User";
      else matchedChoice = "Student";
    }
    else if (currentStep === 6) {
      if (query.includes("yes") || query.includes("5g")) matchedChoice = "Yes";
      else matchedChoice = "No";
    }
    else if (currentStep === 7) {
      if (query.includes("hotstar")) matchedChoice = ["Hotstar"];
      else if (query.includes("prime") || query.includes("amazon")) matchedChoice = ["Prime Video"];
      else if (query.includes("netflix")) matchedChoice = ["Netflix"];
      else if (query.includes("no") || query.includes("without")) matchedChoice = ["No OTT"];
      else matchedChoice = ["No OTT"];
    }
    else if (currentStep === 8) {
      if (query.includes("data") || query.includes("speed")) matchedChoice = "Maximum Data";
      else if (query.includes("cheap") || query.includes("cost") || query.includes("low")) matchedChoice = "Lowest Cost";
      else if (query.includes("ott") || query.includes("entertain")) matchedChoice = "OTT Benefits";
      else if (query.includes("valid") || query.includes("long")) matchedChoice = "Long Validity";
      else matchedChoice = "Best Value";
    }

    setChatInput("");
    handleWizardAnswer(matchedChoice);
  };

  const handleChatSend = async (customText?: string) => {
    const text = (customText ?? chatInput).trim();
    if (!text) return;

    const currentTime = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setChatMessages((current) => [...current, { role: "user", content: text, time: currentTime }]);
    setChatInput("");
    setIsAiLoading(true);
    setAiLoadingPhase("Local Ollama parsing requirements & ranking catalog...");

    try {
      const currentPrefs: Partial<ChatWizardPreferences> = {
        currentOperator: wizardOperator,
        budgetRange: wizardBudget,
        dailyData: wizardData,
        validityPreference: wizardValidityPreference,
        persona: wizardPersona,
        fiveGRequired: wizardFiveGRequired,
        ottPlatforms: wizardOttPlatforms,
        priority: wizardPriority,
        isInternationalRoaming: wizardIsInternationalRoaming,
      };

      const phaseTimer = setTimeout(() => {
        setAiLoadingPhase("Cloud Ollama (gpt-oss:20b-cloud) analyzing trade-offs & explainability...");
      }, 1200);

      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          existingPreferences: currentPrefs,
        }),
      });

      clearTimeout(phaseTimer);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.topPlans && data.topPlans.length > 0) {
          const sanitized = data.extracted?.sanitized;
          if (sanitized) {
            if (sanitized.currentOperator) setWizardOperator(sanitized.currentOperator);
            if (sanitized.budgetRange) setWizardBudget(sanitized.budgetRange);
            if (sanitized.dailyData) setWizardData(sanitized.dailyData);
            if (sanitized.validityPreference) setWizardValidityPreference(sanitized.validityPreference);
            if (sanitized.fiveGRequired) setWizardFiveGRequired(sanitized.fiveGRequired);
            if (sanitized.ottPlatforms && sanitized.ottPlatforms.length > 0) {
              setWizardOttPlatforms(sanitized.ottPlatforms);
              setIsOttAnswered(true);
            }
            if (sanitized.priority) setWizardPriority(sanitized.priority);
          }

          const newBest = data.topPlans[0];
          const explanation = data.explanation;
          setAiExplanation(explanation);

          // Track whether recommendation changed (for What-If)
          if (previousBestPlan) {
            if (previousBestPlan.id !== newBest.id) {
              setWhatIfChangeBanner(
                `Recommendation changed: ${previousBestPlan.operator} ${previousBestPlan.name} (₹${previousBestPlan.price}) → ${newBest.operator} ${newBest.planName} (₹${newBest.price})`
              );
            } else {
              setWhatIfChangeBanner(
                `Recommendation confirmed: ${newBest.operator} ${newBest.planName} (₹${newBest.price}) remains your optimal choice.`
              );
            }
          }
          setPreviousBestPlan({
            id: newBest.id,
            name: newBest.planName,
            price: newBest.price,
            operator: newBest.operator,
          });

          // Structured chat message containing Best Match + Explainability
          let answer = `🤖 **Dual-LLM Recommendation** (${data.models?.local || "Local"} + ${data.models?.cloud || "Cloud"})\n\n`;
          answer += `🏆 **Top Match**: **${newBest.operator} ${newBest.planName}** (₹${newBest.price}, ${newBest.validityDays} Days) — **${Math.round(newBest.finalScore * 100)}% Match**\n\n`;
          if (explanation?.best_plan_reason) {
            answer += `🎯 **Why this plan?**\n${explanation.best_plan_reason}\n\n`;
          }
          if (explanation?.why_second) {
            answer += `🥈 **Why not #${data.topPlans[1]?.planName || "Plan 2"}?**\n${explanation.why_second}\n\n`;
          }
          if (explanation?.why_third) {
            answer += `🥉 **Why not #${data.topPlans[2]?.planName || "Plan 3"}?**\n${explanation.why_third}\n\n`;
          }
          if (explanation?.tradeoff) {
            answer += `⚖️ **Trade-off Summary**:\n${explanation.tradeoff}`;
          }

          setChatMessages((current) => [
            ...current,
            { role: "assistant", content: answer, time: currentTime, citations: [newBest.id] },
          ]);
          return;
        }
      }

      // Fallback
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "⚠️ I encountered an issue consulting the Ollama models. Please ensure Ollama is running and retry your request.",
          time: currentTime,
        },
      ]);
    } catch (err: any) {
      console.error("Chat error calling /api/recommend:", err);
      setChatMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "⚠️ Network error connecting to recommendation engine. Please ensure your local server is active.",
          time: currentTime,
        },
      ]);
    } finally {
      setIsAiLoading(false);
      setAiLoadingPhase("");
    }
  };

  const handleWhatIfAction = async (actionType: "add_budget" | "need_84_days" | "drop_ott") => {
    if (isAiLoading) return;
    let query = "";
    if (actionType === "add_budget") {
      const currentBudgetNum = parseNumericValue(wizardBudget || "500") || 500;
      query = `What if I increase my budget to ₹${currentBudgetNum + 100}?`;
    } else if (actionType === "need_84_days") {
      query = "What if I need 84 days validity?";
    } else if (actionType === "drop_ott") {
      query = "What if I don't need any OTT subscription?";
    }
    await handleChatSend(query);
  };

  const handleAddRemoveCompare = (planId: string) => {
    setSelectedCompareIds(current => {
      if (current.includes(planId)) {
        return current.filter(id => id !== planId);
      }
      if (current.length >= 4) {
        return current;
      }
      return [...current, planId];
    });
  };

  const handleModelCurrentPlan = (plan: Plan) => {
    const modeledMonthlyData =
      typeof plan.dataPerDayGb === "number"
        ? Math.round(plan.dataPerDayGb * 30)
        : plan.totalDataGb ?? 12;

    setMonthlySpend(plan.price);
    setDataUsageGb(modeledMonthlyData);
    setCallMinutes(plan.voice.includes("Unlimited") ? 1200 : 300);
    setOttUsage(plan.ott.length > 0);
    setPreferredOperator(plan.operator);
    setProfilePreset("custom");
    setCatalogFeedback(`Using ${plan.operator} ${plan.planName} as your current baseline for savings analysis.`);
    setActiveTab("Savings Analyzer");
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const filteredCatalogForDisplay = useMemo(() => {
    return localCatalog.filter(plan => {
      if (catalogOperatorFilter !== "All" && plan.operator !== catalogOperatorFilter) return false;
      if (catalogCategoryFilter !== "All" && !plan.category.toLowerCase().includes(catalogCategoryFilter.toLowerCase())) return false;
      
      const query = searchQuery.toLowerCase();
      if (query) {
        return (
          plan.planName.toLowerCase().includes(query) ||
          plan.operator.toLowerCase().includes(query) ||
          plan.highlight.toLowerCase().includes(query) ||
          plan.ott.some(app => app.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [localCatalog, catalogOperatorFilter, catalogCategoryFilter, searchQuery]);

  if (showLandingPage) {
    return (
      <div className="h-screen w-full bg-[#F8FAFC] flex flex-col font-sans select-none overflow-hidden justify-between py-2.5">
        {/* Navigation Bar */}
        <header className="max-w-6xl mx-auto w-full px-6 py-2 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">TeleAI</span>
              <span className="text-[10px] text-slate-400 font-bold block">Smart Prepaid Advisor</span>
            </div>
          </div>
          <button 
            onClick={() => {
              setShowLandingPage(false);
              setActiveTab("AI Advisor");
            }}
            className="rounded-xl bg-[#6366F1] text-white px-5 py-2 text-xs font-extrabold shadow-md hover:bg-indigo-700 transition flex items-center gap-1.5"
          >
            <span>💬</span> Launch Chatbot
          </button>
        </header>

        {/* Hero Section */}
        <main className="max-w-6xl mx-auto w-full px-6 flex-1 grid gap-6 md:grid-cols-[1fr_1fr] items-center py-2.5">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100/50 rounded-full px-3.5 py-1 text-[10px] font-black text-indigo-600 uppercase tracking-wider">
              ✦ AI-Powered
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 leading-[1.12] tracking-tight">
                Find the Perfect <br />
                Prepaid Plan with <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
                Answer a few simple questions and let TeleAI recommend the best prepaid plans tailored just for you.
              </p>
            </div>

            {/* Bullet Feature List */}
            <div className="space-y-2 text-[11px] font-extrabold text-slate-600">
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] text-indigo-600">🔒</span>
                <span>Compare Jio, Airtel, Vi and BSNL plans</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] text-emerald-600">🔄</span>
                <span>Match plans to your budget & data needs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[9px] text-rose-600">▶️</span>
                <span>Find plans with your favorite OTTs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-5 w-5 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-[9px] text-violet-600">🤖</span>
                <span>Get personalized AI recommendations</span>
              </div>
            </div>

            <div className="pt-1">
              <button 
                onClick={() => {
                  setShowLandingPage(false);
                  setActiveTab("AI Advisor");
                }}
                className="w-full sm:w-auto rounded-xl bg-[#6366F1] hover:bg-indigo-700 text-white px-6 py-3 text-xs font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 transition"
              >
                <span>🤖</span>
                <span>Start AI Recommendation</span>
                <span>➔</span>
              </button>
              <p className="text-[9px] font-bold text-slate-400 mt-2 select-none flex items-center gap-1.5">
                <span className="text-emerald-500 font-extrabold">✓</span> 100% Secure • No Spam • Privacy First
              </p>
            </div>
          </div>

          {/* Right Hero: Unified Mockup Graphic */}
          <div className="flex justify-center items-center select-none pt-4 md:pt-0">
            <div className="relative w-full max-w-[420px]">
              <img 
                src="/robot_hero_landing.png" 
                alt="TeleAI Advisor Hero" 
                className="w-full max-h-[260px] md:max-h-[300px] object-contain"
              />
            </div>
          </div>
        </main>

        {/* Why choose TeleAI? Section */}
        <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
          <div className="text-center select-none">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Why choose TeleAI?</h2>
          </div>

          <div className="grid gap-3 grid-cols-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
              <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base shrink-0 select-none">
                👛
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-slate-950 leading-tight">Budget Optimization</h3>
                <p className="text-[9px] font-bold text-slate-400 leading-tight">
                  Find plans that give you the best value within your budget.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
              <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base shrink-0 select-none">
                📶
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">Smart Plan Matching</h3>
                <p className="text-[9px] font-bold text-slate-400 leading-tight">
                  AI analyzes data, validity, calls and more to find the perfect fit.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
              <div className="h-9 w-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-base shrink-0 select-none">
                ▶️
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">OTT Benefits Finder</h3>
                <p className="text-[9px] font-bold text-slate-400 leading-tight">
                  Get plans with Hotstar, Prime, SonyLIV, Zee5 and more.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
              <div className="h-9 w-9 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-base shrink-0 select-none">
                🧠
              </div>
              <div className="space-y-0.5">
                <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">AI Recommendation Engine</h3>
                <p className="text-[9px] font-bold text-slate-400 leading-tight">
                  Advanced AI scans 100+ plans to recommend the best for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works? Section */}
        <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
          <div className="text-center select-none">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">How it works?</h2>
          </div>

          <div className="flex items-center justify-between gap-2 select-none">
            
            {/* Step 1 */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
              <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
                1
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm mb-1">
                👤
              </div>
              <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Tell us your operator</h4>
              <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Choose your current mobile operator.</p>
            </div>

            <span className="text-slate-300 text-xs font-black select-none">➔</span>

            {/* Step 2 */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
              <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
                2
              </div>
              <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm mb-1">
                ₹
              </div>
              <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Enter your budget</h4>
              <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Select your monthly recharge budget.</p>
            </div>

            <span className="text-slate-300 text-xs font-black select-none">➔</span>

            {/* Step 3 */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
              <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
                3
              </div>
              <div className="h-8 w-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-sm mb-1">
                📤
              </div>
              <h4 className="text-[10px] font-black text-slate-950 leading-tight">Choose data needs</h4>
              <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Tell us how much data you use daily.</p>
            </div>

            <span className="text-slate-300 text-xs font-black select-none">➔</span>

            {/* Step 4 */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
              <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
                4
              </div>
              <div className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-sm mb-1">
                🎬
              </div>
              <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Select OTTs</h4>
              <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Pick your favorite OTT platforms.</p>
            </div>

            <span className="text-slate-300 text-xs font-black select-none">➔</span>

            {/* Step 5 */}
            <div className="relative bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
              <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
                5
              </div>
              <div className="h-8 w-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-sm mb-1">
                🎯
              </div>
              <h4 className="text-[10px] font-black text-indigo-950 leading-tight">Get AI recommendation</h4>
              <p className="text-[8px] font-semibold text-indigo-500 leading-tight mt-0.5">Receive the best prepaid plans personalized for you.</p>
            </div>

          </div>
        </section>

        {/* Supported Operators Section */}
        <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
          <div className="text-center select-none">
            <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Supported Operators</h2>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
              <img src="/jio.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Jio" />
              <div>
                <h4 className="text-xs font-black text-slate-955 text-slate-950">Jio</h4>
                <p className="text-[9px] text-slate-400 font-bold">Digital Life</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
              <img src="/airtel.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Airtel" />
              <div>
                <h4 className="text-xs font-black text-slate-955 text-slate-950">Airtel</h4>
                <p className="text-[9px] text-slate-400 font-bold">The Smart Network</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
              <img src="/vi.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Vi" />
              <div>
                <h4 className="text-xs font-black text-slate-955 text-slate-950">Vi</h4>
                <p className="text-[9px] text-slate-400 font-bold">Together for Tomorrow</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
              <img src="/bsnl.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="BSNL" />
              <div>
                <h4 className="text-xs font-black text-slate-955 text-slate-950">BSNL</h4>
                <p className="text-[9px] text-slate-400 font-bold">Connecting India</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="h-screen w-screen bg-[#F8FAFC] text-slate-800 font-sans flex overflow-hidden">
      
      {/* ====================================================
          1. LEFT SIDEBAR (MOCKUP EXACT MATCH)
          ==================================================== */}
      <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col justify-between py-6 px-4 shrink-0 select-none z-10">
        <div className="space-y-6">
          {/* Logo Header */}
          <div 
            onClick={() => router.push("/")}
            className="flex items-center gap-3 px-2 cursor-pointer hover:opacity-85 transition"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">TeleAI</span>
              <span className="text-[10px] text-slate-400 font-bold block">Smart Plan Advisor</span>
            </div>
          </div>

          {/* Navigation - Main Items */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-2 mb-2">MENU</span>
            {mainNavigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.name)}
                type="button"
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition duration-200 ${
                  activeTab === item.name
                    ? "bg-[#6366F1] text-white shadow-md shadow-indigo-500/20"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Chat bottom banner */}
        <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg shadow-indigo-500/15">
          <div className="absolute right-[-12px] bottom-[-12px] opacity-15 text-5xl">🤖</div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-100 block">AI Advisor</span>
          <p className="text-[11px] leading-relaxed text-indigo-50 mt-1 font-bold">Ask anything about plans, offers and coverage.</p>
          <button
            onClick={() => setActiveTab("AI Advisor")}
            type="button"
            className="w-full mt-3 bg-white text-indigo-600 font-extrabold text-[10px] py-2 rounded-xl transition hover:bg-slate-50"
          >
            Start Chat
          </button>
        </div>
      </aside>

      {/* ====================================================
          2. CENTER MAIN WINDOW 
          ==================================================== */}
      <div className={`flex-1 flex flex-col min-h-0 ${activeTab === "AI Advisor" ? "overflow-hidden" : "overflow-y-auto"} scrollbar-thin`}>
        
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-100 py-3.5 px-6 shrink-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Hello, Darshan 👋</h2>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">Let’s find the best plan for you</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Location selector */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs">📍</span>
              <select
                value="Bangalore"
                disabled
                className="pl-7 pr-8 py-2 border border-slate-100 rounded-xl bg-[#F8FAFC] text-xs font-extrabold text-slate-500 outline-none cursor-not-allowed transition opacity-80"
              >
                <option value="Bangalore">Bangalore</option>
              </select>
            </div>

            {/* Global Search bar */}
            <div className="relative w-[220px]">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search plans, operators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-100 rounded-xl bg-[#F8FAFC] text-xs outline-none focus:bg-white focus:border-indigo-400 transition"
              />
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-2">
              <div className="hidden rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-[10px] font-extrabold text-slate-500 md:block">
                PS198 Demo Scope
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-extrabold text-white ring-2 ring-indigo-50 border border-white">
                D
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className={activeTab === "AI Advisor" ? "flex-1 flex flex-col min-h-0 overflow-hidden p-6" : "p-6 space-y-6"}>
          
          {/* ====================================================
              2.1 DASHBOARD VIEW (MAIN TARGET VIEW)
              ==================================================== */}
          {activeTab === "Dashboard" && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              
              {/* Profile Preset Selectors (Floating bar) */}
              <div className="flex items-center gap-2 bg-white border border-slate-100 p-2 rounded-2xl shadow-sm max-w-max">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2">Preset Profiles</span>
                {[
                  { name: "student", label: "Student Mode" },
                  { name: "gamer", label: "Gamer Mode" },
                  { name: "ott_lover", label: "OTT Lover" },
                  { name: "family", label: "Family User" }
                ].map(preset => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.name)}
                    className={`rounded-xl px-4 py-1.5 text-xs font-bold transition duration-300 ${
                      profilePreset === preset.name
                        ? "bg-[#6366F1] text-white shadow-md"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Stats row cards */}
              <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Spend</span>
                    <p className="text-xl font-black text-slate-900">{formatPrice(profile.monthlySpend)}</p>
                    <span className="text-[9px] font-bold text-slate-400 block">Current Plan ⓘ</span>
                  </div>
                  <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center text-base">👛</div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Potential Savings</span>
                    <p className="text-xl font-black text-slate-900">{formatPrice(savings.monthlySavings)} <span className="text-xs font-bold text-slate-400">/month</span></p>
                    <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">Save up to 25%</span>
                  </div>
                  <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-base">📈</div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Data Used</span>
                    <p className="text-xl font-black text-slate-900">{profile.dataUsageGb} GB</p>
                    <span className="text-[9px] font-bold text-slate-400 block">This Month</span>
                  </div>
                  <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-base">📶</div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Network Score</span>
                    <p className="text-xl font-black text-slate-900">{coverage[0]?.overall.toFixed(1) ?? "0.0"} <span className="text-xs font-bold text-slate-400">/10</span></p>
                    <span className="text-[9px] font-bold text-slate-400 block">{coverage[0]?.operator ?? "No operator"} leads in {city}</span>
                  </div>
                  <div className="h-10 w-10 bg-pink-50 rounded-xl flex items-center justify-center text-base">📊</div>
                </div>
              </div>

              {/* Carousel of recommendations */}
              <section className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Top Plan Recommendations</h3>
                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">AI ranked the best plans for you</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button onClick={() => setActiveTab("Plan Catalog")} className="text-xs font-bold text-indigo-600 hover:underline">View All</button>
                    <div className="flex gap-1.5">
                      <button onClick={() => scrollCarousel("left")} className="h-7 w-7 border border-slate-150 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-xs font-extrabold transition">&larr;</button>
                      <button onClick={() => scrollCarousel("right")} className="h-7 w-7 border border-slate-150 bg-white hover:bg-slate-50 rounded-full flex items-center justify-center text-xs font-extrabold transition">&rarr;</button>
                    </div>
                  </div>
                </div>

                {/* Recommendations Cards Flex container */}
                <div ref={carouselRef} className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin select-none">
                  {topThreePlans.map((plan, idx) => {
                    const isJio = plan.operator === "Jio";
                    const isAirtel = plan.operator === "Airtel";
                    const isVi = plan.operator === "Vi";
                    
                    const badgeText = idx === 0 ? "Best Match" : idx === 1 ? "Great Value" : "Budget Friendly";
                    const badgeColor = idx === 0 ? "bg-violet-100 text-violet-700" : idx === 1 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";

                    return (
                      <div key={plan.id} className="min-w-[290px] flex-1 rounded-2xl border border-slate-100 bg-[#FAFAFA] p-4 flex flex-col justify-between hover:shadow-md hover:border-slate-200 transition duration-300">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase ${badgeColor}`}>{badgeText}</span>
                            <span className="text-[9px] font-black text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-full uppercase">{plan.validityDays} Days Validity</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm ${isJio ? "bg-blue-600" : isAirtel ? "bg-red-500" : isVi ? "bg-amber-500" : "bg-slate-800"}`}>
                              {plan.operator.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 font-bold block uppercase">{plan.operator} Prepaid</p>
                              <p className="text-lg font-black text-slate-900 mt-0.5">{formatPrice(plan.price)}</p>
                            </div>
                          </div>

                          {/* Plan Specifications grid */}
                          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] font-bold text-slate-700">
                            <div className="bg-white border border-slate-100 rounded-xl p-1.5">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Data</p>
                              <p className="text-slate-800 mt-0.5">{formatPlanData(plan)}</p>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-xl p-1.5">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">Calls</p>
                              <p className="text-slate-800 mt-0.5">{plan.voice}</p>
                            </div>
                            <div className="bg-white border border-slate-100 rounded-xl p-1.5">
                              <p className="text-[9px] text-slate-400 font-bold uppercase">SMS</p>
                              <p className="text-slate-800 mt-0.5">100 / day</p>
                            </div>
                          </div>

                          {/* App icons row */}
                          <div className="flex gap-1.5 items-center">
                            {plan.fiveG && <span className="bg-indigo-50 border border-indigo-100 rounded px-1.5 py-0.5 text-[8px] font-bold text-indigo-600 uppercase">5G</span>}
                            {plan.ott.map((app) => (
                              <span key={app} className="bg-pink-50 border border-pink-100 rounded px-1.5 py-0.5 text-[8px] font-bold text-pink-600 uppercase whitespace-nowrap overflow-hidden max-w-[80px]">
                                {app.slice(0, 8)}
                              </span>
                            ))}
                          </div>

                          {/* Reasoning box */}
                          <p className="text-[10px] leading-relaxed text-slate-500 italic bg-white border border-slate-50 rounded-xl p-2.5">
                            &ldquo;{plan.highlight}&rdquo;
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <CircularProgress value={plan.finalScore * 10} />
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Value Score</span>
                          </div>
                          <button
                            onClick={() => handleAddRemoveCompare(plan.id)}
                            className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold border transition ${
                              selectedCompareIds.includes(plan.id)
                                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {selectedCompareIds.includes(plan.id) ? "✓ Compare Selected" : "⚖️ Compare"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Bottom Row grid */}
              <div className="grid gap-5 md:grid-cols-12">
                
                {/* Plan Comparison Column (Width: 5 cols) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between md:col-span-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <h4 className="text-xs font-black text-slate-900 tracking-tight">Plan Comparison</h4>
                      <button onClick={() => setActiveTab("Plan Comparison")} className="text-[10px] font-bold text-indigo-600 hover:underline">View All</button>
                    </div>

                    <table className="w-full text-left text-[10px] font-bold">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-50">
                          <th className="py-2">Metric</th>
                          {operatorComparisonPlans.map((plan) => (
                            <th key={plan.id} className="py-2 text-center">
                              {plan.operator}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                        <tr>
                          <td className="py-2 text-slate-400 font-bold">Price</td>
                          {operatorComparisonPlans.map((plan) => (
                            <td key={`${plan.id}-price`} className="py-2 text-center text-slate-900 font-bold">
                              {formatPrice(plan.price)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-bold">Data</td>
                          {operatorComparisonPlans.map((plan) => (
                            <td key={`${plan.id}-data`} className="py-2 text-center">
                              {formatPlanData(plan)}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-bold">Validity</td>
                          {operatorComparisonPlans.map((plan) => (
                            <td key={`${plan.id}-validity`} className="py-2 text-center">
                              {plan.validityDays} Days
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-bold">OTT</td>
                          {operatorComparisonPlans.map((plan) => (
                            <td key={`${plan.id}-ott`} className="py-2 text-center">
                              {plan.ott.length > 0 ? plan.ott[0] : "None"}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-2 text-slate-400 font-bold">Match Score</td>
                          {operatorComparisonPlans.map((plan) => (
                            <td key={`${plan.id}-score`} className="py-2 text-center text-slate-900 font-bold">
                              {Math.round(plan.finalScore * 100)}%
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={() => setActiveTab("Plan Comparison")}
                    className="w-full mt-4 py-2 border border-slate-100 rounded-xl text-[10px] font-extrabold text-indigo-600 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                  >
                    ⚖️ Compare More Plans
                  </button>
                </div>

                {/* You Can Save More Column (Width: 3 cols) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between md:col-span-4">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-900 tracking-tight pb-2 border-b border-slate-50">You Can Save More!</h4>
                    <p className="text-[10px] text-slate-400 font-bold block uppercase">Switch & Save</p>

                    <div className="flex items-center justify-between gap-2 text-center">
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex-1">
                        <span className="text-[8px] text-slate-400 font-bold block uppercase">Current Plan</span>
                        <span className="text-xs font-black text-slate-800 block mt-0.5">{formatPrice(profile.monthlySpend)}/mo</span>
                        <span className="text-[9px] text-slate-400 block font-medium mt-0.5">{profile.preferredOperator} baseline</span>
                      </div>
                      <span className="text-slate-300 font-black text-xs select-none">&rarr;</span>
                      <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex-1">
                        <span className="text-[8px] text-indigo-600 font-bold block uppercase">Recommended</span>
                        <span className="text-xs font-black text-slate-800 block mt-0.5">{formatPrice(bestPlan.price)}/mo</span>
                        <span className="text-[9px] text-indigo-500 block font-bold mt-0.5">{bestPlan.operator} {bestPlan.planName}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-emerald-800 uppercase">You Save</p>
                        <p className="text-base font-black text-emerald-800">{formatPrice(savings.monthlySavings)} <span className="text-[10px] font-bold">/month</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-emerald-800 uppercase">Savings</p>
                        <p className="text-base font-black text-emerald-800">{formatPrice(savings.annualSavings)} <span className="text-[10px] font-bold">/year</span></p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("Savings Analyzer")}
                    className="w-full mt-4 py-2 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl text-[10px] font-extrabold text-indigo-600 transition"
                  >
                    View Better Plans
                  </button>
                </div>

                {/* Recommendation Analytics Column (Width: 4 cols) */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col justify-between md:col-span-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                      <h4 className="text-xs font-black text-slate-900 tracking-tight">AI Diagnostics</h4>
                      <button onClick={() => setActiveTab("AI Analytics")} className="text-[10px] font-bold text-indigo-600 hover:underline">View Analytics</button>
                    </div>
                    
                    <p className="text-[10px] text-slate-400 font-bold block uppercase">Plan Filter Funnel</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Total Catalog Plans</span>
                        <span className="text-slate-900 font-black">{analyticsSummary.totalCount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Budget Fits (&ge;80%)</span>
                        <span className="text-slate-900 font-black">{analyticsSummary.budgetMatchCount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Data Fits (&ge;80%)</span>
                        <span className="text-slate-900 font-black">{analyticsSummary.dataMatchCount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">OTT Fits (&ge;80%)</span>
                        <span className="text-slate-900 font-black">{analyticsSummary.ottMatchCount}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold pt-1.5 border-t border-slate-50">
                        <span className="text-indigo-600 font-extrabold">Final Candidates</span>
                        <span className="text-indigo-600 font-black">{analyticsSummary.candidateCount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("AI Analytics")}
                    className="w-full mt-4 py-2 border border-slate-100 rounded-xl text-[10px] font-extrabold text-indigo-600 hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                  >
                    📈 View Recommendation Funnel
                  </button>
                </div>

              </div>

            </div>
          )}

          {activeTab === "AI Advisor" && (
            <div className="flex-1 grid gap-6 xl:grid-cols-[1.34fr_1fr] min-h-0 overflow-hidden w-full animate-[fadeIn_0.3s_ease-out]">
              
              {/* Left Column: AI Chat Advisor */}
              <div className="flex-1 flex flex-col bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden min-h-0 h-full justify-between">
                
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/20 select-none">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🤖</span>
                    <div>
                      <span className="text-sm font-black text-slate-900 block leading-none">AI Chat Advisor</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCurrentStep(0);
                        setWizardOperator("");
                        setWizardBudget("");
                        setWizardData("");
                        setWizardValidityPreference("");
                        setWizardPersona("");
                        setWizardPurpose("");
                        setWizardFiveGRequired("");
                        setWizardOttPlatforms([]);
                        setIsOttAnswered(false);
                        setWizardPriority("");
                        setSelectedOttPlatforms([]);
                        setWizardIsInternationalRoaming(false);
                        setChatMessages([
                          {
                            role: "assistant",
                            content: "👋 Welcome to TeleAI!\n\nI'll help you find the best prepaid plan based on your budget, data usage, validity, and preferences.\n\nShall we begin? 🚀",
                            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                          }
                        ]);
                      }}
                      type="button"
                      className="rounded-xl border border-slate-200 hover:bg-slate-50 px-2.5 py-1.5 text-[10px] font-extrabold text-slate-600 transition flex items-center gap-1"
                      title="Reset Advisor Wizard"
                    >
                      <span>↻</span> Reset
                    </button>
                  </div>
                </div>

                {/* Progress Bar inside Chat Container */}
                <div className="px-6 py-2 border-b border-slate-100 bg-slate-50/20 flex items-center gap-3 select-none text-[10px] font-extrabold">
                  <span className="text-slate-500 shrink-0">Profile Completion</span>
                  <span className="text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-black shrink-0">{Math.round(completionPercentage)}%</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 rounded-full" 
                      style={{ width: `${completionPercentage}%` }} 
                    />
                  </div>
                </div>

                {/* Scrollable messages panel */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin">
                  {chatMessages.map((msg, i) => {
                    const isUser = msg.role === "user";
                    const isLast = i === chatMessages.length - 1;
                    return (
                      <div 
                        key={i} 
                        ref={isLast ? lastMessageRef : null}
                        className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                      >
                        {isUser ? (
                          <div className="flex flex-col items-end">
                            <div className="bg-[#6366F1] text-white rounded-2xl rounded-tr-none px-4 py-2.5 shadow-sm text-xs leading-relaxed font-bold">
                              {renderUserBubbleContent(msg.content)}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-400 font-bold px-1">
                              <span>{msg.time}</span>
                              <span className="text-indigo-500 font-extrabold text-[10px]">✓✓</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            {/* Assistant Badge */}
                            {msg.content.includes("Welcome to TeleAI") ? (
                              <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs shrink-0 select-none">
                                🤖
                              </div>
                            ) : msg.content.startsWith("Question ") ? (
                              <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white shrink-0 font-black">
                                {msg.content.match(/Question (\d+)/)?.[1] || "🤖"}
                              </div>
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 shrink-0 font-bold">
                                🤖
                              </div>
                            )}

                            <div className="flex flex-col">
                              <div className="bg-slate-50 border border-slate-100 text-slate-800 rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm text-xs leading-relaxed max-w-[90%]">
                                <p className="whitespace-pre-line">
                                  {renderMessageContent(
                                    msg.content.startsWith("Question ")
                                      ? msg.content.split("\n").slice(1).join("\n")
                                      : msg.content,
                                    false
                                  )}
                                </p>
                                
                                {msg.citations && msg.citations.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-200/40 flex flex-wrap gap-1">
                                    {msg.citations.map(cit => (
                                      <span key={cit} className="bg-slate-200 text-slate-600 rounded px-1.5 py-0.5 text-[8px] font-black uppercase">{cit}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">{msg.time}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {isAiLoading && (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/60 text-indigo-900 text-xs font-bold animate-pulse">
                      <div className="h-4 w-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin shrink-0" />
                      <span>{aiLoadingPhase || "AI reasoning in progress..."}</span>
                    </div>
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Suggestion Chips and Inputs */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/10 space-y-4">
                  
                  {/* Suggestion Chips */}
                  <div className="space-y-3">
                    {currentStep < 10 ? (
                      <div className="flex flex-col gap-2 w-full">
                        {currentStep === 0 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {[
                              "Yes, let's start",
                              "I have some preferences",
                              "Show popular plans",
                              "Help me choose"
                            ].map((opt) => (
                              <button
                                key={opt}
                                onClick={() => handleWizardAnswer(opt)}
                                type="button"
                                className="rounded-full border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 px-3.5 py-1.5 text-[10px] font-extrabold text-indigo-600 transition"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 1 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {operatorOptions.map((op) => (
                              <button
                                key={op}
                                onClick={() => handleWizardAnswer(op)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {op}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 2 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {frequencyOptions.map((f) => (
                              <button
                                key={f}
                                onClick={() => handleWizardAnswer(f)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 3 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {getBudgetOptionsForFrequency(wizardValidityPreference).map((b) => (
                              <button
                                key={b}
                                onClick={() => handleWizardAnswer(b)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 4 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {dataOptions.map((d) => (
                              <button
                                key={d}
                                onClick={() => handleWizardAnswer(d)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {d}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 5 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {personaOptions.map((p) => (
                              <button
                                key={p}
                                onClick={() => handleWizardAnswer(p)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 6 && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3 w-full">
                            <span className="text-[10px] font-bold text-slate-400 block uppercase">Select OTT Platforms</span>
                            <div className="grid grid-cols-2 gap-2">
                              {getOttPlatformOptionsForOperator(wizardOperator).map((ott) => {
                                const isSelected = selectedOttPlatforms.includes(ott);
                                return (
                                  <button
                                    key={ott}
                                    type="button"
                                    onClick={() => {
                                      setSelectedOttPlatforms(prev =>
                                        prev.includes(ott) ? prev.filter(item => item !== ott) : [...prev, ott]
                                      );
                                    }}
                                    className={`flex items-center gap-2 rounded-lg p-2 border text-[10px] font-bold transition ${
                                      isSelected
                                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                                  >
                                    <span>{isSelected ? "☑" : "☐"}</span>
                                    <span>{ott}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 pt-2 border-t border-slate-200/50">
                              <button
                                onClick={() => {
                                  setSelectedOttPlatforms([]);
                                  handleWizardAnswer([]);
                                }}
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-1.5 text-[10px] font-bold text-slate-500 transition"
                              >
                                No Preference
                              </button>
                              <button
                                onClick={() => handleWizardAnswer(selectedOttPlatforms)}
                                type="button"
                                className="flex-1 rounded-lg bg-[#6366F1] hover:bg-indigo-700 text-white py-1.5 text-[10px] font-bold transition shadow-sm"
                              >
                                Confirm
                              </button>
                            </div>
                          </div>
                        )}

                        {currentStep === 7 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {yesNoOptions.map((y) => (
                              <button
                                key={y}
                                onClick={() => handleWizardAnswer(y)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {y}
                              </button>
                            ))}
                          </div>
                        )}

                        {currentStep === 8 && (
                          <div className="flex flex-wrap gap-1.5 justify-center">
                            {priorityOptions.map((p) => (
                              <button
                                key={p}
                                onClick={() => handleWizardAnswer(p)}
                                type="button"
                                className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Standard Suggestion Chips when chatbot is in general mode */
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {["Explain Airtel ₹838", "Best plan under ₹300", "Jio vs BSNL coverage"].map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleChatSend(chip)}
                            type="button"
                            className="rounded-full border border-slate-150 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-[10px] font-extrabold text-slate-600 transition"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interactive What-If Scenario Chips */}
                  <div className="flex flex-wrap items-center gap-2 select-none pt-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <span>🔮</span> What-If Actions:
                    </span>
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={() => handleWhatIfAction("add_budget")}
                      className="px-2.5 py-1 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-[10px] font-extrabold border border-violet-200/80 transition shadow-xs disabled:opacity-50"
                    >
                      +₹100 Budget
                    </button>
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={() => handleWhatIfAction("need_84_days")}
                      className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-extrabold border border-blue-200/80 transition shadow-xs disabled:opacity-50"
                    >
                      Need 84 Days
                    </button>
                    <button
                      type="button"
                      disabled={isAiLoading}
                      onClick={() => handleWhatIfAction("drop_ott")}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-extrabold border border-slate-200 transition shadow-xs disabled:opacity-50"
                    >
                      Drop OTT
                    </button>
                  </div>

                  {/* Chat Input Text Area */}
                  <div className="flex gap-2 bg-[#F8FAFC] border border-slate-100 rounded-2xl p-1 shadow-inner">
                    <input
                      type="text"
                      placeholder={currentStep < 10 ? "Type your choice or click options..." : "Type your message..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleChatTextSubmit();
                        }
                      }}
                      className="flex-1 bg-transparent text-xs px-3 py-2 outline-none font-medium text-slate-800 placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => handleChatTextSubmit()}
                      type="button"
                      className="h-9 w-9 rounded-xl bg-[#6366F1] text-white flex items-center justify-center text-xs shadow-md transition hover:bg-indigo-700 shrink-0"
                    >
                      🚀
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider select-none">🔒 100% Encrypted & Secure Preference Matching</span>
                  </div>
                </div>

                {/* 3 Cards Grid Footer below Chat Panel */}
                <div className="grid grid-cols-3 gap-2.5 mt-4 px-1 select-none shrink-0">
                  <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex items-start gap-2">
                    <div className="h-7 w-7 rounded-xl bg-emerald-50 flex items-center justify-center text-xs text-emerald-600 shrink-0">
                      🛡️
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-900 leading-tight">100% Secure</h5>
                      <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">Your data is encrypted and private</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex items-start gap-2">
                    <div className="h-7 w-7 rounded-xl bg-purple-50 flex items-center justify-center text-xs text-purple-600 shrink-0">
                      🧠
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-900 leading-tight">AI Powered</h5>
                      <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">Smart recommendations just for you</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-2.5 shadow-sm flex items-start gap-2">
                    <div className="h-7 w-7 rounded-xl bg-amber-50 flex items-center justify-center text-xs text-amber-600 shrink-0">
                      ⚡
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-900 leading-tight">Real-time Plans</h5>
                      <p className="text-[8px] text-slate-400 font-bold mt-0.5 leading-tight">Latest plans and offers from all operators</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Profile & Recommendations */}
              <div className="space-y-6 overflow-y-auto pr-1 h-full min-h-0">
                
                {/* 1. Your Profile Summary Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 select-none">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">Your Profile</h4>
                    <button 
                      onClick={() => setActiveTab("Profile & Preferences")}
                      className="text-[10px] text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1 font-bold rounded-lg transition"
                    >
                      View Details
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 py-2 border-b border-slate-100/50">
                    <div className="relative flex items-center justify-center shrink-0 h-14 w-14 rounded-full border border-slate-100 bg-[#F8FAFC]">
                      <svg height={40} width={40} className="transform -rotate-90">
                        <circle
                          stroke="#F1F5F9"
                          fill="transparent"
                          strokeWidth={3}
                          r={16}
                          cx={20}
                          cy={20}
                        />
                        <circle
                          stroke="#6366F1"
                          fill="transparent"
                          strokeWidth={3}
                          strokeDasharray={16 * 2 * Math.PI + " " + 16 * 2 * Math.PI}
                          style={{ strokeDashoffset: (16 * 2 * Math.PI) - (completionPercentage / 100) * (16 * 2 * Math.PI) }}
                          strokeLinecap="round"
                          r={16}
                          cx={20}
                          cy={20}
                        />
                      </svg>
                      <div className="absolute text-[9px] font-black text-[#6366F1]">
                        {Math.round(completionPercentage)}%
                      </div>
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900">Setup Progress</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">
                        {completionPercentage === 100 ? "Completed! Excellent match generated." : "Answer a few more questions for better recommendations"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>👤</span>
                        <span>Operator</span>
                      </div>
                      <div className="text-slate-800">
                        {wizardOperator && ["Jio", "Airtel", "Vi", "BSNL"].includes(wizardOperator) ? (
                          <img src={`/${wizardOperator.toLowerCase()}.png`} className="h-5 w-5 rounded-full object-contain" />
                        ) : (
                          <span className="text-slate-400 font-bold">Not specified</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>👜</span>
                        <span>Budget</span>
                      </div>
                      <span className="text-slate-800">{wizardBudget || "Not specified"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>📶</span>
                        <span>Daily Data</span>
                      </div>
                      <span className="text-slate-800">{wizardData || "Not specified"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>📅</span>
                        <span>Validity</span>
                      </div>
                      <span className="text-slate-800">{wizardValidityPreference || "Not specified"}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-extrabold">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>📺</span>
                        <span>OTT Platforms</span>
                      </div>
                      <span className="text-slate-800 select-none">
                        {wizardOttPlatforms.includes("No Preference") ? "Any OTT >" : wizardOttPlatforms.length > 0 && !wizardOttPlatforms.includes("No OTT") ? `${wizardOttPlatforms.length} selected >` : "No Preference >"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button 
                      onClick={() => setActiveTab("Profile & Preferences")}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold"
                    >
                      + 4 more preferences
                    </button>
                  </div>
                </div>

                {/* 2. AI Top Recommendation Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4 select-none">
                  <div className="flex justify-between items-start">
                    <span className="bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                      Best Match For You
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-black text-slate-900">{formatPrice(bestPlan.price)}</span>
                      <span className="text-[9px] font-bold text-slate-400 block mt-0.5">{bestPlan.validityDays} Days Validity</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5 bg-slate-50/10 p-1.5 rounded-2xl">
                    <div className="h-12 w-12 rounded-full border border-slate-100 shadow-sm flex items-center justify-center bg-white shrink-0 object-contain p-1.5">
                      <img src={`/${bestPlan.operator.toLowerCase()}.png`} className="h-9 w-9 rounded-full object-contain" alt={bestPlan.operator} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        {getDisplayPlanName(bestPlan.operator, bestPlan.planName)}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bold mt-1">
                        Unlimited Calls · {formatPlanData(bestPlan)} · 100 SMS/Day
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                        {bestPlan.fiveG ? "5G Network" : "4G LTE Network"} · {bestPlan.operator} Apps Included
                      </p>
                    </div>
                  </div>

                  {/* Match Score Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">Match Score</span>
                      <span className="text-emerald-600 font-black">{Math.round(bestPlan.finalScore * 100)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.round(bestPlan.finalScore * 100)}%` }} 
                      />
                    </div>
                  </div>

                  {/* Features badges row */}
                  <div className="flex flex-wrap gap-1.5 text-[9px] font-bold text-slate-500 select-none">
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                      <span>📶</span>
                      <span>{formatPlanData(bestPlan)}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                      <span>📞</span>
                      <span>Unlimited Calls</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                      <span>✉️</span>
                      <span>100 SMS/Day</span>
                    </div>
                  </div>

                  {/* OTT platforms badges row */}
                  {bestPlan.ott && bestPlan.ott.length > 0 && !bestPlan.ott.includes("No OTT") && (
                    <div className="flex flex-wrap gap-1.5 items-center pt-1 select-none">
                      {bestPlan.ott.map((app, i) => (
                        <span key={i} className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <span>🎬</span> {app}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* What-If Status Banner */}
                  {whatIfChangeBanner && (
                    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/80 p-3 text-[11px] font-bold text-indigo-900 flex items-start gap-2 shadow-xs animate-[fadeIn_0.2s_ease-out]">
                      <span className="text-base">💡</span>
                      <div className="leading-snug">
                        <span className="font-extrabold uppercase text-[9px] text-indigo-500 block">Scenario Outcome</span>
                        {whatIfChangeBanner}
                      </div>
                    </div>
                  )}

                  {/* Dual-LLM Explainability Breakdown Card */}
                  {aiExplanation && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2.5 text-xs shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                          <span>☁️</span> Cloud AI Explainability (gpt-oss:20b)
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                          Catalog Grounded
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-800 flex items-center gap-1.5">
                          <span>🎯</span> Why this plan?
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed pl-3 border-l-2 border-emerald-500 font-medium">
                          {aiExplanation.best_plan_reason}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-800 flex items-center gap-1.5">
                          <span>🥈</span> Why not Plan 2?
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed pl-3 border-l-2 border-amber-500 font-medium">
                          {aiExplanation.why_second}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-slate-800 flex items-center gap-1.5">
                          <span>🥉</span> Why not Plan 3?
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed pl-3 border-l-2 border-slate-300 font-medium">
                          {aiExplanation.why_third}
                        </p>
                      </div>

                      <div className="space-y-1 pt-1 border-t border-slate-200/60">
                        <div className="text-[10px] font-black text-indigo-950 flex items-center gap-1.5">
                          <span>⚖️</span> Trade-off Summary
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed italic pl-3 border-l-2 border-indigo-400 font-medium">
                          {aiExplanation.tradeoff}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* What-If Scenario Simulator Card */}
                  <div className="rounded-2xl border border-violet-100 bg-violet-50/40 p-3.5 space-y-2 select-none">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
                        <span>🔮</span> What-If Scenario Simulator
                      </span>
                      {isAiLoading && (
                        <span className="text-[9px] font-extrabold text-violet-600 animate-pulse">Recalculating...</span>
                      )}
                    </div>
                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                      Click to explore how changing constraints dynamically recalculates your optimal plan:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleWhatIfAction("add_budget")}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-violet-200 hover:bg-violet-100/70 text-violet-800 text-[10px] font-extrabold shadow-xs transition disabled:opacity-50"
                      >
                        +₹100 Budget
                      </button>
                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleWhatIfAction("need_84_days")}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-blue-200 hover:bg-blue-100/70 text-blue-800 text-[10px] font-extrabold shadow-xs transition disabled:opacity-50"
                      >
                        Need 84 Days
                      </button>
                      <button
                        type="button"
                        disabled={isAiLoading}
                        onClick={() => handleWhatIfAction("drop_ott")}
                        className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-[10px] font-extrabold shadow-xs transition disabled:opacity-50"
                      >
                        Drop OTT
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveTab("Plan Comparison")}
                      className="w-full py-2.5 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-md transition text-center"
                    >
                      View Full Details & Compare
                    </button>
                  </div>
                </div>

                {/* Collapsible Diagnostics Console moved to Right Column */}
                <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3 font-mono text-xs text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <h4 className="text-slate-200 font-extrabold text-[10px] uppercase tracking-wider ml-1">
                        AI Inference Diagnostics
                      </h4>
                    </div>
                    <button 
                      onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
                      className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 px-2 py-0.5 rounded text-[9px] font-bold transition shrink-0"
                    >
                      {isDiagnosticsOpen ? "Hide ▴" : "Show ▾"}
                    </button>
                  </div>
                  
                  {isDiagnosticsOpen ? (
                    <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 space-y-1 text-slate-300">
                      {inferenceLogs.length > 0 ? (
                        inferenceLogs.map((log, idx) => (
                          <div key={idx} className="whitespace-pre-wrap leading-relaxed select-text font-mono text-[9px]">
                            {log.startsWith("      -") || log.startsWith("        *") ? (
                              <span className="text-slate-400">{log}</span>
                            ) : log.includes("[ALG]") ? (
                              <span className="text-cyan-400">{log}</span>
                            ) : log.includes("[SYS]") ? (
                              <span className="text-indigo-400">{log}</span>
                            ) : (
                              <span>{log}</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-500 italic text-[9px]">No logs yet. Complete step flow.</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[9px] text-slate-500 italic pl-1">
                      Engine Status: Active (Expand to view logs)
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {activeTab === "Profile & Preferences" && (
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6 max-w-3xl mx-auto animate-[fadeIn_0.3s_ease-out]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 select-none">
                <div>
                  <h3 className="text-base font-black text-slate-950">Profile & Preferences</h3>
                  <p className="text-xs text-slate-505 text-slate-500 mt-1">
                    Review and update your preferences to generate the best matched telecom plans.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    // Reset preferences
                    setCurrentStep(0);
                    setWizardOperator("");
                    setWizardBudget("");
                    setWizardData("");
                    setWizardValidityPreference("");
                    setWizardPersona("");
                    setWizardPurpose("");
                    setWizardFiveGRequired("");
                    setWizardOttPlatforms([]);
                    setIsOttAnswered(false);
                    setWizardPriority("");
                    setSelectedOttPlatforms([]);
                    setWizardIsInternationalRoaming(false);
                    setChatMessages([
                      {
                        role: "assistant",
                        content: "👋 Welcome to TeleAI!\n\nI'll help you find the best prepaid plan based on your budget, data usage, validity, and preferences.\n\nShall we begin? 🚀",
                        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                      }
                    ]);
                    setActiveTab("AI Advisor");
                  }}
                  className="rounded-xl border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 text-xs font-extrabold transition"
                >
                  Reset All Slots
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* 1. Operator Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">Preferred Operator</label>
                  <select
                    value={wizardOperator || "No Preference"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWizardOperator(val === "No Preference" ? "" : val);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    {operatorOptions.map((op) => (
                      <option key={op} value={op}>{op}</option>
                    ))}
                  </select>
                </div>

                {/* 2. Validity Preference */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">Validity Preference</label>
                  <select
                    value={wizardValidityPreference || "No Preference"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWizardValidityPreference(val === "No Preference" ? "" : val);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    <option value="No Preference">No Preference</option>
                    <option value="28 Days">Monthly (28-30 days)</option>
                    <option value="84 Days">Quarterly (84 days)</option>
                    <option value="365 Days">Annual (365 days)</option>
                  </select>
                </div>

                {/* 3. Budget Option */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">Budget Range</label>
                  <select
                    value={wizardBudget || "No Preference"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWizardBudget(val === "No Preference" ? "" : val);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    <option value="No Preference">No Preference</option>
                    {getBudgetOptionsForFrequency(wizardValidityPreference || "28 Days").map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* 4. Daily Data */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">Daily Data Requirement</label>
                  <select
                    value={wizardData || "No Preference"}
                    onChange={(e) => {
                      const val = e.target.value;
                      setWizardData(val === "No Preference" ? "" : val);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    <option value="No Preference">No Preference</option>
                    {dataOptions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Demographic Persona */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">Demographic Persona</label>
                  <select
                    value={wizardPersona || "Mixed Usage"}
                    onChange={(e) => {
                      setWizardPersona(e.target.value);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    {personaOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* 6. 5G Required */}
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-700 block">5G Required?</label>
                  <select
                    value={wizardFiveGRequired || "No"}
                    onChange={(e) => {
                      setWizardFiveGRequired(e.target.value);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    {yesNoOptions.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                {/* 7. Optimization Priority */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-700 block">Optimization Priority</label>
                  <select
                    value={wizardPriority || "Best Value"}
                    onChange={(e) => {
                      setWizardPriority(e.target.value);
                    }}
                    className="w-full p-3 border border-slate-150 rounded-2xl bg-slate-50/50 text-xs font-extrabold text-slate-700 outline-none focus:bg-white focus:border-indigo-400 transition"
                  >
                    {priorityOptions.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                {/* 8. OTT Platforms */}
                <div className="space-y-2 md:col-span-2 select-none">
                  <label className="text-xs font-black text-slate-700 block">Preferred OTT Platforms</label>
                  <div className="grid grid-cols-3 gap-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                    {getOttPlatformOptionsForOperator(wizardOperator || "Jio").map((ott) => {
                      const isSelected = wizardOttPlatforms.includes(ott);
                      return (
                        <button
                          key={ott}
                          type="button"
                          onClick={() => {
                            setWizardOttPlatforms(prev =>
                              prev.includes(ott) ? prev.filter(item => item !== ott) : [...prev, ott]
                            );
                          }}
                          className={`flex items-center gap-2 rounded-xl p-2.5 border text-xs font-extrabold transition ${
                            isSelected
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold"
                              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          <span>{isSelected ? "☑" : "☐"}</span>
                          <span>{ott}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
                <button
                  onClick={() => {
                    setActiveTab("AI Advisor");
                  }}
                  className="rounded-xl border border-slate-200 hover:bg-slate-50 px-5 py-2.5 text-xs font-extrabold text-slate-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setActiveTab("AI Advisor");
                  }}
                  className="rounded-xl bg-[#6366F1] hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-extrabold transition shadow-md"
                >
                  Apply & View Matches
                </button>
              </div>
            </div>
          )}

          {activeTab === "Savings Analyzer" && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-950">Switch & Save Analyzer</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Compare your current monthly spend against the strongest recommendation for your needs.
                      </p>
                    </div>
                    <button onClick={() => setActiveTab("Plan Catalog")} className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-extrabold text-slate-600 hover:bg-slate-50 transition">
                      Open Plan Catalog
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                    <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Baseline</p>
                      <p className="text-3xl font-black text-slate-900 mt-3">{formatPrice(profile.monthlySpend)}</p>
                      <p className="text-[11px] font-bold text-slate-500 mt-2">{profile.preferredOperator} user profile</p>
                    </div>
                    <div className="text-center text-2xl font-black text-slate-300">&rarr;</div>
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50/70 p-5 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Recommended Plan</p>
                      <p className="text-3xl font-black text-slate-900 mt-3">{formatPrice(bestPlan.price)}</p>
                      <p className="text-[11px] font-bold text-indigo-600 mt-2">{bestPlan.operator} {bestPlan.planName}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Monthly Savings</p>
                      <p className="text-3xl font-black text-emerald-700 mt-3">{formatPrice(savings.monthlySavings)}</p>
                    </div>
                    <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Annual Savings</p>
                      <p className="text-3xl font-black text-indigo-700 mt-3">{formatPrice(savings.annualSavings)}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                    <p className="text-sm font-bold text-slate-700 leading-relaxed">
                      {savings.monthlySavings > 0
                        ? `You can lower spend by ${formatPrice(savings.monthlySavings)} each month without losing the fit on coverage, data, or OTT needs.`
                        : "Your current baseline already sits near the best-value recommendation for the selected profile."}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Why this recommendation saves money</h4>
                    <p className="text-xs text-slate-500 mt-1">A compact explanation you can use during the evaluator walkthrough.</p>
                  </div>

                  <div className="space-y-3">
                    {recommendationReasons.map((reason) => (
                      <div key={reason} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{reason}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl bg-slate-950 text-white p-5 space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Recommended snapshot</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Data</p>
                        <p className="text-sm font-black mt-1">{formatPlanData(bestPlan)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Validity</p>
                        <p className="text-sm font-black mt-1">{bestPlan.validityDays} days</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">OTT</p>
                        <p className="text-sm font-black mt-1">{bestPlan.ott.length > 0 ? bestPlan.ott.join(", ") : "No OTT bundle"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-slate-400">Coverage</p>
                        <p className="text-sm font-black mt-1">{bestPlan.operatorCoverage.toFixed(1)}/10 in {city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Potential Switch Candidates</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Top options that keep spend at or below your current monthly model.</p>
                  </div>
                  <button onClick={() => setActiveTab("Plan Comparison")} className="text-xs font-bold text-indigo-600 hover:underline">
                    Compare Plans
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {savingsCandidates.map((plan) => (
                    <div key={plan.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{plan.operator}</p>
                          {plan.existingPlanRequired && (
                            <span className="rounded bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 text-[7px] font-bold text-amber-700 uppercase tracking-wider scale-95 origin-right">
                              ⚠️ Add-on
                            </span>
                          )}
                        </div>
                        <h5 className="text-sm font-black text-slate-900 mt-2">{plan.planName}</h5>
                        <p className="text-xl font-black text-slate-900 mt-3">{formatPrice(plan.price)}</p>
                        <p className="text-[10px] font-bold text-slate-500 mt-1">{formatPlanData(plan)} · {plan.validityDays} days</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Match</span>
                        <span className="text-sm font-black text-emerald-600">{Math.round(plan.finalScore * 100)}%</span>
                      </div>
                      <button onClick={() => handleAddRemoveCompare(plan.id)} className="w-full rounded-xl border border-slate-200 bg-white py-2 text-[10px] font-extrabold text-slate-600 hover:bg-slate-50 transition">
                        {selectedCompareIds.includes(plan.id) ? "Selected for Comparison" : "Add to Comparison"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====================================================
              2.2 DEDICATED FULL VIEW TABS (OPTIONAL SECTIONS OVER Dashboard)
              ==================================================== */}
          {activeTab === "Plan Comparison" && (
            <div className="space-y-5 bg-white border border-slate-100 rounded-3xl p-5 shadow-sm animate-[fadeIn_0.3s_ease-out]">
              <h3 className="text-base font-black text-slate-950">Compare Plans</h3>
              <p className="text-xs text-slate-500">Compare Jio, Airtel, Vi, and BSNL plans side-by-side on price, data, validity, OTT, and value.</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                {rankedPlans.map(plan => (
                  <button
                    key={plan.id}
                    onClick={() => handleAddRemoveCompare(plan.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                      selectedCompareIds.includes(plan.id)
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {selectedCompareIds.includes(plan.id) ? `✓ ${plan.operator} ₹${plan.price}` : `+ ${plan.operator} ₹${plan.price}`}
                  </button>
                ))}
              </div>

              {selectedCompareIds.length > 0 ? (
                <div className="overflow-x-auto pt-4 border-t border-slate-100">
                  <table className="w-full min-w-[600px] text-left text-xs font-bold">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 font-bold text-slate-400 uppercase">Parameter</th>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          if (!plan) return null;
                          return (
                            <th key={id} className="py-3 px-4 text-center">
                              <p className="text-[10px] text-indigo-600 uppercase font-black">{plan.operator}</p>
                              <p className="text-base font-black mt-0.5">{formatPrice(plan.price)}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{plan.planName}</p>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">Data</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          return <td key={id} className="py-3 px-4 text-center font-bold">{plan ? formatPlanData(plan) : "-"}</td>;
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">Validity</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          return <td key={id} className="py-3 px-4 text-center font-bold">{plan?.validityDays} Days</td>;
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">Calls</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          return <td key={id} className="py-3 px-4 text-center">{plan?.voice}</td>;
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">5G Ready</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          return <td key={id} className="py-3 px-4 text-center font-bold text-indigo-600">{plan?.fiveG ? "Yes ⚡" : "No"}</td>;
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">Bundled Streaming</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          return (
                            <td key={id} className="py-3 px-4 text-center">
                              {plan?.ott && plan.ott.length > 0 ? (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {plan.ott.map(app => (
                                    <span key={app} className="bg-pink-50 text-pink-600 rounded px-1.5 py-0.5 text-[9px] font-bold">{app}</span>
                                  ))}
                                </div>
                              ) : "-"}
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="py-3 text-slate-400 font-bold">Value Score</td>
                        {selectedCompareIds.map(id => {
                          const plan = localCatalog.find(p => p.id === id);
                          if (!plan) return <td key={id} className="py-3 px-4 text-center">-</td>;
                          const stats = compareMetric(plan, city);
                          return <td key={id} className="py-3 px-4 text-center font-black text-emerald-600 text-sm">{Math.round(stats.valueScore)}%</td>;
                        })}
                      </tr>
                      <tr className="bg-slate-50/30">
                        <td className="py-4 text-slate-400 font-bold">AI Verdict</td>
                        {selectedCompareIds.map(id => {
                          const rankedPlan = rankedPlans.find(p => p.id === id);
                          if (!rankedPlan) return <td key={id} className="py-4 px-4 text-center">-</td>;
                          
                          const pros: string[] = [];
                          const cons: string[] = [];

                          if (rankedPlan.existingPlanRequired) {
                            cons.push("Requires active base plan");
                          }

                          if (rankedPlan.budgetFit >= 80) pros.push("Matches budget");
                          else if (rankedPlan.budgetFit <= 40) cons.push("Exceeds budget limit");

                          if (rankedPlan.dataFit >= 80) pros.push("Matches daily data usage");
                          else if (rankedPlan.dataFit <= 40) cons.push("Insufficient daily data");

                          if (rankedPlan.fiveG && prefs.fiveGRequired === "Yes") pros.push("5G network enabled");
                          else if (!rankedPlan.fiveG && prefs.fiveGRequired === "Yes") cons.push("Lacks 5G network");

                          if (rankedPlan.ottFit >= 80) pros.push("Includes requested OTTs");
                          else if (rankedPlan.ott.length > 0) pros.push("Includes streaming benefits");
                          else if (prefs.ottPlatforms.length > 0 && !prefs.ottPlatforms.includes("No OTT")) cons.push("No OTT apps");

                          if (rankedPlan.validityFit >= 80) pros.push("Matches validity request");

                          let badgeText = "Alternative Fit";
                          let badgeColor = "bg-slate-100 text-slate-700";
                          if (rankedPlan.finalScore >= 0.85) {
                            badgeText = "Highly Recommended";
                            badgeColor = "bg-emerald-100 text-emerald-700 border border-emerald-200";
                          } else if (rankedPlan.finalScore >= 0.65) {
                            badgeText = "Recommended";
                            badgeColor = "bg-indigo-100 text-indigo-700 border border-indigo-200";
                          } else {
                            badgeText = "Not Recommended";
                            badgeColor = "bg-rose-100 text-rose-700 border border-rose-200";
                          }

                          return (
                            <td key={id} className="py-4 px-4 text-center space-y-2 align-top">
                              <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${badgeColor}`}>
                                {badgeText}
                              </span>
                              <div className="text-left max-w-[150px] mx-auto space-y-1 mt-2 text-[9px]">
                                {pros.slice(0, 2).map(pro => (
                                  <div key={pro} className="text-emerald-600 font-bold flex items-center gap-1">
                                    <span>✓</span> <span>{pro}</span>
                                  </div>
                                ))}
                                {cons.slice(0, 2).map(con => (
                                  <div key={con} className="text-rose-500 font-bold flex items-center gap-1">
                                    <span>✗</span> <span>{con}</span>
                                  </div>
                                ))}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 font-bold border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  Select plans above to evaluate specs side-by-side.
                </div>
              )}
            </div>
          )}

          {activeTab === "AI Analytics" && (
            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] animate-[fadeIn_0.3s_ease-out]">
              {/* Funnel & Metrics */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-black text-slate-950">AI Decision Path Funnel</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    See how plans drop off at each filtering phase based on your constraints.
                  </p>
                </div>

                {/* Funnel visualization */}
                <div className="space-y-4">
                  {/* Step 1 */}
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-black">1</div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Total Catalog Plans</p>
                        <p className="text-[10px] text-slate-400 font-bold">Total prepaid datasets loaded</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{analyticsSummary.totalCount}</span>
                  </div>

                  {/* Funnel Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-4 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-black">2</div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Operator Fits (&ge;80%)</p>
                        <p className="text-[10px] text-slate-400 font-bold">Matches user preferred carrier</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">
                      {rankedPlans.filter((p) => p.operatorFit >= 80).length}
                    </span>
                  </div>

                  {/* Funnel Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-4 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-black">3</div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Budget Fits (&ge;80%)</p>
                        <p className="text-[10px] text-slate-400 font-bold">Matches user pricing bracket ({wizardBudget || budgetRangeLabel(monthlySpend)})</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{analyticsSummary.budgetMatchCount}</span>
                  </div>

                  {/* Funnel Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-4 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-500 flex items-center justify-center text-white text-xs font-black">4</div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">Data Fits (&ge;80%)</p>
                        <p className="text-[10px] text-slate-400 font-bold">Matches user usage pattern</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{analyticsSummary.dataMatchCount}</span>
                  </div>

                  {/* Funnel Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-4 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-slate-50 border border-slate-100/50 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center text-white text-xs font-black">5</div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-950">OTT Fits (&ge;80%)</p>
                        <p className="text-[10px] text-slate-400 font-bold">Contains bundling requirements</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{analyticsSummary.ottMatchCount}</span>
                  </div>

                  {/* Funnel Connector */}
                  <div className="flex justify-center -my-2">
                    <div className="h-4 w-0.5 bg-slate-200"></div>
                  </div>

                  {/* Step 6 */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-black">6</div>
                      <div>
                        <p className="text-xs font-extrabold text-indigo-950">Final Candidates (&ge;75%)</p>
                        <p className="text-[10px] text-indigo-50 font-bold">Optimized results matching priorities</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-indigo-700">{analyticsSummary.candidateCount}</span>
                  </div>
                </div>
              </div>

              {/* Weight Customizer Slider Panel */}
              <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-black text-slate-950">Interactive Match Weights</h3>
                    <p className="text-xs text-slate-500 mt-1">Adjust sliders to customize the AI prioritization engine.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setWeightBudget(35);
                      setWeightData(25);
                      setWeightOtt(15);
                      setWeightValidity(15);
                      setWeightOperator(10);
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 text-[10px] font-extrabold text-slate-500 hover:bg-slate-50 transition"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="space-y-4 bg-slate-50/50 border border-slate-100 rounded-2xl p-4">
                  {/* Budget Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Budget Fit Weight</span>
                      <span className="text-indigo-600 font-black">{Math.round((weightBudget / Math.max(1, weightBudget + weightData + weightOtt + weightValidity + weightOperator)) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={weightBudget} 
                      onChange={(e) => setWeightBudget(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Data Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Data Fit Weight</span>
                      <span className="text-indigo-600 font-black">{Math.round((weightData / Math.max(1, weightBudget + weightData + weightOtt + weightValidity + weightOperator)) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={weightData} 
                      onChange={(e) => setWeightData(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* OTT Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>OTT Fit Weight</span>
                      <span className="text-indigo-600 font-black">{Math.round((weightOtt / Math.max(1, weightBudget + weightData + weightOtt + weightValidity + weightOperator)) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={weightOtt} 
                      onChange={(e) => setWeightOtt(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Validity Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Validity Fit Weight</span>
                      <span className="text-indigo-600 font-black">{Math.round((weightValidity / Math.max(1, weightBudget + weightData + weightOtt + weightValidity + weightOperator)) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={weightValidity} 
                      onChange={(e) => setWeightValidity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  {/* Operator Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700">
                      <span>Operator Loyalty Weight</span>
                      <span className="text-indigo-600 font-black">{Math.round((weightOperator / Math.max(1, weightBudget + weightData + weightOtt + weightValidity + weightOperator)) * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={weightOperator} 
                      onChange={(e) => setWeightOperator(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>

                {/* Real-time recommendations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Real-Time Recommendations</h4>
                  {topThreePlans.map((plan, index) => (
                    <div key={plan.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="rounded-full bg-indigo-100 text-indigo-700 font-black text-[9px] px-1.5 py-0.5">#{index + 1}</span>
                          <span className="font-extrabold text-slate-900">{plan.operator} {plan.planName}</span>
                          {plan.existingPlanRequired && (
                            <span className="rounded bg-amber-50 border border-amber-200/50 px-1.5 py-0.5 text-[7px] font-bold text-amber-700 uppercase tracking-wider scale-90 origin-left">
                              ⚠️ Add-on
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">
                          Budget: {Math.round(plan.budgetFit)}% · Data: {Math.round(plan.dataFit)}% · OTT: {Math.round(plan.ottFit)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-indigo-600 text-sm block">{Math.round(plan.finalScore * 100)}%</span>
                        <span className="text-[9px] text-slate-400 font-extrabold block uppercase mt-0.5">Match Score</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Plan Catalog" && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
                <div className="flex flex-wrap gap-2 items-center">
                  <select 
                    value={catalogOperatorFilter} 
                    onChange={(e) => setCatalogOperatorFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="All">All Operators</option>
                    {operators.map(op => <option key={op} value={op}>{op}</option>)}
                  </select>

                  <select 
                    value={catalogCategoryFilter} 
                    onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 outline-none"
                  >
                    <option value="All">All Categories</option>
                    <option value="Truly Unlimited">Truly Unlimited</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder="Search plans, apps..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none w-[180px]"
                  />
                </div>

                <button 
                  onClick={() => setIsAddPlanOpen(true)}
                  className="rounded-xl bg-[#6366F1] text-white font-bold text-xs px-4 py-2.5 transition flex items-center gap-1.5"
                >
                  ➕ Add Custom Plan
                </button>
              </div>

              {catalogFeedback && (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                  {catalogFeedback}
                </div>
              )}

              {isAddPlanOpen && (
                <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 max-w-[440px] w-full shadow-2xl animate-[scaleUp_0.2s_ease-out]">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-sm">Create New Custom Voucher</h3>
                      <button onClick={() => setIsAddPlanOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">×</button>
                    </div>

                    <form onSubmit={handleCustomPlanSubmit} className="space-y-4 text-xs font-bold text-slate-700">
                      <div className="grid grid-cols-2 gap-3">
                        <label className="space-y-1">
                          <span>Operator</span>
                          <select 
                            value={newPlanOperator} 
                            onChange={(e) => setNewPlanOperator(e.target.value as Operator)}
                            className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 outline-none"
                          >
                            {["Airtel", "Jio", "BSNL", "Vi"].map(op => <option key={op} value={op}>{op}</option>)}
                          </select>
                        </label>
                        <label className="flex items-center gap-2 pt-6 select-none cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newPlan5G} 
                            onChange={(e) => setNewPlan5G(e.target.checked)}
                            className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>5G Enabled</span>
                        </label>
                      </div>

                      <label className="block space-y-1">
                        <span>Plan Name</span>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Daily Booster" 
                          value={newPlanName}
                          onChange={(e) => setNewPlanName(e.target.value)}
                          className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 font-medium outline-none"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-3">
                        <label className="space-y-1">
                          <span>Price (INR)</span>
                          <input 
                            type="number" 
                            required
                            value={newPlanPrice}
                            onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 font-medium outline-none"
                          />
                        </label>
                        <label className="space-y-1">
                          <span>Validity (Days)</span>
                          <input 
                            type="number" 
                            required
                            value={newPlanValidity}
                            onChange={(e) => setNewPlanValidity(Number(e.target.value))}
                            className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 font-medium outline-none"
                          />
                        </label>
                      </div>

                      <label className="block space-y-1">
                        <span>Data Cap (GB/day)</span>
                        <input 
                          type="number" 
                          step={0.5}
                          value={newPlanDataPerDay}
                          onChange={(e) => setNewPlanDataPerDay(Number(e.target.value))}
                          className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 font-medium outline-none"
                        />
                      </label>

                      <label className="block space-y-1">
                        <span>OTT bundled benefits (Comma separated list)</span>
                        <input 
                          type="text" 
                          placeholder="Wynk, Prime, Hotstar" 
                          value={newPlanOtt}
                          onChange={(e) => setNewPlanOtt(e.target.value)}
                          className="w-full rounded-xl border border-slate-250 bg-slate-50 p-2.5 font-medium outline-none"
                        />
                      </label>

                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                        <button type="button" onClick={() => setIsAddPlanOpen(false)} className="rounded-xl border border-slate-200 hover:bg-slate-50 px-4 py-2 text-slate-500 transition">Cancel</button>
                        <button type="submit" className="rounded-xl bg-[#6366F1] text-white px-4 py-2 transition">Create Plan</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCatalogForDisplay.map((plan) => (
                  <div key={plan.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-extrabold text-slate-800 text-sm">{plan.operator}</span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full">{plan.category}</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{plan.planName}</h4>
                      <p className="text-xl font-black text-slate-950 mt-2">{formatPrice(plan.price)}</p>
                      <p className="text-[9px] text-slate-400 mt-0.5 font-bold uppercase">{plan.validityDays} Days Validity</p>
                      {plan.existingPlanRequired && (
                        <div className="mt-1.5 inline-block rounded bg-amber-50 border border-amber-200/50 px-2 py-0.5 text-[8px] font-bold text-amber-700 uppercase tracking-wider">
                          ⚠️ Requires Active Base Plan
                        </div>
                      )}
                      
                      <div className="mt-4 space-y-2 border-t border-slate-50 pt-3 text-[11px] text-slate-600 font-medium">
                        <p>📶 Data: <span className="font-black text-slate-800">{formatPlanData(plan)}</span></p>
                        <p>🗣️ Calls: {plan.voice}</p>
                        {plan.ott.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1.5">
                            {plan.ott.map(app => <span key={app} className="bg-pink-50 text-pink-600 rounded px-1.5 py-0.5 text-[8px] font-bold">{app}</span>)}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-slate-50 pt-4">
                      <button onClick={() => handleAddRemoveCompare(plan.id)} className="flex-1 rounded-xl py-2 border border-slate-200 hover:bg-slate-50 text-[10px] font-bold text-slate-600 transition">⚖️ Compare</button>
                      <button onClick={() => handleModelCurrentPlan(plan)} className="flex-1 rounded-xl bg-[#6366F1] text-white text-[10px] font-bold transition py-2">Model Savings</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </main>
  );
}
