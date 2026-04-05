"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const MapboxMap = dynamic(() => import("@/components/MapboxMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-pink-50">
      <div className="flex flex-col items-center gap-3">
        <div className="text-4xl animate-bounce">🐰</div>
        <p className="text-pink-600 font-medium">Loading map...</p>
      </div>
    </div>
  ),
});

export default function CreatePage() {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Hint states
  const [hint1, setHint1] = useState("");
  const [hint2, setHint2] = useState("");
  const [hint3, setHint3] = useState("");
  const [showHints, setShowHints] = useState(false);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    setShareUrl(null);
    setShowHints(true);
  };

  const createEgg = async () => {
    if (!selectedLocation) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/eggs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          hint1: hint1.trim() || null,
          hint2: hint2.trim() || null,
          hint3: hint3.trim() || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create egg");

      const data = await response.json();
      const url = `${window.location.origin}/hunt/${data.id}`;
      setShareUrl(url);
    } catch (error) {
      console.error("Error creating egg:", error);
      alert("Failed to create egg. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setSelectedLocation(null);
    setShareUrl(null);
    setCopied(false);
    setHint1("");
    setHint2("");
    setHint3("");
    setShowHints(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🥚</span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Easter Egg Hunt
            </h1>
          </div>
          <div className="text-sm text-gray-600">
            <span className="hidden sm:inline">Hide eggs and add hints for seekers!</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-6xl mb-4">🐰🥚🗺️</div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome to the Easter Egg Hunt!
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
            Hide Easter eggs anywhere in the world and challenge your friends to find them.
            Add up to 3 optional hints to help seekers on their hunt!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-pink-200 h-[500px] lg:h-[600px]">
              <MapboxMap
                onLocationSelect={handleLocationSelect}
                marker={selectedLocation}
                interactive={true}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🐰</div>
                <h2 className="text-xl font-bold text-gray-800">
                  Hide Your Easter Egg
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  Click anywhere on the map to choose where to hide your egg.
                </p>
              </div>

              {selectedLocation && !shareUrl && (
                <div className="space-y-4">
                  <div className="bg-pink-50 rounded-xl p-4 border border-pink-200">
                    <div className="text-pink-700 font-medium mb-2 text-sm">
                      📍 Selected Location
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Latitude: {selectedLocation.latitude.toFixed(6)}°</p>
                      <p>Longitude: {selectedLocation.longitude.toFixed(6)}°</p>
                    </div>
                  </div>

                  {/* Hints Section */}
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800 font-medium mb-3">
                      <span className="text-lg">💡</span>
                      <span>Add Hints (Optional)</span>
                    </div>
                    <p className="text-xs text-yellow-600 mb-3">
                      Add up to 3 hints to help seekers find your egg!
                    </p>
                    
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={hint1}
                        onChange={(e) => setHint1(e.target.value)}
                        placeholder="Hint 1 (e.g., Near a famous landmark)"
                        className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        maxLength={100}
                      />
                      {hint1 && (
                        <input
                          type="text"
                          value={hint2}
                          onChange={(e) => setHint2(e.target.value)}
                          placeholder="Hint 2 (e.g., In a European capital)"
                          className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          maxLength={100}
                        />
                      )}
                      {hint2 && (
                        <input
                          type="text"
                          value={hint3}
                          onChange={(e) => setHint3(e.target.value)}
                          placeholder="Hint 3 (e.g., Look near the clock tower)"
                          className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          maxLength={100}
                        />
                      )}
                    </div>
                    
                    {(hint1 || hint2 || hint3) && (
                      <p className="text-xs text-yellow-600 mt-2">
                        {3 - [hint1, hint2, hint3].filter(Boolean).length} hints remaining
                      </p>
                    )}
                  </div>

                  <button
                    onClick={createEgg}
                    disabled={isCreating}
                    className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  >
                    {isCreating ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">🥚</span>
                        Creating...
                      </span>
                    ) : (
                      "🎉 Create Easter Egg Hunt!"
                    )}
                  </button>

                  <button
                    onClick={reset}
                    className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Choose different location
                  </button>
                </div>
              )}

              {shareUrl && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-2xl text-center mb-2">🎉</div>
                    <p className="text-green-800 font-medium text-center">
                      Easter egg hidden!
                    </p>
                    {hint1 && (
                      <p className="text-green-600 text-xs text-center mt-1">
                        with {hint2 ? (hint3 ? "3 hints" : "2 hints") : "1 hint"}
                      </p>
                    )}
                  </div>

                  <div className="bg-gray-100 rounded-xl p-4 flex items-center gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none truncate"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all shadow-md"
                    >
                      {copied ? "✓ Copied!" : "Copy"}
                    </button>
                  </div>

                  <Link
                    href={shareUrl}
                    className="block w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    🕵️ Start Hunting Now
                  </Link>

                  <button
                    onClick={reset}
                    className="w-full py-3 border-2 border-purple-300 text-purple-600 font-medium rounded-xl hover:bg-purple-50 transition-colors"
                  >
                    Hide Another Egg
                  </button>
                </div>
              )}

              {!selectedLocation && !shareUrl && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4 animate-pulse">🗺️</div>
                  <p className="text-gray-500">
                    Click anywhere on the map to get started!
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Then add optional hints to help seekers
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
