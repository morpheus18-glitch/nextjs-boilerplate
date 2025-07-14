"use client";
import { useEffect, useState } from "react";
import AnimatedGear from "../components/AnimatedGear";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

interface DashboardData {
  inventory: { new: number; used: number; total: number };
  sales: { months: string[]; numbers: number[]; total: number };
  financing: { financedRate: number; averageAPR: number; totalFinanced: number };
  profitLoss: { revenue: number; expenses: number; net: number };
}

export default function Dashboard() {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const match = document.cookie.match(/session=([^;]+)/);
    if (!match) {
      window.location.href = "/";
      return;
    }
    const [, value] = match;
    const parts = value.split(":");
    const userRole = parts[1] as "admin" | "user";
    setRole(userRole);
    fetch("/api/dashboard-data")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard…
      </div>
    );
  }

  const salesChartData = {
    labels: data.sales.months,
    datasets: [
      {
        label: "Monthly Sales",
        data: data.sales.numbers,
        borderColor: "#4fd1ff",
        backgroundColor: "rgba(79,209,255,0.2)",
      },
    ],
  };

  const financeChartData = {
    labels: ["Revenue", "Expenses", "Net"],
    datasets: [
      {
        label: "Financials",
        data: [data.profitLoss.revenue, data.profitLoss.expenses, data.profitLoss.net],
        backgroundColor: ["#4fd1ff", "#ff726f", "#2ddd2d"],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950 p-6">
      <div className="absolute top-6 left-6">
        <AnimatedGear />
      </div>
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/10 space-y-10">
        <h1 className="text-4xl font-bold text-white text-center">Dealership Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 text-white text-center">
          <div className="bg-gray-800/60 p-4 rounded-xl transform hover:rotate-1 transition">
            <div className="text-sm">New Inventory</div>
            <div className="text-2xl font-bold">{data.inventory.new}</div>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-xl transform hover:rotate-1 transition">
            <div className="text-sm">Used Inventory</div>
            <div className="text-2xl font-bold">{data.inventory.used}</div>
          </div>
          <div className="bg-gray-800/60 p-4 rounded-xl transform hover:rotate-1 transition">
            <div className="text-sm">Total Inventory</div>
            <div className="text-2xl font-bold">{data.inventory.total}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/70 p-4 rounded-xl">
            <Line data={salesChartData} />
          </div>
          <div className="bg-gray-900/70 p-4 rounded-xl">
            <Bar data={financeChartData} />
          </div>
        </div>

        {role === "admin" && (
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold shadow"
          >
            Admin Panel
          </a>
        )}
        <button
          className="px-6 py-3 bg-gray-700 hover:bg-gray-900 rounded-lg text-white font-semibold shadow"
          onClick={() => {
            document.cookie = "session=; Max-Age=0; path=/";
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
