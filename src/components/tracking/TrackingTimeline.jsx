import { Check } from "lucide-react";
import { STAGES } from "../../context/OrderContext";

export default function TrackingTimeline({ currentStage }) {
  return (
    <ol className="relative">
      {STAGES.map((label, i) => {
        const done = i < currentStage;
        const active = i === currentStage;
        return (
          <li key={label} className="flex gap-3 pb-4 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                ${done ? "bg-primary text-white" : active ? "bg-primary-light text-primary ring-4 ring-primary/15" : "bg-gray-100 text-muted"}`}>
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < STAGES.length - 1 && <div className={`w-0.5 flex-1 mt-1 ${done ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
            <div className="pt-0.5">
              <div className={`text-sm font-medium ${active ? "text-primary" : done ? "text-ink" : "text-muted"}`}>{label}</div>
              {active && <div className="text-[11px] text-primary">In progress…</div>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}