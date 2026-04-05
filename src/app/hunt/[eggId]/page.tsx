"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { calculateDistance, metersToMiles, formatDistance } from "@/lib/distance";

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

interface EggData {
  id: string;
  latitude: number;
  longitude: number;
  hint1?: string;
  hint2?: string;
  hint3?: string;
}

interface Guess {
  latitude: number;
  longitude: number;
  distance: number;
  distanceMiles: number;
}

export default function HuntPage() {
  const params = useParams();
  const eggId = params.eggId as string;
  
  const [egg, setEgg] = useState<EggData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [found, setFound] = useState(false);
  const [showEgg, setShowEgg] = useState(false);
  
  // Hint reveal tracking
  const [revealedHints, setRevealedHints] = useState(0);

  useEffect(() => {
    fetchEgg();
  }, [eggId]);

  const fetchEgg = async () => {
    try {
      const response = await fetch(`/api/eggs/${eggId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError("Egg not found. The link may be invalid or expired.");
        } else {
          setError("Failed to load egg. Please try again.");
        }
        return;
      }
      const data = await response.json();
      setEgg(data);
    } catch (err) {
      setError("An error occurred while loading the egg.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuess = (lat: number, lng: number) => {
    if (!egg || found) return;

    const distanceMeters = calculateDistance(lat, lng, egg.latitude, egg.longitude);
    const distanceMiles = metersToMiles(distanceMeters);

    const newGuess: Guess = {
      latitude: lat,
      longitude: lng,
      distance: distanceMeters,
      distanceMiles,
    };

    setGuesses([newGuess, ...guesses]);

    if (distanceMeters <= 100) {
      setFound(true);
      setShowEgg(true);
    }
  };

  const revealNextHint = () => {
    setRevealedHints(prev => prev + 1);
  };

  const getAvailableHints = () => {
    if (!egg) return 0;
    return [egg.hint1, egg.hint2, egg.hint3].filter(Boolean).length;
  };

  const getProximityEmoji = (miles: number) => {
    if (miles < 0.1) return "🔥";
    if (miles < 1) return "🌡️";
    if (miles < 10) return "😊";
    if (miles < 50) return "🤔";
    if (miles < 100) return "❄️";
    return "🥶";
  };

  const getProximityColor = (miles: number) => {
    if (miles < 0.1) return "text-red-600 bg-red-50 border-red-200";
    if (miles < 1) return "text-orange-600 bg-orange-50 border-orange-200";
    if (miles < 10) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    if (miles < 50) return "text-blue-600 bg-blue-50 border-blue-200";
    if (miles < 100) return "text-indigo-600 bg-indigo-50 border-indigo-200";
    return "text-purple-600 bg-purple-50 border-purple-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🥚</div>
          <p className="text-xl text-gray-600">Loading your Easter egg hunt...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all"
          >
            Create Your Own Hunt
          </Link>
        </div>
      </div>
    );
  }

  const availableHints = getAvailableHints();
  const hints = egg ? [egg.hint1, egg.hint2, egg.hint3].filter(Boolean) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🥚</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                Easter Egg Hunt
              </h1>
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
            >
              Hide Your Own →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-pink-200 h-[500px] lg:h-[600px]">
              {egg && (
                <MapboxMap
                  onLocationSelect={handleGuess}
                  marker={showEgg ? { latitude: egg.latitude, longitude: egg.longitude } : null}
                  interactive={!found}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-200 p-6">
              {found ? (
                <div className="text-center">
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>
                  <h2 className="text-2xl font-bold text-green-600 mb-2">
                    You Found It!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Congratulations! You discovered the Easter egg!
                  </p>
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 mb-6 border-2 border-yellow-300">
                    <div className="text-5xl mb-2">🥚</div>
                    <p className="text-sm text-gray-700">Easter Egg Found!</p>
                  </div>
                  <Link
                    href="/"
                    className="w-full inline-block py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all transform hover:scale-105"
                  >
                    Hide Your Own Egg
                  </Link>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🕵️</div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Find the Easter Egg!
                    </h2>
                    <p className="text-gray-600 text-sm mt-2">
                      Click on the map to search. You are looking for a hidden Easter egg somewhere in the world!
                    </p>
                  </div>

                  {/* Hints Section */}
                  {availableHints > 0 && (
                    <div className="mb-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">💡</span>
                          <span className="font-semibold text-yellow-800">Hints Available</span>
                        </div>
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                          {revealedHints}/{availableHints} revealed
                        </span>
                      </div>
                      
                      {/* Revealed Hints */}
                      <div className="space-y-2 mb-3">
                        {hints.slice(0, revealedHints).map((hint, index) => (
                          <div 
                            key={index} 
                            className="bg-white rounded-lg p-3 border border-yellow-300 text-sm text-gray-700"
                          >
                            <span className="font-medium text-yellow-600">Hint {index + 1}: </span>
                            {hint}
                          </div>
                        ))}
                      </div>
                      
                      {/* Reveal Button */}
                      {revealedHints < availableHints && (
                        <button
                          onClick={revealNextHint}
                          className="w-full py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          🔓 Reveal Next Hint
                        </button>
                      )}
                      
                      {revealedHints >= availableHints && (
                        <p className="text-xs text-yellow-600 text-center">
                          All hints revealed! Good luck!
                        </p>
                      )}
                    </div>
                  )}

                  {guesses.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                        Your Guesses
                      </h3>
                      <div className="space-y-2 max-h-[250px] overflow-y-auto">
                        {guesses.map((guess, index) => (
                          <div
                            key={index}
                            className={`rounded-xl p-3 border-2 ${getProximityColor(guess.distanceMiles)}`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-lg">
                                {formatDistance(guess.distanceMiles)}
                              </span>
                              <span className="text-2xl">
                                {getProximityEmoji(guess.distanceMiles)}
                              </span>
                            </div>
                            <p className="text-xs opacity-75 mt-1">
                              Guess #{guesses.length - index}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {guesses.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4 animate-pulse">🗺️</div>
                      <p className="text-gray-500">
                        Click anywhere on the map to start your search!
                      </p>
                      {availableHints > 0 && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded-lg">
                          <p className="text-xs text-yellow-700">
                            💡 {availableHints} hint{availableHints > 1 ? 's' : ''} available below!
                          </p>
                        </div>
                      )}
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                        <p>💡 Tip: Get within 100 meters to find the egg!</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
