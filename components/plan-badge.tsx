"use client";

import { Badge } from "@/components/ui/badge";

interface PlanBadgeProps {
  plan?: string;
}

export default function PlanBadge({ plan = "Free" }: PlanBadgeProps) {
  return <Badge variant="secondary">{plan}</Badge>;
}

