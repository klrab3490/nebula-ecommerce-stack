"use client";

import React from "react";

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      <p className="mb-4 text-muted-foreground">
        Nebula E-Commerce Stack uses cookies to improve your browsing experience
        and provide personalized services.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h2>
      <p className="text-muted-foreground">
        Cookies are small text files stored on your device when you visit our
        website. They help us recognize your preferences and improve performance.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Types of Cookies We Use</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
        <li>Essential cookies – required for basic functionality</li>
        <li>Analytics cookies – help us understand usage patterns</li>
        <li>Functional cookies – remember your preferences</li>
        <li>Advertising cookies – deliver relevant ads</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Managing Cookies</h2>
      <p className="text-muted-foreground">
        You can disable cookies in your browser settings, but some features of
        the platform may not work properly.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h2>
      <p className="text-muted-foreground">
        We may update this Cookie Policy as needed. Please check this page
        regularly for updates.
      </p>

      <p className="mt-6 text-muted-foreground">
        Last updated: August 2025
      </p>
    </div>
  );
}
