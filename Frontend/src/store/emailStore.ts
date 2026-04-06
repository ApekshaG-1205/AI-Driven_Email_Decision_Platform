import { create } from "zustand";
import { mockEmails, mockAlerts, type Email, type Alert } from "@/data/mockData";

interface EmailStore {
  emails: Email[];
  alerts: Alert[];
  selectedEmailId: string | null;
  filters: {
    urgent: boolean;
    highRisk: boolean;
    complaint: boolean;
    search: string;
  };
  setSelectedEmail: (id: string | null) => void;
  setFilter: (key: keyof EmailStore["filters"], value: boolean | string) => void;
  updateEmailStatus: (id: string, status: Email["status"]) => void;
  assignTeam: (id: string, team: string) => void;
  markAlertRead: (id: string) => void;
  getFilteredEmails: () => Email[];
}

export const useEmailStore = create<EmailStore>((set, get) => ({
  emails: mockEmails,
  alerts: mockAlerts,
  selectedEmailId: null,
  filters: { urgent: false, highRisk: false, complaint: false, search: "" },
  setSelectedEmail: (id) => set({ selectedEmailId: id }),
  setFilter: (key, value) => set((s) => ({ filters: { ...s.filters, [key]: value } })),
  updateEmailStatus: (id, status) =>
    set((s) => ({ emails: s.emails.map((e) => (e.id === id ? { ...e, status } : e)) })),
  assignTeam: (id, team) =>
    set((s) => ({ emails: s.emails.map((e) => (e.id === id ? { ...e, assignedTeam: team } : e)) })),
  markAlertRead: (id) =>
    set((s) => ({ alerts: s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) })),
  getFilteredEmails: () => {
    const { emails, filters } = get();
    return emails.filter((e) => {
      if (filters.urgent && e.urgency !== "high" && e.urgency !== "critical") return false;
      if (filters.highRisk && e.riskLevel !== "high") return false;
      if (filters.complaint && e.intent !== "complaint") return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return e.subject.toLowerCase().includes(q) || e.sender.toLowerCase().includes(q);
      }
      return true;
    });
  },
}));
