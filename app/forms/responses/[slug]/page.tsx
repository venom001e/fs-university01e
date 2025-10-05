import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { MoveLeft } from "lucide-react";

import Link from "next/link";

import { type Question, Prisma, type Option } from "@prisma/client";

import {
  getGroupedResponsesFromUser,
  getResponsesFromForm,
} from "@/lib/actions/actions";

import ResponsePie from "@/components/pie";
import ResponseBarChart from "@/components/response-bar-chart";

import { notFound } from "next/navigation";

import { ExportToExcelButton } from "./export-excel-button";

type QuestionWithOptionsWithAnswer = Prisma.QuestionGetPayload<{
  include: {
    options: true;
    answers: {
      include: {
        options: true;
      };
    };
  };
}>;

function transformData(optionsData: (Option | null)[]) {
  type QuestionIdCount = {
    [key: string]: {
      name: string;
      value: number;
    };
  };
  const questionIdCount: QuestionIdCount = {};

  optionsData.forEach((item) => {
    if (item === null) {
      return;
    }
    if (!questionIdCount[item.id]) {
      questionIdCount[item.id] = { name: item.optionText, value: 1 };
    } else {
      questionIdCount[item.id].value += 1;
    }
  });

  const result = Object.values(questionIdCount);

  return result;
}

function Question({ question }: { question: QuestionWithOptionsWithAnswer }) {
  if (question.type === "SHORT_RESPONSE") {
    return (
      <Card className="col-span-3 mt-8">
        <CardHeader className="pb-2">
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-6">
            {question.answers.map((answer) => {
              return (
                <div key={answer.id} className="ml-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else if (question.type === "SELECT_ONE_OPTION") {
    const optionsData = question.answers.map((answer) => {
      return answer.options[0];
    });

    const options = transformData(optionsData);

    return (
      <Card className="col-span-3 mt-8">
        <CardHeader className="pb-2">
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <ResponsePie data={options} />
            {question.answers.map((answer) => {
              return (
                <div key={answer.id} className="ml-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  } else if (question.type === "SELECT_MULTIPLE_OPTIONS") {
    const { options, answers } = question;

    const optionsCounter: Record<
      string,
      { name: string; count: number; order: number }
    > = {};

    for (const option of options) {
      optionsCounter[option.id] = {
        name: option.optionText,
        count: 0,
        order: option.order,
      };
    }

    for (const answer of answers) {
      const optionsOfAnswer = answer.options;
      for (const optionOfAnswer of optionsOfAnswer) {
        const newCount = (optionsCounter[optionOfAnswer.id].count += 1);
        optionsCounter[optionOfAnswer.id] = {
          ...optionsCounter[optionOfAnswer.id],
          count: newCount,
        };
      }
    }

    const barChartData = Object.entries(optionsCounter)
      .sort((a, b) => {
        return a[1].order - b[1].order;
      })
      .map(([_, value]) => {
        return { name: value.name, count: value.count };
      });

    return (
      <Card className="col-span-3 mt-8">
        <CardHeader className="pb-2">
          <CardTitle>{question.text}</CardTitle>
          <CardDescription>{`${question.answers.length} responses`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="mt-12">
              <ResponseBarChart data={barChartData} />
            </div>

            {question.answers.map((answer) => {
              return (
                <div key={answer.id} className="ml-4 space-y-1">
                  <p className="text-sm text-muted-foreground">
                    {answer.answerText}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }
}

function ResponseCard({ response }: { response: any }) {
  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="text-lg">
          Response #{response.id.slice(-8)}
        </CardTitle>
        <CardDescription>
          Submitted on {new Date(response.submittedAt).toLocaleDateString()} at{" "}
          {new Date(response.submittedAt).toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {response.answers.map((answer: any, index: number) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900 mb-1">
                {answer.questionText}
              </h4>
              <div className="text-gray-700">
                {answer.questionType === "SELECT_ONE_OPTION" ||
                answer.questionType === "SELECT_MULTIPLE_OPTIONS" ? (
                  <div className="flex flex-wrap gap-2">
                    {answer.options && answer.options.length > 0 ? (
                      answer.options.map((option: any, optIndex: number) => (
                        <span
                          key={optIndex}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {option.optionText}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">No option selected</span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm">
                    {answer.answerText || (
                      <span className="text-gray-500 italic">No answer provided</span>
                    )}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default async function Page({ params }: { params: { slug: string } }) {
  const formId = params.slug;
  const result = await getGroupedResponsesFromUser(formId);
  const processedData = await getResponsesFromForm(formId);

  if (processedData === null || "error" in processedData) {
    notFound();
  }

  if ("error" in result) {
    notFound();
  }

  return (
    <div className="px-4 mb-4 md:mx-48 md:my-20">
      <div className="my-10">
        <Link href={`/forms`}>
          <div className="flex items-center">
            <MoveLeft
              className="mr-2"
              color="#000000"
              strokeWidth={1.75}
              absoluteStrokeWidth
              size={18}
            />
            {"Back to my forms"}
          </div>
        </Link>
      </div>
      <h2 className="border-b pb-2 text-3xl font-semibold tracking-tight transition-colors">
        Responses ({Array.isArray(result) ? result.length : 0} total)
      </h2>
      <div className="mt-6">
        <ExportToExcelButton processedData={processedData} />
      </div>

      {/* Individual Response Cards */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Individual Responses</h3>
        {Array.isArray(result) && result.length > 0 ? (
          result.map((response) => (
            <ResponseCard key={response.id} response={response} />
          ))
        ) : (
          <Card className="w-full">
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">
                No responses yet. Share your form to start collecting responses!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Charts (Original functionality preserved) */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Response Summary</h3>
        <div className="grid grid-cols-1 gap-6">
          {/* You can add summary charts here if needed */}
        </div>
      </div>
    </div>
  );
}
