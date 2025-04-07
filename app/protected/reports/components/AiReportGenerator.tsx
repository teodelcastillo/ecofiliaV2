"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Leaf, BarChart, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AiReportGenerator({ selectedProjectId }: { selectedProjectId?: string }) {
  const [reportType, setReportType] = useState("overview");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const reportTypes = [
    { value: "overview", label: "Project Overview", icon: <Leaf className="h-4 w-4" /> },
    { value: "sustainability", label: "Climate Change and Sustainability Filter", icon: <BarChart className="h-4 w-4" /> },
    { value: "inputs", label: "Inputs for Climate Change and Sustainability Annex", icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  const handleGenerate = async () => {
    if (!selectedProjectId || !reportType) {
      toast({ title: "Missing selection", description: "Please select a project and report type.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
    }, 300);

    try {
      const res = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId, reportType }),
      });

      const data = await res.json();
      clearInterval(interval);
      setIsGenerating(false);
      setProgress(100);

      if (res.ok && data?.report) {
        toast({ title: "Report ready", description: "Redirecting to download...", variant: "default" });

        // Esperá 1 segundo y redirigí al visor
        setTimeout(() => {
          router.push(`/projects/${selectedProjectId}/reports`);
        }, 1000);
      } else {
        toast({
          title: "Generation failed",
          description: data?.error || "The report could not be generated.",
          variant: "destructive",
        });
      }
    } catch (err) {
      clearInterval(interval);
      setIsGenerating(false);
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-t-4 border-t-primary shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Report Generator
        </CardTitle>
        <CardDescription>Create professional environmental reports quickly</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            {reportTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isGenerating && <Progress value={progress} className="h-2" />}
      </CardContent>

      <CardFooter>
        <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  );
}
