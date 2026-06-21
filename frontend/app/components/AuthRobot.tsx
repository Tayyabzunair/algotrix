"use client";

import Spline from "@splinetool/react-spline";

export default function AuthRobot() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient glows */}
      <div
        className="glow-blob"
        style={{
          width: "450px",
          height: "450px",
          background: "#10b981",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.3,
        }}
      />
      <div
        className="glow-blob"
        style={{
          width: "300px",
          height: "300px",
          background: "#059669",
          bottom: "5%",
          right: "5%",
          opacity: 0.25,
        }}
      />

      {/* 3D Robot */}
      <div className="relative z-10 w-full h-full">
        <Spline scene="https://prod.spline.design/ikgkGJC9Nsiz4PvL/scene.splinecode" />
      </div>
    </div>
  );
}
