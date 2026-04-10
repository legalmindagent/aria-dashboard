import { SAMPLE_CALLS, CallRecord, CallStatus } from "./data";

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

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className={`text-3xl font-bold ${accent ?? "text-gray-900"}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
    </div>
  );
}

function CallRow({ call }: { call: CallRecord }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
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
    </tr>
  );
}

export default function DashboardPage() {
  const calls = SAMPLE_CALLS;

  const today = new Date().toISOString().slice(0, 10);
  const todayCalls = calls.filter((c) => c.time.startsWith(today));
  const completedCalls = calls.filter((c) => c.duration > 0);
  const avgDuration =
    completedCalls.length > 0
      ? Math.round(
          completedCalls.reduce((sum, c) => sum + c.duration, 0) /
            completedCalls.length
        )
      : 0;
  const activeCalls = calls.filter((c) => c.status === "active").length;

  const recentCalls = calls.slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back — here&apos;s an overview of your AI receptionist activity.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Calls"
          value={calls.length}
          sub="All time"
        />
        <StatCard
          label="Calls Today"
          value={todayCalls.length}
          sub={new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
          accent="text-blue-600"
        />
        <StatCard
          label="Avg Duration"
          value={formatDuration(avgDuration)}
          sub="Completed calls only"
        />
        <StatCard
          label="Active Now"
          value={activeCalls}
          sub="Live calls in progress"
          accent={activeCalls > 0 ? "text-green-600" : undefined}
        />
      </div>

      {/* Recent calls table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Recent Calls</h3>
          <a
            href="/calls"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all →
          </a>
        </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentCalls.map((call) => (
                <CallRow key={call.id} call={call} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
