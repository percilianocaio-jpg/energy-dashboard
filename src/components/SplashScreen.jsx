import { Zap } from "lucide-react";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#09090B] flex items-center justify-center">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 grid-background opacity-30" />

      {/* GRADIENT GLOW */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400/10 rounded-full blur-3xl animate-pulse" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">
        {/* ICON */}
        <div className="relative flex items-center justify-center">
          {/* outer ring */}
          <div className="absolute w-32 h-32 rounded-full border border-yellow-400/20 animate-spin-slow" />

          {/* middle glow */}
          <div className="absolute w-24 h-24 rounded-full bg-yellow-400/10 blur-2xl animate-pulse" />

          {/* icon */}
          <div className="w-20 h-20 rounded-full border border-yellow-400/30 bg-yellow-400/5 backdrop-blur-xl flex items-center justify-center">
            <Zap
              size={34}
              strokeWidth={2.5}
              className="text-yellow-400"
            />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="mt-10 text-3xl font-semibold tracking-tight text-white">
          Energy Dashboard
        </h1>

        {/* SUBTITLE */}
        <p className="mt-3 text-sm text-zinc-500 tracking-wide uppercase">
          Initializing monitoring system
        </p>

        {/* LOADING BAR */}
        <div className="w-72 h-[4px] bg-zinc-800 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-yellow-400 animate-loading-bar rounded-full" />
        </div>

        {/* STATUS */}
        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-600">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />

          <span>Connecting to energy services...</span>
        </div>
      </div>
    </div>
  );
}