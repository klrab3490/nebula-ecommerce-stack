"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Contact form submitted", data);
    setSubmitted(true);
    form.reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-b">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground mt-2">We&#39;d love to hear from you. Send us a message and we&#39;ll respond soon.</p>
          </div>

          <form onSubmit={onSubmit} className="bg-card border rounded-xl shadow-sm p-6 md:p-8 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                <Input id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
              <Input id="subject" name="subject" placeholder="How can we help?" required />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                placeholder="Write your message here..."
                required
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              {submitted ? (
                <p className="text-sm text-green-600 dark:text-green-400">Thanks! Your message has been sent.</p>
              ) : (
                <span className="text-sm text-muted-foreground">We usually respond within 1–2 business days.</span>
              )}
              <Button type="submit" className="px-6">Send Message</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
