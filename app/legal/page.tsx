"use client";

import React from "react";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">Legal Information</h1>

      {/* Table of Contents */}
      <nav className="mb-8 space-y-2">
        <Link href="#privacy" className="text-blue-600 hover:underline block">
          Privacy Policy
        </Link>
        <Link href="#terms" className="text-blue-600 hover:underline block">
          Terms of Service
        </Link>
        <Link href="#cookies" className="text-blue-600 hover:underline block">
          Cookie Policy
        </Link>
      </nav>

      {/* Privacy Policy */}
      <section id="privacy">
        <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
        <p className="mb-4 text-muted-foreground">
          At Nebula E-Commerce Stack, your privacy is important to us. This Privacy Policy explains
          how we collect, use, and protect your personal information when you use our platform.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h3>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Account information (name, email, password)</li>
          <li>Order and payment details</li>
          <li>Usage data (pages visited, interactions)</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-2">How We Use Your Data</h3>
        <p className="text-muted-foreground">
          We use your data to provide our services, process payments, deliver orders, improve user
          experience, and communicate updates or promotions.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Data Protection</h3>
        <p className="text-muted-foreground">
          We implement industry-standard security measures to safeguard your personal data. We do
          not sell your information to third parties.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Your Rights</h3>
        <p className="text-muted-foreground">
          You can request access, correction, or deletion of your personal data at any time by
          contacting us.
        </p>
        <p className="mt-6 text-muted-foreground">Last updated: August 2025</p>
      </section>

      {/* Terms of Service */}
      <section id="terms">
        <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
        <p className="mb-4 text-muted-foreground">
          By using Nebula E-Commerce Stack, you agree to the following terms and conditions. Please
          read them carefully.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Use of Service</h3>
        <p className="text-muted-foreground">
          You agree to use the platform only for lawful purposes and in compliance with all
          applicable laws and regulations.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Accounts</h3>
        <p className="text-muted-foreground">
          You are responsible for maintaining the confidentiality of your account and password. Any
          activity under your account is your responsibility.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Purchases & Payments</h3>
        <p className="text-muted-foreground">
          All sales are subject to our pricing and refund policies. We use secure payment providers,
          but are not responsible for issues arising from third-party services.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Limitations of Liability</h3>
        <p className="text-muted-foreground">
          Nebula E-Commerce Stack is not liable for damages resulting from the use or inability to
          use the platform, except as required by law.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h3>
        <p className="text-muted-foreground">
          We may update these Terms of Service at any time. Continued use of the platform after
          changes means you accept the updated terms.
        </p>
        <p className="mt-6 text-muted-foreground">Last updated: August 2025</p>
      </section>

      {/* Cookie Policy */}
      <section id="cookies">
        <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
        <p className="mb-4 text-muted-foreground">
          Nebula E-Commerce Stack uses cookies to improve your browsing experience and provide
          personalized services.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">What Are Cookies?</h3>
        <p className="text-muted-foreground">
          Cookies are small text files stored on your device when you visit our website. They help
          us recognize your preferences and improve performance.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Types of Cookies We Use</h3>
        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
          <li>Essential cookies – required for basic functionality</li>
          <li>Analytics cookies – help us understand usage patterns</li>
          <li>Functional cookies – remember your preferences</li>
          <li>Advertising cookies – deliver relevant ads</li>
        </ul>
        <h3 className="text-xl font-semibold mt-6 mb-2">Managing Cookies</h3>
        <p className="text-muted-foreground">
          You can disable cookies in your browser settings, but some features of the platform may
          not work properly.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-2">Changes to This Policy</h3>
        <p className="text-muted-foreground">
          We may update this Cookie Policy as needed. Please check this page regularly for updates.
        </p>
        <p className="mt-6 text-muted-foreground">Last updated: August 2025</p>
      </section>
    </div>
  );
}
