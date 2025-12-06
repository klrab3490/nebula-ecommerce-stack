"use client";

import React from "react";
import { Instagram, Facebook, Twitter } from "lucide-react";
import Link from "next/link";

interface SocialLinksProps {
  variant?: "footer" | "contact";
  className?: string;
}

export default function SocialLinks({ variant = "footer", className = "" }: SocialLinksProps) {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL || "#";
  const twitterUrl = process.env.NEXT_PUBLIC_TWITTER_URL || "#";

  const socialPlatforms = [
    {
      name: "Instagram",
      url: instagramUrl,
      icon: Instagram,
      color: "hover:bg-pink-500",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      name: "Facebook",
      url: facebookUrl,
      icon: Facebook,
      color: "hover:bg-blue-500",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      name: "Twitter",
      url: twitterUrl,
      icon: Twitter,
      color: "hover:bg-sky-400",
      gradient: "from-sky-400 to-sky-500",
    },
  ];

  const baseClasses =
    variant === "footer"
      ? "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:scale-110"
      : "bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:scale-110 hover:shadow-lg";

  return (
    <div className={`flex gap-4 ${className}`}>
      {socialPlatforms.map((platform) => {
        const IconComponent = platform.icon;
        return (
          <Link
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-3 rounded-full transition-all duration-300 ${baseClasses} ${platform.color}`}
            aria-label={`Follow us on ${platform.name}`}
          >
            <IconComponent size={20} />
          </Link>
        );
      })}
    </div>
  );
}
