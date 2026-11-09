
import type { SavedRequest } from "../types/api";

interface SavedRequestsProps {
  requests: SavedRequest[];
  onLoad: (request: SavedRequest) => void;
  onDelete: (id: string) => void;
}

export default function SavedRequests({
  requests,
  onLoad,
  onDelete,
}: SavedRequestsProps) {
  return (
    <section className="saved-requests-section">
      <div className="saved-requests-heading">
        <div>
          <h2>Saved Requests</h2>
          <p>Your reusable API request collection.</p>
        </div>

        <span>{requests.length} saved</span>
      </div>

      {requests.length === 0 ? (
        <p className="empty-response">
          No saved requests yet. Save a request to build your collection.
        </p>
      ) : (
        <div className="saved-requests-list">
          {requests.map((request) => (
            <article
              className="saved-request-item"
              key={request.id}
            >
              <div className="saved-request-info">
                <div className="saved-request-top">
                  <span
                    className={`method-badge method-${request.method.toLowerCase()}`}
                  >
                    {request.method}
                  </span>

                  <h3>{request.name}</h3>
                </div>

                <p className="saved-request-url">
                  {request.url}
                </p>
              </div>

              <div className="saved-request-actions">
                <button
                  type="button"
                  className="load-request-button"
                  onClick={() => onLoad(request)}
                >
                  Load
                </button>

                <button
                  type="button"
                  className="delete-request-button"
                  onClick={() => onDelete(request.id)}
                  aria-label={`Delete ${request.name}`}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
