"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PricingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Free</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Get Started</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pro</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Upgrade</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Enterprise</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full">Contact Sales</Button>
        </CardContent>
      </Card>
    </div>
  );
}

