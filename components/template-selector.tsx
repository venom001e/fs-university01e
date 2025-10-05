"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FORM_TEMPLATES, getAllCategories, getTemplatesByCategory, type FormTemplate } from "@/lib/templates";

interface TemplateSelectorProps {
  onSelectTemplate: (template: FormTemplate) => void;
  onCreateBlank: () => void;
  onGenerateAI?: (prompt: string) => void;
}

export function TemplateSelector({ onSelectTemplate, onCreateBlank, onGenerateAI }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [showAIPrompt, setShowAIPrompt] = useState<boolean>(false);
  const [showTemplates, setShowTemplates] = useState<boolean>(true);
  const categories = ["All", ...getAllCategories()];

  const filteredTemplates = selectedCategory === "All"
    ? FORM_TEMPLATES
    : getTemplatesByCategory(selectedCategory);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose a Template</h1>
        <p className="text-muted-foreground">
          Start with a pre-built template or create your own from scratch
        </p>
      </div>

      {/* AI Generated Feature - Top Priority */}
      {showTemplates && !showAIPrompt && (
        <div className="mb-8">
          <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => {
            setShowAIPrompt(true);
            setShowTemplates(false);
          }}>
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-blue-600 rounded-full">
                    <span className="text-3xl text-white">🤖</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">AI Form Generator</h3>
                    <p className="text-gray-600 text-lg">Describe your form in plain English and let AI create it instantly</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-blue-600 text-white text-sm px-3 py-1 mb-2">✨ AI Powered</Badge>
                  <p className="text-sm text-gray-500">No coding required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Templates Section */}
      {showTemplates && (
        <>
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectTemplate(template)}
              >
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">{template.icon}</div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{template.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {template.questions.length} questions
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Options Row */}
          <div className="flex justify-center">
            {/* Blank Form Option */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed max-w-sm" onClick={onCreateBlank}>
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <CardTitle className="text-lg">Blank Form</CardTitle>
                <CardDescription className="text-sm">
                  Start with a completely empty form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">Custom</Badge>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* AI Prompt Dialog */}
      {showAIPrompt && (
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowAIPrompt(false);
                    setShowTemplates(true);
                    setAiPrompt("");
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ← Back to Templates
                </Button>
                <div className="p-3 bg-blue-600 rounded-full">
                  <span className="text-2xl text-white">🤖</span>
                </div>
                <div></div> {/* Spacer for centering */}
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
                Describe Your Perfect Form
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Tell our AI what kind of form you need, and we'll create it for you instantly!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Example Prompts */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">💡</span>
                  Example Prompts:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Create a customer feedback form for a restaurant",
                    "Build an event registration form with payment details",
                    "Make a job application form for software developers",
                    "Design a product survey for an e-commerce store",
                    "Create a contact form for a consulting business"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setAiPrompt(example)}
                      className="text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-md border border-gray-200 hover:border-blue-300 transition-colors text-sm text-gray-700 hover:text-blue-700"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Describe your form requirements:
                </label>
                <textarea
                  placeholder="e.g., Create a customer feedback form for a restaurant with questions about food quality, service, ambiance, and overall experience..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none min-h-[120px] text-gray-700 placeholder-gray-400"
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Be as specific as possible for better results. Include question types, options, and any special requirements.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button
                  onClick={() => {
                    if (aiPrompt.trim() && onGenerateAI) {
                      onGenerateAI(aiPrompt);
                      setShowAIPrompt(false);
                      setAiPrompt("");
                    }
                  }}
                  disabled={!aiPrompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="mr-2">✨</span>
                  Generate My Form
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAIPrompt(false);
                    setShowTemplates(true);
                    setAiPrompt("");
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}