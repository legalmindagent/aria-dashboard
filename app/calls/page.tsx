"use client";

import { useState, useMemo } from "react";
import { SAMPLE_CALLS, CallRecord, CallStatus } from "../data";

const PAGE_SIZE = 6;

function formatDuration(seconds: number): string {
  if (seconds === 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_STYLES: Record<CallStatus, string> = {
  completed: "bg-green-100 text-green-700",
  missed: "bg-red-100 text-red-700",
  voicemail: "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
};

function CallDetailPanel({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Call Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Caller</dt>
            <dd className="text-gray-900">{call.caller}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Time</dt>
            <dd className="text-gray-900">{formatTime(call.time)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Duration</dt>
            <dd className="text-gray-900">{formatDuration(call.duration)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Industry</dt>
            <dd className="text-gray-900">{call.industry}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Business</dt>
            <dd className="text-gray-900">{call.businessName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500 font-medium">Status</dt>
            <dd>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[call.status]}`}
              >
                {call.status}
              </span>
            </dd>
          </div>
          {call.notes && (
            <div className="pt-2 border-t border-gray-100">
              <dt className="text-gray-500 font-medium mb-1">Notes</dt>
              <dd className="text-gray-800">{call.notes}</dd>
            </div>
          )}
        </dl>
        <button
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function CallsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CallStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<CallRecord | null>(null);

  const filtered = useMemo(() => {
    return SAMPLE_CALLS.filter((c) => {
      const matchSearch =
        search === "" ||
        c.caller.toLowerCase().includes(search.toLowerCase()) ||
        c.industry.toLowerCase().includes(search.toLowerCase()) ||
        c.businessName.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStatusFilter(e.target.value as CallStatus | "all");
    setPage(1);
  }

  return (
    <div className="space-y-6">
      {selected && (
        <CallDetailPanel call={selected} onClose={() => setSelected(null)} />
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Call Log</h2>
        <p className="text-sm text-gray-500 mt-1">
          All calls handled by your AI receptionist.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by caller, industry, or business…"
          value={search}
          onChange={handleSearchChange}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={handleStatusChange}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
          <option value="voicemail">Voicemail</option>
          <option value="active">Active</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Caller
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No calls match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((call) => (
                  <tr
                    key={call.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelected(call)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatTime(call.time)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {call.caller}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {formatDuration(call.duration)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                      {call.industry}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[call.status]}`}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-blue-600 whitespace-nowrap text-right">
                      Details →
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <span>
            {filtered.length === 0
              ? "0 results"
              : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(
                  currentPage * PAGE_SIZE,
                  filtered.length
                )} of ${filtered.length}`}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
