import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 20px",
            background: "var(--cream)",
          }}
        >
          <div style={{ width: "100%", maxWidth: 640, textAlign: "center" }}>
            <p className="eyebrow" style={{ justifyContent: "center" }}>
              Something went wrong
            </p>
            <h1 style={{ maxWidth: "18ch", marginInline: "auto" }}>
              The page hit an unexpected error.
            </h1>
            <p style={{ maxWidth: "52ch", marginInline: "auto" }}>
              Reloading usually fixes it. If it happens again, tell us what you
              were doing and we will look into it.
            </p>

            <div
              style={{
                margin: "26px auto",
                padding: "16px 18px",
                textAlign: "left",
                border: "1px solid var(--line)",
                background: "var(--white)",
                overflow: "auto",
              }}
            >
              <pre
                style={{
                  margin: 0,
                  fontFamily: "var(--fm)",
                  fontSize: "var(--t-xs)",
                  color: "var(--muted)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {this.state.error?.stack}
              </pre>
            </div>

            <div
              style={{
                display: "flex",
                gap: 14,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => window.location.reload()}
                className="btn btn-solid"
                style={{ cursor: "pointer" }}
              >
                <RotateCcw size={16} /> Reload the page
              </button>
              <a
                href="https://wa.me/2349050690837"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                <AlertTriangle size={16} /> Tell us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
