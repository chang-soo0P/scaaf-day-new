"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RuleBuilderModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function RuleBuilderModal({ open, onOpenChange }: RuleBuilderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rule Builder</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">Rule builder coming soon...</p>
      </DialogContent>
    </Dialog>
  );
}

