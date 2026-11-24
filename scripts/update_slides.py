import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def update_presentation():
    pptx_path = "pptx/Nvidia RTD.pptx"
    prs = Presentation(pptx_path)
    print(f"Loaded {pptx_path}. Slide count: {len(prs.slides)}")

    PRIMARY_COLOR = RGBColor(0x15, 0x81, 0xAA)    # #1581AA Blue-cyan
    DARK_TITLE = RGBColor(0x0E, 0x74, 0x90)       # #0E7490 Cyan-700
    TEXT_DARK = RGBColor(0x1E, 0x29, 0x3B)        # #1E293B Slate-800
    TEXT_MUTED = RGBColor(0x33, 0x41, 0x55)       # #334155 Slate-700
    FOOTER_GRAY = RGBColor(0x89, 0x89, 0x89)      # #898989 Gray

    # Helper: update slide number text
    def set_slide_number(slide, num_str):
        for sh in slide.shapes:
            if sh.has_text_frame:
                txt = sh.text_frame.text.strip()
                if "of 12" in txt or "of 13" in txt or txt.startswith("(#)"):
                    sh.text_frame.text = num_str
                    for p in sh.text_frame.paragraphs:
                        p.font.name = "Century Gothic"
                        p.font.size = Pt(9)
                        p.font.color.rgb = FOOTER_GRAY
                        p.alignment = PP_ALIGN.RIGHT

    # Helper: ensure university footer exists
    def ensure_university_footer(slide):
        for sh in slide.shapes:
            if sh.has_text_frame and "Dept of CSE" in sh.text_frame.text:
                return # already exists
        # Add footer text box
        tx_box = slide.shapes.add_textbox(2819400, 6156325, 5129212, 365125)
        tf = tx_box.text_frame
        p = tf.paragraphs[0]
        p.text = "* Dept of CSE., SOE-Dayananda Sagar University"
        p.font.name = "Century Gothic"
        p.font.size = Pt(9)
        p.font.color.rgb = FOOTER_GRAY

    # Helper: set cell text
    def format_cell(cell, text, font_size=Pt(8.5), bold=False, color=TEXT_DARK):
        cell.text = text
        for p in cell.text_frame.paragraphs:
            p.font.name = "Calibri"
            p.font.size = font_size
            p.font.bold = bold
            if color:
                p.font.color.rgb = color

    # =========================================================================
    # SLIDE 1: Title Slide
    # =========================================================================
    slide1 = prs.slides[0]
    for sh in slide1.shapes:
        if sh.shape_id == 690:
            tf = sh.text_frame
            tf.clear()
            p1 = tf.paragraphs[0]
            p1.text = "TeleAI: A Grounded Dual-LLM Architecture for Deterministic Telecom Tariff Recommendation"
            p1.font.name = "Calibri"
            p1.font.size = Pt(25)
            p1.font.bold = True
            p1.font.color.rgb = PRIMARY_COLOR
            p1.space_after = Pt(10)

            p2 = tf.add_paragraph()
            p2.text = "Decoupled Edge NLU, 212-Plan Catalog Grounding, Contrastive XAI & Real-Time Counterfactual Simulation"
            p2.font.name = "Calibri"
            p2.font.size = Pt(13)
            p2.font.bold = False
            p2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 2: Overview
    # =========================================================================
    slide2 = prs.slides[1]
    set_slide_number(slide2, "2 of 13")
    ensure_university_footer(slide2)
    for sh in slide2.shapes:
        if sh.shape_id == 702:
            tf = sh.text_frame
            tf.clear()
            agenda = [
                "Abstract",
                "Problem Statement & Motivation",
                "Project Objectives",
                "Literature Survey & Comparative Analysis",
                "Proposed Methodology & Mathematical Formulation",
                "System Implementation & Live Pipeline Execution",
                "Experimental Results & Performance Benchmarks",
                "References & Project Summary"
            ]
            for idx, item in enumerate(agenda):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.text = f"{idx + 1}. {item}"
                p.font.name = "Calibri"
                p.font.size = Pt(15.5)
                p.font.color.rgb = TEXT_DARK
                p.space_after = Pt(8)

    # =========================================================================
    # SLIDE 3: Abstract
    # =========================================================================
    slide3 = prs.slides[2]
    set_slide_number(slide3, "3 of 13")
    ensure_university_footer(slide3)
    for sh in slide3.shapes:
        if sh.shape_id == 729:
            tf = sh.text_frame
            tf.clear()
            bullets = [
                ("High-Dimensional Decision Problem: ", "Selecting optimal prepaid plans is challenging due to heterogeneous pricing, non-standard validities (24, 28, 56, 84, 365 days), tiered daily bandwidth, and fragmented OTT perks across operators."),
                ("Decoupled Architecture: ", "TeleAI strictly decouples linguistic understanding from factual plan selection and contrastive rationale generation, eliminating generative hallucination by design."),
                ("Edge Linguistic Understanding: ", "A local 4-bit quantized Small Language Model (Llama 3.2 3B via Ollama) extracts structured JSON preference vectors (~1.2s) while preserving 100% user privacy."),
                ("Deterministic Catalog Grounding: ", "An in-memory Multi-Attribute Utility Theory (MAUT) engine evaluates 212 verified plans across Jio, Airtel, Vi, and BSNL with Hard Boundary Invalidation (Score = -∞) in <3ms."),
                ("Cloud Contrastive XAI: ", "An asynchronous cloud analyst model (GPT-OSS 20B) synthesizes structured 'Why This / Why Not' rationales with verified deterministic fallback."),
                ("Counterfactual 'What-If' Simulation: ", "An interactive client-side simulator enables real-time sensitivity analysis (<15ms) as users dynamically perturb budget, data, or validity constraints.")
            ]
            for idx, (head, body) in enumerate(bullets):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                r1 = p.add_run()
                r1.text = "• " + head
                r1.font.bold = True
                r1.font.size = Pt(12.5)
                r1.font.name = "Calibri"
                r1.font.color.rgb = TEXT_DARK

                r2 = p.add_run()
                r2.text = body
                r2.font.bold = False
                r2.font.size = Pt(12.5)
                r2.font.name = "Calibri"
                r2.font.color.rgb = TEXT_MUTED
                p.space_after = Pt(7)

    # =========================================================================
    # SLIDE 4: Problem Statement & Motivation
    # =========================================================================
    slide4 = prs.slides[3]
    set_slide_number(slide4, "4 of 13")
    ensure_university_footer(slide4)
    for sh in slide4.shapes:
        if sh.shape_id == 719:
            sh.text_frame.text = "Problem Statement & Motivation"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(32)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.shape_id == 720:
            tf = sh.text_frame
            tf.clear()
            items = [
                ("Problem & Tariff Fragmentation:", True, Pt(14), PRIMARY_COLOR),
                ("• Hundreds of rapidly shifting prepaid plans across 4 major Indian telcos (Jio, Airtel, Vi, BSNL) create cognitive overload.", False, Pt(12), TEXT_MUTED),
                ("• Multi-attribute decision complexity: non-standard validity cycles (24/28/56/84/365d), daily vs bulk data throttles, and fragmented OTT perks.", False, Pt(12), TEXT_MUTED),
                ("Limitations of Existing Paradigms (from Research Literature):", True, Pt(14), PRIMARY_COLOR),
                ("• Rule-Based Chatbots: Brittle keyword/regex matching; fail completely on informal conversational queries.", False, Pt(12), TEXT_MUTED),
                ("• Collaborative Filtering: Cold-start penalty; unable to enforce strict multi-dimensional arithmetic constraints.", False, Pt(12), TEXT_MUTED),
                ("• End-to-End Generative LLMs: Prone to commercial hallucinations (invented prices, expired plans, fictitious OTT perks); cannot guarantee budget bounds.", False, Pt(12), TEXT_MUTED),
                ("• Standard Text RAG: Semantic retrieval over text snippets fails to enforce strict numerical ceilings.", False, Pt(12), TEXT_MUTED),
                ("Proposed TeleAI Solution:", True, Pt(14), PRIMARY_COLOR),
                ("• Decoupled Dual-LLM Architecture: Isolates edge SLM for linguistic parsing, guarantees 0% tariff hallucination via deterministic catalog lookup, and generates contrastive XAI trade-offs.", False, Pt(12), TEXT_MUTED)
            ]
            for idx, (txt, is_hdr, fsz, col) in enumerate(items):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.text = txt
                p.font.name = "Calibri"
                p.font.size = fsz
                p.font.bold = is_hdr
                p.font.color.rgb = col
                p.space_after = Pt(3 if not is_hdr else 6)

    # =========================================================================
    # SLIDE 5: Objectives
    # =========================================================================
    slide5 = prs.slides[4]
    set_slide_number(slide5, "5 of 13")
    ensure_university_footer(slide5)
    for sh in slide5.shapes:
        if sh.name == "Title 1":
            sh.text_frame.paragraphs[0].text = "Objectives"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(32)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.name == "Text Placeholder 2":
            tf = sh.text_frame
            tf.clear()
            objs = [
                ("Conversational Telecom Advisory: ", "Develop an AI recommendation chatbot tailored for prepaid mobile plans without rigid form-filling."),
                ("Edge Intent Extraction: ", "Deploy 4-bit quantized Llama 3.2 3B via Ollama to extract structured JSON preferences in ~1.2s locally with 100% user data privacy."),
                ("Deterministic Catalog Grounding: ", "Index 212 verified real-world plans across Jio (62), Airtel (58), Vi (52), and BSNL (40) for millisecond-level evaluation."),
                ("Strict Arithmetic Boundary Enforcement: ", "Enforce Hard Boundary Invalidation (Score = -∞) for plans violating budget ceilings or daily data thresholds."),
                ("Contrastive Explainability (XAI): ", "Integrate Cloud GPT-OSS 20B to synthesize structured comparative rationales ('Why Rank-1 / Why Not Rank-2 & 3') with instant deterministic fallback."),
                ("Interactive Counterfactual Simulation: ", "Enable real-time client-side constraint mutation (<15ms) for dynamic What-If price-bandwidth sensitivity analysis."),
                ("Zero-Hallucination Commercial Guarantee: ", "Eliminate LLM tariff fabrication by strictly decoupling linguistic extraction from verified catalog data.")
            ]
            for idx, (head, body) in enumerate(objs):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                r1 = p.add_run()
                r1.text = "• " + head
                r1.font.bold = True
                r1.font.size = Pt(12.5)
                r1.font.name = "Calibri"
                r1.font.color.rgb = TEXT_DARK

                r2 = p.add_run()
                r2.text = body
                r2.font.bold = False
                r2.font.size = Pt(12.5)
                r2.font.name = "Calibri"
                r2.font.color.rgb = TEXT_MUTED
                p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 6: Literature Survey (Part 1)
    # =========================================================================
    slide6 = prs.slides[5]
    set_slide_number(slide6, "6 of 13")
    ensure_university_footer(slide6)
    for sh in slide6.shapes:
        if sh.name == "Title 1":
            sh.text_frame.paragraphs[0].text = "Literature Survey: Conversational & Dialogue Recommenders"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(23)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.has_table:
            t = sh.table
            headers = ["Author(s) / Paper Title", "Journal / Conference & Year", "Problem Addressed", "Technology / Design", "Results by Author", "What You Infer"]
            for c_i, h in enumerate(headers):
                format_cell(t.cell(0, c_i), h, font_size=Pt(9), bold=True, color=TEXT_DARK)
            
            row1 = [
                "Dietmar Jannach, Ahtsham Manzoor, Wanling Cai, Li Chen\nA Survey on Conversational Recommender Systems",
                "ACM Computing Surveys (CSUR), 2021",
                "Personalized recommendation through multi-turn dialogue interaction",
                "Conversational AI, Preference Elicitation, Dialogue Systems",
                "Surveys interactive recommendation paradigms; shows conversational interaction significantly increases user engagement.",
                "A conversational interface can collect complex multi-attribute user needs without forcing rigid dropdown forms."
            ]
            for c_i, val in enumerate(row1):
                format_cell(t.cell(1, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)

            row2 = [
                "Chongming Gao, Wenjie Wang, Zhaochun Ren, et al.\nAdvances and Challenges in Conversational Recommender Systems: A Survey",
                "AI Open (Elsevier), 2021",
                "Multi-turn recommendation & state tracking challenges",
                "Deep Learning, Dialogue Management, Intent Tracking",
                "Demonstrates conversational turn-taking improves satisfaction but highlights state-tracking brittleness across multi-turn sessions.",
                "Decoupling intent extraction into structured JSON parameters avoids complex state drift across conversational turns."
            ]
            for c_i, val in enumerate(row2):
                format_cell(t.cell(2, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)

    # =========================================================================
    # SLIDE 7: Literature Survey (Part 2)
    # =========================================================================
    slide7 = prs.slides[6]
    set_slide_number(slide7, "7 of 13")
    ensure_university_footer(slide7)

    # Add header title if not present
    has_title = False
    for sh in slide7.shapes:
        if sh.has_text_frame and "Literature Survey:" in sh.text_frame.text:
            has_title = True
            break
    if not has_title:
        tx_title = slide7.shapes.add_textbox(637937, 451877, 7500000, 600000)
        p = tx_title.text_frame.paragraphs[0]
        p.text = "Literature Survey: Hybrid Recommenders & Hallucination Mitigation"
        p.font.name = "Calibri"
        p.font.size = Pt(23)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR

    for sh in slide7.shapes:
        if sh.name == "Table 7":
            t = sh.table
            headers = ["Author(s) / Paper Title", "Journal / Conference & Year", "Problem Addressed", "Technology / Design", "Results by Author", "What You Infer"]
            for c_i, h in enumerate(headers):
                format_cell(t.cell(0, c_i), h, font_size=Pt(9), bold=True, color=TEXT_DARK)
        elif sh.name == "Table 5":
            t = sh.table
            row0 = [
                "Robin Burke\nHybrid Recommender Systems: Survey and Experiments",
                "User Modeling and User-Adapted Interaction, 2002",
                "Overcoming individual recommender limitations & cold-start penalties",
                "Hybrid Recommender Systems, Constraint-Based Filtering, MAUT",
                "Hybrid combinations combining multi-attribute constraints outperform individual collaborative or content methods.",
                "Multi-Attribute Utility Theory (MAUT) with hard constraint satisfaction provides reliable deterministic tariff scoring."
            ]
            for c_i, val in enumerate(row0):
                format_cell(t.cell(0, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)

            row1 = [
                "Lei Huang, Weitao Yu, Weihong Ma, et al.\nA Survey on Hallucination in Large Language Models: Taxonomy and Challenges",
                "ACM Computing Surveys (CSUR), 2024",
                "Factual inaccuracies, hallucinations, and confabulations in generative LLMs",
                "LLM Factuality Assessment, Hallucination Taxonomy & Mitigation",
                "Generative LLMs frequently hallucinate domain facts, numbers, and dates when relied upon as factual knowledge bases.",
                "LLMs must NEVER be the source of commercial plan details; plan selection must be strictly grounded in verified catalog data."
            ]
            for c_i, val in enumerate(row1):
                format_cell(t.cell(1, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)

    # =========================================================================
    # SLIDE 8: Literature Survey (Part 3) & Research Gap
    # =========================================================================
    slide8 = prs.slides[7]
    set_slide_number(slide8, "8 of 13")
    ensure_university_footer(slide8)

    has_title = False
    for sh in slide8.shapes:
        if sh.has_text_frame and "Literature Survey:" in sh.text_frame.text:
            has_title = True
            break
    if not has_title:
        tx_title = slide8.shapes.add_textbox(541367, 451877, 7500000, 600000)
        p = tx_title.text_frame.paragraphs[0]
        p.text = "Literature Survey: Telecom Decision Rules & Counterfactual Recourse"
        p.font.name = "Calibri"
        p.font.size = Pt(23)
        p.font.bold = True
        p.font.color.rgb = PRIMARY_COLOR

    for sh in slide8.shapes:
        if sh.name == "Table 7":
            t = sh.table
            headers = ["Author(s) / Paper Title", "Journal / Conference & Year", "Problem Addressed", "Technology / Design", "Results by Author", "What You Infer"]
            for c_i, h in enumerate(headers):
                format_cell(t.cell(0, c_i), h, font_size=Pt(9), bold=True, color=TEXT_DARK)
        elif sh.name == "Table 5":
            t = sh.table
            row0 = [
                "John Keeney, Sven van der Meer, Gabriel Hogan\nA Recommender-System for Telecommunications Management Actions",
                "IFIP/IEEE International Symposium on Integrated Network Management (IM), 2013",
                "Decision support for complex telecommunications service management",
                "Policy-Based Management, Telecom Recommender Rules",
                "Recommender systems significantly improve telecom decision-making through policy-guided ranked alternatives.",
                "Telecom recommendations require strict domain rules, tariff compliance, and operator-specific constraints."
            ]
            for c_i, val in enumerate(row0):
                format_cell(t.cell(0, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)

            row1 = [
                "Sandra Wachter, Brent Mittelstadt, Chris Russell\nCounterfactual Explanations Without Opening the Black Box: Automated Decisions and GDPR",
                "Harvard Journal of Law & Technology, 2017",
                "Explainability in automated decisions without opening model internals",
                "Counterfactual Explanations, Algorithmic Recourse, Sensitivity Analysis",
                "Demonstrates that explaining minimal feature perturbations required to achieve alternative outcomes builds user trust.",
                "Interactive What-If counterfactual mutation gives users intuitive insight into how budget or data changes alter the top plan."
            ]
            for c_i, val in enumerate(row1):
                format_cell(t.cell(1, c_i), val, font_size=Pt(8.5), bold=False, color=TEXT_MUTED)
        elif sh.name == "TextBox 1":
            tf = sh.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            r1 = p.add_run()
            r1.text = "Research Gap: "
            r1.font.name = "Calibri"
            r1.font.size = Pt(10.5)
            r1.font.bold = True
            r1.font.color.rgb = PRIMARY_COLOR

            r2 = p.add_run()
            r2.text = "While conversational recommenders (Jannach 2021) and hybrid filtering (Burke 2002) are established, pure generative LLMs suffer from severe commercial hallucination (Huang 2024), and standard RAG fails on arithmetic bounds. Existing systems lack the integration of local edge privacy-preserving NLU, deterministic catalog grounding with Hard Boundary Invalidation, contrastive XAI, and real-time counterfactual What-If simulation. TeleAI resolves this gap with a decoupled dual-LLM architecture."
            r2.font.name = "Calibri"
            r2.font.size = Pt(10.5)
            r2.font.bold = False
            r2.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 9: Proposed Methodology & Architecture
    # =========================================================================
    slide9 = prs.slides[8]
    set_slide_number(slide9, "9 of 13")
    ensure_university_footer(slide9)
    for sh in slide9.shapes:
        if sh.shape_id == 785:
            sh.text_frame.paragraphs[0].text = "Proposed Methodology & Architecture"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(28)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.shape_id == 786:
            tf = sh.text_frame
            tf.clear()
            steps = [
                ("1. Natural Language Query: ", "User enters conversational requirements without rigid forms (e.g., 'Jio plan under 500 with 2GB/day and OTT')."),
                ("2. Edge Linguistic NLU (Llama 3.2 3B): ", "Local 4-bit quantized model on Ollama extracts typed JSON schema (Operator, Budget, Data, Validity, OTT, 5G, Priority) in ~1.2s with 100% client data privacy."),
                ("3. Hard Constraint Invalidation: ", "Evaluates 212 verified plans across Jio (62), Airtel (58), Vi (52), BSNL (40). Plans violating budget (P_i > B_max) or data floor (D_i < D_min) are assigned: Score(p_i) = -∞."),
                ("4. Deterministic MAUT Scoring: ", "Surviving plans scored via Multi-Attribute Utility Theory in 2.4 ms: Score(p_i) = w_p·F_budget(p_i) + w_d·F_data(p_i) + w_v·F_validity(p_i) + w_o·F_ott(p_i) + w_b·F_operator(p_i) with priority-adaptive dynamic weights."),
                ("5. Cloud Contrastive XAI (GPT-OSS 20B): ", "Grounded analyst synthesizes structured JSON rationale ('best_plan_reason', 'why_second', 'why_third', 'tradeoff') comparing Top-3 candidates, with instant deterministic fallback."),
                ("6. Counterfactual What-If Simulation: ", "Reactive client-side state mutation recalculates rankings across all 212 plans in <15ms as users dynamically tweak budget, data, or validity sliders.")
            ]
            for idx, (head, body) in enumerate(steps):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                r1 = p.add_run()
                r1.text = head
                r1.font.bold = True
                r1.font.size = Pt(11.5)
                r1.font.name = "Calibri"
                r1.font.color.rgb = TEXT_DARK

                r2 = p.add_run()
                r2.text = body
                r2.font.bold = False
                r2.font.size = Pt(11.5)
                r2.font.name = "Calibri"
                r2.font.color.rgb = TEXT_MUTED
                p.space_after = Pt(6)

    # =========================================================================
    # SLIDE 10: System Implementation & Live Pipeline Execution
    # =========================================================================
    slide10 = prs.slides[9]
    set_slide_number(slide10, "10 of 13")
    ensure_university_footer(slide10)
    for sh in slide10.shapes:
        if sh.name == "Title 1":
            sh.text_frame.paragraphs[0].text = "System Implementation & Live Pipeline Execution"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(22)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = DARK_TITLE
        elif sh.name == "TextBox 9":
            tf = sh.text_frame
            tf.clear()
            lines = [
                ("Live Pipeline Execution Highlights (Table 2):", True, Pt(11), PRIMARY_COLOR),
                ("• Query: 'I need a Jio plan under ₹500 with 2GB/day and OTT'", False, Pt(9.5), TEXT_DARK),
                ("• Edge NLU (Llama 3.2 3B): Extracted {op:'Jio', budget:500, daily_data:2.0, ott:true} in ~1.2s", False, Pt(9.5), TEXT_MUTED),
                ("• Deterministic Engine: Evaluated 212 catalog plans in 2.4 ms (Score = -∞ cutoff)", False, Pt(9.5), TEXT_MUTED),
                ("• Top-1 Match: Jio True 5G ₹450 (28d, 2GB/day, JioHotstar Mobile, 96% Match)", False, Pt(9.5), TEXT_DARK),
                ("• Cloud XAI (GPT-OSS 20B): Grounded trade-off synthesis in ~2.1s (Rank-1 vs Rank-2 Jio ₹399 & Rank-3 ₹445)", False, Pt(9.5), TEXT_MUTED),
                ("• Counterfactual What-If: Real-time slider perturbation re-scores 212 plans in ~12ms", False, Pt(9.5), TEXT_MUTED),
                ("• Catalog Factuality: 100% grounded in verified dataset; 0% tariff hallucination", False, Pt(9.5), TEXT_DARK)
            ]
            for idx, (txt, is_hdr, fsz, col) in enumerate(lines):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.text = txt
                p.font.name = "Calibri"
                p.font.size = fsz
                p.font.bold = is_hdr
                p.font.color.rgb = col
                p.space_after = Pt(2)

    # =========================================================================
    # SLIDE 11: Experimental Results & Performance Benchmarks
    # =========================================================================
    slide11 = prs.slides[10]
    set_slide_number(slide11, "11 of 13")
    ensure_university_footer(slide11)
    for sh in slide11.shapes:
        if sh.shape_id == 710:
            sh.text_frame.paragraphs[0].text = "Experimental Results & Performance Benchmarks"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(28)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.name == "TextBox 2":
            tf = sh.text_frame
            tf.clear()
            sections = [
                ("Measured Execution Latencies (from Research Paper Table 3):", True, Pt(13.5), PRIMARY_COLOR),
                ("• Edge NLU Slot Extraction (Llama 3.2 3B): 1,120 – 1,380 ms (~1.2s avg) [Local Ollama 4-bit]", False, Pt(11.5), TEXT_DARK),
                ("• Deterministic Catalog Scoring (212 plans): 2.1 – 2.8 ms (sub-3ms) [In-Memory TypeScript Engine]", False, Pt(11.5), TEXT_DARK),
                ("• Cloud Contrastive XAI (GPT-OSS 20B): 1,850 – 2,420 ms [Cloud Ollama Endpoint]", False, Pt(11.5), TEXT_DARK),
                ("• Counterfactual What-If Re-ranking: 11.5 – 14.2 ms (<15ms) [Client-Side Reactive Mutation]", False, Pt(11.5), TEXT_DARK),
                ("", False, Pt(4), TEXT_DARK),
                ("Key System Outcomes & Architectural Validation:", True, Pt(13.5), PRIMARY_COLOR),
                ("• Zero Commercial Tariff Hallucination: 100% grounded in 212 verified plans across Jio (62), Airtel (58), Vi (52), and BSNL (40).", False, Pt(11.5), TEXT_MUTED),
                ("• Strict Arithmetic Boundary Compliance: Hard boundary cutoff (Score = -∞) eliminates out-of-budget recommendations.", False, Pt(11.5), TEXT_MUTED),
                ("• Transparent Contrastive Explainability: Structured rationales detail why Rank-1 won and alternatives fell short.", False, Pt(11.5), TEXT_MUTED),
                ("• Interactive Algorithmic Recourse: Instant What-If simulation provides immediate feedback on price-bandwidth trade-offs.", False, Pt(11.5), TEXT_MUTED),
                ("• High Fault Tolerance: Deterministic fallback guarantees uninterrupted operation even during cloud disconnects.", False, Pt(11.5), TEXT_MUTED)
            ]
            for idx, (txt, is_hdr, fsz, col) in enumerate(sections):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.text = txt
                p.font.name = "Calibri"
                p.font.size = fsz
                p.font.bold = is_hdr
                p.font.color.rgb = col
                p.space_after = Pt(2.5 if not is_hdr else 5)

    # =========================================================================
    # SLIDE 12: References
    # =========================================================================
    slide12 = prs.slides[11]
    set_slide_number(slide12, "12 of 13")
    ensure_university_footer(slide12)
    for sh in slide12.shapes:
        if sh.name == "Title 1":
            sh.text_frame.paragraphs[0].text = "References"
            sh.text_frame.paragraphs[0].font.name = "Calibri"
            sh.text_frame.paragraphs[0].font.size = Pt(28)
            sh.text_frame.paragraphs[0].font.bold = True
            sh.text_frame.paragraphs[0].font.color.rgb = PRIMARY_COLOR
        elif sh.name == "Text Placeholder 2":
            tf = sh.text_frame
            tf.clear()
            refs = [
                "[1] D. Jannach, A. Manzoor, W. Cai, and L. Chen, 'A Survey on Conversational Recommender Systems,' ACM Computing Surveys, vol. 54, no. 5, 2021.",
                "[2] C. Gao, W. Wang, Z. Ren, and D. Yin, 'Advances and Challenges in Conversational Recommender Systems: A Survey,' AI Open, vol. 2, 2021.",
                "[3] R. Burke, 'Hybrid Recommender Systems: Survey and Experiments,' User Modeling and User-Adapted Interaction, vol. 12, no. 4, 2002.",
                "[4] G. Adomavicius and A. Tuzhilin, 'Toward the Next Generation of Recommender Systems,' IEEE Trans. Knowl. Data Eng., vol. 17, no. 6, 2005.",
                "[5] J. Keeney, S. van der Meer, and G. Hogan, 'A Recommender-System for Telecommunications Management Actions,' in Proc. IFIP/IEEE IM, 2013, pp. 760–763.",
                "[6] L. Huang, W. Yu, W. Ma, et al., 'A Survey on Hallucination in Large Language Models: Taxonomy and Challenges,' ACM Computing Surveys, vol. 56, no. 12, 2024.",
                "[7] S. Wachter, B. Mittelstadt, and C. Russell, 'Counterfactual Explanations Without Opening the Black Box: Automated Decisions and GDPR,' Harvard JOLT, 2017.",
                "[8] Meta AI, 'Llama 3.2: Lightweight, Quantized Multilingual Models for Edge Computing,' Meta AI Research Technical Report, 2024.",
                "[9] Telecom Regulatory Authority of India (TRAI), 'The Indian Telecom Services Performance Indicators: Reports on Tariff Trends,' Govt. of India, 2024."
            ]
            for idx, r_txt in enumerate(refs):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.text = r_txt
                p.font.name = "Calibri"
                p.font.size = Pt(11)
                p.font.color.rgb = TEXT_MUTED
                p.space_after = Pt(4)

    # =========================================================================
    # SLIDE 13: Conclusion & Summary
    # =========================================================================
    slide13 = prs.slides[12]
    set_slide_number(slide13, "13 of 13")
    ensure_university_footer(slide13)
    for sh in slide13.shapes:
        if sh.shape_id == 804:
            tf = sh.text_frame
            tf.clear()
            p_ty = tf.paragraphs[0]
            p_ty.text = "THANK YOU"
            p_ty.font.name = "Century Gothic"
            p_ty.font.size = Pt(34)
            p_ty.font.bold = True
            p_ty.font.color.rgb = PRIMARY_COLOR
            p_ty.space_after = Pt(10)

            summary_points = [
                ("TeleAI Core Contributions:", True, Pt(14), PRIMARY_COLOR),
                ("• Decoupled Dual-LLM Architecture: Eliminates commercial hallucination by isolating language parsing from factual catalog lookup.", False, Pt(12), TEXT_MUTED),
                ("• Edge Privacy & Speed: 4-bit Llama 3.2 3B extracts structured user preferences locally in ~1.2s with zero raw cloud transmission.", False, Pt(12), TEXT_MUTED),
                ("• Deterministic Catalog Integrity: Evaluates 212 verified plans across Jio, Airtel, Vi, and BSNL in <3ms with Hard Boundary Invalidation.", False, Pt(12), TEXT_MUTED),
                ("• Contrastive Explainability & Counterfactual Recourse: Cloud GPT-OSS 20B generates grounded trade-offs, while reactive What-If allows instant sensitivity analysis (<15ms).", False, Pt(12), TEXT_MUTED),
                ("", False, Pt(5), TEXT_MUTED),
                ("Future Work: Dynamic live operator API syncing, multi-turn session state management, and regional multilingual NLU.", False, Pt(11), TEXT_DARK)
            ]
            for head, is_b, fsz, col in summary_points:
                p = tf.add_paragraph()
                p.text = head
                p.font.name = "Calibri"
                p.font.size = fsz
                p.font.bold = is_b
                p.font.color.rgb = col
                p.space_after = Pt(3.5)

    prs.save(pptx_path)
    print("Successfully updated and saved", pptx_path)

if __name__ == "__main__":
    update_presentation()
