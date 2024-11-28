"use client";

import React, { useEffect, useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import dotenv from "dotenv";

dotenv.config();

const agentId = "a29d458e9d138371eeecb3932f328ed9";
const webClient = new RetellWebClient();

interface RegisterCallResponse {
  access_token: string;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const ghostAudioRef = React.useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.className = isDarkMode ? "dark" : "";

    webClient.on("call_started", () => {
      console.log("call started");
      setIsCalling(true);
      // Play ghost sound when the call starts
      if (ghostAudioRef.current) {
        ghostAudioRef.current.currentTime = 0;
        ghostAudioRef.current.play();
        ghostAudioRef.current.volume = 0.25
      }
    });

    webClient.on("call_ended", () => {
      console.log("call ended");
      setIsCalling(false);
      // Stop ghost sound when the call ends
      if (ghostAudioRef.current) {
        ghostAudioRef.current.pause();
      }
    });

    return () => {
      if (ghostAudioRef.current) {
        ghostAudioRef.current.pause();
      }
    };
  }, []);

  const toggleConversation = async () => {
    if (isCalling) {
      webClient.stopCall();
      setIsCalling(false);
    } else {
      const registerCallResponse = await registerCall(agentId);
      if (registerCallResponse.access_token) {
        webClient
          .startCall({
            accessToken: registerCallResponse.access_token,
          })
          .catch(console.error);
        setIsCalling(true);
      }
    }
  };

  const generateAd = async () => {
    try {
      const response = await fetch("/api/generateAd", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.imageUrl);
      } else {
        console.error("Error generating ad");
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  async function registerCall(agentId: string): Promise<RegisterCallResponse> {
    try {
      const response = await fetch("/api/create-web-call", { // Use relative path for API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agent_id: agentId,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const data: RegisterCallResponse = await response.json();
      return data;
    } catch (err) {
      console.log(err);
      throw new Error(err instanceof Error ? err.message : String(err));
    }
  }
  

  return (
    <div
      className={`flex flex-col min-h-screen justify-center items-center py-8 ${
        isDarkMode
          ? "bg-gradient-to-b from-black to-red-900 text-red-200"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      {/* Ghost Sound */}
      <audio ref={ghostAudioRef} src="/ghost.mp3" loop/>

      {/* Theme Toggle Icon */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-2 transition-transform duration-300 hover:scale-110"
      >
        {isDarkMode ? (
          <MoonIcon className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_#ff0000]" />
        ) : (
          <SunIcon className="h-10 w-10 text-red-500 drop-shadow-[0_0_10px_#ff0000]" />
        )}
      </button>

      <div
        className={`p-6 rounded-lg shadow-lg w-80 text-center ${
          isDarkMode
            ? "bg-red-900 border border-red-700 shadow-[0_0_15px_#ff0000]"
            : "bg-white"
        }`}
      >
        <div className="text-2xl font-semibold mb-4">
          {isCalling ? "☠️ End Call" : "🍷Drink Amontillado with Fortunato"}
        </div>

        <div className="mb-6">
          {isCalling
            ? "Fortunato is live from the underworld!"
            : "Click to awaken Fortunato"}
        </div>

        <button
          onClick={toggleConversation}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCalling
              ? "bg-red-600 hover:bg-red-900 text-white shadow-[0_0_10px_#ff0000]"
              : "bg-red-600 hover:bg-red-900 text-red-300 shadow-[0_0_15px_#ff4d4d]"
          }`}
        >
          {isCalling ? "Banish Fortunato" : "Summon Fortunato"}
        </button>
      </div>

      <button
        onClick={generateAd}
        className="mt-6 px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_#ff4d4d] hover:shadow-[0_0_20px_#ff6666]"
      >
        Generate Memory
      </button>

      {imageUrl && (
        <div className="mt-6">
          <img
            src={imageUrl}
            alt="Generated Haunted Ad"
            className="w-96 h-auto rounded-lg shadow-[0_0_20px_#ff0000]"
          />
        </div>
      )}
    </div>
  );
}
