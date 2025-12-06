"use client";

import React from "react";
import { MapPin, Phone, Clock, Navigation, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LocateStorePage() {
  // Store details from environment variables or defaults
  const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS || "Kerala, India";
  const storeCity = process.env.NEXT_PUBLIC_STORE_CITY || "Kerala";
  const storeState = process.env.NEXT_PUBLIC_STORE_STATE || "Kerala";
  const storeZipCode = process.env.NEXT_PUBLIC_STORE_ZIP || "695001";
  const storePhone = process.env.NEXT_PUBLIC_STORE_PHONE || "+91 98765 43210";
  const storeEmail = process.env.NEXT_PUBLIC_STORE_EMAIL || "store@nebula.com";
  const storeMapEmbedUrl =
    process.env.NEXT_PUBLIC_STORE_MAP_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3945.7304!2d76.9366!3d8.5241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzEnMjcuNyJOIDc2wrA1NicxMS44IkU!5e0!3m2!1sen!2sin!4v1234567890";

  // Store hours
  const storeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const handleGetDirections = () => {
    // Open Google Maps with the address
    const query = encodeURIComponent(`${storeAddress}, ${storeCity}, ${storeState} ${storeZipCode}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute -inset-2 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full p-5">
                  <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                📍 Visit Our Store
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                Come experience our products in person. We&#39;d love to see you at our store!
              </p>
              <div className="w-24 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Map Section */}
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-zinc-700/50">
                  <div className="aspect-video">
                    <iframe
                      src={storeMapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Store Location Map"
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Store Info Section */}
              <div className="space-y-6">
                {/* Address Card */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-zinc-700/50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="bg-linear-to-br from-purple-500 to-pink-500 rounded-xl p-3 shadow-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-foreground">Our Address</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                          {storeAddress}
                          <br />
                          {storeCity}, {storeState} {storeZipCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info Card */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-zinc-700/50">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl p-3 shadow-lg">
                          <Phone className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Phone</h4>
                          <a
                            href={`tel:${storePhone}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {storePhone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-linear-to-br from-orange-500 to-red-500 rounded-xl p-3 shadow-lg">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">Email</h4>
                          <a
                            href={`mailto:${storeEmail}`}
                            className="text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            {storeEmail}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Hours Card */}
                <div className="relative">
                  <div className="absolute -inset-1 bg-linear-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 dark:border-zinc-700/50">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="bg-linear-to-br from-green-500 to-emerald-500 rounded-xl p-3 shadow-lg">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-3 text-foreground">Store Hours</h3>
                        <div className="space-y-2">
                          {storeHours.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex justify-between py-2 border-b border-border last:border-0"
                            >
                              <span className="text-sm text-muted-foreground">{schedule.day}</span>
                              <span className="text-sm font-semibold text-foreground">
                                {schedule.hours}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Get Directions Button */}
                <Button
                  onClick={handleGetDirections}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl px-6 py-6 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Navigation className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                    <span>Get Directions</span>
                  </div>
                </Button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-16 max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur opacity-10"></div>
                <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/30 dark:border-zinc-700/50">
                  <h3 className="text-xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    What to Expect
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">✨ Product Testing</h4>
                      <p>Try our products before you buy. Our team will help you find the perfect match for your needs.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">🎁 Exclusive In-Store Offers</h4>
                      <p>Enjoy special discounts and promotions available only at our physical location.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">👥 Expert Consultation</h4>
                      <p>Get personalized recommendations from our beauty and wellness experts.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">🅿️ Parking Available</h4>
                      <p>Free parking available for all customers visiting our store.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
