import React from "react";

export const DefaultAvatar: React.FC<{ size?: number }> = ({ size = 80 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6d4c41"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ borderRadius: "50%", backgroundColor: "#f5eee1" }}
  >
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
  </svg>
);
