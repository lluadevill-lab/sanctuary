import type { Achievement } from "@/types";

export default function AchievementBadge({
  achievement,
  unlocked,
}: {
  achievement: Achievement;
  unlocked: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors ${
        unlocked
          ? "border-gold/50 bg-gold/10"
          : "border-void-line bg-void-panel/40 opacity-50 grayscale"
      }`}
    >
      <span className="text-3xl">{achievement.icon}</span>
      <h4 className={`font-display text-sm ${unlocked ? "text-gold-bright" : "text-parchment/60"}`}>
        {achievement.title}
      </h4>
      <p className="text-xs text-parchment/50">{achievement.description}</p>
      {!unlocked && (
        <span className="text-[10px] uppercase tracking-wider text-parchment/30">
          Bloqueada
        </span>
      )}
    </div>
  );
}
