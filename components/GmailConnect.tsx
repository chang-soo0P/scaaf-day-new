"use client";

import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface GmailConnectProps {
  onConnect?: () => void;
}

export function GmailConnect({ onConnect }: GmailConnectProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGmailConnect = async () => {
    try {
      setIsLoading(true);

      // CRITICAL: Include credentials to send cookies
      const response = await fetch("/api/auth/google", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.error) {
        console.error("Failed to get auth URL:", data.error);
        alert("Failed to connect Gmail. Please try again.");
        return;
      }

      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        console.error("No auth URL received");
        alert("Could not retrieve authentication URL.");
      }
    } catch (error) {
      console.error("Gmail connect error:", error);
      alert("An error occurred while connecting to Gmail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <Mail className="w-16 h-16 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-indigo-900 text-2xl font-semibold">Scaaf.day</h1>
            <p className="text-gray-600">Emotionally summarize your email every day</p>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
            <div className="space-y-1">
              <p className="text-gray-700">AI summarizes your emails</p>
              <p className="text-gray-500 text-sm">and delivers emotional highlights</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1" />
            <div className="space-y-1">
              <p className="text-gray-700">Automatic grouping by sender</p>
              <p className="text-gray-500 text-sm">so you never miss important messages</p>
            </div>
          </div>
        </div>

        {/* Gmail Button */}
        <Button
          onClick={handleGmailConnect}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          size="lg"
        >
          <Mail className="w-5 h-5 mr-2" />
          {isLoading ? "Connecting..." : "Connect Gmail"}
        </Button>

        {/* Terms & Privacy & OAuth Disclosure */}
        <p className="text-xs text-gray-500 leading-5 pt-4">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-gray-700"
          >
            Terms of Service
          </Link>
          {", "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-gray-700"
          >
            Privacy Policy
          </Link>
          {", and "}
          <Link
            href="/google-oauth-disclosure"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:text-gray-700"
          >
            OAuth Data Use Disclosure
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
