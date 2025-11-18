"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export function LockCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Premium Feature
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">This feature is available in premium plans.</p>
      </CardContent>
    </Card>
  );
}

