export type Operator = "Airtel" | "Jio" | "BSNL" | "Vi";

export type Plan = {
  id: string;
  operator: Operator;
  planName: string;
  price: number;
  validityDays: number;
  dataPerDayGb?: number;
  totalDataGb?: number;
  smsPerDay?: number;
  voice: string;
  fiveG: boolean;
  ott: string[];
  roaming: boolean;
  category: string;
  source: "uploaded" | "demo";
  highlight: string;
  existingPlanRequired?: boolean;
};

export type CoverageRecord = {
  city: string;
  state: string;
  operator: Operator;
  fourG: number;
  fiveG: number;
  overall: number;
};

export type UsageProfile = {
  userId: string;
  monthlySpend: number;
  dataUsageGb: number;
  callMinutes: number;
  smsUsage: number;
  ottUsage: boolean;
  preferredOperator: Operator;
  city: string;
};

export type RankedPlan = Plan & {
  operatorCoverage: number;
  candidateScore: number;
  budgetMatch: number;
  dataMatch: number;
  coverageMatch: number;
  ottMatch: number;
  preferenceMatch: number;
  rerankBoost: number;
  finalScore: number;
  reason: string[];
  // Fit breakdown metrics (0 to 100)
  budgetFit: number;
  dataFit: number;
  ottFit: number;
  validityFit: number;
  operatorFit: number;
};

export type ChatWizardPreferences = {
  currentOperator: string;
  budgetRange: string;
  dailyData: string;
  validityPreference: string;
  persona: string;
  purpose: string;
  fiveGRequired: string;
  ottPlatforms: string[];
  priority: string;
  addonRequested?: boolean;
  isInternationalRoaming?: boolean;
};

export const operators: Operator[] = ["Airtel", "Jio", "BSNL", "Vi"];

export const usagePresets: Record<string, UsageProfile> = {
  creator: {
    userId: "creator-01",
    monthlySpend: 599,
    dataUsageGb: 60,
    callMinutes: 1200,
    smsUsage: 100,
    ottUsage: true,
    preferredOperator: "Jio",
    city: "Bangalore",
  },
  family: {
    userId: "family-01",
    monthlySpend: 349,
    dataUsageGb: 38,
    callMinutes: 2100,
    smsUsage: 340,
    ottUsage: true,
    preferredOperator: "Airtel",
    city: "Mumbai",
  },
  value: {
    userId: "value-01",
    monthlySpend: 250,
    dataUsageGb: 22,
    callMinutes: 850,
    smsUsage: 110,
    ottUsage: false,
    preferredOperator: "BSNL",
    city: "Chennai",
  },
};

export const coverageRecords: CoverageRecord[] = [
  { city: "Bangalore", state: "Karnataka", operator: "Jio", fourG: 9.2, fiveG: 9.4, overall: 9.3 },
  { city: "Bangalore", state: "Karnataka", operator: "Airtel", fourG: 8.7, fiveG: 8.9, overall: 8.8 },
  { city: "Bangalore", state: "Karnataka", operator: "Vi", fourG: 7.0, fiveG: 7.2, overall: 7.1 },
  { city: "Bangalore", state: "Karnataka", operator: "BSNL", fourG: 6.1, fiveG: 6.3, overall: 6.2 },

  { city: "Mumbai", state: "Maharashtra", operator: "Airtel", fourG: 9.1, fiveG: 9.0, overall: 9.05 },
  { city: "Mumbai", state: "Maharashtra", operator: "Jio", fourG: 9.2, fiveG: 9.5, overall: 9.35 },
  { city: "Mumbai", state: "Maharashtra", operator: "BSNL", fourG: 6.0, fiveG: 4.8, overall: 5.9 },
  { city: "Mumbai", state: "Maharashtra", operator: "Vi", fourG: 7.4, fiveG: 6.6, overall: 7.0 },

  { city: "Delhi", state: "Delhi", operator: "Airtel", fourG: 8.8, fiveG: 9.0, overall: 8.9 },
  { city: "Delhi", state: "Delhi", operator: "Jio", fourG: 9.3, fiveG: 9.6, overall: 9.45 },
  { city: "Delhi", state: "Delhi", operator: "BSNL", fourG: 6.1, fiveG: 5.1, overall: 5.95 },
  { city: "Delhi", state: "Delhi", operator: "Vi", fourG: 7.2, fiveG: 6.4, overall: 6.95 },

  { city: "Chennai", state: "Tamil Nadu", operator: "Airtel", fourG: 8.7, fiveG: 8.8, overall: 8.75 },
  { city: "Chennai", state: "Tamil Nadu", operator: "Jio", fourG: 8.8, fiveG: 9.0, overall: 8.9 },
  { city: "Chennai", state: "Tamil Nadu", operator: "BSNL", fourG: 6.6, fiveG: 5.4, overall: 6.3 },
  { city: "Chennai", state: "Tamil Nadu", operator: "Vi", fourG: 7.0, fiveG: 6.1, overall: 6.75 },

  { city: "Hyderabad", state: "Telangana", operator: "Airtel", fourG: 8.8, fiveG: 8.9, overall: 8.85 },
  { city: "Hyderabad", state: "Telangana", operator: "Jio", fourG: 9.1, fiveG: 9.3, overall: 9.2 },
  { city: "Hyderabad", state: "Telangana", operator: "BSNL", fourG: 6.2, fiveG: 5.0, overall: 6.0 },
  { city: "Hyderabad", state: "Telangana", operator: "Vi", fourG: 7.2, fiveG: 6.3, overall: 6.8 },
];

