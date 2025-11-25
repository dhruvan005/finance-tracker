import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

export function DashboardEmptyState() {
  return (
    <Card className="mt-8 border border-border/50">
      <CardContent className="py-16">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <DollarSign className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No data yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Start by adding your income and expenses to see comprehensive insights and analytics here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
