import React from "react";

export default function PageHeader({ icon: Icon, title, description }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
        )}
        <h1 className="text-2xl font-heading font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>
      {description && (
        <p className="text-sm text-slate-500 ml-[52px]">{description}</p>
      )}
    </div>
  );
}