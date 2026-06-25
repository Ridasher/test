import React from "react";
import CopyButton from "@/components/shared/CopyButton";

export default function PostVariantCard({ label, content, index }) {
  const colors = [
    "from-blue-500/5 to-blue-500/0 border-blue-200/60",
    "from-violet-500/5 to-violet-500/0 border-violet-200/60",
    "from-emerald-500/5 to-emerald-500/0 border-emerald-200/60",
  ];

  return (
    <div className={`rounded-xl border bg-gradient-to-br ${colors[index % 3]} p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <CopyButton text={content} />
      </div>
      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
        {content}
      </div>
    </div>
  );
}