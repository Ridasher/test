import React, { useState, useEffect } from "react";
import api from "@/api/client";
import { MessageSquare, Sparkles, Trash2, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/shared/PageHeader";
import CopyButton from "@/components/shared/CopyButton";

const contextLabels = {
  prise_de_contact: "Prise de contact",
  suivi: "Suivi",
  remerciement: "Remerciement",
  proposition: "Proposition",
  autre: "Autre",
};

const contextColors = {
  prise_de_contact: "bg-blue-50 text-blue-700 border-blue-200",
  suivi: "bg-amber-50 text-amber-700 border-amber-200",
  remerciement: "bg-emerald-50 text-emerald-700 border-emerald-200",
  proposition: "bg-violet-50 text-violet-700 border-violet-200",
  autre: "bg-slate-50 text-slate-700 border-slate-200",
};

export default function MessageDrafts() {
  const [recipientName, setRecipientName] = useState("");
  const [context, setContext] = useState("prise_de_contact");
  const [contextDetails, setContextDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [drafts, setDrafts] = useState([]);

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const response = await api.get('/messages');
      setDrafts(response.data);
    } catch (error) {
      console.error("Failed to load drafts", error);
    }
  };

  const handleGenerate = async () => {
    if (!recipientName.trim()) return;
    setLoading(true);
    setGeneratedMessage("");

    try {
      const response = await api.post('/messages/generate', {
        recipientName,
        context: contextLabels[context],
        contextDetails
      });
      setGeneratedMessage(response.data.content);
    } catch (error) {
      console.error("Failed to generate message", error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedMessage) return;
    try {
      await api.post('/messages', {
        recipientName,
        context,
        contextDetails,
        content: generatedMessage,
        status: "brouillon",
      });
      setRecipientName("");
      setContextDetails("");
      setGeneratedMessage("");
      loadDrafts();
    } catch (error) {
      console.error("Failed to save draft", error);
    }
  };

  const handleDeleteDraft = async (id) => {
    try {
      await api.delete(`/messages/${id}`);
      loadDrafts();
    } catch (error) {
      console.error("Failed to delete draft", error);
    }
  };

  return (
    <div>
      <PageHeader
        icon={MessageSquare}
        title="Brouillons de messages"
        description="Générez des messages LinkedIn personnalisés"
      />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nom du destinataire
              </label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Ex: Marie Dupont"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type de message
              </label>
              <Select value={context} onValueChange={setContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(contextLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Contexte / objectif (optionnel)
            </label>
            <Textarea
              value={contextDetails}
              onChange={(e) => setContextDetails(e.target.value)}
              placeholder="Ex: Je l'ai rencontré(e) à une conférence tech la semaine dernière..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={loading || !recipientName.trim()}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? "Génération..." : "Générer le message"}
          </Button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-slate-500">L'IA rédige votre message avec Ollama...</p>
            </div>
          </div>
        )}

        {generatedMessage && !loading && (
          <div className="bg-white rounded-2xl border border-blue-200/60 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Message généré</h3>
              <div className="flex gap-2">
                <CopyButton text={generatedMessage} />
                <Button size="sm" onClick={handleSaveDraft} className="gap-1.5">
                  Sauvegarder
                </Button>
              </div>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-lg p-4">
              {generatedMessage}
            </div>
          </div>
        )}

        {drafts.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Mes brouillons ({drafts.length})
            </h2>
            <div className="space-y-3">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-white rounded-xl border border-slate-200/80 p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-800 text-sm">{draft.recipientName}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${contextColors[draft.context]}`}>
                        {contextLabels[draft.context]}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${
                        draft.status === "brouillon"
                          ? "bg-slate-50 text-slate-600 border-slate-200"
                          : draft.status === "copié"
                          ? "bg-blue-50 text-blue-600 border-blue-200"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}>
                        {draft.status}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <CopyButton
                        text={draft.content}
                        variant="ghost"
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {draft.content}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(draft.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}