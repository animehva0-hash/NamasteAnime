"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  airingAt: number;
  className?: string;
}

export default function CountdownTimer({ airingAt, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = airingAt - now;
      if (diff <= 0) {
        setTimeLeft("Aired");
        return;
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [airingAt]);

  return <span className={className}>{timeLeft}</span>;
}
