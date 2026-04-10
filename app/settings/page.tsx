"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const BACKEND_URL = "https://voice-agent-backend-y0t9.onrender.com";

interface BusinessConfig {
  business_name: string;
  agent_name: string;
  industry: string;
  owner_email: string;
  owner_phone: string;
  greeting: string;
  voice: string;
  notify_sms: boolean;
  notify_email: boolean;
}

export default function SettingsPage() {
  const [businesses, setBusinesses] = useState<Record<string, BusinessConfig>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch(`${BACKEND_URL}/businesses`);
        const data = await res.json();
        setBusinesses(data.configs || {});
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBusinesses();
  }, []);

  const handleSave = async (phone: string, config: BusinessConfig) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/register-business`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ twilio_number: phone, ...config }),
      });
      if (res.ok) {
        setMessage("Settings saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setMessage("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  const entries = Object.entries(businesses);

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
            <Link href="/calls" className="hover:text-indigo-600">
              Calls
            </Link>
            <Link href="/settings" className="text-indigo-600">
              Settings
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your AI receptionist configuration.
          </p>
        </div>

        {message && (
          <div className="mb-6 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading settings...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-white rounded-xl border px-6 py-16 text-center">
            <p className="text-lg text-gray-500">No businesses configured yet</p>
          </div>
        ) : (
          entries.map(([phone, config]) => (
            <div key={phone} className="bg-white rounded-xl border p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {config.business_name}
                  </h2>
                  <p className="text-sm text-gray-500 font-mono">{phone}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={config.business_name}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, business_name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={config.agent_name}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, agent_name: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <select
                    value={config.industry}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, industry: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {["towing", "locksmith", "hvac", "plumbing", "dental", "real_estate", "pest_control", "roofing", "auto_repair", "veterinary", "legal", "electrical", "general"].map((ind) => (
                      <option key={ind} value={ind}>
                        {ind.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Voice
                  </label>
                  <select
                    value={config.voice}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, voice: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    {["Kore", "Puck", "Charon", "Fenrir", "Aoede"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Email
                  </label>
                  <input
                    type="email"
                    value={config.owner_email}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, owner_email: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notification Phone (SMS)
                  </label>
                  <input
                    type="tel"
                    value={config.owner_phone}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, owner_phone: e.target.value },
                      }))
                    }
                    placeholder="+1234567890"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Greeting (optional)
                  </label>
                  <input
                    type="text"
                    value={config.greeting}
                    onChange={(e) =>
                      setBusinesses((prev) => ({
                        ...prev,
                        [phone]: { ...config, greeting: e.target.value },
                      }))
                    }
                    placeholder="Thank you for calling..."
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={config.notify_email}
                      onChange={(e) =>
                        setBusinesses((prev) => ({
                          ...prev,
                          [phone]: { ...config, notify_email: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    Email notifications
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={config.notify_sms}
                      onChange={(e) =>
                        setBusinesses((prev) => ({
                          ...prev,
                          [phone]: { ...config, notify_sms: e.target.checked },
                        }))
                      }
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    SMS notifications
                  </label>
                </div>
                <button
                  onClick={() => handleSave(phone, config)}
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
