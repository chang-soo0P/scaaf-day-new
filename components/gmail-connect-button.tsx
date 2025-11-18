"use client";

import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

interface GmailConnectButtonProps {
  onClick?: () => void;
  className?: string;
}

export function GmailConnectButton({ onClick, className }: GmailConnectButtonProps) {
  return (
    <Button onClick={onClick} className={className}>
      <Mail className="mr-2 h-4 w-4" />
      Connect Gmail
    </Button>
  );
}

