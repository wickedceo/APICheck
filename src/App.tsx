
import { useEffect, useState } from "react";
import RequestPanel from "./components/RequestPanel";
import ResponseViewer from "./components/ResponseViewer";
import SavedRequests from "./components/SavedRequests";
import ApiTestRunner from "./components/ApiTestRunner";
import {
  sendApiRequest,
  type ApiResponse,
  type HttpMethod,
} from "./services/apiClient";
import type {
  RequestHistoryItem,
  SavedRequest,
} from "./types/api";
import "./App.css";

const HISTORY_KEY = "apicheck-request-history";
const SAVED_REQUESTS_KEY = "apicheck-saved-requests";

function loadHistory(): RequestHistoryItem[] {
  try {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadSavedRequests(): SavedRequest[] {
  try {
    const saved = localStorage.getItem(SAVED_REQUESTS_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function App() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState<RequestHistoryItem[]>(
    loadHistory
  );

  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>(
    loadSavedRequests
  );

  const [loadedRequest, setLoadedRequest] =
    useState<SavedRequest | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
      );
    } catch {
      console.error("Unable to save request history.");
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(
        SAVED_REQUESTS_KEY,
        JSON.stringify(savedRequests)
      );
    } catch {
      console.error("Unable to save saved requests.");
    }
  }, [savedRequests]);

  const handleSend = async (
    url: string,
    method: HttpMethod,
    headers: Record<string, string>,
    body: string
  ) => {
    setLoading(true);
    setResponse(null);
    setError(null);

    const createdAt = new Date().toLocaleString();

    try {
      const result = await sendApiRequest({
        url,
        method,
        headers,
        body,
      });

      setResponse(result);

      const historyItem: RequestHistoryItem = {
        id: crypto.randomUUID(),
        url,
        method,
        status: result.status,
        duration: result.duration,
        createdAt,
      };

      setHistory((previous) =>
        [historyItem, ...previous].slice(0, 50)
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred."
      );

      const historyItem: RequestHistoryItem = {
        id: crypto.randomUUID(),
        url,
        method,
        status: null,
        duration: null,
        createdAt,
      };

      setHistory((previous) =>
        [historyItem, ...previous].slice(0, 50)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRequest = (
    name: string,
    url: string,
    method: HttpMethod,
    headers: Record<string, string>,
    body: string
  ) => {
    const newRequest: SavedRequest = {
      id: crypto.randomUUID(),
      name,
      url,
      method,
      headers,
      body,
    };

    setSavedRequests((previous) => [
      newRequest,
      ...previous,
    ]);
  };

  const handleLoadRequest = (request: SavedRequest) => {
    setLoadedRequest(request);
  };

  const handleLoadedRequestHandled = () => {
    setLoadedRequest(null);
  };

  const handleDeleteSavedRequest = (id: string) => {
    setSavedRequests((previous) =>
      previous.filter((request) => request.id !== id)
    );
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand">
          <div className="brand-icon">API</div>
          <div>
            <h1>APICheck</h1>
            <p>REST API TESTING PLATFORM</p>
          </div>
        </div>

        <span className="header-status">
          <span className="status-dot" />
          Testing environment
        </span>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <span className="eyebrow">DEVELOPER TOOLKIT</span>
          <h2>
            Test APIs.
            <br />
            <span>Build with confidence.</span>
          </h2>
          <p>
            Send HTTP requests, inspect responses and
            understand how your APIs perform.
          </p>
        </section>

        <RequestPanel
          onSend={handleSend}
          onSave={handleSaveRequest}
          loading={loading}
          loadedRequest={loadedRequest}
          onLoadedRequestHandled={handleLoadedRequestHandled}
        />

        {loading && (
          <p className="loading-message">
            Sending your request...
          </p>
        )}

        <ResponseViewer
          response={response}
          error={error}
        />

        <ApiTestRunner response={response} />

        <SavedRequests
          requests={savedRequests}
          onLoad={handleLoadRequest}
          onDelete={handleDeleteSavedRequest}
        />

        <section className="history-section">
          <div className="history-heading">
            <h2>Request History</h2>

            <div className="history-actions">
              <span>{history.length} requests</span>

              <button
                type="button"
                className="clear-history-button"
                onClick={clearHistory}
                disabled={history.length === 0}
              >
                Clear History
              </button>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="empty-response">
              Your previous API requests will appear here.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item) => (
                <div className="history-item" key={item.id}>
                  <div className="history-top">
                    <span
                      className={`method-badge method-${item.method.toLowerCase()}`}
                    >
                      {item.method}
                    </span>

                    <span
                      className={
                        item.status !== null &&
                        item.status >= 200 &&
                        item.status < 300
                          ? "history-success"
                          : "history-error"
                      }
                    >
                      {item.status ?? "Failed"}
                    </span>
                  </div>

                  <p className="history-url">{item.url}</p>

                  <div className="history-details">
                    <span>
                      {item.duration !== null
                        ? `${item.duration} ms`
                        : "No response"}
                    </span>
                    <span>{item.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="app-footer">
          <p>APICheck · REST API Testing Platform</p>
          <span>Built with React + TypeScript</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
