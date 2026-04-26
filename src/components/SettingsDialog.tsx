import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getApiBase, setApiBase } from "@/lib/api";

export function SettingsDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (open) setUrl(getApiBase());
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>FastAPI Backend URL</DialogTitle>
          <DialogDescription>
            Paste the public base URL of your RejectedIn FastAPI service. The frontend POSTs to <code>/analyze</code> on this host.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="api">Base URL</Label>
          <Input
            id="api"
            placeholder="https://rejectedin-api.onrender.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Stored locally in your browser. Your backend must enable CORS for this origin (it already does:
            <code> allow_origins=["*"]</code>).
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setApiBase(url.trim());
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
