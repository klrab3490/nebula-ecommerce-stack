"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface ProductDisclaimerProps {
  className?: string;
}

export default function ProductDisclaimer({ className = "" }: ProductDisclaimerProps) {
  return (
    <div
      className={`bg-amber-50/80 dark:bg-amber-900/20 backdrop-blur-sm border border-amber-200 dark:border-amber-800/50 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
            Important Disclaimer
          </h4>
          <div className="text-xs text-amber-800 dark:text-amber-200/90 leading-relaxed space-y-2">
            <p>
              <strong>Individual Results May Vary:</strong> The results and benefits described are
              based on general use and individual experiences may differ based on skin/hair type,
              application method, and other factors.
            </p>
            <p>
              <strong>Patch Test Recommended:</strong> Before full application, we recommend
              performing a patch test on a small area of skin to check for any allergic reactions or
              sensitivities.
            </p>
            <p>
              <strong>Not Medical Advice:</strong> This product is for cosmetic use only and is not
              intended to diagnose, treat, cure, or prevent any disease or medical condition.
              Consult a healthcare professional for medical concerns.
            </p>
            <p>
              <strong>Storage & Usage:</strong> Store in a cool, dry place away from direct
              sunlight. Follow the recommended usage instructions for best results. Discontinue use
              if irritation occurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
