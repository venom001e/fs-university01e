"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Edit3, Save, X, Copy, Check, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import EditableFormTitle from "@/components/editable-form-title";

interface Question {
  id: string;
  text: string;
  placeholder: string;
  type: string;
  order: number;
  options: Option[];
  mandatory: boolean;
}

interface Option {
  id: string;
  optionText: string;
  order: number;
}

interface Form {
  id: string;
  title: string;
  published: boolean;
}

interface QuestionFormProps {
  questions: Question[];
  form: Form;
  createShortResponseQuestion: (formId: string, questionOrder: number) => Promise<any>;
  deleteOption: (questionId: string, optionId: string, formId: string) => Promise<any>;
  deleteQuestion: (formId: string, questionId: string) => Promise<any>;
  tooglePublishFormFromUser: (formId: string) => Promise<any>;
  createOptionQuestion: (formId: string, questionOrder: number) => Promise<any>;
  updateOptionText: (optionText: string, optionId: string, questionId: string, formId: string) => Promise<any>;
  createOption: (questionId: string, optionText: string) => Promise<any>;
  host: string;
  createMultipleOptionQuestion: ({ formId, questionOrder }: { formId: string; questionOrder: number }) => Promise<any>;
  updateFormFromUser: (formId: string, title: string) => Promise<any>;
  updateQuestionFromUser: (formId: string, questionId: string, placeholder: string | null, text: string | null, mandatory: boolean | null) => Promise<any>;
}