const rawPlanCatalog: Plan[] = [
  {
    id: "bsnl-153",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 153",
    price: 153,
    validityDays: 24,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "1 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-147",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 147",
    price: 147,
    validityDays: 24,
    totalDataGb: 5.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "5 GB total data + Unlimited voice calls.",
  },
  {
    id: "bsnl-199",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 199",
    price: 199,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-225",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 225",
    price: 225,
    validityDays: 30,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "2.5 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-247",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 247",
    price: 247,
    validityDays: 30,
    totalDataGb: 50.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "50 GB total data + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-299",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 299",
    price: 299,
    validityDays: 30,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "3 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-229",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 229",
    price: 229,
    validityDays: 30,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls for 1 month.",
  },
  {
    id: "bsnl-239",
    operator: "BSNL",
    planName: "BSNL Monthly Voucher 239",
    price: 239,
    validityDays: 30,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Monthly Voucher",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice + Rs 10 talk value.",
  },
  {
    id: "bsnl-411",
    operator: "BSNL",
    planName: "BSNL Data Voucher 411",
    price: 411,
    validityDays: 60,
    totalDataGb: 100.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "100 GB total data add-on.",
  },
  {
    id: "bsnl-198",
    operator: "BSNL",
    planName: "BSNL Data Voucher 198",
    price: 198,
    validityDays: 30,
    totalDataGb: 40.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "40 GB total data add-on.",
  },
  {
    id: "bsnl-105",
    operator: "BSNL",
    planName: "BSNL Data Voucher 105",
    price: 105,
    validityDays: 7,
    totalDataGb: 20.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "20 GB total data booster.",
  },
  {
    id: "bsnl-58",
    operator: "BSNL",
    planName: "BSNL Data Voucher 58",
    price: 58,
    validityDays: 7,
    totalDataGb: 8.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "8 GB total data booster.",
  },
  {
    id: "bsnl-16",
    operator: "BSNL",
    planName: "BSNL Data Voucher 16",
    price: 16,
    validityDays: 1,
    totalDataGb: 2.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "2 GB total data booster for 1 day.",
  },
  {
    id: "bsnl-347",
    operator: "BSNL",
    planName: "BSNL STV 347",
    price: 347,
    validityDays: 50,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-319",
    operator: "BSNL",
    planName: "BSNL Voice Voucher 319",
    price: 319,
    validityDays: 60,
    totalDataGb: 10.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "10 GB total data + 300 SMS + Unlimited voice calls.",
  },
  {
    id: "bsnl-485",
    operator: "BSNL",
    planName: "BSNL STV 485",
    price: 485,
    validityDays: 72,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-599",
    operator: "BSNL",
    planName: "BSNL STV 599",
    price: 599,
    validityDays: 70,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "3 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-997",
    operator: "BSNL",
    planName: "BSNL PV 997",
    price: 997,
    validityDays: 150,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-897",
    operator: "BSNL",
    planName: "BSNL PV 897",
    price: 897,
    validityDays: 165,
    totalDataGb: 24.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "24 GB total data + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-107",
    operator: "BSNL",
    planName: "BSNL Freebie 107",
    price: 107,
    validityDays: 20,
    totalDataGb: 3.0,
    voice: "200 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Voucher",
    source: "uploaded",
    highlight: "200 Minutes Voice + 3 GB total data.",
  },
  {
    id: "bsnl-197",
    operator: "BSNL",
    planName: "BSNL Freebie 197",
    price: 197,
    validityDays: 35,
    totalDataGb: 5.0,
    voice: "300 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Voucher",
    source: "uploaded",
    highlight: "300 Minutes Voice + 5 GB total data + 100 SMS.",
  },
  {
    id: "bsnl-99",
    operator: "BSNL",
    planName: "BSNL Voice 99",
    price: 99,
    validityDays: 14,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Voice Voucher",
    source: "uploaded",
    highlight: "Unlimited Voice calls.",
  },
  {
    id: "bsnl-439",
    operator: "BSNL",
    planName: "BSNL Voice 439",
    price: 439,
    validityDays: 80,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Voice Voucher",
    source: "uploaded",
    highlight: "Unlimited Voice calls + 300 SMS.",
  },
  {
    id: "bsnl-1499",
    operator: "BSNL",
    planName: "BSNL Annual 1499",
    price: 1499,
    validityDays: 300,
    totalDataGb: 32.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual",
    source: "uploaded",
    highlight: "32 GB total data + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-1999",
    operator: "BSNL",
    planName: "BSNL Annual 1999",
    price: 1999,
    validityDays: 330,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual",
    source: "uploaded",
    highlight: "1.5 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-2399",
    operator: "BSNL",
    planName: "BSNL Annual 2399",
    price: 2399,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual",
    source: "uploaded",
    highlight: "2 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-2799",
    operator: "BSNL",
    planName: "BSNL Annual 2799",
    price: 2799,
    validityDays: 365,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual",
    source: "uploaded",
    highlight: "3 GB/day + 100 SMS/day + Unlimited voice calls.",
  },
  {
    id: "bsnl-28",
    operator: "BSNL",
    planName: "BSNL BiTV South Lite",
    price: 28,
    validityDays: 30,
    voice: "No Voice",
    fiveG: false,
    ott: ["South Lite Pack (7 OTTs)"],
    roaming: true,
    category: "BiTV Pack",
    source: "uploaded",
    highlight: "South Lite bundle with 7 OTT channels.",
  },
  {
    id: "bsnl-29",
    operator: "BSNL",
    planName: "BSNL BiTV Lite Pack",
    price: 29,
    validityDays: 30,
    voice: "No Voice",
    fiveG: false,
    ott: ["Lite Pack (7 OTTs)"],
    roaming: true,
    category: "BiTV Pack",
    source: "uploaded",
    highlight: "North/East/West Lite bundle with 7 OTT channels.",
  },
  {
    id: "bsnl-151",
    operator: "BSNL",
    planName: "BSNL BiTV National Power",
    price: 151,
    validityDays: 30,
    voice: "No Voice",
    fiveG: false,
    ott: ["National Power Pack (17 OTTs)", "9 Complimentary OTTs"],
    roaming: true,
    category: "BiTV Pack",
    source: "uploaded",
    highlight: "National Power pack with 17 OTTs + 9 complimentary OTTs.",
  },
  {
    id: "jio-299",
    operator: "Jio",
    planName: "Jio Truly Unlimited 299",
    price: 299,
    validityDays: 28,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day with Unlimited voice and 5G data.",
  },
  {
    id: "jio-249",
    operator: "Jio",
    planName: "Jio Truly Unlimited 249",
    price: 249,
    validityDays: 28,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1 GB/day with Unlimited voice calls.",
  },
  {
    id: "jio-189",
    operator: "Jio",
    planName: "Jio Truly Unlimited 189",
    price: 189,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB total data with Unlimited voice calls.",
  },
  {
    id: "jio-3999",
    operator: "Jio",
    planName: "Jio True 5G 3999",
    price: 3999,
    validityDays: 365,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["FanCode", "JioCinema Premium", "Netflix"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2.5 GB/day with FanCode, Netflix, and JioCinema.",
  },
  {
    id: "jio-3599",
    operator: "Jio",
    planName: "Jio True 5G 3599",
    price: 3599,
    validityDays: 365,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2.5 GB/day annual pack with Jio Suite.",
  },
  {
    id: "jio-2025",
    operator: "Jio",
    planName: "Jio True 5G 2025",
    price: 2025,
    validityDays: 200,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2.5 GB/day for 200 days with Jio Suite.",
  },
  {
    id: "jio-1799",
    operator: "Jio",
    planName: "Jio True 5G 1799",
    price: 1799,
    validityDays: 84,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 3 GB/day for 84 days with Netflix Mobile.",
  },
  {
    id: "jio-1299",
    operator: "Jio",
    planName: "Jio True 5G 1299",
    price: 1299,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 84 days with Netflix Mobile.",
  },
  {
    id: "jio-1199",
    operator: "Jio",
    planName: "Jio True 5G 1199",
    price: 1199,
    validityDays: 84,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["SonyLIV", "ZEE5"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 3 GB/day with SonyLIV and ZEE5.",
  },
  {
    id: "jio-1049",
    operator: "Jio",
    planName: "Jio True 5G 1049",
    price: 1049,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["SonyLIV", "ZEE5"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day with SonyLIV and ZEE5.",
  },
  {
    id: "jio-1029",
    operator: "Jio",
    planName: "Jio True 5G 1029",
    price: 1029,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Amazon Prime Lite"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day with Amazon Prime Lite.",
  },
  {
    id: "jio-1028",
    operator: "Jio",
    planName: "Jio True 5G 1028",
    price: 1028,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Swiggy One Lite"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day with Swiggy One Lite and \u20b950 cashback.",
  },
  {
    id: "jio-999",
    operator: "Jio",
    planName: "Jio True 5G 999",
    price: 999,
    validityDays: 98,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 98 days with JioHotstar Mobile.",
  },
  {
    id: "jio-949",
    operator: "Jio",
    planName: "Jio True 5G 949",
    price: 949,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day with JioHotstar Mobile.",
  },
  {
    id: "jio-899",
    operator: "Jio",
    planName: "Jio True 5G 899",
    price: 899,
    validityDays: 90,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 90 days with JioHotstar Mobile.",
  },
  {
    id: "jio-859",
    operator: "Jio",
    planName: "Jio True 5G 859",
    price: 859,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 84 days with JioHotstar Mobile.",
  },
  {
    id: "jio-749",
    operator: "Jio",
    planName: "Jio True 5G 749",
    price: 749,
    validityDays: 72,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 72 days with JioHotstar Mobile.",
  },
  {
    id: "jio-719",
    operator: "Jio",
    planName: "Jio True 5G 719",
    price: 719,
    validityDays: 70,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 70 days with JioHotstar Mobile.",
  },
  {
    id: "jio-629",
    operator: "Jio",
    planName: "Jio True 5G 629",
    price: 629,
    validityDays: 56,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day for 56 days with JioHotstar Mobile.",
  },
  {
    id: "jio-449",
    operator: "Jio",
    planName: "Jio True 5G 449",
    price: 449,
    validityDays: 28,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 3 GB/day for 28 days with Jio Suite.",
  },
  {
    id: "jio-459",
    operator: "Jio",
    planName: "Jio Youth & Gaming 459",
    price: 459,
    validityDays: 84,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Gaming Partner Benefits"],
    roaming: true,
    category: "Youth & Gaming",
    source: "uploaded",
    highlight: "Gaming-focused pack with 1.5 GB/day for 84 days.",
  },
  {
    id: "jio-450",
    operator: "Jio",
    planName: "Jio True 5G 450",
    price: 450,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "True 5G Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G + 2 GB/day with JioHotstar Mobile.",
  },
  {
    id: "jio-445",
    operator: "Jio",
    planName: "Jio Entertainment 445",
    price: 445,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["10 OTTs Bundle"],
    roaming: true,
    category: "Entertainment",
    source: "uploaded",
    highlight: "2 GB/day with 10 bundled OTT channels.",
  },
  {
    id: "jio-399",
    operator: "Jio",
    planName: "Jio Sports & Gaming 399",
    price: 399,
    validityDays: 28,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2.5 GB/day with Sports, Gaming, and Movies highlights.",
  },
  {
    id: "jio-889",
    operator: "Jio",
    planName: "JioSaavn Pro 889",
    price: 889,
    validityDays: 84,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioSaavn Pro"],
    roaming: true,
    category: "JioSaavn Pro",
    source: "uploaded",
    highlight: "1.5 GB/day with JioSaavn Pro subscription for 84 days.",
  },
  {
    id: "jio-329",
    operator: "Jio",
    planName: "JioSaavn Pro 329",
    price: 329,
    validityDays: 28,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioSaavn Pro"],
    roaming: true,
    category: "JioSaavn Pro",
    source: "uploaded",
    highlight: "1.5 GB/day with JioSaavn Pro subscription for 28 days.",
  },
  {
    id: "jio-195",
    operator: "Jio",
    planName: "JioHotstar Data 195",
    price: 195,
    validityDays: 30,
    totalDataGb: 15.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "JioHotstar",
    source: "uploaded",
    highlight: "15 GB total data pack with JioHotstar Mobile.",
  },
  {
    id: "jio-100",
    operator: "Jio",
    planName: "JioHotstar Data 100",
    price: 100,
    validityDays: 30,
    totalDataGb: 6.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "JioHotstar",
    source: "uploaded",
    highlight: "6 GB total data pack with JioHotstar Mobile.",
  },
  {
    id: "jio-79",
    operator: "Jio",
    planName: "JioHotstar Data 79",
    price: 79,
    validityDays: 30,
    totalDataGb: 3.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "JioHotstar",
    source: "uploaded",
    highlight: "3 GB total data pack with JioHotstar Mobile.",
  },
  {
    id: "jio-500",
    operator: "Jio",
    planName: "Jio Mega Content 500",
    price: 500,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["11+ OTTs Bundle"],
    roaming: true,
    category: "Entertainment",
    source: "uploaded",
    highlight: "Mega Content plan with 2 GB/day and 11+ OTT platforms.",
  },
  {
    id: "jio-175",
    operator: "Jio",
    planName: "Jio Entertainment 175",
    price: 175,
    validityDays: 28,
    totalDataGb: 10.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["10 OTTs Bundle"],
    roaming: true,
    category: "Entertainment",
    source: "uploaded",
    highlight: "Data only pack with 10 GB total + 10 bundled OTT channels.",
  },
  {
    id: "jio-495",
    operator: "Jio",
    planName: "Jio Youth & Gaming 495",
    price: 495,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Gaming Partner Benefits"],
    roaming: true,
    category: "Youth & Gaming",
    source: "uploaded",
    highlight: "Gaming-focused pack with 2 GB/day for 28 days.",
  },
  {
    id: "jio-151",
    operator: "Jio",
    planName: "Jio 5G Upgrade 151",
    price: 151,
    validityDays: 28,
    totalDataGb: 9.0,
    voice: "Active Plan Required",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "True Unlimited Upgrade",
    source: "uploaded",
    highlight: "Unlimited 5G Data upgrade + 9 GB booster.",
  },
  {
    id: "jio-101",
    operator: "Jio",
    planName: "Jio 5G Upgrade 101",
    price: 101,
    validityDays: 28,
    totalDataGb: 6.0,
    voice: "Active Plan Required",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "True Unlimited Upgrade",
    source: "uploaded",
    highlight: "Unlimited 5G Data upgrade + 6 GB booster.",
  },
  {
    id: "jio-51",
    operator: "Jio",
    planName: "Jio 5G Upgrade 51",
    price: 51,
    validityDays: 28,
    totalDataGb: 3.0,
    voice: "Active Plan Required",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "True Unlimited Upgrade",
    source: "uploaded",
    highlight: "Unlimited 5G Data upgrade + 3 GB booster.",
  },
  {
    id: "jio-2799",
    operator: "Jio",
    planName: "Jio IR Annual 2799",
    price: 2799,
    validityDays: 365,
    totalDataGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "Annual International Roaming plan with 3 GB total data.",
  },
  {
    id: "jio-123",
    operator: "Jio",
    planName: "JioPhone 123",
    price: 123,
    validityDays: 28,
    dataPerDayGb: 0.5,
    voice: "Unlimited",
    fiveG: false,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "4G Feature Phone Plan",
    source: "uploaded",
    highlight: "Affordable JioPhone pack with 0.5 GB/day data.",
  },
  {
    id: "jio-234",
    operator: "Jio",
    planName: "JioPhone 234",
    price: 234,
    validityDays: 56,
    dataPerDayGb: 0.5,
    voice: "Unlimited",
    fiveG: false,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "4G Feature Phone Plan",
    source: "uploaded",
    highlight: "JioPhone pack with 0.5 GB/day data for 56 days.",
  },
  {
    id: "jio-1234",
    operator: "Jio",
    planName: "JioPhone Annual 1234",
    price: 1234,
    validityDays: 336,
    dataPerDayGb: 0.5,
    voice: "Unlimited",
    fiveG: false,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "4G Feature Phone Plan",
    source: "uploaded",
    highlight: "Annual JioPhone pack with 0.5 GB/day data.",
  },
  {
    id: "jio-369",
    operator: "Jio",
    planName: "JioPhone 369",
    price: 369,
    validityDays: 84,
    dataPerDayGb: 0.5,
    voice: "Unlimited",
    fiveG: false,
    ott: ["JioCinema", "JioTV"],
    roaming: true,
    category: "4G Feature Phone Plan",
    source: "uploaded",
    highlight: "JioPhone pack with Voice & Data for 84 days.",
  },
  {
    id: "jio-132",
    operator: "Jio",
    planName: "JioPhone Data 132",
    price: 132,
    validityDays: 14,
    totalDataGb: 10.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "4G Feature Phone Addon",
    source: "uploaded",
    highlight: "10 GB data booster for feature phones.",
  },
  {
    id: "jio-86",
    operator: "Jio",
    planName: "JioPhone Data 86",
    price: 86,
    validityDays: 28,
    totalDataGb: 6.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "4G Feature Phone Addon",
    source: "uploaded",
    highlight: "6 GB data booster for feature phones.",
  },
  {
    id: "jio-62",
    operator: "Jio",
    planName: "JioPhone Data 62",
    price: 62,
    validityDays: 28,
    totalDataGb: 4.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "4G Feature Phone Addon",
    source: "uploaded",
    highlight: "4 GB data booster for feature phones.",
  },
  {
    id: "jio-26",
    operator: "Jio",
    planName: "JioPhone Data 26",
    price: 26,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "4G Feature Phone Addon",
    source: "uploaded",
    highlight: "2 GB data booster for feature phones.",
  },
  {
    id: "jio-ir-499",
    operator: "Jio",
    planName: "Jio IR Starter 499",
    price: 499,
    validityDays: 1,
    totalDataGb: 0.25,
    voice: "100 Mins Calls",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "1 Day IR pack with voice & data.",
  },
  {
    id: "jio-ir-2499",
    operator: "Jio",
    planName: "Jio IR Pack 2499",
    price: 2499,
    validityDays: 10,
    totalDataGb: 5.0,
    voice: "100 Mins/Day",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "10 Days IR pack with voice & data.",
  },
  {
    id: "jio-ir-3999",
    operator: "Jio",
    planName: "Jio IR Pack 3999",
    price: 3999,
    validityDays: 30,
    totalDataGb: 10.0,
    voice: "200 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "30 Days IR pack with voice & data.",
  },
  {
    id: "jio-ir-4999",
    operator: "Jio",
    planName: "Jio IR Pack 4999",
    price: 4999,
    validityDays: 30,
    totalDataGb: 15.0,
    voice: "250 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "30 Days premium IR pack with voice & data.",
  },
  {
    id: "jio-ir-5999",
    operator: "Jio",
    planName: "Jio IR Pack 5999",
    price: 5999,
    validityDays: 30,
    totalDataGb: 20.0,
    voice: "300 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "30 Days supreme IR pack with voice & data.",
  },
  {
    id: "jio-ir-2799",
    operator: "Jio",
    planName: "Jio IR Annual 2799",
    price: 2799,
    validityDays: 365,
    totalDataGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "Annual International Roaming plan with 3 GB total data.",
  },
  {
    id: "jio-ird-5899",
    operator: "Jio",
    planName: "Jio IR Data 5899",
    price: 5899,
    validityDays: 21,
    totalDataGb: 10.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "21 Days data-only IR pack with 10 GB.",
  },
  {
    id: "jio-ird-4499",
    operator: "Jio",
    planName: "Jio IR Data 4499",
    price: 4499,
    validityDays: 14,
    totalDataGb: 8.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "14 Days data-only IR pack with 8 GB.",
  },
  {
    id: "jio-ird-2999",
    operator: "Jio",
    planName: "Jio IR Data 2999",
    price: 2999,
    validityDays: 7,
    totalDataGb: 5.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "7 Days data-only IR pack with 5 GB.",
  },
  {
    id: "jio-ird-999",
    operator: "Jio",
    planName: "Jio IR Data 999",
    price: 999,
    validityDays: 14,
    totalDataGb: 2.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "14 Days data-only IR pack with 2 GB.",
  },
  {
    id: "jio-ird-599",
    operator: "Jio",
    planName: "Jio IR Data 599",
    price: 599,
    validityDays: 7,
    totalDataGb: 1.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "7 Days data-only IR pack with 1 GB.",
  },
  {
    id: "jio-top-10",
    operator: "Jio",
    planName: "Jio Talktime 10",
    price: 10,
    validityDays: 365,
    totalDataGb: 0.0,
    voice: "\u20b97.47 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "jio-top-20",
    operator: "Jio",
    planName: "Jio Talktime 20",
    price: 20,
    validityDays: 365,
    totalDataGb: 0.0,
    voice: "\u20b914.95 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "jio-top-50",
    operator: "Jio",
    planName: "Jio Talktime 50",
    price: 50,
    validityDays: 365,
    totalDataGb: 0.0,
    voice: "\u20b939.37 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "jio-top-1000",
    operator: "Jio",
    planName: "Jio Talktime 1000",
    price: 1000,
    validityDays: 365,
    totalDataGb: 0.0,
    voice: "\u20b9844.46 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "High-value Talktime Top-Up voucher.",
  },
  {
    id: "vi-399",
    operator: "Vi",
    planName: "Vi Nonstop Hero 399",
    price: 399,
    validityDays: 28,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data + JioHotstar Mobile for 28 Days.",
  },
  {
    id: "vi-419",
    operator: "Vi",
    planName: "Vi Nonstop Hero 419",
    price: 419,
    validityDays: 28,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["SonyLIV", "ZEE5", "19 OTTs Combo"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data + ZEE5, SonyLIV & 19 OTTs combo.",
  },
  {
    id: "vi-365",
    operator: "Vi",
    planName: "Vi Nonstop Hero 365",
    price: 365,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data + Vi Movies & TV access.",
  },
  {
    id: "vi-379",
    operator: "Vi",
    planName: "Vi Nonstop Hero 379",
    price: 379,
    validityDays: 30,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 1 month + Vi Movies & TV.",
  },
  {
    id: "vi-408",
    operator: "Vi",
    planName: "Vi Nonstop Hero 408",
    price: 408,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["SonyLIV Mobile"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data + SonyLIV Mobile for 28 Days.",
  },
  {
    id: "vi-670",
    operator: "Vi",
    planName: "Vi Nonstop Hero 670",
    price: 670,
    validityDays: 56,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data + Vi Movies & TV for 56 Days.",
  },
  {
    id: "vi-1005",
    operator: "Vi",
    planName: "Vi Nonstop Hero 1005",
    price: 1005,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 84 Days + Vi Movies & TV.",
  },
  {
    id: "vi-1599",
    operator: "Vi",
    planName: "Vi Nonstop Hero 1599",
    price: 1599,
    validityDays: 84,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 84 Days + Netflix bundle.",
  },
  {
    id: "vi-2099",
    operator: "Vi",
    planName: "Vi Nonstop Hero 2099",
    price: 2099,
    validityDays: 180,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 180 Days + Vi Movies & TV.",
  },
  {
    id: "vi-3749",
    operator: "Vi",
    planName: "Vi Nonstop Hero 3749",
    price: 3749,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data annual plan with Vi Movies & TV.",
  },
  {
    id: "vi-580",
    operator: "Vi",
    planName: "Vi Nonstop Hero 580",
    price: 580,
    validityDays: 48,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 48 Days + Vi Movies & TV.",
  },
  {
    id: "vi-860",
    operator: "Vi",
    planName: "Vi Nonstop Hero 860",
    price: 860,
    validityDays: 72,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 72 Days + Vi Movies & TV.",
  },
  {
    id: "vi-1750",
    operator: "Vi",
    planName: "Vi Nonstop Hero 1750",
    price: 1750,
    validityDays: 150,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 150 Days + Vi Movies & TV.",
  },
  {
    id: "vi-3050",
    operator: "Vi",
    planName: "Vi Nonstop Hero 3050",
    price: 3050,
    validityDays: 290,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Unlimited 5G/4G Data for 290 Days + Vi Movies & TV.",
  },
  {
    id: "vi-349",
    operator: "Vi",
    planName: "Vi Hero 349",
    price: 349,
    validityDays: 28,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day with Binge All Night, Weekend Rollover and Vi Movies & TV.",
  },
  {
    id: "vi-579",
    operator: "Vi",
    planName: "Vi Hero 579",
    price: 579,
    validityDays: 56,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day for 56 days + Rollover data.",
  },
  {
    id: "vi-666",
    operator: "Vi",
    planName: "Vi Hero 666",
    price: 666,
    validityDays: 64,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day for 64 days + Rollover data.",
  },
  {
    id: "vi-799",
    operator: "Vi",
    planName: "Vi Hero 799",
    price: 799,
    validityDays: 77,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day for 77 days + Rollover data.",
  },
  {
    id: "vi-859",
    operator: "Vi",
    planName: "Vi Hero 859",
    price: 859,
    validityDays: 84,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day for 84 days + Rollover data.",
  },
  {
    id: "vi-1749",
    operator: "Vi",
    planName: "Vi Hero 1749",
    price: 1749,
    validityDays: 180,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day for 180 days + Rollover data.",
  },
  {
    id: "vi-3499",
    operator: "Vi",
    planName: "Vi Hero 3499",
    price: 3499,
    validityDays: 365,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Annual 1.5 GB/day pack with Rollover data.",
  },
  {
    id: "vi-3599",
    operator: "Vi",
    planName: "Vi Hero 3599",
    price: 3599,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Vi Movies & TV"],
    roaming: true,
    category: "Hero Unlimited",
    source: "uploaded",
    highlight: "Annual 2 GB/day pack with Rollover data.",
  },
  {
    id: "vi-1198",
    operator: "Vi",
    planName: "Vi Netflix 1198",
    price: 1198,
    validityDays: 70,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with Netflix for 70 days.",
  },
  {
    id: "vi-696",
    operator: "Vi",
    planName: "Vi Prime Lite 696",
    price: 696,
    validityDays: 56,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Amazon Prime Lite"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with Amazon Prime Lite for 56 days.",
  },
  {
    id: "vi-996",
    operator: "Vi",
    planName: "Vi Prime Lite 996",
    price: 996,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Amazon Prime Lite"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with Amazon Prime Lite for 84 days.",
  },
  {
    id: "vi-994",
    operator: "Vi",
    planName: "Vi JioHotstar 994",
    price: 994,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with JioHotstar Mobile for 84 days.",
  },
  {
    id: "vi-3699",
    operator: "Vi",
    planName: "Vi JioHotstar 3699",
    price: 3699,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["1 Year JioHotstar"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with 1 Year JioHotstar Mobile.",
  },
  {
    id: "vi-3999",
    operator: "Vi",
    planName: "Vi Premium OTT Annual 3999",
    price: 3999,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["1 Year JioHotstar", "Amazon Prime Lite"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with JioHotstar and Amazon Prime Lite.",
  },
  {
    id: "vi-795",
    operator: "Vi",
    planName: "Vi ZEE5 SonyLIV 795",
    price: 795,
    validityDays: 56,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["ZEE5", "SonyLIV"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "3 GB/day with SonyLIV and ZEE5 for 56 days.",
  },
  {
    id: "vi-979",
    operator: "Vi",
    planName: "Vi ZEE5 SonyLIV 979",
    price: 979,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["ZEE5", "SonyLIV"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day with SonyLIV and ZEE5 for 84 days.",
  },
  {
    id: "vi-2399",
    operator: "Vi",
    planName: "Vi ZEE5 SonyLIV 2399",
    price: 2399,
    validityDays: 180,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["ZEE5", "SonyLIV"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day with SonyLIV and ZEE5 for 180 days.",
  },
  {
    id: "vi-4999",
    operator: "Vi",
    planName: "Vi Ultimate OTT 4999",
    price: 4999,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["20+ OTTs Bundle"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Annual pack with 20+ premium OTT subscriptions.",
  },
  {
    id: "vi-3799",
    operator: "Vi",
    planName: "Vi Prime Video 3799",
    price: 3799,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Prime Video Mobile"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + 1 Year Amazon Prime Video Mobile.",
  },
  {
    id: "vi-179",
    operator: "Vi",
    planName: "Vi Unlimited 179",
    price: 179,
    validityDays: 24,
    totalDataGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 1 GB data.",
  },
  {
    id: "vi-189",
    operator: "Vi",
    planName: "Vi Unlimited 189",
    price: 189,
    validityDays: 26,
    totalDataGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 1 GB data.",
  },
  {
    id: "vi-199",
    operator: "Vi",
    planName: "Vi Unlimited 199",
    price: 199,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 2 GB data.",
  },
  {
    id: "vi-209",
    operator: "Vi",
    planName: "Vi Unlimited 209",
    price: 209,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 2 GB data.",
  },
  {
    id: "vi-218",
    operator: "Vi",
    planName: "Vi Unlimited 218",
    price: 218,
    validityDays: 30,
    totalDataGb: 3.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1 Month plan with 3 GB total data.",
  },
  {
    id: "vi-239",
    operator: "Vi",
    planName: "Vi Unlimited 239",
    price: 239,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Standard voice pack with 2 GB data.",
  },
  {
    id: "vi-299",
    operator: "Vi",
    planName: "Vi Unlimited 299",
    price: 299,
    validityDays: 28,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Standard 1 GB/day daily data pack.",
  },
  {
    id: "vi-345",
    operator: "Vi",
    planName: "Vi Unlimited 345",
    price: 345,
    validityDays: 30,
    totalDataGb: 25.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "30 Days pack with 25 GB total data.",
  },
  {
    id: "vi-369",
    operator: "Vi",
    planName: "Vi Unlimited 369",
    price: 369,
    validityDays: 56,
    totalDataGb: 4.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "56 Days pack with 4 GB total data.",
  },
  {
    id: "vi-548",
    operator: "Vi",
    planName: "Vi Unlimited 548",
    price: 548,
    validityDays: 84,
    totalDataGb: 7.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "84 Days pack with 7 GB total data.",
  },
  {
    id: "vi-625",
    operator: "Vi",
    planName: "Vi Unlimited 625",
    price: 625,
    validityDays: 60,
    totalDataGb: 50.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "60 Days pack with 50 GB total data.",
  },
  {
    id: "vi-1149",
    operator: "Vi",
    planName: "Vi Unlimited 1149",
    price: 1149,
    validityDays: 180,
    totalDataGb: 15.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "180 Days pack with 15 GB total data.",
  },
  {
    id: "vi-2249",
    operator: "Vi",
    planName: "Vi Unlimited 2249",
    price: 2249,
    validityDays: 365,
    totalDataGb: 30.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Annual pack with 30 GB total data.",
  },
  {
    id: "vi-340",
    operator: "Vi",
    planName: "Vi Unlimited 340",
    price: 340,
    validityDays: 28,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1 GB/day daily data pack.",
  },
  {
    id: "vi-470",
    operator: "Vi",
    planName: "Vi Voice 470",
    price: 470,
    validityDays: 84,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Unlimited voice calls for 84 Days.",
  },
  {
    id: "vi-479",
    operator: "Vi",
    planName: "Vi Unlimited 479",
    price: 479,
    validityDays: 48,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1 GB/day daily data for 48 Days.",
  },
  {
    id: "vi-489",
    operator: "Vi",
    planName: "Vi Unlimited 489",
    price: 489,
    validityDays: 78,
    totalDataGb: 6.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "78 Days pack with 6 GB total data.",
  },
  {
    id: "vi-add-175",
    operator: "Vi",
    planName: "Vi Movies Premium 175",
    price: 175,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["20 OTTs Bundle"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "20 OTTs via Vi Movies & TV.",
  },
  {
    id: "vi-add-248",
    operator: "Vi",
    planName: "Vi Movies Mega 248",
    price: 248,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar", "SonyLIV", "ZEE5", "20 OTTs Bundle"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "JioHotstar + SonyLIV + ZEE5 + 20 OTTs bundle.",
  },
  {
    id: "vi-add-154",
    operator: "Vi",
    planName: "Vi Movies Ultimate 154",
    price: 154,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["29 OTTs Bundle"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "29 OTTs via Vi Movies & TV.",
  },
  {
    id: "vi-add-202",
    operator: "Vi",
    planName: "Vi Movies Lite 202",
    price: 202,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["17 OTTs Bundle"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "17 OTTs via Vi Movies & TV.",
  },
  {
    id: "vi-add-101",
    operator: "Vi",
    planName: "Vi JioHotstar 101",
    price: 101,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "28 Days JioHotstar Mobile add-on.",
  },
  {
    id: "vi-add-169",
    operator: "Vi",
    planName: "Vi JioHotstar 169",
    price: 169,
    validityDays: 84,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "84 Days JioHotstar Mobile add-on.",
  },
  {
    id: "vi-add-239",
    operator: "Vi",
    planName: "Vi JioHotstar 239",
    price: 239,
    validityDays: 30,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "JioHotstar Mobile standalone voucher.",
  },
  {
    id: "vi-add-95",
    operator: "Vi",
    planName: "Vi SonyLIV 95",
    price: 95,
    validityDays: 28,
    voice: "No Voice",
    fiveG: false,
    ott: ["SonyLIV Mobile"],
    roaming: true,
    category: "OTT Add-On",
    source: "uploaded",
    highlight: "SonyLIV Mobile standalone voucher.",
  },
  {
    id: "vi-top-10",
    operator: "Vi",
    planName: "Vi TopUp 10",
    price: 10,
    validityDays: 365,
    voice: "\u20b97.47 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "vi-top-20",
    operator: "Vi",
    planName: "Vi TopUp 20",
    price: 20,
    validityDays: 365,
    voice: "\u20b914.95 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "vi-top-50",
    operator: "Vi",
    planName: "Vi TopUp 50",
    price: 50,
    validityDays: 365,
    voice: "\u20b939.37 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "vi-top-100",
    operator: "Vi",
    planName: "Vi TopUp 100",
    price: 100,
    validityDays: 365,
    voice: "\u20b981.75 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "vi-top-500",
    operator: "Vi",
    planName: "Vi TopUp 500",
    price: 500,
    validityDays: 365,
    voice: "\u20b9423.75 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "vi-top-1000",
    operator: "Vi",
    planName: "Vi TopUp 1000",
    price: 1000,
    validityDays: 365,
    voice: "\u20b9847.46 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Talktime Top-Up voucher.",
  },
  {
    id: "airtel-349",
    operator: "Airtel",
    planName: "Airtel Truly Unlimited 349",
    price: 349,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Airtel Xstream Play"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + Unlimited 5G Data.",
  },
  {
    id: "airtel-379",
    operator: "Airtel",
    planName: "Airtel Truly Unlimited 379",
    price: 379,
    validityDays: 30,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Google One"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + Google One subscription.",
  },
  {
    id: "airtel-399",
    operator: "Airtel",
    planName: "Airtel JioHotstar 399",
    price: 399,
    validityDays: 28,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2.5 GB/day + JioHotstar Mobile.",
  },
  {
    id: "airtel-409",
    operator: "Airtel",
    planName: "Airtel Aha Premium 409",
    price: 409,
    validityDays: 28,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Aha Premium", "20+ OTTs Bundle"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2.5 GB/day + Aha Premium + 20+ OTT channels.",
  },
  {
    id: "airtel-429",
    operator: "Airtel",
    planName: "Airtel Truly Unlimited 429",
    price: 429,
    validityDays: 30,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Airtel Xstream Play"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2.5 GB/day + Unlimited 5G Data for 1 month.",
  },
  {
    id: "airtel-449",
    operator: "Airtel",
    planName: "Airtel JioHotstar 449",
    price: 449,
    validityDays: 28,
    dataPerDayGb: 4.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Heavy 4 GB/day daily data + JioHotstar Mobile.",
  },
  {
    id: "airtel-649",
    operator: "Airtel",
    planName: "Airtel Truly Unlimited 649",
    price: 649,
    validityDays: 56,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Airtel Xstream Play"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + Unlimited 5G Data for 56 Days.",
  },
  {
    id: "airtel-838",
    operator: "Airtel",
    planName: "Airtel Amazon Prime 838",
    price: 838,
    validityDays: 56,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Amazon Prime Lite", "SonyLIV", "20+ OTTs Bundle"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Heavy 3 GB/day + Prime Lite + SonyLIV + 20 OTTs via Xstream Play.",
  },
  {
    id: "airtel-979",
    operator: "Airtel",
    planName: "Airtel Aha Premium 979",
    price: 979,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Aha Premium", "20+ OTTs Bundle", "SonyLIV"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day for 84 Days + Aha Premium + 20+ OTTs via Xstream Play.",
  },
  {
    id: "airtel-1029",
    operator: "Airtel",
    planName: "Airtel JioHotstar 1029",
    price: 1029,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile (3M)"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day + JioHotstar Mobile for 3 months.",
  },
  {
    id: "airtel-1199",
    operator: "Airtel",
    planName: "Airtel Amazon Prime 1199",
    price: 1199,
    validityDays: 84,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Amazon Prime Lite", "SonyLIV", "20+ OTTs Bundle"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2.5 GB/day + Amazon Prime Lite + SonyLIV + 20 OTTs via Xstream Play.",
  },
  {
    id: "airtel-1729",
    operator: "Airtel",
    planName: "Airtel Netflix 1729",
    price: 1729,
    validityDays: 84,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix Basic"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "2 GB/day for 84 Days + Netflix Basic subscription.",
  },
  {
    id: "airtel-1798",
    operator: "Airtel",
    planName: "Airtel Netflix 1798",
    price: 1798,
    validityDays: 84,
    dataPerDayGb: 3.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix Basic"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Heavy 3 GB/day for 84 Days + Netflix Basic.",
  },
  {
    id: "airtel-3599",
    operator: "Airtel",
    planName: "Airtel Adobe Premium 3599",
    price: 3599,
    validityDays: 365,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Adobe Express Premium"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Annual 2 GB/day pack + Adobe Express Premium + Unlimited 5G Data.",
  },
  {
    id: "airtel-3999",
    operator: "Airtel",
    planName: "Airtel JioHotstar 3999",
    price: 3999,
    validityDays: 365,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["JioHotstar Mobile (3M)"],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Annual 2.5 GB/day pack + JioHotstar Mobile (3M) + Unlimited 5G Data.",
  },
  {
    id: "airtel-net-279",
    operator: "Airtel",
    planName: "Airtel Netflix 279",
    price: 279,
    validityDays: 30,
    totalDataGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: ["Netflix Basic"],
    roaming: true,
    category: "Netflix Vouchers",
    source: "uploaded",
    highlight: "Netflix Basic + 1 GB data for 1 month.",
  },
  {
    id: "airtel-net-598",
    operator: "Airtel",
    planName: "Airtel Netflix 598",
    price: 598,
    validityDays: 28,
    dataPerDayGb: 2.0,
    voice: "Unlimited",
    fiveG: true,
    ott: ["Netflix Basic"],
    roaming: true,
    category: "Netflix Vouchers",
    source: "uploaded",
    highlight: "2 GB/day + Netflix Basic for 28 Days.",
  },
  {
    id: "airtel-jh-100",
    operator: "Airtel",
    planName: "Airtel JioHotstar 100",
    price: 100,
    validityDays: 30,
    totalDataGb: 6.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["JioHotstar Mobile (1M)"],
    roaming: true,
    category: "JioHotstar",
    source: "uploaded",
    highlight: "6 GB total data pack + JioHotstar Mobile (1M).",
  },
  {
    id: "airtel-xstream-195",
    operator: "Airtel",
    planName: "Airtel Xstream 195",
    price: 195,
    validityDays: 30,
    totalDataGb: 12.0,
    voice: "No Voice",
    fiveG: false,
    ott: ["Aha Premium", "SonyLIV", "Airtel Xstream Play"],
    roaming: true,
    category: "Airtel Xstream",
    source: "uploaded",
    highlight: "12 GB total data pack + Aha Premium + SonyLIV + Xstream Play.",
  },
  {
    id: "airtel-ann-1849",
    operator: "Airtel",
    planName: "Airtel Annual 1849",
    price: 1849,
    validityDays: 365,
    totalDataGb: 24.0,
    voice: "Unlimited Calls + 3600 SMS",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual Plans",
    source: "uploaded",
    highlight: "Budget Annual voice voucher + 24 GB total data.",
  },
  {
    id: "airtel-ann-2249",
    operator: "Airtel",
    planName: "Airtel Annual 2249",
    price: 2249,
    validityDays: 365,
    totalDataGb: 30.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Annual Plans",
    source: "uploaded",
    highlight: "Annual pack with 30 GB total data.",
  },
  {
    id: "airtel-ann-4999",
    operator: "Airtel",
    planName: "Airtel NRI Annual 4999",
    price: 4999,
    validityDays: 365,
    dataPerDayGb: 2.5,
    voice: "Unlimited",
    fiveG: true,
    ott: ["NRI Benefits (7GB IR Data)"],
    roaming: true,
    category: "NRI Plan",
    source: "uploaded",
    highlight: "Premium NRI Annual plan. 7GB IR data + Unlimited calls + 2.5GB/day in India.",
  },
  {
    id: "airtel-199",
    operator: "Airtel",
    planName: "Airtel Unlimited 199",
    price: 199,
    validityDays: 28,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 2 GB data.",
  },
  {
    id: "airtel-219",
    operator: "Airtel",
    planName: "Airtel Unlimited 219",
    price: 219,
    validityDays: 30,
    totalDataGb: 2.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Budget Unlimited voice pack with 2 GB data for 1 month.",
  },
  {
    id: "airtel-299",
    operator: "Airtel",
    planName: "Airtel Unlimited 299",
    price: 299,
    validityDays: 28,
    dataPerDayGb: 1.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Standard 1 GB/day daily data pack.",
  },
  {
    id: "airtel-319",
    operator: "Airtel",
    planName: "Airtel Unlimited 319",
    price: 319,
    validityDays: 30,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day daily data for 1 month.",
  },
  {
    id: "airtel-355",
    operator: "Airtel",
    planName: "Airtel Unlimited 355",
    price: 355,
    validityDays: 30,
    totalDataGb: 25.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "30 Days pack with 25 GB total data.",
  },
  {
    id: "airtel-469",
    operator: "Airtel",
    planName: "Airtel Voice 469",
    price: 469,
    validityDays: 84,
    voice: "Unlimited Calls + 900 SMS",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "Voice-focused pack for 84 Days.",
  },
  {
    id: "airtel-489",
    operator: "Airtel",
    planName: "Airtel Unlimited 489",
    price: 489,
    validityDays: 77,
    totalDataGb: 6.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "77 Days pack with 6 GB total data.",
  },
  {
    id: "airtel-548",
    operator: "Airtel",
    planName: "Airtel Unlimited 548",
    price: 548,
    validityDays: 84,
    totalDataGb: 7.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "84 Days pack with 7 GB total data.",
  },
  {
    id: "airtel-579",
    operator: "Airtel",
    planName: "Airtel Unlimited 579",
    price: 579,
    validityDays: 56,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day daily data for 56 Days.",
  },
  {
    id: "airtel-609",
    operator: "Airtel",
    planName: "Airtel Unlimited 609",
    price: 609,
    validityDays: 30,
    totalDataGb: 60.0,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "60 GB total data pack for 1 month.",
  },
  {
    id: "airtel-619",
    operator: "Airtel",
    planName: "Airtel Unlimited 619",
    price: 619,
    validityDays: 60,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day daily data for 60 Days.",
  },
  {
    id: "airtel-899",
    operator: "Airtel",
    planName: "Airtel Unlimited 899",
    price: 899,
    validityDays: 84,
    dataPerDayGb: 1.5,
    voice: "Unlimited",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Truly Unlimited",
    source: "uploaded",
    highlight: "1.5 GB/day daily data for 84 Days.",
  },
  {
    id: "airtel-data-22",
    operator: "Airtel",
    planName: "Airtel Data 22",
    price: 22,
    validityDays: 1,
    totalDataGb: 1.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "1 GB data booster for 1 Day.",
  },
  {
    id: "airtel-data-26",
    operator: "Airtel",
    planName: "Airtel Data 26",
    price: 26,
    validityDays: 1,
    totalDataGb: 1.5,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "1.5 GB data booster for 1 Day.",
  },
  {
    id: "airtel-data-33",
    operator: "Airtel",
    planName: "Airtel Data 33",
    price: 33,
    validityDays: 1,
    totalDataGb: 2.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "2 GB data booster for 1 Day.",
  },
  {
    id: "airtel-data-39",
    operator: "Airtel",
    planName: "Airtel Data 39",
    price: 39,
    validityDays: 3,
    dataPerDayGb: 3.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "3 GB/day data pack for 3 Days.",
  },
  {
    id: "airtel-data-49",
    operator: "Airtel",
    planName: "Airtel Data 49",
    price: 49,
    validityDays: 1,
    voice: "No Voice",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "Unlimited Data booster for 1 Day.",
  },
  {
    id: "airtel-data-77",
    operator: "Airtel",
    planName: "Airtel Data 77",
    price: 77,
    validityDays: 7,
    totalDataGb: 5.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "5 GB data booster for 7 Days.",
  },
  {
    id: "airtel-data-99",
    operator: "Airtel",
    planName: "Airtel Data 99",
    price: 99,
    validityDays: 2,
    voice: "No Voice",
    fiveG: true,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "Unlimited Data booster for 2 Days.",
  },
  {
    id: "airtel-data-100",
    operator: "Airtel",
    planName: "Airtel Data 100",
    price: 100,
    validityDays: 30,
    totalDataGb: 6.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "6 GB data booster for 30 Days.",
  },
  {
    id: "airtel-data-161",
    operator: "Airtel",
    planName: "Airtel Data 161",
    price: 161,
    validityDays: 30,
    totalDataGb: 12.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "12 GB data booster for 30 Days.",
  },
  {
    id: "airtel-data-195",
    operator: "Airtel",
    planName: "Airtel Data 195",
    price: 195,
    validityDays: 30,
    totalDataGb: 12.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "12 GB data booster for 30 Days.",
  },
  {
    id: "airtel-data-361",
    operator: "Airtel",
    planName: "Airtel Data 361",
    price: 361,
    validityDays: 90,
    totalDataGb: 50.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Data Pack",
    source: "uploaded",
    highlight: "50 GB data booster for 90 Days.",
  },
  {
    id: "airtel-ir-118",
    operator: "Airtel",
    planName: "Airtel IR Activation 118",
    price: 118,
    validityDays: 365,
    voice: "IR Activation Only",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "IR Activation + Free Incoming SMS.",
  },
  {
    id: "airtel-ir-698",
    operator: "Airtel",
    planName: "Airtel IR 698",
    price: 698,
    validityDays: 1,
    totalDataGb: 1.0,
    voice: "100 Mins Calls",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "1 GB data + 100 Mins + 10 SMS.",
  },
  {
    id: "airtel-ir-699",
    operator: "Airtel",
    planName: "Airtel IR Data 699",
    price: 699,
    validityDays: 1,
    totalDataGb: 2.0,
    voice: "No Voice",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "2 GB IR Data pack.",
  },
  {
    id: "airtel-ir-898",
    operator: "Airtel",
    planName: "Airtel IR 898",
    price: 898,
    validityDays: 5,
    totalDataGb: 4.0,
    voice: "150 Mins Calls",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "4 GB data + 150 Mins + 20 SMS.",
  },
  {
    id: "airtel-ir-1198",
    operator: "Airtel",
    planName: "Airtel IR 1198",
    price: 1198,
    validityDays: 10,
    totalDataGb: 6.0,
    voice: "200 Mins Calls",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "6 GB data + 200 Mins + 20 SMS.",
  },
  {
    id: "airtel-ir-2998",
    operator: "Airtel",
    planName: "Airtel IR 2998",
    price: 2998,
    validityDays: 30,
    totalDataGb: 10.0,
    voice: "300 Mins Calls",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "International Roaming",
    source: "uploaded",
    highlight: "10 GB data + 300 Mins + 20 SMS.",
  },
  {
    id: "airtel-if-196",
    operator: "Airtel",
    planName: "Airtel In-Flight 196",
    price: 196,
    validityDays: 1,
    totalDataGb: 0.25,
    voice: "100 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "In-Flight Roaming",
    source: "uploaded",
    highlight: "250 MB + 100 Mins + 100 SMS in-flight.",
  },
  {
    id: "airtel-if-295",
    operator: "Airtel",
    planName: "Airtel In-Flight 295",
    price: 295,
    validityDays: 1,
    totalDataGb: 0.5,
    voice: "100 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "In-Flight Roaming",
    source: "uploaded",
    highlight: "500 MB + 100 Mins + 100 SMS in-flight.",
  },
  {
    id: "airtel-if-595",
    operator: "Airtel",
    planName: "Airtel In-Flight 595",
    price: 595,
    validityDays: 1,
    totalDataGb: 1.0,
    voice: "100 Mins",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "In-Flight Roaming",
    source: "uploaded",
    highlight: "1 GB + 100 Mins + 100 SMS in-flight.",
  },
  {
    id: "airtel-top-10",
    operator: "Airtel",
    planName: "Airtel TopUp 10",
    price: 10,
    validityDays: 365,
    voice: "\u20b97.47 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "airtel-top-120",
    operator: "Airtel",
    planName: "Airtel TopUp 120",
    price: 120,
    validityDays: 365,
    voice: "\u20b998.69 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "airtel-top-500",
    operator: "Airtel",
    planName: "Airtel TopUp 500",
    price: 500,
    validityDays: 365,
    voice: "\u20b9423.73 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Standard Talktime Top-Up voucher.",
  },
  {
    id: "airtel-top-1000",
    operator: "Airtel",
    planName: "Airtel TopUp 1000",
    price: 1000,
    validityDays: 365,
    voice: "\u20b9847.46 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "High-value Talktime Top-Up voucher.",
  },
  {
    id: "airtel-top-5000",
    operator: "Airtel",
    planName: "Airtel TopUp 5000",
    price: 5000,
    validityDays: 365,
    voice: "\u20b94237.29 Talktime",
    fiveG: false,
    ott: [],
    roaming: true,
    category: "Top-up",
    source: "uploaded",
    highlight: "Premium Talktime Top-Up voucher.",
  }
];

export function isAddonPack(plan: Plan): boolean {
  const price = plan.price;
  const operator = plan.operator;
  
  if (operator === "Airtel") {
    const airtelAddons = [22, 26, 33, 39, 48, 49, 51, 77, 99, 100, 101, 151, 161, 195, 279, 361];
    if (airtelAddons.includes(price)) return true;
  }
  
  if (operator === "Jio") {
    const jioAddons = [359, 289, 219, 175, 49, 29, 19, 11, 51, 101, 151];
    if (jioAddons.includes(price)) return true;
  }
  
  if (operator === "Vi") {
    const viAddons = [175, 798, 22, 44, 248, 26, 33, 101, 48, 49, 251, 201, 61, 139, 169, 208, 145, 154, 89, 348, 488, 95, 69, 202, 1189, 99];
    if (viAddons.includes(price)) return true;
  }
  
  if (plan.category === "Data Pack") return true;
  if (plan.voice && (plan.voice.toLowerCase().includes("active plan") || plan.voice.toLowerCase().includes("no service validity") || plan.voice === "No Voice")) {
    return true;
  }
  
  return false;
}

export const planCatalog: Plan[] = rawPlanCatalog.map(plan => ({
  ...plan,
  existingPlanRequired: isAddonPack(plan)
}));

export type UserInsights = {
  avgSpend: number;
  monthlyData: number;
  calls: number;
  ottInterest: boolean;
  dailyNeedGb: number;
  monthlyNeedMinutes: number;
};

export function analyzeUsage(profile: UsageProfile): UserInsights {
  return {
    avgSpend: profile.monthlySpend,
    monthlyData: profile.dataUsageGb,
    calls: profile.callMinutes,
    ottInterest: profile.ottUsage,
    dailyNeedGb: profile.dataUsageGb / 30,
    monthlyNeedMinutes: profile.callMinutes,
  };
}

export function getCoverageForCity(city: string) {
  return coverageRecords
    .filter((record) => record.city === city)
    .sort((left, right) => right.overall - left.overall);
}

export function getCityOptions() {
  return Array.from(new Set(coverageRecords.map((record) => record.city)));
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function dataCapacity(plan: Plan) {
  if (typeof plan.dataPerDayGb === "number") {
    return plan.dataPerDayGb;
  }
  if (typeof plan.totalDataGb === "number") {
    return plan.totalDataGb / Math.max(plan.validityDays, 1);
  }
  return 0.5;
}

export function getOperatorCoverageScore(city: string, operator: Operator) {
  const record = coverageRecords.find(
    (entry) => entry.city === city && entry.operator === operator,
  );
  return record ? record.overall : 6.5;
}

export function rankPlans(profile: UsageProfile, city = profile.city): RankedPlan[] {
  const coverageByOperator = new Map<Operator, number>();
  for (const operator of operators) {
    coverageByOperator.set(operator, getOperatorCoverageScore(city, operator));
  }

  const bestCoverage = Math.max(...Array.from(coverageByOperator.values()));
  const dailyNeed = profile.dataUsageGb / 30;

  const scored = planCatalog
    .map((plan) => {
      const coverage = coverageByOperator.get(plan.operator) ?? 6.5;
      const planCap = dataCapacity(plan);
      
      const budgetMatch = clamp(1 - Math.abs(plan.price - profile.monthlySpend) / Math.max(plan.price, profile.monthlySpend, 1));
      const dataMatch = clamp(1 - Math.abs(planCap - dailyNeed) / Math.max(dailyNeed, 0.5));
      const coverageMatch = clamp(coverage / 10);
      const ottMatch = profile.ottUsage ? clamp(plan.ott.length / 2.5) : (plan.ott.length === 0 ? 1.0 : 0.1);
      const preferenceMatch = plan.operator === profile.preferredOperator ? 1 : 0.24;
      
      const candidateScore =
        budgetMatch * 0.35 + dataMatch * 0.25 + coverageMatch * 0.2 + ottMatch * 0.1 + preferenceMatch * 0.1;
      
      const rerankBoost =
        (plan.operator === profile.preferredOperator ? 0.05 : 0) +
        (coverage >= bestCoverage - 0.15 ? 0.03 : 0) +
        (plan.source === "uploaded" ? 0.02 : 0.01);
        
      const finalScore = clamp(candidateScore + rerankBoost);

      const reasons = [
        plan.operator === profile.preferredOperator ? "Matches your preferred operator" : `Ranks well against ${profile.preferredOperator}`,
        coverage >= bestCoverage - 0.15 ? `${plan.operator} leads in ${city}` : `${plan.operator} remains competitive in ${city}`,
        plan.ott.length > 0 ? "Includes bundled OTT or premium benefits" : "Keeps the plan lean for pure connectivity",
      ];

      return {
        ...plan,
        operatorCoverage: coverage,
        candidateScore,
        budgetMatch,
        dataMatch,
        coverageMatch,
        ottMatch,
        preferenceMatch,
        rerankBoost,
        finalScore,
        reason: reasons,
        budgetFit: budgetMatch * 100,
        dataFit: dataMatch * 100,
        ottFit: ottMatch * 100,
        validityFit: 100,
        operatorFit: preferenceMatch * 100,
      };
    })
    .sort((left, right) => {
      if (Math.abs(right.finalScore - left.finalScore) > 0.0001) {
        return right.finalScore - left.finalScore;
      }
      const leftDaily = left.price / (left.validityDays || 1);
      const rightDaily = right.price / (right.validityDays || 1);
      if (Math.abs(leftDaily - rightDaily) > 0.01) {
        return leftDaily - rightDaily;
      }
      return left.price - right.price;
    });

  return scored;
}

export function getTopPlanByOperator(profile: UsageProfile, city = profile.city) {
  const ranked = rankPlans(profile, city);
  const leaders = new Map<Operator, RankedPlan>();

  for (const plan of ranked) {
    if (!leaders.has(plan.operator)) {
      leaders.set(plan.operator, plan);
    }
  }

  return operators.map((operator) => leaders.get(operator)).filter(Boolean) as RankedPlan[];
}

export function explainRecommendation(plan: RankedPlan, profile: UsageProfile, city: string) {
  const valueGap = Math.max(profile.monthlySpend - plan.price, 0);
  const dailyNeed = profile.dataUsageGb / 30;
  const planData = typeof plan.dataPerDayGb === "number" ? plan.dataPerDayGb : (plan.totalDataGb ?? 0) / Math.max(plan.validityDays, 1);

  return [
    `You use about ${dailyNeed.toFixed(1)}GB/day, and this plan delivers ${planData.toFixed(1)}GB/day of usable quota.`,
    `In ${city}, ${plan.operator} scores ${plan.operatorCoverage.toFixed(1)}/10 on coverage, which boosts the re-ranked result.`,
    valueGap > 0 ? `It keeps roughly ₹${valueGap.toFixed(0)} of your monthly budget available for add-ons or savings.` : `It sits close to your current budget, so the engine prefers it over much pricier alternatives.`,
  ];
}

export function savingsSummary(currentPlanPrice: number, recommendedPrice: number) {
  const monthlySavings = Math.max(currentPlanPrice - recommendedPrice, 0);

  return {
    monthlySavings,
    annualSavings: monthlySavings * 12,
  };
}

export function compareMetric(plan: Plan, city: string) {
  const coverage = getOperatorCoverageScore(city, plan.operator);
  const data = dataCapacity(plan);
  
  const baseValue = (plan.dataPerDayGb ?? data) * 20 + coverage * 2.5 + (plan.ott.length > 0 ? 8 : 0);
  const valueScore = clamp(
    baseValue / Math.max(plan.price / 75, 1),
    0,
    100,
  );

  return {
    cost: plan.price,
    data,
    calls: plan.voice.includes("Unlimited") ? 100 : 60,
    ott: plan.ott.length,
    coverage,
    valueScore,
  };
}

export function searchKnowledgeBase(query: string) {
  const normalized = query.toLowerCase();

  let targetOperator: string | null = null;
  if (normalized.includes("jio")) targetOperator = "Jio";
  else if (normalized.includes("airtel")) targetOperator = "Airtel";
  else if (normalized.includes("bsnl")) targetOperator = "BSNL";
  else if (normalized.includes("vi")) targetOperator = "Vi";

  const stopWords = new Set(["i", "am", "using", "sim", "and", "need", "per", "day", "with", "my", "is", "a", "to", "for", "in", "of", "the", "plan", "plans", "data", "unlimited"]);

  const matchingPlans = planCatalog.filter((plan) => {
    if (targetOperator && plan.operator !== targetOperator) {
      return false;
    }

    const searchable = [
      plan.planName,
      plan.category,
      plan.operator,
      plan.voice,
      plan.ott.join(" "),
      plan.highlight,
    ]
      .join(" ")
      .toLowerCase();

    const queryTerms = normalized.split(/\s+/).filter(Boolean).filter(term => !stopWords.has(term));
    if (queryTerms.length === 0) return true;
    
    return queryTerms.some((term) => searchable.includes(term));
  });

  if (normalized.includes("ott") || normalized.includes("stream") || normalized.includes("netflix") || normalized.includes("prime") || normalized.includes("hotstar")) {
    const plans = matchingPlans.filter((plan) => plan.ott.length > 0).slice(0, 5);

    return {
      answer: plans.length
        ? `The catalog shows premium OTT bundling in plans like: ${plans.map((plan) => `${plan.operator} ₹${plan.price} (${plan.dataPerDayGb ?? 0}GB/d)`).join(", ")}. Airtel bundles Prime and Wynk Music, Jio offers Hotstar and JioCinema Premium, and Vi includes Hotstar mobile.`
        : "No OTT-heavy plans matched the query, but the catalog has OTT bundles in Airtel, Jio, and Vi plans.",
      citations: plans.map((plan) => `${plan.operator} ₹${plan.price} - ${plan.planName}`),
    };
  }

  if (normalized.includes("coverage") || normalized.includes("network") || normalized.includes("city") || normalized.includes("best tower")) {
    return {
      answer: `Coverage intelligence ranks operators city-by-city. In Bangalore, Jio leads at 9.3 overall, followed closely by Airtel at 8.8, Vi at 7.1, and BSNL at 6.2.`,
      citations: ["coverage_records"],
    };
  }

  const sample = matchingPlans.slice(0, 4);

  return {
    answer: sample.length
      ? `Here are some matched plans: ${sample.map((plan) => `${plan.operator} ₹${plan.price} (${plan.dataPerDayGb ?? 0}GB/d)`).join(", ")}.`
      : `I could not find a direct match. Try asking about "cheap plans", "Netflix plans", or "coverage in Bangalore".`,
    citations: sample.map((plan) => `${plan.operator} ₹${plan.price} - ${plan.category}`),
  };
}

export function getBestPlan(profile: UsageProfile, city = profile.city) {
  return rankPlans(profile, city)[0];
}

export function parseNumericValue(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/[₹\s,]/g, "");
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

export function parseBudgetRange(rangeStr: string): { min: number; max: number } {
  if (!rangeStr) return { min: 0, max: Infinity };
  const cleaned = rangeStr.replace(/[₹\s,]/g, "");
  
  if (cleaned.toLowerCase().startsWith("under")) {
    const maxVal = parseFloat(cleaned.replace(/under/i, ""));
    return { min: 0, max: isNaN(maxVal) ? Infinity : maxVal };
  }
  if (cleaned.includes("-")) {
    const parts = cleaned.split("-");
    const minVal = parseFloat(parts[0]);
    const maxVal = parseFloat(parts[1]);
    return { min: isNaN(minVal) ? 0 : minVal, max: isNaN(maxVal) ? Infinity : maxVal };
  }
  if (cleaned.endsWith("+")) {
    const minVal = parseFloat(cleaned.replace("+", ""));
    return { min: isNaN(minVal) ? 0 : minVal, max: Infinity };
  }
  
  const numeric = parseFloat(cleaned);
  if (!isNaN(numeric)) {
    return { min: 0, max: numeric };
  }
  
  return { min: 0, max: Infinity };
}

export function extractIntentFromQuery(text: string): Partial<ChatWizardPreferences> {
  const result: Partial<ChatWizardPreferences> = {};
  const lower = text.toLowerCase();

  // 1. Detect Operator
  if (lower.includes("airtel")) result.currentOperator = "Airtel";
  else if (lower.includes("jio")) result.currentOperator = "Jio";
  else if (lower.includes("bsnl")) result.currentOperator = "BSNL";
  else if (lower.includes("vi")) result.currentOperator = "Vi";

  // 2. Detect Budget
  const budgetRegex = /(?:under|below|budget|less|within|price|rs\.?|₹)\s*(?:is|of|around|about|near|limit)?\s*(?:rs\.?|₹)?\s*(\d+)/i;
  const budgetMatch = lower.match(budgetRegex);
  if (budgetMatch) {
    result.budgetRange = `₹${budgetMatch[1]}`;
  } else {
    const allNumbers = [...lower.matchAll(/\b(\d{3,4})\b/g)];
    const validStandalone = allNumbers.find((m) => {
      const numStr = m[1];
      const index = m.index ?? 0;
      const after = lower.slice(index + numStr.length).trim();
      // If the number is followed by day, gb, mb, etc. it's not a budget
      if (/^(?:day|gb|mb|per|daily|year)/i.test(after)) {
        return false;
      }
      return true;
    });
    if (validStandalone) {
      result.budgetRange = `₹${validStandalone[1]}`;
    }
  }

  // 3. Detect Daily Data
  const dataRegex = /(\d+(?:\.\d+)?)\s*(?:gb|gig)\s*(?:per\s*day|daily|\/day)?/i;
  const dataMatch = lower.match(dataRegex);
  if (dataMatch) {
    const val = parseFloat(dataMatch[1]);
    result.dailyData = `${val} GB`;
  }

  // 4. Detect Validity
  const validityRegex = /(\d+)\s*(?:day|days|month|months|year|years)/i;
  const validityMatch = lower.match(validityRegex);
  if (validityMatch) {
    const num = parseInt(validityMatch[1], 10);
    const unit = validityMatch[0].toLowerCase();
    if (unit.includes("month")) {
      if (num === 1) result.validityPreference = "28 Days";
      else if (num === 2) result.validityPreference = "56 Days";
      else if (num === 3) result.validityPreference = "84 Days";
      else result.validityPreference = `${num * 30} Days`;
    } else if (unit.includes("year")) {
      result.validityPreference = "365 Days";
    } else {
      result.validityPreference = `${num} Days`;
    }
  } else if (lower.includes("annual") || lower.includes("yearly") || lower.includes("yearlong")) {
    result.validityPreference = "365 Days";
  }

  // 5. Detect OTT Platforms
  const isNegativeOtt =
    /don'?t\s+(?:want|need|require|care\s+about)\s+(?:any\s+)?(?:ott|streaming|entertainment|apps?|services?|subscriptions?)/i.test(lower) ||
    /do\s+not\s+(?:want|need|require)\s+(?:any\s+)?(?:ott|streaming|entertainment|apps?|services?|subscriptions?)/i.test(lower) ||
    /no\s+(?:ott|otts|streaming|entertainment|subscriptions?|apps?|services?)/i.test(lower) ||
    /without\s+(?:any\s+)?(?:ott|streaming|entertainment|subscriptions?|services?)/i.test(lower) ||
    /zero\s+ott/i.test(lower) ||
    /exclude\s+ott/i.test(lower) ||
    /hate\s+ott/i.test(lower) ||
    /avoid\s+ott/i.test(lower) ||
    /pure\s+(?:calling|data|connectivity)/i.test(lower) ||
    /only\s+(?:calling|data|connectivity)/i.test(lower) ||
    lower.includes("no ott") ||
    lower.includes("without ott") ||
    lower.includes("pure calling") ||
    lower.includes("no entertainment");

  if (isNegativeOtt) {
    result.ottPlatforms = ["No OTT"];
  } else {
    const otts: string[] = [];
    if (lower.includes("netflix")) otts.push("Netflix");
    if (lower.includes("hotstar") || lower.includes("disney")) otts.push("Hotstar");
    if (lower.includes("prime") || lower.includes("amazon")) otts.push("Prime Video");
    if (lower.includes("sony") || lower.includes("liv")) otts.push("SonyLIV");
    if (lower.includes("zee")) otts.push("Zee5");
    if (lower.includes("jiocinema") || lower.includes("cinema")) otts.push("JioCinema");
    if (lower.includes("jiotv")) otts.push("JioTV");
    
    if (otts.length > 0) {
      result.ottPlatforms = otts;
    }
  }

  // 6. Detect 5G
  if (lower.includes("5g") || lower.includes("fifth gen") || lower.includes("5 generation")) {
    result.fiveGRequired = "Yes";
  }

  // 7. Detect Persona / Purpose
  if (lower.includes("game") || lower.includes("gaming") || lower.includes("pubg") || lower.includes("cod")) {
    result.persona = "gamer";
    result.purpose = "Gaming";
  } else if (!isNegativeOtt && (lower.includes("stream") || lower.includes("streaming") || lower.includes("netflix") || lower.includes("prime") || lower.includes("movie") || lower.includes("watch"))) {
    result.persona = "streamer";
    result.purpose = "Streaming";
  } else if (lower.includes("student") || lower.includes("study") || lower.includes("college") || lower.includes("class")) {
    result.persona = "student";
    result.purpose = "Work/Study";
  } else if (lower.includes("work") || lower.includes("office") || lower.includes("zoom") || lower.includes("meeting")) {
    result.persona = "professional";
    result.purpose = "Work/Study";
  } else if (lower.includes("family") || lower.includes("parent") || lower.includes("kid") || lower.includes("home")) {
    result.persona = "family";
    result.purpose = "Mixed Usage";
  } else if (lower.includes("social") || lower.includes("instagram") || lower.includes("insta") || lower.includes("youtube") || lower.includes("facebook")) {
    result.persona = "social";
    result.purpose = "Social Media";
  }

  // 8. Detect Add-on / Booster pack intent
  if (lower.includes("booster") || lower.includes("addon") || lower.includes("add-on") || lower.includes("top up") || lower.includes("top-up") || lower.includes("data pack") || lower.includes("data-pack") || lower.includes("upgrade")) {
    result.addonRequested = true;
  }

  // 9. Detect International Roaming intent
  if (lower.includes("roaming") || lower.includes("international") || lower.includes(" ir ") || lower.includes("usa") || lower.includes("abroad") || lower.includes("travel")) {
    result.isInternationalRoaming = true;
  }

  return result;
}

export function rankPlansByPreferences(
  prefs: ChatWizardPreferences,
  customWeights?: {
    budgetWeight: number;
    dataWeight: number;
    ottWeight: number;
    validityWeight: number;
    operatorWeight: number;
  }
): RankedPlan[] {
  const city = "Bangalore";
  const coverageByOperator = new Map<Operator, number>();
  for (const operator of operators) {
    coverageByOperator.set(operator, getOperatorCoverageScore(city, operator));
  }

  // Determine weights
  let budgetW = 35;
  let dataW = 25;
  let ottW = 15;
  let validityW = 15;
  let operatorW = 10;

  if (customWeights) {
    const total =
      customWeights.budgetWeight +
      customWeights.dataWeight +
      customWeights.ottWeight +
      customWeights.validityWeight +
      customWeights.operatorWeight;
    if (total > 0) {
      budgetW = (customWeights.budgetWeight / total) * 100;
      dataW = (customWeights.dataWeight / total) * 100;
      ottW = (customWeights.ottWeight / total) * 100;
      validityW = (customWeights.validityWeight / total) * 100;
      operatorW = (customWeights.operatorWeight / total) * 100;
    }
  } else {
    // Dynamic weight adjustments based on user priority
    if (prefs.priority === "Lowest Cost") {
      budgetW = 50;
      dataW = 25;
      ottW = 10;
      validityW = 10;
      operatorW = 5;
    } else if (prefs.priority === "Maximum Data") {
      budgetW = 25;
      dataW = 45;
      ottW = 10;
      validityW = 10;
      operatorW = 10;
    } else if (prefs.priority === "OTT Benefits") {
      budgetW = 25;
      dataW = 20;
      ottW = 35;
      validityW = 10;
      operatorW = 10;
    } else if (prefs.priority === "Long Validity") {
      budgetW = 25;
      dataW = 15;
      ottW = 10;
      validityW = 40;
      operatorW = 10;
    } else if (prefs.priority === "Best Value") {
      budgetW = 35;
      dataW = 25;
      ottW = 15;
      validityW = 15;
      operatorW = 10;
    }
  }

  const scored = planCatalog.map((plan) => {
    const coverage = coverageByOperator.get(plan.operator) ?? 6.5;
    const planCap = dataCapacity(plan);

    // 1. Budget Fit (0-100)
    let budgetFit = 100;
    let budgetPenaltyMultiplier = 1.0;
    const { min, max } = parseBudgetRange(prefs.budgetRange);

    if (plan.price <= max) {
      if (plan.price >= min) {
        if (prefs.priority === "Best Value" || prefs.priority === "Lowest Cost") {
          const span = max - min || 1;
          const ratio = (plan.price - min) / span;
          budgetFit = Math.round(100 - ratio * 10);
        } else {
          budgetFit = 100;
        }
      } else {
        const diff = min - plan.price;
        budgetFit = Math.max(80, Math.round(100 - (diff / min) * 20));
      }
    } else {
      const excessRatio = (plan.price - max) / max;
      if (excessRatio >= 1.0) {
        budgetFit = 0;
        budgetPenaltyMultiplier = 0.0;
      } else if (excessRatio >= 0.5) {
        budgetFit = Math.max(0, Math.round(30 - (excessRatio - 0.5) * 60));
        budgetPenaltyMultiplier = 0.3;
      } else {
        budgetFit = Math.max(0, Math.round(80 - excessRatio * 100));
        budgetPenaltyMultiplier = 1.0 - (excessRatio * 0.4);
      }
    }

    // 2. Data Fit (0-100)
    let dataFit = 50;
    const dailyDataNum = parseNumericValue(prefs.dailyData);
    const isStandardData = ["<1 GB", "1.5 GB", "2 GB", "3 GB+"].includes(prefs.dailyData);

    if (dailyDataNum !== null && !isStandardData) {
      if (planCap >= dailyDataNum) {
        dataFit = 100;
      } else {
        dataFit = Math.round((planCap / dailyDataNum) * 100);
      }
    } else {
      if (prefs.dailyData === "<1 GB") {
        if (planCap < 1.2) {
          dataFit = 100;
        } else if (planCap <= 2.0) {
          dataFit = 70;
        } else {
          dataFit = 40;
        }
      } else if (prefs.dailyData === "1.5 GB") {
        if (planCap >= 1.4 && planCap <= 1.6) {
          dataFit = 100;
        } else if (planCap >= 1.0 && planCap < 1.4) {
          dataFit = 75;
        } else if (planCap > 1.6 && planCap <= 2.2) {
          dataFit = 75;
        } else {
          dataFit = 40;
        }
      } else if (prefs.dailyData === "2 GB") {
        if (planCap >= 1.8 && planCap <= 2.5) {
          dataFit = 100;
        } else if (planCap >= 1.4 && planCap < 1.8) {
          dataFit = 75;
        } else if (planCap > 2.5 && planCap <= 3.0) {
          dataFit = 75;
        } else {
          dataFit = 40;
        }
      } else if (prefs.dailyData === "3 GB+") {
        if (planCap >= 3.0) {
          dataFit = 100;
        } else if (planCap >= 2.0) {
          dataFit = 70;
        } else if (planCap >= 1.5) {
          dataFit = 50;
        } else {
          dataFit = 25;
        }
      }
    }

    // 3. Validity Fit (0-100)
    let validityFit = 50;
    const validityNum = parseNumericValue(prefs.validityPreference);
    const isStandardValidity = ["No Preference", "28 Days", "56 Days", "84 Days", "365 Days"].includes(prefs.validityPreference);

    if (validityNum !== null && !isStandardValidity) {
      if (plan.validityDays === validityNum) {
        validityFit = 100;
      } else {
        validityFit = Math.max(20, Math.round(100 - (Math.abs(plan.validityDays - validityNum) / validityNum) * 100));
      }
    } else {
      if (prefs.validityPreference === "No Preference" || !prefs.validityPreference) {
        validityFit = 100;
      } else if (prefs.validityPreference === "28 Days") {
        if (plan.validityDays >= 24 && plan.validityDays <= 30) {
          validityFit = 100;
        } else {
          validityFit = 10;
        }
      } else if (prefs.validityPreference === "56 Days") {
        if (plan.validityDays >= 50 && plan.validityDays <= 65) {
          validityFit = 100;
        } else {
          validityFit = 10;
        }
      } else if (prefs.validityPreference === "84 Days") {
        if (plan.validityDays >= 80 && plan.validityDays <= 95) {
          validityFit = 100;
        } else {
          validityFit = 10;
        }
      } else if (prefs.validityPreference === "365 Days") {
        if (plan.validityDays >= 300) {
          validityFit = 100;
        } else {
          validityFit = 10;
        }
      }
    }

    // 4. OTT Fit (0-100)
    let ottFit = 50;
    const targetOtts = prefs.ottPlatforms
      ? prefs.ottPlatforms.filter((p) => p !== "No Preference" && p !== "No OTT" && p !== "")
      : [];

    const premiumOttKeywords = [
      "netflix",
      "hotstar",
      "disney",
      "prime",
      "amazon",
      "sonyliv",
      "sony",
      "zee5",
      "zee",
      "fancode",
      "jiocinema premium",
      "sun nxt",
      "discovery",
      "aha",
      "hoichoi",
    ];
    const hasPaidOtt = plan.ott.some((app) =>
      premiumOttKeywords.some((kw) => app.toLowerCase().includes(kw))
    );

    if (prefs.ottPlatforms && (prefs.ottPlatforms.includes("No OTT") || prefs.ottPlatforms.length === 0)) {
      ottFit = !hasPaidOtt ? 100 : 65;
    } else {
      if (targetOtts.length === 0) {
        ottFit = plan.ott.length > 0 ? 100 : 30;
      } else {
        let matchedCount = 0;
        for (const targetOtt of targetOtts) {
          const lowerTarget = targetOtt.toLowerCase();
          const matches = plan.ott.some((app) => {
            const lowerApp = app.toLowerCase();
            if (lowerTarget.includes("hotstar") && (lowerApp.includes("hotstar") || lowerApp.includes("disney"))) return true;
            if (lowerTarget.includes("prime") && lowerApp.includes("prime")) return true;
            if (lowerTarget.includes("sony") && (lowerApp.includes("sony") || lowerApp.includes("liv"))) return true;
            if (lowerTarget.includes("zee") && lowerApp.includes("zee")) return true;
            if (lowerTarget.includes("jio") && lowerApp.includes("jio")) return true;
            return false;
          });
          if (matches) matchedCount++;
        }
        ottFit = (matchedCount / targetOtts.length) * 100;
        if (ottFit === 0 && plan.ott.length > 0) {
          ottFit = 30;
        } else if (ottFit === 0 && plan.ott.length === 0) {
          ottFit = 10;
        }
      }
    }

    // 5. Operator Fit (0-100)
    let operatorFit = 50;
    if (prefs.currentOperator === "No Preference" || !prefs.currentOperator) {
      operatorFit = 100;
    } else if (plan.operator.toLowerCase() === prefs.currentOperator.toLowerCase()) {
      operatorFit = 100;
    } else {
      operatorFit = 30;
    }

    // Final score calculation
    let weightedRaw =
      (budgetFit * budgetW +
        dataFit * dataW +
        ottFit * ottW +
        validityFit * validityW +
        operatorFit * operatorW) /
      100;

    let finalScore = (weightedRaw / 100) * budgetPenaltyMultiplier;

    // Apply validity match penalty
    if (prefs.validityPreference && prefs.validityPreference !== "No Preference") {
      let isMatch = false;
      const days = plan.validityDays;
      if (prefs.validityPreference === "28 Days" && days >= 24 && days <= 30) isMatch = true;
      else if (prefs.validityPreference === "56 Days" && days >= 50 && days <= 65) isMatch = true;
      else if (prefs.validityPreference === "84 Days" && days >= 80 && days <= 95) isMatch = true;
      else if (prefs.validityPreference === "365 Days" && days >= 300) isMatch = true;
      
      if (!isMatch) {
        finalScore = finalScore * 0.7; // penalize non-matching validity tiers
      }
    }

    // Apply operator match penalty
    if (prefs.currentOperator && prefs.currentOperator !== "No Preference") {
      if (plan.operator.toLowerCase() !== prefs.currentOperator.toLowerCase()) {
        finalScore = finalScore * 0.1; // heavily penalize other operators
      }
    }

    // Apply 5G required check
    if (prefs.fiveGRequired === "Yes" && !plan.fiveG) {
      finalScore = finalScore * 0.7;
    }

    // Apply Add-on / Outgoing validity check
    if (prefs.addonRequested) {
      if (!plan.existingPlanRequired) {
        finalScore = finalScore * 0.3; // penalize standard voice plans
      }
    } else {
      if (plan.existingPlanRequired) {
        finalScore = finalScore * 0.3; // penalize data boosters/upgrades
      }
    }

    // Apply International Roaming filter
    const isIrPlan = plan.category.toLowerCase().includes("international") || plan.category.toLowerCase().includes("roaming");
    const requiresIr = !!prefs.isInternationalRoaming;
    if (requiresIr !== isIrPlan) {
      finalScore = 0.0;
    }

    // Clamp score
    if (budgetPenaltyMultiplier === 0.0) {
      finalScore = 0.0;
    } else {
      finalScore = Math.min(0.99, Math.max(0.05, finalScore));
    }

    // Reasons construction
    const reasons: string[] = [];
    if (plan.existingPlanRequired) {
      reasons.push("⚠️ Requires active existing plan with validity");
    }
    if (budgetFit >= 90) {
      reasons.push("Budget matches");
    } else if (budgetFit >= 60) {
      reasons.push(`Near budget (₹${plan.price} is slightly above target)`);
    }

    if (prefs.ottPlatforms && (prefs.ottPlatforms.includes("No OTT") || prefs.ottPlatforms.length === 0)) {
      if (plan.ott.length === 0) {
        reasons.push("No unnecessary OTT costs");
      }
    } else {
      let ottAdded = false;
      for (const t of targetOtts) {
        const lowerT = t.toLowerCase();
        const hasApp = plan.ott.some((app) => {
          const lowerApp = app.toLowerCase();
          if (lowerT.includes("hotstar") && (lowerApp.includes("hotstar") || lowerApp.includes("disney"))) return true;
          if (lowerT.includes("prime") && lowerApp.includes("prime")) return true;
          if (lowerT.includes("sony") && (lowerApp.includes("sony") || lowerApp.includes("liv"))) return true;
          if (lowerT.includes("zee") && lowerApp.includes("zee")) return true;
          if (lowerT.includes("jio") && lowerApp.includes("jio")) return true;
          return false;
        });
        if (hasApp) {
          reasons.push(`${t.includes("Prime") ? "Prime Video" : t} included`);
          ottAdded = true;
        }
      }
      if (!ottAdded && plan.ott.length > 0) {
        reasons.push(`${plan.ott[0]} included`);
      }
    }

    const dataDisplay = plan.dataPerDayGb
      ? `${plan.dataPerDayGb}GB/day`
      : plan.totalDataGb
        ? `${plan.totalDataGb}GB total`
        : "Standard";
    reasons.push(`${dataDisplay} data`);
    reasons.push(`Strong Bangalore network score`);

    if (prefs.purpose === "Streaming") {
      reasons.push(`Best match for OTT-focused users`);
    } else if (prefs.purpose === "Gaming") {
      reasons.push(`Low latency 5G connectivity for gaming`);
    } else if (prefs.purpose === "Social Media") {
      reasons.push(`Ideal data volume for daily social browsing`);
    } else if (prefs.purpose === "Work/Study") {
      reasons.push(`Dependable data & validity for virtual work`);
    } else {
      reasons.push(`Great all-rounder plan for mixed usage`);
    }

    return {
      ...plan,
      operatorCoverage: coverage,
      candidateScore: weightedRaw / 100,
      budgetMatch: budgetFit / 100,
      dataMatch: dataFit / 100,
      coverageMatch: coverage / 10,
      ottMatch: ottFit / 100,
      preferenceMatch: operatorFit / 100,
      rerankBoost: 0.05,
      finalScore,
      reason: reasons,
      budgetFit,
      dataFit,
      ottFit,
      validityFit,
      operatorFit,
    };
  }).sort((left, right) => {
    if (Math.abs(right.finalScore - left.finalScore) > 0.0001) {
      return right.finalScore - left.finalScore;
    }
    const leftDaily = left.price / (left.validityDays || 1);
    const rightDaily = right.price / (right.validityDays || 1);
    if (Math.abs(leftDaily - rightDaily) > 0.01) {
      return leftDaily - rightDaily;
    }
    return left.price - right.price;
  });

  return scored;
}