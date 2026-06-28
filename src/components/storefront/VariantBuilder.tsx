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

  const removeValue = (gi: number, vi: number) => {
    const newGroups = [...groups];
    newGroups[gi] = { ...newGroups[gi], values: newGroups[gi].values.filter((_, i) => i !== vi) };
    
    // If no values left, remove the entire group
    if (newGroups[gi].values.length === 0) {
      updateGroups(newGroups.filter((_, i) => i !== gi));
    } else {
      updateGroups(newGroups);
    }
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
                <span className="inline-flex items-center justify-between rounded-full bg-background border border-border px-3 py-1 text-xs font-medium min-w-[100px]">
                  <span>{v.value}</span>
                  <button type="button" onClick={() => removeValue(gi, vi)} className="ml-2 text-muted-foreground hover:text-destructive shrink-0">
                    <X className="h-3 w-3" />
                  </button>
                </span>
                <span className="text-xs text-muted-foreground">+₦</span>
                <Input type="number" defaultValue={v.modifier} onChange={(e) => updateModifier(gi, vi, Number(e.target.value))} className="h-8 sm:h-9 w-24 sm:w-32 rounded-lg text-[13px] sm:text-sm" />
              </div>
            ))}
          </div>
        </div>
      ))}
      {adding ? (
        <div className="border border-border/60 rounded-2xl p-4 space-y-3 bg-muted/20">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] sm:text-xs text-muted-foreground">Type</Label>
              <Input className="rounded-xl mt-1.5 h-9 sm:h-10 text-[13px] sm:text-sm" placeholder="e.g. Size" value={newType} onChange={(e) => setNewType(e.target.value)} />
            </div>
            <div>
              <Label className="text-[11px] sm:text-xs text-muted-foreground">Values (comma separated)</Label>
              <Input className="rounded-xl mt-1.5 h-9 sm:h-10 text-[13px] sm:text-sm" placeholder="S, M, L" value={newValues} onChange={(e) => setNewValues(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={addGroup} type="button">Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)} type="button">Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setAdding(true)} className="gap-2 rounded-xl h-8 text-[11px] sm:text-xs" type="button">
          <Plus className="h-4 w-4" /> Add variant group
        </Button>
      )}
    </div>
  );
}
