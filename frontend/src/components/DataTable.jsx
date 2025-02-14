import React, { useEffect, useState } from "react";
import { fetchHealthData } from "../services/api";

export default function HealthDataTable() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHealthData();
        setData(response.data);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    loadData();
  }, []);

  // Filter data based on location
  const filteredData = data.filter((item) =>
    item.location.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Health Data Table
          </h3>
          <p className="mt-2 text-sm text-gray-700">
            Explore health data including dates, locations, metrics, and values.
          </p>
        </div>
        {/* Filter Input */}
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <input
            type="text"
            placeholder="Filter by location"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="block w-64 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              {/* Table Header */}
              <thead>
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Date
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Metric
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Value
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-0">
                        {item.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.location}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.metric}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-700">
                        {item.value}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-4 text-sm text-gray-500"
                    >
                      No data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
