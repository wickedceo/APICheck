
import type { HttpMethod } from "../services/apiClient";

export interface RequestHistoryItem {
  id: string;
  url: string;
  method: HttpMethod;
  status: number | null;
  duration: number | null;
  createdAt: string;
}

export interface SavedRequest {
  id: string;
  name: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body: string;
}

export interface ApiTestResult {
  id: string;
  name: string;
  passed: boolean;
  message: string;
}
