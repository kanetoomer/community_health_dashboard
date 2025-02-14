import React, { useState } from "react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { uploadFile } from "../services/api";

export default function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    try {
      await uploadFile(file);
      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <>
      <header>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            File Upload
          </h3>
        </div>
      </header>
      <div className="mt-10 text-center border-2 border-dashed border-gray-300 rounded-lg p-6">
        {/* Icon */}
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mx-auto size-12 text-gray-400"
        >
          <path
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Heading */}
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          Upload Health Data
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Choose a CSV file to get started.
        </p>

        {/* File Input */}
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

        {/* Conditional Upload Button */}
        {file && (
          <div className="mt-16">
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleUpload}
            >
              <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 size-5" />
              Upload File
            </button>
          </div>
        )}
      </div>
    </>
  );
}
