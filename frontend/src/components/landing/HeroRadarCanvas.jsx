"use client";

import { Component, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const RadarCanvasInner = dynamic(() => import("./HeroRadarCanvasInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[280px] items-center justify-center">
      <span className="animate-pulse font-mono text-xs tracking-[0.2em] text-cyan-400/70">
        Initialisation du radar…
      </span>
    </div>
  ),
});

class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[280px] items-center justify-center rounded-2xl border border-red-500/20 bg-slate-900/50">
          <span className="font-mono text-sm text-red-400">Radar 3D indisponible</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HeroRadarCanvas(props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center">
        <span className="animate-pulse font-mono text-xs text-cyan-400/70">
          Chargement…
        </span>
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <RadarCanvasInner {...props} />
    </CanvasErrorBoundary>
  );
}
