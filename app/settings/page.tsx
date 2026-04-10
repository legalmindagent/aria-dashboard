"use client";

import { useState } from "react";
import { INDUSTRIES } from "../data";

interface Settings {
  businessName: string;
  industry: string;
  agentName: string;
  greeting: string;
  ownerEmail: string;
  ownerPhone: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  businessName: "Cool Breeze HVAC",
  industry: "HVAC",
  agentName: "Aria",
  greeting:
    "Hi, thanks for calling Cool Breeze HVAC! I'm Aria, your AI receptionist. How can I help you today?",
  ownerEmail: "owner@example.com",
  ownerPhone: "+1 (555) 000-0000",
  smsEnabled: true,
  emailEnabled: true,
};

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked ? "bg-blue-600" : "bg-gray-200"
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function FormField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [toast, setToast] = useState(false);

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((s) => ({ ...s, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Settings saved successfully!
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-1">
          Configure your AI receptionist and notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Business info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">Business Information</h3>

          <FormField label="Business Name" id="businessName">
            <input
              id="businessName"
              type="text"
              value={settings.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Industry" id="industry">
            <select
              id="industry"
              value={settings.industry}
              onChange={(e) => set("industry", e.target.value)}
              className={inputClass}
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        {/* Agent config */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">AI Agent Configuration</h3>

          <FormField label="Agent Name" id="agentName">
            <input
              id="agentName"
              type="text"
              value={settings.agentName}
              onChange={(e) => set("agentName", e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Custom Greeting" id="greeting">
            <textarea
              id="greeting"
              rows={3}
              value={settings.greeting}
              onChange={(e) => set("greeting", e.target.value)}
              className={inputClass + " resize-none"}
            />
          </FormField>
        </div>

        {/* Owner contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">Owner Contact</h3>

          <FormField label="Email Address" id="ownerEmail">
            <input
              id="ownerEmail"
              type="email"
              value={settings.ownerEmail}
              onChange={(e) => set("ownerEmail", e.target.value)}
              className={inputClass}
            />
          </FormField>

          <FormField label="Phone Number" id="ownerPhone">
            <input
              id="ownerPhone"
              type="tel"
              value={settings.ownerPhone}
              onChange={(e) => set("ownerPhone", e.target.value)}
              className={inputClass}
            />
          </FormField>
        </div>

        {/* Notification preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <h3 className="text-base font-semibold text-gray-900">Notification Preferences</h3>

          <Toggle
            checked={settings.smsEnabled}
            onChange={(v) => set("smsEnabled", v)}
            label="SMS Notifications"
            description="Receive a text message after each call."
          />
          <Toggle
            checked={settings.emailEnabled}
            onChange={(v) => set("emailEnabled", v)}
            label="Email Notifications"
            description="Receive an email summary after each call."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
