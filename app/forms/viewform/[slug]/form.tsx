"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";

import { type Form, Prisma, type Option } from "@prisma/client";

type QuestionWithOptions = Prisma.QuestionGetPayload<{
  include: {
    options: true;
  };
}> & {
  mandatory: boolean;
};

type ShortResponseAnswer = {
  type: "SHORT_RESPONSE";
  optionId: null;
  text: string;
  optionIds: null;
};

type OneOptionAnswer = {
  type: "SELECT_ONE_OPTION";
  optionId: string;
  text: string;
  optionIds: null;
};

type SelectMultipleOptionsAnwer = {
  type: "SELECT_MULTIPLE_OPTIONS";
  optionIds: string[];
  optionId: null;
  text: string;
};

type Accumulator = {
  [key: string]:
    | ShortResponseAnswer
    | OneOptionAnswer
    | SelectMultipleOptionsAnwer;
};

type SetAnswers = React.Dispatch<React.SetStateAction<Accumulator>>;

export default function Form({
  questions,
  submitForm,
  formId,
}: {
  questions: QuestionWithOptions[];
  submitForm: any;
  formId: string;
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(
    questions.reduce<Accumulator>((acc, question) => {
      if (question.type === "SHORT_RESPONSE") {
        acc[question.id] = {
          type: "SHORT_RESPONSE",
          optionId: null,
          text: "",
          optionIds: null,
        };
      } else if (question.type === "SELECT_ONE_OPTION") {
        acc[question.id] = {
          type: "SELECT_ONE_OPTION",
          optionId: "",
          text: "",
          optionIds: null,
        };
      } else if (question.type === "SELECT_MULTIPLE_OPTIONS") {
        acc[question.id] = {
          type: "SELECT_MULTIPLE_OPTIONS",
          optionId: null,
          text: "",
          optionIds: [],
        };
      }
      return acc;
    }, {})
  );

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQuestionData = questions[currentQuestion];

  const handleNext = () => {
    // Validate current question if mandatory
    const currentQ = questions[currentQuestion];
    const currentAnswer = answers[currentQ.id];

    if (currentQ.mandatory) {
      if (currentQ.type === "SHORT_RESPONSE" && (!currentAnswer.text || currentAnswer.text.trim() === "")) {
        alert("This question is required. Please provide an answer.");
        return;
      }
      if (currentQ.type === "SELECT_ONE_OPTION" && (!currentAnswer.optionId || currentAnswer.optionId === "")) {
        alert("This question is required. Please select an option.");
        return;
      }
      if (currentQ.type === "SELECT_MULTIPLE_OPTIONS" && (!currentAnswer.optionIds || currentAnswer.optionIds.length === 0)) {
        alert("This question is required. Please select at least one option.");
        return;
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    // Validate all mandatory questions before submit
    for (const question of questions) {
      const answer = answers[question.id];
      if (question.mandatory) {
        if (question.type === "SHORT_RESPONSE" && (!answer.text || answer.text.trim() === "")) {
          alert(`Question "${question.text}" is required. Please provide an answer.`);
          setCurrentQuestion(questions.indexOf(question));
          return;
        }
        if (question.type === "SELECT_ONE_OPTION" && (!answer.optionId || answer.optionId === "")) {
          alert(`Question "${question.text}" is required. Please select an option.`);
          setCurrentQuestion(questions.indexOf(question));
          return;
        }
        if (question.type === "SELECT_MULTIPLE_OPTIONS" && (!answer.optionIds || answer.optionIds.length === 0)) {
          alert(`Question "${question.text}" is required. Please select at least one option.`);
          setCurrentQuestion(questions.indexOf(question));
          return;
        }
      }
    }
    await submitForm(answers, formId);
    router.push(`/forms/success/${formId}`);
  };

  const renderQuestion = (question: QuestionWithOptions) => {
    if (question.type === "SHORT_RESPONSE") {
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-lg md:text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {question.text}{question.mandatory ? " *" : ""}
          </div>
          <Input
            onChange={(e) => {
              const newValue = e.target.value;
              setAnswers((prevAnswers) => ({
                ...prevAnswers,
                [question.id]: {
                  ...prevAnswers[question.id],
                  text: newValue,
                  type: "SHORT_RESPONSE",
                  optionId: null,
                  optionIds: null,
                },
              }));
            }}
            placeholder={question.placeholder ? question.placeholder : "Type your answer here..."}
            className="w-full p-3 md:p-4 text-base md:text-lg border-2 border-gray-200 rounded-xl md:rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-sm hover:shadow-md"
            value={answers[question.id]?.text || ""}
          />
        </div>
      );
    } else if (question.type === "SELECT_ONE_OPTION") {
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-lg md:text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {question.text}
          </div>
          <QuestionRadioGroup
            setAnswers={setAnswers}
            options={question.options}
            questionId={question.id}
            selectedValue={answers[question.id]?.optionId || ""}
          />
        </div>
      );
    } else if (question.type === "SELECT_MULTIPLE_OPTIONS") {
      return (
        <div className="space-y-3 md:space-y-4">
          <div className="text-lg md:text-xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {question.text}
          </div>
          <QuestionChexbox
            setAnswers={setAnswers}
            options={question.options}
            questionId={question.id}
            selectedValues={answers[question.id]?.optionIds || []}
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Modern Design - Responsive */}
      <div className="bg-white shadow-lg border-b border-gray-200 px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            className="flex items-center text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-purple-600 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2" />
            <span className="font-medium hidden sm:inline">Back</span>
          </button>
          <div className="text-center flex-1 mx-4">
            <div className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 truncate px-2">
              {questions[currentQuestion]?.text?.substring(0, 25)}...
            </div>
            <div className="w-32 md:w-56 bg-gray-200 rounded-full h-2 md:h-3 shadow-inner mx-auto">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 md:h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Question Content - Enhanced Design - Responsive - No Scroll Needed */}
      <div className="max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-xl md:shadow-2xl border border-gray-100 transform hover:scale-[1.01] md:hover:scale-[1.02] transition-all duration-300">
          {renderQuestion(currentQuestionData)}
        </div>
      </div>

      {/* Bottom Navigation - Enhanced Design - Responsive */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 px-4 md:px-6 py-3 md:py-4">
        <div className="max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto flex items-center justify-between">
          <Button
            onClick={handleBack}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-3 md:px-6 py-2 md:py-3 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed border-2 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
          >
            &lt; Back
          </Button>
          
          <div className="text-center hidden sm:block">
            <div className="text-xs md:text-sm font-semibold text-gray-600 mb-1">
              QUESTION {currentQuestion + 1} OF {questions.length}
            </div>
            <div className="w-20 md:w-24 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center sm:hidden text-xs text-gray-500">
            {currentQuestion + 1}/{questions.length}
          </div>

          {currentQuestion === questions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Send &gt;
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 px-4 md:px-8 py-2 md:py-3 text-sm md:text-base text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Next &gt;
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const QuestionRadioGroup = ({
  options,
  setAnswers,
  questionId,
  selectedValue,
}: {
  options: Option[];
  setAnswers: SetAnswers;
  questionId: string;
  selectedValue: string;
}) => {
  return (
    <RadioGroup
      value={selectedValue}
      onValueChange={(value) => {
        setAnswers((prevAnswers) => ({
          ...prevAnswers,
          [questionId]: {
            ...prevAnswers[questionId],
            optionId: value,
            type: "SELECT_ONE_OPTION",
            text: "",
            optionIds: null,
          },
        }));
      }}
      className="space-y-1"
    >
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <RadioGroupItem
            value={option.id}
            id={option.id}
            className="w-3 h-3 text-purple-600 border border-gray-300"
          />
          <label
            htmlFor={option.id}
            className="text-sm text-gray-700 cursor-pointer flex-1 py-1 px-2 rounded border border-gray-200 hover:border-purple-300 transition-all"
          >
            {option.optionText}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
};

const QuestionChexbox = ({
  options,
  setAnswers,
  questionId,
  selectedValues,
}: {
  options: Option[];
  setAnswers: SetAnswers;
  questionId: string;
  selectedValues: string[];
}) => {
  return (
    <div className="space-y-1">
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={selectedValues.includes(option.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setAnswers((prevAnswers) => ({
                  ...prevAnswers,
                  [questionId]: {
                    ...prevAnswers[questionId],
                    optionIds: [...(selectedValues || []), option.id],
                    type: "SELECT_MULTIPLE_OPTIONS",
                    text: "",
                    optionId: null,
                  },
                }));
              } else {
                setAnswers((prevAnswers) => ({
                  ...prevAnswers,
                  [questionId]: {
                    ...prevAnswers[questionId],
                    optionIds: (selectedValues || []).filter((id) => id !== option.id),
                    type: "SELECT_MULTIPLE_OPTIONS",
                    text: "",
                    optionId: null,
                  },
                }));
              }
            }}
            className="w-3 h-3 text-purple-600 border border-gray-300 rounded"
          />
          <label
            htmlFor={option.id}
            className="text-sm text-gray-700 cursor-pointer flex-1 py-1 px-2 rounded border border-gray-200 hover:border-purple-300 transition-all"
          >
            {option.optionText}
          </label>
        </div>
      ))}
    </div>
  );
};
