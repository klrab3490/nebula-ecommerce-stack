"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactUs() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Contact form submitted", data);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    form.reset();
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@nebula.com",
      description: "Send us an email anytime",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "+91 98765 43210",
      description: "Mon-Fri from 8am to 5pm",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      content: "Kerala, India",
      description: "Come say hello",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Response Time",
      content: "1-2 Business Days",
      description: "We're here to help",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Modern Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-pink-50/60 to-blue-50/80 dark:from-purple-950/20 dark:via-pink-950/10 dark:to-blue-950/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

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
                💬 Get In Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
                We&#39;d love to hear from you. Send us a message and we&#39;ll respond as soon as possible.
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
                  <div className={`absolute -inset-0.5 bg-linear-to-r ${info.gradient} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`}></div>

                  {/* Main Card */}
                  <div className="relative bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/30 dark:border-zinc-700/50 group-hover:bg-white/90 dark:group-hover:bg-zinc-900/90">
                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out rounded-2xl"></div>

                    <div className="relative z-10">
                      <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                        <div className={`absolute -inset-2 bg-linear-to-r ${info.gradient} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
                        <div className={`relative bg-linear-to-r ${info.gradient} rounded-2xl p-4 text-white shadow-lg`}>
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

            {/* Enhanced Contact Form */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20 animate-pulse"></div>

                {/* Main Form Card */}
                <form onSubmit={onSubmit} className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/30 dark:border-zinc-700/50 space-y-8">
                  {/* Shine Effect */}
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent rounded-3xl opacity-50"></div>

                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl md:text-3xl font-black mb-2 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        ✉️ Send us a Message
                      </h2>
                      <p className="text-muted-foreground">Fill out the form below and we&#39;ll get back to you soon</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-bold text-foreground">Full Name</label>
                        <div className="relative group">
                          <Input
                            id="name"
                            name="name"
                            placeholder="Enter your full name"
                            required
                            className="h-12 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-zinc-700/50 rounded-xl focus:border-purple-500 transition-all duration-300 group-hover:bg-white/70 dark:group-hover:bg-zinc-800/70"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-bold text-foreground">Email Address</label>
                        <div className="relative group">
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="h-12 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-zinc-700/50 rounded-xl focus:border-purple-500 transition-all duration-300 group-hover:bg-white/70 dark:group-hover:bg-zinc-800/70"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      <label htmlFor="subject" className="text-sm font-bold text-foreground">Subject</label>
                      <div className="relative group">
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="What's this about?"
                          required
                          className="h-12 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-zinc-700/50 rounded-xl focus:border-purple-500 transition-all duration-300 group-hover:bg-white/70 dark:group-hover:bg-zinc-800/70"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mb-8">
                      <label htmlFor="message" className="text-sm font-bold text-foreground">Your Message</label>
                      <div className="relative group">
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          className="w-full bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-2 border-white/20 dark:border-zinc-700/50 rounded-xl px-4 py-3 text-base transition-all duration-300 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 group-hover:bg-white/70 dark:group-hover:bg-zinc-800/70 resize-none placeholder:text-muted-foreground"
                          placeholder="Tell us more about your inquiry..."
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      {submitted ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">Message sent successfully! We&#39;ll be in touch soon.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">We usually respond within 1–2 business days</span>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <div className="flex items-center gap-2">
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Sending...</span>
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                              <span>Send Message</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
