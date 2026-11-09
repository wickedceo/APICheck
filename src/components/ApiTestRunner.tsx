
import { useState } from "react";
import type { ApiResponse } from "../services/apiClient";

interface ApiTestRunnerProps {
  response: ApiResponse | null;
}

interface TestResult {
  id: string;
  name: string;
  passed: boolean;
  message: string;
}

export default function ApiTestRunner({
  response,
}: ApiTestRunnerProps) {
  const [expectedStatus, setExpectedStatus] = useState("200");
  const [expectedText, setExpectedText] = useState("");
  const [requiredField, setRequiredField] = useState("");
  const [maxDuration, setMaxDuration] = useState("1000");
  const [results, setResults] = useState<TestResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const runTests = () => {
    if (!response) return;

    const tests: TestResult[] = [];

    const status = Number(expectedStatus);
    const durationLimit = Number(maxDuration);
    const responseText = JSON.stringify(response.data) ?? "";

    tests.push({
      id: "status",
      name: "HTTP status code",
      passed:
        Number.isInteger(status) &&
        status >= 100 &&
        status <= 599 &&
        response.status === status,
      message: `Expected ${expectedStatus}, received ${response.status}.`,
    });

    if (expectedText.trim()) {
      tests.push({
        id: "text",
        name: "Expected response text",
        passed: responseText
          .toLowerCase()
          .includes(expectedText.trim().toLowerCase()),
        message: responseText
          .toLowerCase()
          .includes(expectedText.trim().toLowerCase())
          ? `Response contains "${expectedText}".`
          : `Response does not contain "${expectedText}".`,
      });
    }

    if (requiredField.trim()) {
      const fieldExists =
        typeof response.data === "object" &&
        response.data !== null &&
        !Array.isArray(response.data) &&
        Object.prototype.hasOwnProperty.call(
          response.data,
          requiredField.trim()
        );

      tests.push({
        id: "field",
        name: "Required JSON field",
        passed: fieldExists,
        message: fieldExists
          ? `Field "${requiredField}" exists in the response.`
          : `Field "${requiredField}" was not found.`,
      });
    }

    const validDuration =
      Number.isFinite(durationLimit) && durationLimit >= 0;

    tests.push({
      id: "duration",
      name: "Response time",
      passed:
        validDuration && response.duration <= durationLimit,
      message: validDuration
        ? `${response.duration} ms (limit: ${maxDuration} ms).`
        : "Enter a valid response time limit.",
    });

    setResults(tests);
    setHasRun(true);
  };

  const passedCount = results.filter(
    (result) => result.passed
  ).length;

  return (
    <section className="api-test-runner">
      <div className="test-runner-heading">
        <div>
          <h2>API Test Runner</h2>
          <p>Run automated checks against your API response.</p>
        </div>

        <span className="test-runner-label">
          AUTOMATED TESTS
        </span>
      </div>

      <div className="test-config-grid">
        <div className="test-config-item">
          <label htmlFor="expected-status">
            Expected status code
          </label>
          <input
            id="expected-status"
            type="number"
            min="100"
            max="599"
            value={expectedStatus}
            onChange={(event) =>
              setExpectedStatus(event.target.value)
            }
          />
        </div>

        <div className="test-config-item">
          <label htmlFor="max-duration">
            Maximum response time (ms)
          </label>
          <input
            id="max-duration"
            type="number"
            min="0"
            value={maxDuration}
            onChange={(event) =>
              setMaxDuration(event.target.value)
            }
          />
        </div>

        <div className="test-config-item">
          <label htmlFor="expected-text">
            Expected response text
          </label>
          <input
            id="expected-text"
            type="text"
            placeholder="Example: userId"
            value={expectedText}
            onChange={(event) =>
              setExpectedText(event.target.value)
            }
          />
        </div>

        <div className="test-config-item">
          <label htmlFor="required-field">
            Required JSON field
          </label>
          <input
            id="required-field"
            type="text"
            placeholder="Example: title"
            value={requiredField}
            onChange={(event) =>
              setRequiredField(event.target.value)
            }
          />
        </div>
      </div>

      <button
        type="button"
        className="run-tests-button"
        onClick={runTests}
        disabled={!response}
      >
        Run Tests
      </button>

      {!response && (
        <p className="test-runner-hint">
          Send an API request first to run automated tests.
        </p>
      )}

      {hasRun && (
        <div className="test-results">
          <div className="test-results-summary">
            <div>
              <h3>Test Results</h3>
              <p>
                {passedCount} of {results.length} tests passed
              </p>
            </div>

            <span
              className={
                passedCount === results.length
                  ? "test-summary-pass"
                  : "test-summary-fail"
              }
            >
              {passedCount === results.length
                ? "ALL PASSED"
                : "CHECK FAILED"}
            </span>
          </div>

          <div className="test-results-list">
            {results.map((result) => (
              <div className="test-result-item" key={result.id}>
                <div className="test-result-info">
                  <strong>{result.name}</strong>
                  <p>{result.message}</p>
                </div>

                <span
                  className={
                    result.passed
                      ? "test-pass"
                      : "test-fail"
                  }
                >
                  {result.passed ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
