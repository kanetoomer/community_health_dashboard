import React, { useEffect, useState } from "react";
import { fetchHealthData } from "../services/api";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// Utility function for conditional class names
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DataCharts() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState([]);

  // Fetch health data and calculate stats
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHealthData();
        const fetchedData = response.data;
        setData(fetchedData);
        calculateStats(fetchedData);
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };
    loadData();
  }, []);

  // Calculate key statistics
  const calculateStats = (data) => {
    let admissions = 0;
    let vaccinations = 0;
    let cases = 0;
    let dailyCases = {};

    data.forEach((item) => {
      if (item.metric === "hospital_admissions") {
        admissions += item.value;
      } else if (item.metric === "vaccinations_administered") {
        vaccinations += item.value;
      } else if (item.metric === "covid_cases") {
        cases += item.value;

        // Track daily cases
        dailyCases[item.date] = (dailyCases[item.date] || 0) + item.value;
      }
    });

    // Calculate average daily cases
    const days = Object.keys(dailyCases).length;
    const avgDailyCases = days > 0 ? (cases / days).toFixed(2) : 0;

    // Generate stats array
    const updatedStats = [
      {
        name: "Total Admissions",
        value: admissions,
        change: "+5.2%",
        changeType: "positive",
      },
      {
        name: "Total Vaccinations",
        value: vaccinations,
        change: "+3.8%",
        changeType: "positive",
      },
      {
        name: "Total Cases",
        value: cases,
        change: "-2.1%",
        changeType: "negative",
      },
      {
        name: "Average Daily Cases",
        value: avgDailyCases,
        change: "+1.5%",
        changeType: "positive",
      },
    ];
    setStats(updatedStats);
  };

  // Prepare chart data
  const chartData = {
    labels: data.map((item) => item.date),
    datasets: [
      {
        label: "Health Data Trends",
        data: data.map((item) => item.value),
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Stats Cards */}
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Health Data Trends
      </h3>
      <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
          >
            <dt className="text-sm/6 font-medium text-gray-500">{stat.name}</dt>
            <dd
              className={classNames(
                stat.changeType === "negative"
                  ? "text-rose-600"
                  : "text-gray-700",
                "text-xs font-medium"
              )}
            >
              {stat.change}
            </dd>
            <dd className="w-full flex-none text-3xl/10 font-medium tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Chart */}
      <div className="mt-6">
        <div className="bg-white p-4 rounded-lg shadow">
          {data.length > 0 ? (
            <Line data={chartData} />
          ) : (
            <p className="text-center text-gray-500">
              No data available to display charts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
