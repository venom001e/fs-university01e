"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TemplateSelector } from "@/components/template-selector";
import { FormTemplate } from "@/lib/templates";
import { createForm } from "@/lib/actions/actions";
import { createFormFromTemplate } from "@/lib/actions/templates";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

export function CreateFormDialog() {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleSelectTemplate = async (template: FormTemplate) => {
    setIsCreating(true);
    try {
      const result = await createFormFromTemplate(template);
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: `Form "${template.name}" created successfully!`,
        });
        setOpen(false);
        router.push(`/forms/${result.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create form from template",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateBlank = async () => {
    setIsCreating(true);
    try {
      const result = await createForm();
      if ("error" in result) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Blank form created successfully!",
        });
        setOpen(false);
        router.push(`/forms/${result.id}`);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blank form",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleGenerateAI = async (prompt: string) => {
    setIsCreating(true);
    try {
      const response = await fetch("/api/generate-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate form");
      }

      toast({
        title: "Success",
        description: "AI generated form created successfully!",
      });
      setOpen(false);
      router.push(`/forms/${data.form.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate AI form",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={isCreating}>
          {isCreating ? "Creating..." : "Create new form"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Form</DialogTitle>
          <DialogDescription>
            Choose a template to get started quickly, or create a blank form from scratch.
          </DialogDescription>
        </DialogHeader>
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onCreateBlank={handleCreateBlank}
          onGenerateAI={handleGenerateAI}
        />
      </DialogContent>
    </Dialog>
  );
}