export default function QuestionForm({
  questions: initialQuestions,
  form,
  createShortResponseQuestion,
  deleteOption,
  deleteQuestion,
  tooglePublishFormFromUser,
  createOptionQuestion,
  updateOptionText,
  createOption,
  host,
  createMultipleOptionQuestion,
  updateFormFromUser,
  updateQuestionFromUser,
}: QuestionFormProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editingOption, setEditingOption] = useState<string | null>(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newOptionText, setNewOptionText] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(initialQuestions);
  }, [initialQuestions]);

  const publicUrl = `${host}/forms/viewform/${form.id}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Form link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        toast({
          title: "Link Copied!",
          description: "Form link has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        toast({
          title: "Copy Failed",
          description: "Please copy the link manually.",
          variant: "destructive",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  const shareForm = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: form.title || 'My Form',
          text: 'Check out my form!',
          url: publicUrl,
        });
      } catch (err) {
        // User cancelled sharing or sharing not supported
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const formTitleDebounced = useCallback(
    async (formId: string, title: string) => {
      try {
        await updateFormFromUser(formId, title);
        toast({
          title: "Success",
          description: "Form title updated successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update form title",
          variant: "destructive",
        });
      }
    },
    [updateFormFromUser, toast]
  );

  const handleAddQuestion = async (type: "SHORT_RESPONSE" | "SELECT_ONE_OPTION" | "SELECT_MULTIPLE_OPTIONS") => {
    try {
      const questionOrder = questions.length + 1;

      if (type === "SHORT_RESPONSE") {
        await createShortResponseQuestion(form.id, questionOrder);
      } else if (type === "SELECT_ONE_OPTION") {
        await createOptionQuestion(form.id, questionOrder);
      } else if (type === "SELECT_MULTIPLE_OPTIONS") {
        await createMultipleOptionQuestion({ formId: form.id, questionOrder });
      }

      // Refresh the page to get updated data
      window.location.reload();
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(form.id, questionId);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddOption = async (questionId: string) => {
    if (!newOptionText.trim()) return;

    try {
      await createOption(questionId, newOptionText);
      setNewOptionText("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding option:", error);
    }
  };

  const handleDeleteOption = async (questionId: string, optionId: string) => {
    try {
      await deleteOption(questionId, optionId, form.id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting option:", error);
    }
  };

  const handleUpdateOption = async (optionText: string, optionId: string, questionId: string) => {
    try {
      await updateOptionText(optionText, optionId, questionId, form.id);
      setEditingOption(null);
      window.location.reload();
    } catch (error) {
      console.error("Error updating option:", error);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await tooglePublishFormFromUser(form.id);
      window.location.reload();
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo.png"
              alt="FS University Logo"
              width={150}
              height={50}
              className="mx-auto"
            />
          </div>
          <div className="text-center">
            <div className="mb-2">
              <EditableFormTitle
                value={form.title || "Untitled Form"}
                formTitleDebounced={formTitleDebounced}
                formId={form.id}
              />
            </div>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant={form.published ? "default" : "secondary"}>
                {form.published ? "Published" : "Draft"}
              </Badge>
              <Button
                onClick={handleTogglePublish}
                variant={form.published ? "destructive" : "default"}
                size="sm"
              >
                {form.published ? "Unpublish" : "Publish"}
              </Button>
            </div>

            {/* Copy Link Section - Only show when published */}
            {form.published && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-green-800">🎉 Form Published!</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy Link"}
                    </Button>
                    <Button
                      onClick={shareForm}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
                <div className="bg-white p-3 rounded border">
                  <p className="text-sm text-gray-600 break-all font-mono">
                    {publicUrl}
                  </p>
                </div>
                <p className="text-sm text-green-700 mt-2">
                  Share this link with others to collect responses!
                </p>
              </div>
            )}

            {!form.published && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
                <p className="text-blue-800">
                  📝 <strong>Publish your form</strong> to get a shareable link and start collecting responses!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Questions */}
          {questions.map((question) => (
            <Card key={question.id} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">
                  Question {question.order}
                  <Badge variant="outline" className="ml-2">
                    {question.type.replace("_", " ")}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question Text
                    </label>
                  <Input
                    value={question.text}
                    placeholder="Enter your question"
                    className="w-full"
                  />
                  <div className="mt-2 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={question.mandatory}
                      onChange={async (e) => {
                        const newMandatory = e.target.checked;
                        try {
                          await updateQuestionFromUser(form.id, question.id, null, null, newMandatory);
                          // Update local state
                          setQuestions(questions.map(q =>
                            q.id === question.id ? { ...q, mandatory: newMandatory } : q
                          ));
                          toast({
                            title: "Success",
                            description: "Question updated successfully!",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to update question",
                            variant: "destructive",
                          });
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <label className="text-sm font-medium text-gray-700">Required</label>
                  </div>
                  </div>

                  {question.type === "SHORT_RESPONSE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Placeholder
                      </label>
                      <Input
                        value={question.placeholder}
                        placeholder="Enter placeholder text"
                        className="w-full"
                      />
                    </div>
                  )}

                  {(question.type === "SELECT_ONE_OPTION" || question.type === "SELECT_MULTIPLE_OPTIONS") && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Options
                        </label>
                        <div className="flex gap-2">
                          <Input
                            value={newOptionText}
                            onChange={(e) => setNewOptionText(e.target.value)}
                            placeholder="Add new option"
                            className="w-48"
                          />
                          <Button
                            onClick={() => handleAddOption(question.id)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option) => (
                          <div key={option.id} className="flex items-center gap-2">
                            <Input
                              value={option.optionText}
                              onChange={(e) => {
                                const updatedQuestions = questions.map(q =>
                                  q.id === question.id
                                    ? {
                                        ...q,
                                        options: q.options.map(o =>
                                          o.id === option.id
                                            ? { ...o, optionText: e.target.value }
                                            : o
                                        )
                                      }
                                    : q
                                );
                                setQuestions(updatedQuestions);
                              }}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateOption(option.optionText, option.id, question.id)}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOption(question.id, option.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Question Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Add New Question</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleAddQuestion("SHORT_RESPONSE")}
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                >
                  <span className="text-2xl mb-1">📝</span>
                  <span>Short Answer</span>
                </Button>
                <Button
                  onClick={() => handleAddQuestion("SELECT_ONE_OPTION")}
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                >
                  <span className="text-2xl mb-1">🔘</span>
                  <span>Multiple Choice</span>
                </Button>
                <Button
                  onClick={() => handleAddQuestion("SELECT_MULTIPLE_OPTIONS")}
                  className="h-20 flex flex-col items-center justify-center"
                  variant="outline"
                >
                  <span className="text-2xl mb-1">☑️</span>
                  <span>Checkboxes</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
