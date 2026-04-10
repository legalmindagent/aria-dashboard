const INDUSTRIES = [
  "HVAC",
  "Dental",
  "Real Estate",
  "Plumbing",
  "Pest Control",
  "Roofing",
  "Auto Repair",
  "Veterinary",
  "Electrical",
  "Home Cleaning",
  "Towing",
  "Locksmith",
  "General",
] as const;

export type Industry = (typeof INDUSTRIES)[number];
export { INDUSTRIES };

export type CallStatus = "completed" | "missed" | "voicemail" | "active";

export interface CallRecord {
  id: string;
  time: string; // ISO string
  caller: string;
  duration: number; // seconds
  industry: Industry;
  status: CallStatus;
  businessName: string;
  notes?: string;
}

export const SAMPLE_CALLS: CallRecord[] = [
  {
    id: "1",
    time: "2026-04-10T03:12:00Z",
    caller: "+1 (555) 201-4823",
    duration: 187,
    industry: "HVAC",
    status: "completed",
    businessName: "Cool Breeze HVAC",
    notes: "Caller requested an AC tune-up appointment for next week.",
  },
  {
    id: "2",
    time: "2026-04-10T02:47:00Z",
    caller: "+1 (555) 398-7612",
    duration: 0,
    industry: "Dental",
    status: "missed",
    businessName: "Bright Smile Dental",
  },
  {
    id: "3",
    time: "2026-04-10T02:30:00Z",
    caller: "+1 (555) 874-0031",
    duration: 312,
    industry: "Plumbing",
    status: "completed",
    businessName: "QuickFix Plumbing",
    notes: "Emergency pipe burst — dispatched on-call technician.",
  },
  {
    id: "4",
    time: "2026-04-10T01:55:00Z",
    caller: "+1 (555) 120-9944",
    duration: 95,
    industry: "Real Estate",
    status: "voicemail",
    businessName: "Skyline Realty",
    notes: "Left message asking about 3BR listings in downtown area.",
  },
  {
    id: "5",
    time: "2026-04-10T01:22:00Z",
    caller: "+1 (555) 663-5501",
    duration: 224,
    industry: "Auto Repair",
    status: "completed",
    businessName: "Metro Auto Repair",
    notes: "Scheduled oil change for Saturday 10am.",
  },
  {
    id: "6",
    time: "2026-04-10T00:58:00Z",
    caller: "+1 (555) 741-2208",
    duration: 0,
    industry: "Pest Control",
    status: "missed",
    businessName: "BugBusters Pest Control",
  },
  {
    id: "7",
    time: "2026-04-09T23:40:00Z",
    caller: "+1 (555) 530-6677",
    duration: 401,
    industry: "Roofing",
    status: "completed",
    businessName: "SteelTop Roofing",
    notes: "Requested inspection quote after storm damage.",
  },
  {
    id: "8",
    time: "2026-04-09T22:15:00Z",
    caller: "+1 (555) 289-3390",
    duration: 148,
    industry: "Veterinary",
    status: "completed",
    businessName: "Paws & Claws Vet",
    notes: "Booked annual checkup for two dogs.",
  },
  {
    id: "9",
    time: "2026-04-09T21:08:00Z",
    caller: "+1 (555) 914-7723",
    duration: 0,
    industry: "Electrical",
    status: "missed",
    businessName: "Bright Wire Electric",
  },
  {
    id: "10",
    time: "2026-04-09T20:33:00Z",
    caller: "+1 (555) 467-8812",
    duration: 260,
    industry: "Home Cleaning",
    status: "completed",
    businessName: "Sparkle Home Cleaning",
    notes: "New client onboarding — bi-weekly deep clean.",
  },
  {
    id: "11",
    time: "2026-04-09T19:47:00Z",
    caller: "+1 (555) 334-0091",
    duration: 73,
    industry: "Towing",
    status: "completed",
    businessName: "FastTow Services",
    notes: "Vehicle stranded on I-95 — truck dispatched.",
  },
  {
    id: "12",
    time: "2026-04-09T18:22:00Z",
    caller: "+1 (555) 891-5530",
    duration: 55,
    industry: "Locksmith",
    status: "voicemail",
    businessName: "KeyMaster Locksmith",
    notes: "Left message about a car lockout on Maple St.",
  },
  {
    id: "13",
    time: "2026-04-09T17:00:00Z",
    caller: "+1 (555) 223-6641",
    duration: 198,
    industry: "General",
    status: "completed",
    businessName: "Aria Demo Business",
    notes: "General inquiry — transferred to owner.",
  },
];
