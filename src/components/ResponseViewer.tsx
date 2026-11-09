
import type { ApiResponse } from "../services/apiClient";
import { formatJson, getStatusLabel } from "../utils/apiHelpers";

interface ResponseViewerProps {
  response: ApiResponse | null;
  error: string | null;
}

export default function ResponseViewer({
  response,
  error,
}: ResponseViewerProps) {
  if (error) {
    return (
      <section className="response-viewer">
        <h2>Response</h2>
        <div className="error-message">
          <strong>Request failed</strong>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!response) {
    return (
      <section className="response-viewer">
        <h2>Response</h2>
        <p className="empty-response">
          Send an API request to see the response here.
        </p>
      </section>
    );
  }

  return (
    <section className="response-viewer">
      <h2>Response</h2>

      <div className="response-meta">
        <span className={response.status >= 200 && response.status < 300 ? "status-success" : "status-error"}>
          {response.status} {response.statusText}
        </span>

        <span>{response.duration} ms</span>

        <span>{getStatusLabel(response.status)}</span>
      </div>

      <h3>Response body</h3>

      <pre className="response-body">
        {formatJson(response.data)}
      </pre>

      <h3>Response headers</h3>

      <pre className="response-body">
        {formatJson(response.headers)}
      </pre>
    </section>
  );
}
