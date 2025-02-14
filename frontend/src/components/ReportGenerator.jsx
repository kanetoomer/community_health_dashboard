import React, { useState } from "react";

export default function ReportGenerator() {
  const [reportStatus, setReportStatus] = useState("");

  const handleGenerateReport = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/generate-report/"
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Health_Report.pdf";
        link.click();
        setReportStatus("Report generated and downloaded successfully.");
      } else {
        setReportStatus("Failed to generate the report.");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      setReportStatus("An error occurred while generating the report.");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Generate Reports
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Generate and download a report summarizing the health data.
          </p>
        </div>
      </div>

      {/* Report Generation Card */}
      <div className="mt-6">
        {/* Generate Report Button */}
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>

        {/* Status Message */}
        {reportStatus && (
          <div
            className={`mt-4 text-sm ${
              reportStatus.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {reportStatus}
          </div>
        )}
      </div>
    </div>
  );
}
