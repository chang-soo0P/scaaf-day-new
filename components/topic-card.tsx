"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TopicCardProps {
  title?: string;
  description?: string;
}

export function TopicCard({ title = "Topic", description }: TopicCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {description && (
        <CardContent>
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      )}
    </Card>
  );
}

