"use client";

import { useQuery } from "@tanstack/react-query";

export const useGmailMessages = () => {
  return useQuery({
    queryKey: ["gmail-messages"],
    queryFn: async () => {
      const res = await fetch("/api/gmail/messages", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load Gmail messages");
      }

      const data = await res.json();
      return data.data || [];
    },
    staleTime: 2 * 60 * 1000,
  });
};
