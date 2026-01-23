import React from "react";

export default function AIInsightCard({
  insight,
  insightId,
  onGenerate,
  onSendEmail,
  isGenerating,
  isSendingEmail,
  error,
  emailSent,
}) {
  // Error state - show retry button
  if (error && !insight) {
    return (
      <div className="bg-linear-to-r from-red-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">⚠️ Generation Failed</h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                {error === "The model is overloaded. Please try again later."
                  ? "AI service is temporarily busy. Please try again in a moment."
                  : error || "Failed to generate insights. Please try again."}
              </p>
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="ml-4 bg-white text-red-600 hover:bg-red-50 disabled:bg-gray-300 disabled:text-gray-500 font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                Retrying...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Retry
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // No insights - show generate button
  if (!insight) {
    return (
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">💡 AI Insight</h3>
              <p className="text-white text-opacity-90 leading-relaxed">
                No AI insights generated yet. Generate insights to get intelligent recommendations for your business.
              </p>
            </div>
          </div>
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="ml-4 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Insights
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Has insights - show structured insight card
  const getTrendEmoji = (trend) => {
    switch (trend) {
      case "positive":
        return "📈";
      case "negative":
        return "📉";
      case "warning":
        return "⚠️";
      default:
        return "➡️";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-orange-500";
      case "low":
        return "border-l-green-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "financial":
        return "bg-blue-500";
      case "inventory":
        return "bg-orange-500";
      case "product":
        return "bg-purple-500";
      case "operations":
        return "bg-green-500";
      case "growth":
        return "bg-pink-500";
      case "alert":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${getPriorityColor(insight.priority)}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Header with type badge and trend */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`${getTypeColor(insight.type)} text-white text-xs font-semibold px-3 py-1 rounded-full uppercase`}
            >
              {insight.type}
            </span>
            <span className="text-2xl">{getTrendEmoji(insight.trend)}</span>
            {insight.value && <span className="text-gray-700 font-bold text-lg">{insight.value}</span>}
          </div>

          {/* Message */}
          <h3 className="text-gray-900 text-lg font-semibold mb-2">{insight.message}</h3>

          {/* Action */}
          {insight.action && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-3">
              <p className="text-blue-900 text-sm">
                <span className="font-semibold">💡 Recommendation: </span>
                {insight.action}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onSendEmail}
          disabled={isSendingEmail || !insightId || emailSent}
          className="ml-4 bg-white text-blue-600 hover:bg-blue-50 disabled:bg-gray-300 disabled:text-gray-500 font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          {isSendingEmail ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              Sending...
            </>
          ) : emailSent ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Email Sent
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Report
            </>
          )}
        </button>
      </div>
    </div>
  );
}
