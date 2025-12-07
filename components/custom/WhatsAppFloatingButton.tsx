"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { generateWhatsAppMessage, generateWhatsAppUrl } from "@/lib/whatsappMessages";

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  // Show button after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show tooltip after 3 seconds on initial load
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setShowTooltip(true);
        // Hide tooltip after 5 seconds
        setTimeout(() => setShowTooltip(false), 5000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleClick = () => {
    // Generate context-aware message
    const message = generateWhatsAppMessage({ pathname });

    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Don't show on seller dashboard or if WhatsApp number is not configured
  if (pathname.startsWith("/seller") || !whatsappNumber) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-4 animate-fade-in">
            <div className="relative">
              <div className="bg-white dark:bg-zinc-900 text-foreground px-4 py-3 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-700 max-w-[200px] relative">
                <button
                  onClick={() => setShowTooltip(false)}
                  className="absolute -top-2 -right-2 bg-gray-200 dark:bg-zinc-700 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                  aria-label="Close tooltip"
                >
                  <X size={12} />
                </button>
                <p className="text-sm font-medium">Need help? Chat with us on WhatsApp!</p>
              </div>
              {/* Arrow */}
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white dark:bg-zinc-900 border-r border-b border-gray-200 dark:border-zinc-700 transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={handleClick}
          className="group relative flex items-center justify-center w-16 h-16 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-[#25D366] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>

          {/* Icon */}
          <div className="relative">
            <MessageCircle size={32} fill="white" className="drop-shadow-lg" />
          </div>

          {/* Ripple Effect */}
          <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-20"></span>
        </button>

        {/* Small badge/notification (optional - can be enabled based on business logic) */}
        {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">
          1
        </div> */}
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
