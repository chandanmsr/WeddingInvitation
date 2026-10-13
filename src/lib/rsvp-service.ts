import type { RSVPSubmission } from "@/data/wedding";

export interface RSVPService {
  save(submission: RSVPSubmission): Promise<void>;
}

const STORAGE_KEY = "sakshi-vivek-rsvp-demo";

export const localRSVPService: RSVPService = {
  async save(submission) {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const entries: RSVPSubmission[] = saved ? JSON.parse(saved) as RSVPSubmission[] : [];
    entries.push(submission);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  },
};
