"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Group = { type: string; values: { value: string; modifier: number }[] };

export function VariantBuilder({ defaultGroups = [], onChange }: { defaultGroups?: Group[], onChange?: (groups: Group[]) => void }) {
  const [groups, setGroups] = useState<Group[]>(defaultGroups);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const [newValues, setNewValues] = useState("");

  const updateGroups = (newGroups: Group[]) => {
    setGroups(newGroups);
    if (onChange) onChange(newGroups);
  };

  const addGroup = () => {
    if (!newType.trim() || !newValues.trim()) return;
    updateGroups([...groups, {
      type: newType,
      values: newValues.split(",").map((v) => ({ value: v.trim(), modifier: 0 })),
    }]);
    setNewType(""); setNewValues(""); setAdding(false);
  };

  const updateModifier = (gi: number, vi: number, modifier: number) => {
    const newGroups = [...groups];
    newGroups[gi] = { ...newGroups[gi], values: [...newGroups[gi].values] };
    newGroups[gi].values[vi] = { ...newGroups[gi].values[vi], modifier };
    updateGroups(newGroups);
  };

  const removeGroup = (gi: number) => {
    updateGroups(groups.filter((_, i) => i !== gi));
  };

  return (
    <div className="space-y-3">
      {groups.map((g, gi) => (
        <div key={gi} className="border border-border/60 rounded-2xl p-4 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium text-sm">{g.type}</div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeGroup(gi)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {g.values.map((v, vi) => (
              <div key={vi} className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-background border border-border px-3 py-1 text-xs font-medium min-w-[100px]">{v.value}</span>
                <span className="text-xs text-muted-foreground">+₦</span>
                <Input type="number" defaultValue={v.modifier} onChange={(e) => updateModifier(gi, vi, Number(e.target.value))} className="h-8 w-32 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ))}
      {adding ? (
        <div className="border border-border/60 rounded-2xl p-4 space-y-3 bg-muted/20">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <Input className="rounded-xl mt-1.5" placeholder="e.g. Size" value={newType} onChange={(e) => setNewType(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Values (comma separated)</Label>
              <Input className="rounded-xl mt-1.5" placeholder="S, M, L" value={newValues} onChange={(e) => setNewValues(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addGroup} type="button">Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)} type="button">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)} className="gap-2" type="button">
          <Plus className="h-4 w-4" /> Add variant group
        </Button>
      )}
    </div>
  );
}
