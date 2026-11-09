
import { describe, it, expect, vi, afterEach } from "vitest";
import { sendApiRequest } from "./apiClient";

describe("sendApiRequest", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sends a GET request successfully", async () => {
    const mockResponse = {
      status: 200,
      statusText: "OK",
      headers: new Headers({
        "content-type": "application/json",
      }),
      text: async () => JSON.stringify({ id: 1, title: "Test" }),
    };

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(mockResponse as Response);

    const result = await sendApiRequest({
      url: "https://example.com/api",
      method: "GET",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ id: 1, title: "Test" });
  });

  it("sends a POST request with a JSON body", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue({
        status: 201,
        statusText: "Created",
        headers: new Headers(),
        text: async () => JSON.stringify({ id: 2 }),
      } as Response);

    await sendApiRequest({
      url: "https://example.com/api",
      method: "POST",
      body: JSON.stringify({ title: "New item" }),
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.com/api",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ title: "New item" }),
      })
    );
  });

  it("keeps plain text responses as strings", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      text: async () => "Hello API",
    } as Response);

    const result = await sendApiRequest({
      url: "https://example.com/api",
      method: "GET",
    });

    expect(result.data).toBe("Hello API");
  });

  it("handles empty responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      status: 204,
      statusText: "No Content",
      headers: new Headers(),
      text: async () => "",
    } as Response);

    const result = await sendApiRequest({
      url: "https://example.com/api",
      method: "GET",
    });

    expect(result.status).toBe(204);
    expect(result.data).toBeNull();
  });

  it("throws when the network request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("Network error")
    );

    await expect(
      sendApiRequest({
        url: "https://example.com/api",
        method: "GET",
      })
    ).rejects.toThrow("Network error");
  });
});
