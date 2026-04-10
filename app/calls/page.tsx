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

export default function CallsPage() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCalls() {
      try {
        const res = await fetch(`${BACKEND_URL}/call-log`);
        const data = await res.json();
        setCalls(data.calls || []);
      } catch (err) {
        console.error("Error fetching calls:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCalls();
    const interval = setInterval(fetchCalls, 15000);
    return () => clearInterval(interval);
  }, []);

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
            <Link href="/" className="hover:text-indigo-600">
              Dashboard
            </Link>
            <Link href="/calls" className="text-indigo-600">
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
          <h1 className="text-2xl font-bold text-gray-900">Call Log</h1>
          <p className="text-gray-500 mt-1">
            Complete history of all calls handled by your AI receptionist.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading calls...</p>
          </div>
        ) : calls.length === 0 ? (
          <div className="bg-white rounded-xl border px-6 py-16 text-center">
            <p className="text-lg text-gray-500 mb-2">No calls yet</p>
            <p className="text-sm text-gray-400">
              Call{" "}
              <span className="font-mono text-indigo-600">(423) 556-3838</span>{" "}
              to test your AI receptionist!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500 border-b bg-gray-50">
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Caller</th>
                  <th className="px-6 py-3">Business</th>
                  <th className="px-6 py-3">Industry</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {calls.map((call, i) => (
                  <tr
                    key={call.call_sid || i}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-6 py-3 text-gray-600">
                      {formatTime(call.started_at)}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {call.caller}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {call.business_name}
                    </td>
                    <td className="px-6 py-3 text-gray-600 capitalize">
                      {call.industry}
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {formatDuration(call.duration)}
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

        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Showing {calls.length} call(s) • Auto-refreshes every 15s</p>
        </div>
      </main>
    </div>
  );
}
