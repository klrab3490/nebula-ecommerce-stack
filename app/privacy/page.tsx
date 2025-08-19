"use client";

import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-muted-foreground">
        At Nebula E-Commerce Stack, your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information when you use our platform.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
      <ul className="list-disc pl-6 text-muted-foreground space-y-1">
        <li>Account information (name, email, password)</li>
        <li>Order and payment details</li>
        <li>Usage data (pages visited, interactions)</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h2>
      <p className="text-muted-foreground">
        We use your data to provide our services, process payments, deliver
        orders, improve user experience, and communicate updates or promotions.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Data Protection</h2>
      <p className="text-muted-foreground">
        We implement industry-standard security measures to safeguard your
        personal data. We do not sell your information to third parties.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
      <p className="text-muted-foreground">
        You can request access, correction, or deletion of your personal data
        at any time by contacting us.
      </p>

      <p className="mt-6 text-muted-foreground">
        Last updated: August 2025
      </p>
    </div>
  );
}
