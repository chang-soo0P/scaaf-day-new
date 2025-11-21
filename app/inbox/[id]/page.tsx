"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function InboxDetailPage() {
  const { id } = useParams();
  const [message, setMessage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch(`/api/gmail/message?id=${id}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load message");
        }

        const data = await res.json();
        setMessage(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
      </div>
    );
  }

  if (!message) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{message.subject}</h1>

      <Card>
        <CardHeader>
          <div className="text-gray-600 text-sm">
            From: {message.from}
          </div>
          <div className="text-gray-500 text-sm">
            Date: {message.date}
          </div>
        </CardHeader>

        <CardContent>
          <div className="whitespace-pre-line text-sm text-gray-800 leading-6">
            {message.body}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
