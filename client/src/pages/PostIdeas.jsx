import React, { useState, useEffect } from "react";
import api from "@/api/client";
import { Lightbulb, Sparkles, ChevronDown, ChevronUp, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import PostVariantCard from "@/components/posts/PostVariantCard";

export default function PostIdeas() {
  const [subject, setSubject] = useState("");
  const [tone, setTone] = useState("professionnel");
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.get('/posts');
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to load history", error);
    }
  };

  const handleGenerate = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setVariants(null);

    try {
      const response = await api.post('/posts/generate', { topic: subject, tone });
      const newPost = response.data;
      
      setVariants({
        variant_1: newPost.variants[0]?.content || "Erreur de génération",
        variant_2: newPost.variants[1]?.content || "Erreur de génération",
        variant_3: newPost.variants[2]?.content || "Erreur de génération",
      });

      loadHistory();
    } catch (error) {
      console.error("Failed to generate posts", error);
      alert("Une erreur est survenue lors de la génération.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      loadHistory();
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  return (
    <div>
      <PageHeader
        icon={Lightbulb}
        title="Idées de posts"
        description="Décrivez un sujet et l'IA génère 3 variantes de post LinkedIn"
      />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sujet ou brouillon
            </label>
            <Textarea
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Les tendances du marketing digital en 2025, l'importance du personal branding..."
              rows={4}
              className="resize-none text-sm"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full sm:w-48">
              <label className="block text-sm font-medium text-slate-700 mb-2">Ton</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                  <SelectItem value="inspirant">Inspirant</SelectItem>
                  <SelectItem value="décontracté">Décontracté</SelectItem>
                  <SelectItem value="storytelling">Storytelling</SelectItem>
                  <SelectItem value="éducatif">Éducatif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={loading || !subject.trim()}
              className="gap-2 h-10 px-6"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              {loading ? "Génération..." : "Générer 3 variantes"}
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p className="text-sm text-slate-500">L'IA rédige vos posts avec Ollama...</p>
            </div>
          </div>
        )}

        {variants && !loading && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-800">Vos 3 variantes</h2>
            <PostVariantCard label="Variante 1" content={variants.variant_1} index={0} />
            <PostVariantCard label="Variante 2" content={variants.variant_2} index={1} />
            <PostVariantCard label="Variante 3" content={variants.variant_3} index={2} />
          </div>
        )}

        {history.length > 0 && (
          <div className="border-t border-slate-200 pt-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              Historique ({history.length})
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                {history.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                    <button
                      onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{post.topic}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {post.tone && ` · ${post.tone}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(post.id);
                          }}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                        {expandedId === post.id ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>
                    {expandedId === post.id && (
                      <div className="px-4 pb-4 space-y-3">
                        <PostVariantCard label="Variante 1" content={post.variants[0]?.content} index={0} />
                        <PostVariantCard label="Variante 2" content={post.variants[1]?.content} index={1} />
                        <PostVariantCard label="Variante 3" content={post.variants[2]?.content} index={2} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}