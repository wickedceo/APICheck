
import type { HttpMethod } from "../services/apiClient";

export const HTTP_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export function formatJson(data: unknown): string {
  if (typeof data === "string") {
    try {
      return JSON.stringify(JSON.parse(data), null, 2);
    } catch {
      return data;
    }
  }

  return JSON.stringify(data, null, 2) ?? "";
}

export function getStatusLabel(status: number): string {
  if (status >= 200 && status < 300) return "Success";
  if (status >= 300 && status < 400) return "Redirect";
  if (status >= 400 && status < 500) return "Client Error";
  if (status >= 500) return "Server Error";

  return "Unknown";
}
