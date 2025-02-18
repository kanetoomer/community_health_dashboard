import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { uploadFile, analyzeFile } from "../services/api";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data cleaning options state
  const [cleaningOptions, setCleaningOptions] = useState({
    removeDuplicates: false,
    handleMissing: false,
    standardizeFormats: false,
  });

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle cleaning option changes
  const handleCleaningOptionChange = (e) => {
    const { name, checked } = e.target;
    setCleaningOptions((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle file upload and analysis
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    setLoading(true);
    try {
      // Step 1: Upload the file
      const uploadResponse = await uploadFile(file);
      const filePath = uploadResponse.filePath;

      // Step 2: Generate the report using the uploaded file and cleaning options
      const reportResponse = await analyzeFile({
        filePath,
        cleaningOptions,
      });
      setReport(reportResponse);
    } catch (error) {
      console.error("Upload or analysis failed:", error);
      alert("Failed to upload file and generate report.");
    }
    setLoading(false);
  };

  // Handle download of the generated image
  const handleDownloadImage = () => {
    if (report && report.histogramPlot) {
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${report.histogramPlot}`;
      link.download = "report_image.png";
      link.click();
    }
  };

  // Handle download of the generated PDF report
  const handleDownloadPDF = () => {
    if (report && report.pdfReport) {
      const link = document.createElement("a");
      link.href = `data:application/pdf;base64,${report.pdfReport}`;
      link.download = "report.pdf";
      link.click();
    }
  };

  // If a report exists, show the report UI with download options
  if (report) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Report</h2>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Summary Statistics:</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs">
            {JSON.stringify(report.summary, null, 2)}
          </pre>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold">Interactive Chart:</h3>
          <img
            src={`data:image/png;base64,${report.histogramPlot}`}
            alt="Report Plot"
            className="max-w-full h-auto border"
          />
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleDownloadImage}
            className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Download Image
          </button>
          <button
            onClick={handleDownloadPDF}
            className="mt-4 inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Download PDF
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, show the file upload UI with cleaning options only
  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Upload Health Data & Data Cleaning
          </h3>
        </div>
      </header>
      <div className="mt-10 border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="mx-auto w-12 h-12 text-gray-400"
          >
            <path
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Upload Health Data
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Choose a CSV file to get started.
          </p>
        </div>
        <div className="mt-4 inline-flex">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-indigo-600 file:text-white
                       hover:file:bg-indigo-500"
          />
        </div>
        {file && (
          <>
            {/* Data Cleaning Options */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900">
                Data Cleaning Options
              </h4>
              <div className="mt-2 space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="removeDuplicates"
                    checked={cleaningOptions.removeDuplicates}
                    onChange={handleCleaningOptionChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Remove duplicates</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="handleMissing"
                    checked={cleaningOptions.handleMissing}
                    onChange={handleCleaningOptionChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">Handle missing values</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="standardizeFormats"
                    checked={cleaningOptions.standardizeFormats}
                    onChange={handleCleaningOptionChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">
                    Standardize formats (e.g., ZIP codes, dates)
                  </span>
                </label>
              </div>
            </div>
            {/* Upload/Generate Report Button */}
            <div className="mt-16">
              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {loading ? "Processing..." : "Generate Report"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
