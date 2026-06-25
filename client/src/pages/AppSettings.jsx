import React from "react";
import { Settings, Info } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function AppSettings() {
  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Paramètres"
        description="Configuration de votre assistant"
      />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">À propos</h3>
          <div className="bg-blue-50/60 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-sm text-slate-600">
              <p>
                <strong>LinkedIn IA Assistant</strong> est votre outil personnel pour préparer du contenu LinkedIn de qualité.
              </p>
              <ul className="space-y-1 list-disc list-inside text-xs text-slate-500">
                <li>Générez des posts LinkedIn avec l'IA</li>
                <li>Créez des brouillons de messages personnalisés</li>
                <li>Notez vos prospects après recherche manuelle</li>
                <li>Aucune connexion automatique à LinkedIn — vous gardez le contrôle</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-700">Comment ça marche</h3>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-blue-600">1</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Idées de posts</p>
                <p className="text-xs text-slate-500">Décrivez un sujet, l'IA génère 3 variantes que vous copiez dans LinkedIn.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-violet-600">2</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Brouillons de messages</p>
                <p className="text-xs text-slate-500">Indiquez le destinataire et le contexte, recevez un message prêt à copier.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-emerald-600">3</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">Prospects</p>
                <p className="text-xs text-slate-500">Lancez une recherche LinkedIn, puis notez manuellement vos prospects ici.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/60 rounded-2xl border border-amber-200/60 p-6 space-y-2">
          <h3 className="text-sm font-semibold text-amber-800">⚠️ Respect des conditions LinkedIn</h3>
          <p className="text-xs text-amber-700 leading-relaxed">
            Cette application ne se connecte pas automatiquement à votre compte LinkedIn, ne scrape aucune donnée et n'envoie aucun message automatiquement.
            Tous les posts et messages sont copiés manuellement par vous. La recherche de prospects ouvre simplement la page de recherche standard de LinkedIn.
          </p>
        </div>
      </div>
    </div>
  );
}