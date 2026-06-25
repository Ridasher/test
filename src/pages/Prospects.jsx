import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Search, Plus, Trash2, ExternalLink, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PageHeader from "@/components/shared/PageHeader";

export default function Prospects() {
  const [searchKeywords, setSearchKeywords] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [prospects, setProspects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProspect, setNewProspect] = useState({
    name: "",
    linkedin_url: "",
    position: "",
    company: "",
    sector: "",
    city: "",
    notes: "",
    rating: 3,
  });

  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    const items = await base44.entities.Prospect.list("-created_date", 50);
    setProspects(items);
  };

  const handleLinkedInSearch = () => {
    const parts = [];
    if (searchKeywords.trim()) parts.push(searchKeywords.trim());
    if (searchPosition.trim()) parts.push(searchPosition.trim());
    if (searchCity.trim()) parts.push(searchCity.trim());
    if (parts.length === 0) return;

    const query = encodeURIComponent(parts.join(" "));
    const url = `https://www.linkedin.com/search/results/people/?keywords=${query}`;
    window.open(url, "_blank");
  };

  const handleAddProspect = async () => {
    if (!newProspect.name.trim()) return;
    await base44.entities.Prospect.create(newProspect);
    setNewProspect({
      name: "",
      linkedin_url: "",
      position: "",
      company: "",
      sector: "",
      city: "",
      notes: "",
      rating: 3,
    });
    setDialogOpen(false);
    loadProspects();
  };

  const handleDeleteProspect = async (id) => {
    await base44.entities.Prospect.delete(id);
    loadProspects();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        icon={Users}
        title="Recherche de prospects"
        description="Recherchez sur LinkedIn et notez vos prospects manuellement"
      />

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-slate-700">Recherche LinkedIn</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Mots-clés</label>
              <Input
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                placeholder="Ex: développeur, marketing..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Poste</label>
              <Input
                value={searchPosition}
                onChange={(e) => setSearchPosition(e.target.value)}
                placeholder="Ex: CTO, DRH..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Ville</label>
              <Input
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Ex: Paris, Lyon..."
              />
            </div>
          </div>
          <Button onClick={handleLinkedInSearch} className="gap-2">
            <Search className="w-4 h-4" />
            Rechercher sur LinkedIn
            <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-60" />
          </Button>
          <p className="text-xs text-slate-400">
            Ouvre la recherche LinkedIn dans un nouvel onglet — naviguez et notez vos prospects ci-dessous.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Mes prospects ({prospects.length})
          </h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Ajouter un prospect</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Nom *</label>
                    <Input
                      value={newProspect.name}
                      onChange={(e) => setNewProspect({ ...newProspect, name: e.target.value })}
                      placeholder="Nom complet"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Entreprise</label>
                    <Input
                      value={newProspect.company}
                      onChange={(e) => setNewProspect({ ...newProspect, company: e.target.value })}
                      placeholder="Entreprise"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Lien LinkedIn</label>
                  <Input
                    value={newProspect.linkedin_url}
                    onChange={(e) => setNewProspect({ ...newProspect, linkedin_url: e.target.value })}
                    placeholder="https://www.linkedin.com/in/..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Poste</label>
                    <Input
                      value={newProspect.position}
                      onChange={(e) => setNewProspect({ ...newProspect, position: e.target.value })}
                      placeholder="CTO"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Secteur</label>
                    <Input
                      value={newProspect.sector}
                      onChange={(e) => setNewProspect({ ...newProspect, sector: e.target.value })}
                      placeholder="Tech"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1.5">Ville</label>
                    <Input
                      value={newProspect.city}
                      onChange={(e) => setNewProspect({ ...newProspect, city: e.target.value })}
                      placeholder="Paris"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Notes</label>
                  <Textarea
                    value={newProspect.notes}
                    onChange={(e) => setNewProspect({ ...newProspect, notes: e.target.value })}
                    placeholder="Notes sur ce prospect..."
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Intérêt : {newProspect.rating}/5
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <button
                        key={i}
                        onClick={() => setNewProspect({ ...newProspect, rating: i })}
                        className="p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            i <= newProspect.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 hover:text-amber-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={handleAddProspect} disabled={!newProspect.name.trim()} className="w-full">
                  Ajouter le prospect
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {prospects.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">Aucun prospect noté pour le moment</p>
            <p className="text-xs text-slate-400 mt-1">
              Lancez une recherche LinkedIn puis ajoutez vos prospects ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {prospects.map((prospect) => (
              <div
                key={prospect.id}
                className="bg-white rounded-xl border border-slate-200/80 p-4 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">
                    {prospect.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800 text-sm">{prospect.name}</span>
                    {prospect.rating && renderStars(prospect.rating)}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {prospect.position && (
                      <span className="text-xs text-slate-500">{prospect.position}</span>
                    )}
                    {prospect.position && prospect.company && (
                      <span className="text-xs text-slate-300">·</span>
                    )}
                    {prospect.company && (
                      <span className="text-xs text-slate-500">{prospect.company}</span>
                    )}
                    {(prospect.position || prospect.company) && prospect.city && (
                      <span className="text-xs text-slate-300">·</span>
                    )}
                    {prospect.city && (
                      <span className="text-xs text-slate-500">{prospect.city}</span>
                    )}
                  </div>
                  {prospect.notes && (
                    <p className="text-xs text-slate-400 mt-1.5">{prospect.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {prospect.linkedin_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(prospect.linkedin_url, "_blank")}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteProspect(prospect.id)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}