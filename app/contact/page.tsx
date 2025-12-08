"use client";

import { Button } from "@/components/ui/button";
import SocialLinks from "@/components/custom/SocialLinks";
import { generateWhatsAppMessage, generateWhatsAppUrl } from "@/lib/whatsappMessages";
import { Mail, MessageSquare, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

export default function ContactUs() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const handleWhatsAppClick = () => {
    const message = generateWhatsAppMessage({ pathname: "/contact" });
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@nebula.com",
      description: "Send us an email anytime",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "+91 98765 43210",
      description: "Mon-Fri from 8am to 5pm",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      content: "Kerala, India",
      description: "Come say hello",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      content: "1-2 Business Days",
      description: "We're here to help",
      gradient: "from-orange-500 to-red-500",
    },
  ];

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
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
                <div className="absolute -inset-2 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-full p-5">
                  <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-black mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                💬 Let's Connect
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                We're here to help! Chat with us on WhatsApp for instant support and personalized
                assistance.
              </p>
              <div className="w-24 h-1 bg-linear-to-r from-purple-500 to-pink-500 mx-auto mt-6 rounded-full"></div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute -inset-0.5 bg-linear-to-r ${info.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`}
                  ></div>

                  {/* Main Card */}
                  <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30 dark:border-zinc-700/50 group-hover:bg-white/90 dark:group-hover:bg-zinc-900/90">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"></div>

                    <div className="relative z-10">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                        <div
                          className={`absolute -inset-2 bg-linear-to-r ${info.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
                        ></div>
                        <div
                          className={`relative bg-linear-to-r ${info.gradient} rounded-2xl p-4 text-white shadow-lg`}
                        >
                          {info.icon}
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:bg-linear-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {info.title}
                      </h3>
                      <p className="font-semibold text-foreground mb-1">{info.content}</p>
                      <p className="text-sm text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media Section */}
            <div className="text-center mb-16">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Connect With Us
                </h3>
                <p className="text-muted-foreground mb-6">
                  Follow us on social media for the latest updates, offers, and beauty tips
                </p>
                <div className="flex justify-center">
                  <SocialLinks variant="contact" />
                </div>
              </div>
            </div>

            {/* WhatsApp CTA Section */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-[#25D366] via-[#128C7E] to-[#075E54] rounded-3xl blur opacity-30 animate-pulse"></div>

                {/* Main CTA Card */}
                <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 dark:border-zinc-700/50">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-50"></div>

                  <div className="relative z-10 text-center space-y-6">
                    {/* WhatsApp Icon */}
                    <div className="relative inline-flex items-center justify-center">
                      <div className="absolute -inset-4 bg-[#25D366]/20 rounded-full blur-2xl animate-pulse"></div>
                      <div className="relative bg-[#25D366] rounded-full p-8 shadow-2xl">
                        <MessageCircle size={64} fill="white" className="text-white" />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl md:text-3xl font-black mb-3 bg-linear-to-r from-[#25D366] to-[#128C7E] bg-clip-text text-transparent">
                        Chat with Us on WhatsApp
                      </h2>
                      <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                        Get instant responses to your queries! Our team is ready to assist you with
                        product recommendations, order tracking, and any questions you may have.
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                      <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl mb-2">⚡</div>
                        <h4 className="font-semibold text-sm mb-1">Instant Replies</h4>
                        <p className="text-xs text-muted-foreground">
                          No waiting, get answers right away
                        </p>
                      </div>
                      <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl mb-2">🛍️</div>
                        <h4 className="font-semibold text-sm mb-1">Product Help</h4>
                        <p className="text-xs text-muted-foreground">
                          Expert advice on our products
                        </p>
                      </div>
                      <div className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4">
                        <div className="text-2xl mb-2">📦</div>
                        <h4 className="font-semibold text-sm mb-1">Order Support</h4>
                        <p className="text-xs text-muted-foreground">
                          Track and manage your orders
                        </p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={handleWhatsAppClick}
                      disabled={!whatsappNumber}
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white border-0 rounded-xl px-8 py-6 font-bold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                      <div className="flex items-center gap-3">
                        <MessageCircle size={24} fill="white" />
                        <span>Start WhatsApp Chat</span>
                      </div>
                    </Button>

                    {!whatsappNumber && (
                      <p className="text-sm text-red-500 dark:text-red-400">
                        WhatsApp number not configured. Please add NEXT_PUBLIC_WHATSAPP_NUMBER to
                        .env.local
                      </p>
                    )}

                    {/* Alternative Contact Info */}
                    <div className="pt-6 border-t border-white/20 dark:border-zinc-700/50">
                      <p className="text-sm text-muted-foreground mb-3">
                        Prefer email? Reach us at{" "}
                        <a
                          href="mailto:support@nebula.com"
                          className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                        >
                          support@nebula.com
                        </a>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Email response time: 1-2 business days
                      </p>
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
