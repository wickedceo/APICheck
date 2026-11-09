
import { useEffect, useState, type FormEvent } from "react";
import { HTTP_METHODS } from "../utils/apiHelpers";
import type { HttpMethod } from "../services/apiClient";
import type { SavedRequest } from "../types/api";

interface RequestPanelProps {
  onSend: (
    url: string,
    method: HttpMethod,
    headers: Record<string, string>,
    body: string
  ) => void;
  onSave: (
    name: string,
    url: string,
    method: HttpMethod,
    headers: Record<string, string>,
    body: string
  ) => void;
  loading: boolean;
  loadedRequest: SavedRequest | null;
  onLoadedRequestHandled: () => void;
}

export default function RequestPanel({
  onSend,
  onSave,
  loading,
  loadedRequest,
  onLoadedRequestHandled,
}: RequestPanelProps) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [headersText, setHeadersText] = useState("{}");
  const [body, setBody] = useState(
    '{\n  "title": "My API test",\n  "completed": false\n}'
  );
  const [requestName, setRequestName] = useState("");
  const [inputError, setInputError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const [previousLoadedRequest, setPreviousLoadedRequest] =
    useState<SavedRequest | null>(null);

  const bodyDisabled = ["GET", "DELETE"].includes(method);

  if (
    loadedRequest &&
    loadedRequest !== previousLoadedRequest
  ) {
    setPreviousLoadedRequest(loadedRequest);
    setUrl(loadedRequest.url);
    setMethod(loadedRequest.method);
    setHeadersText(
      JSON.stringify(loadedRequest.headers, null, 2)
    );
    setBody(loadedRequest.body);
    setRequestName(loadedRequest.name);
    setInputError("");
    setSaveMessage("Saved request loaded successfully!");
  }

  useEffect(() => {
    if (loadedRequest) {
      onLoadedRequestHandled();
    }
  }, [loadedRequest, onLoadedRequestHandled]);

  const validateRequest = () => {
    setInputError("");
    setSaveMessage("");

    if (!url.trim()) {
      setInputError("Please enter an API URL.");
      return null;
    }

    let headers: Record<string, string>;

    try {
      headers = JSON.parse(headersText);

      if (
        typeof headers !== "object" ||
        headers === null ||
        Array.isArray(headers) ||
        Object.values(headers).some(
          (value) => typeof value !== "string"
        )
      ) {
        throw new Error(
          "Headers must be a JSON object with string values."
        );
      }
    } catch (error) {
      setInputError(
        error instanceof Error
          ? error.message
          : "Invalid headers JSON."
      );
      return null;
    }

    if (body.trim() && !bodyDisabled) {
      try {
        JSON.parse(body);
      } catch {
        setInputError(
          "Please enter a valid JSON request body."
        );
        return null;
      }
    }

    return {
      url: url.trim(),
      method,
      headers,
      body,
    };
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const request = validateRequest();

    if (!request) return;

    onSend(
      request.url,
      request.method,
      request.headers,
      request.body
    );
  };

  const handleSave = () => {
    const request = validateRequest();

    if (!request) return;

    if (!requestName.trim()) {
      setInputError("Please enter a name for your saved request.");
      return;
    }

    onSave(
      requestName.trim(),
      request.url,
      request.method,
      request.headers,
      request.body
    );

    setSaveMessage("Request saved successfully!");
    setRequestName("");
  };

  return (
    <form className="request-panel" onSubmit={handleSubmit}>
      <div className="request-controls">
        <select
          value={method}
          onChange={(event) =>
            setMethod(event.target.value as HttpMethod)
          }
          aria-label="HTTP method"
        >
          {HTTP_METHODS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <input
          type="url"
          placeholder="Enter API URL (https://...)"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
          aria-label="API URL"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      <div className="request-editor">
        <h3>Request headers (JSON)</h3>

        <textarea
          value={headersText}
          onChange={(event) => setHeadersText(event.target.value)}
          placeholder={'{\n  "Authorization": "Bearer token"\n}'}
          rows={5}
          spellCheck={false}
          aria-label="Request headers"
        />

        <h3>Request body (JSON)</h3>

        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Enter your JSON request body"
          rows={8}
          spellCheck={false}
          disabled={bodyDisabled}
          aria-label="Request body"
        />

        {bodyDisabled && (
          <p className="editor-hint">
            Request bodies are disabled for {method} requests.
          </p>
        )}
      </div>

      <div className="save-request-controls">
        <h3>Save this request</h3>

        <div className="save-request-row">
          <input
            type="text"
            placeholder="Give your request a name"
            value={requestName}
            onChange={(event) => setRequestName(event.target.value)}
            aria-label="Saved request name"
          />

          <button
            type="button"
            onClick={handleSave}
            className="save-request-button"
          >
            Save Request
          </button>
        </div>
      </div>

      {inputError && (
        <p className="input-error">{inputError}</p>
      )}

      {saveMessage && (
        <p className="save-success-message">
          {saveMessage}
        </p>
      )}
    </form>
  );
}
