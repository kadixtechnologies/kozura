import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Group = { type: string; values: { value: string; modifier: number }[] };

export function VariantBuilder() {
  const [groups, setGroups] = useState<Group[]>([
    { type: "Color", values: [
      { value: "Black", modifier: 0 }, { value: "Silver", modifier: 0 }, { value: "Gold", modifier: 5000 },
    ]},
    { type: "Storage", values: [
      { value: "128GB", modifier: 0 }, { value: "256GB", modifier: 50000 }, { value: "512GB", modifier: 120000 },
    ]},
  ]);
  const [adding, setAdding] = useState(false);
  const [newType, setNewType] = useState("");
  const [newValues, setNewValues] = useState("");

  const addGroup = () => {
    if (!newType.trim() || !newValues.trim()) return;
    setGroups([...groups, {
      type: newType,
      values: newValues.split(",").map((v) => ({ value: v.trim(), modifier: 0 })),
    }]);
    setNewType(""); setNewValues(""); setAdding(false);
  };

  return (
    <div className="space-y-3">
      {groups.map((g, gi) => (
        <div key={gi} className="border border-border/60 rounded-2xl p-4 bg-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="font-medium text-sm">{g.type}</div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setGroups(groups.filter((_, i) => i !== gi))}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {g.values.map((v, vi) => (
              <div key={vi} className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-background border border-border px-3 py-1 text-xs font-medium min-w-[100px]">{v.value}</span>
                <span className="text-xs text-muted-foreground">+₦</span>
                <Input type="number" defaultValue={v.modifier} className="h-8 w-32 rounded-lg" />
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
            <Button size="sm" onClick={addGroup}>Add</Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add variant group
        </Button>
      )}
    </div>
  );
}
