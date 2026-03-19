"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// 🔥 IMPORTANT: Replace with your ACTUAL Render URL
const BASE_URL = "https://spreadvision-aihttps-github-com.onrender.com";

export default function Home() {
  const [form, setForm] = useState({
    rainfall: 50,
    temperature: 30,
    humidity: 60,
    stagnant_water: 0.5
  });

  const [risk, setRisk] = useState("");
  const [actions, setActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Prediction function
  const handlePrediction = async (data: any) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.post(
        `${BASE_URL}/predict-risk`,
        {
          rainfall: Number(data.rainfall),
          temperature: Number(data.temperature),
          humidity: Number(data.humidity),
          stagnant_water: Number(data.stagnant_water)
        }
      );

      const riskLevel = response.data.risk_level;
      setRisk(riskLevel);

      const actionsRes = await axios.get(
        `${BASE_URL}/preventive-actions?risk=${riskLevel}`
      );

      setActions(actionsRes.data.recommended_actions);

    } catch (err) {
      console.error(err);
      setError("⚠️ Unable to connect to server. Please wait...");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Run once on load
  useEffect(() => {
    handlePrediction(form);
  }, []);

  // 🔥 Handle slider change
  const handleChange = (e: any) => {
    const updatedForm = {
      ...form,
      [e.target.name]: e.target.value
    };

    setForm(updatedForm);
    handlePrediction(updatedForm);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-xl">

        <h1 className="text-3xl font-bold mb-2 text-center">
          SpreadVision.ai
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Real-time outbreak prediction using environmental data
        </p>

        <div className="space-y-6">

          <div>
            <label className="block font-semibold">
              Rainfall: {form.rainfall}
            </label>
            <input
              type="range"
              name="rainfall"
              min="0"
              max="200"
              value={form.rainfall}
              onChange={handleChange}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">
              Temperature: {form.temperature}
            </label>
            <input
              type="range"
              name="temperature"
              min="20"
              max="40"
              value={form.temperature}
              onChange={handleChange}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">
              Humidity: {form.humidity}
            </label>
            <input
              type="range"
              name="humidity"
              min="40"
              max="100"
              value={form.humidity}
              onChange={handleChange}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold">
              Stagnant Water: {form.stagnant_water}
            </label>
            <input
              type="range"
              name="stagnant_water"
              min="0"
              max="1"
              step="0.1"
              value={form.stagnant_water}
              onChange={handleChange}
              className="w-full accent-blue-500"
            />
          </div>

        </div>

        {/* 🔥 Loading */}
        {loading && (
          <p className="mt-6 text-center text-blue-400">
            Connecting to server...
          </p>
        )}

        {/* 🔥 Error */}
        {error && (
          <p className="mt-4 text-center text-red-400">
            {error}
          </p>
        )}

        {/* 🔥 Results */}
        {!loading && risk && (
          <div className="mt-8 p-5 bg-gray-700 rounded-xl shadow">

            <h2 className={`text-xl font-bold ${
              risk === "HIGH" ? "text-red-500" :
              risk === "MEDIUM" ? "text-yellow-400" :
              "text-green-500"
            }`}>
              Risk Level: {risk}
            </h2>

            <ul className="mt-3 list-disc ml-5 space-y-1">
              {actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>

          </div>
        )}

      </div>
    </div>
  );
}