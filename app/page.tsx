"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_URL = "https://voice-agent-backend-y0t9.onrender.com";

interface CallRecord {
  call_sid: string;
  caller: string;
  called: string;
  business_name: string;
  industry: string;
  duration: number;
  started_at: string;
  ended_at: string;
  status: string;
}

interface HealthData {
  status: string;
  active_calls: number;
  businesses: number;
  total_calls: number;
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 1) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [healthRes, callRes] = await Promise.all([
          fetch(`${BACKEND_URL}/health`),
          fetch(`${BACKEND_URL}/call-log`),
        ]);
        const healthData = await healthRes.json();
        const callData = await callRes.json();
        setHealth(healthData);
        setCalls(callData.calls || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const totalCalls = health?.total_calls ?? calls.length;
  const todayCalls = calls.filter((c) => {
    const d = new Date(c.started_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;
  const completedCalls = calls.filter((c) => c.status === "completed");
  const avgDuration =
    completedCalls.length > 0
      ? Math.round(
          completedCalls.reduce((sum, c) => sum + c.duration, 0) /
            completedCalls.length
        )
      : 0;
  const activeCalls = health?.active_calls ?? 0;

  const recentCalls = calls.slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="font-semibold text-lg text-gray-900">
              Aria Voice AI
            </span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="text-indigo-600">
              Dashboard
            </Link>
            <Link href="/calls" className="hover:text-indigo-600">
              Calls
            </Link>
            <Link href="/settings" className="hover:text-indigo-600">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back — here&apos;s an overview of your AI receptionist activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-500">Total Calls</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{totalCalls}</p>
            <p className="text-xs text-gray-400 mt-1">All time</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-500">Calls Today</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{todayCalls}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-500">Avg Duration</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {formatDuration(avgDuration)}
            </p>
            <p className="text-xs text-gray-400 mt-1">Completed calls only</p>
          </div>
          <div className="bg-white rounded-xl border p-6">
            <p className="text-sm text-gray-500">Active Now</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{activeCalls}</p>
            <p className="text-xs text-gray-400 mt-1">Live calls in progress</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Calls</h2>
            <Link href="/calls" className="text-sm text-indigo-600 hover:underline">
              View all →
            </Link>
          </div>
          {recentCalls.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-400">
              <p className="text-lg mb-2">No calls yet</p>
              <p className="text-sm">
                Call{" "}
                <span className="font-mono text-indigo-600">(423) 556-3838</span>{" "}
                to test your AI receptionist!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-gray-500 border-b">
                    <th className="px-6 py-3">Time</th>
                    <th className="px-6 py-3">Caller</th>
                    <th className="px-6 py-3">Duration</th>
                    <th className="px-6 py-3">Industry</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentCalls.map((call, i) => (
                    <tr key={call.call_sid || i} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-600">
                        {formatTime(call.started_at)}
                      </td>
                      <td className="px-6 py-3 font-medium text-gray-900">
                        {call.caller}
                      </td>
                      <td className="px-6 py-3 text-gray-600">
                        {formatDuration(call.duration)}
                      </td>
                      <td className="px-6 py-3 text-gray-600 capitalize">
                        {call.industry}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                            call.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : call.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {call.status === "completed"
                            ? "Completed"
                            : call.status === "active"
                            ? "Active"
                            : "Missed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>
            Backend: {health?.status === "ok" ? "🟢 Online" : "🔴 Offline"} •{" "}
            {health?.businesses ?? 0} business(es) registered • Auto-refreshes every
            15s
          </p>
        </div>
      </main>
    </div>
  );
}
