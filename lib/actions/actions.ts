"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

type AnswersWithQuestionOptionAndResponse = Prisma.AnswerGetPayload<{
  include: { question: true; options: true; response: true };
}>;

// Define the shape of the input object's values
interface InputValueType {
  type: "SHORT_RESPONSE" | "SELECT_ONE_OPTION" | "SELECT_MULTIPLE_OPTIONS";
  text: string | null;
  optionId: string | null;
  optionIds: string[] | null;
}

// Define the shape of the output object
interface OutputType {
  answerText: string | null;
  questionId: string;
  type: "SHORT_RESPONSE" | "SELECT_ONE_OPTION" | "SELECT_MULTIPLE_OPTIONS";
  optionId: string | null;
  optionIds: string[] | null;
}

function transform(obj: Record<string, InputValueType>): OutputType[] {
  const result: OutputType[] = [];

  for (let key in obj) {
    if (obj[key].type === "SHORT_RESPONSE") {
      result.push({
        answerText: obj[key].text,
        questionId: key,
        type: "SHORT_RESPONSE",
        optionId: null,
        optionIds: null,
      });
    } else if (obj[key].type === "SELECT_ONE_OPTION") {
      // Allow empty selection for optional questions
      if (obj[key].optionId && obj[key].optionId !== "") {
        result.push({
          answerText: null,
          questionId: key,
          optionId: obj[key].optionId,
          type: "SELECT_ONE_OPTION",
          optionIds: null,
        });
      }
      // Skip unanswered questions (don't add to result)
    } else if (obj[key].type === "SELECT_MULTIPLE_OPTIONS") {
      if (obj[key].optionIds && obj[key].optionIds.length > 0) {
        result.push({
          answerText: null,
          optionId: null,
          type: "SELECT_MULTIPLE_OPTIONS",
          questionId: key,
          optionIds: obj[key].optionIds,
        });
      }
      // Skip unanswered questions (don't add to result)
    }
  }

  return result;
}

export const updateOptionText = async (
  optionText: string,
  optionId: string,
  questionId: string,
  formId: string
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  await prisma.question.findFirstOrThrow({
    where: {
      userId: session.user.id,
      id: questionId,
      formId,
    },
  });

  await prisma.option.update({
    where: {
      id: optionId,
    },
    data: {
      optionText,
    },
  });

  revalidatePath(`forms/${formId}`);

  return;
};

export const submitForm = async (answersHash: any, formId: string) => {
  const answers = transform(answersHash);

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
    },
  });

  // Get questions to map answers to question texts and check mandatory
  const questions = await prisma.question.findMany({
    where: {
      formId: form.id,
    },
    select: {
      id: true,
      text: true,
      mandatory: true,
    },
  });

  // Validate mandatory questions are answered
  const answeredQuestionIds = answers.map(a => a.questionId);
  for (const question of questions) {
    if (question.mandatory && !answeredQuestionIds.includes(question.id)) {
      throw new Error(`Mandatory question "${question.text}" must be answered`);
    }
  }

  for (const answer of answers) {
    const question = await prisma.question.findFirstOrThrow({
      where: {
        id: answer.questionId,
      },
    });

    if (question.formId !== form.id) {
      throw new Error("Question does not belong to the form");
    }
  }

  const response = await prisma.response.create({
    data: {
      submittedAt: new Date().toISOString(),
    },
  });

  const createAnswerOperations = answers.map((answer) => {
    if (answer.type === "SHORT_RESPONSE") {
      if (answer.answerText === null) {
        throw new Error(`Missing answerText for question ${answer.questionId}`);
      }
      return prisma.answer.create({
        data: {
          answerText: answer.answerText,
          questionId: answer.questionId,
          formId: form.id,
          responseId: response.id,
        },
      });
    } else if (answer.type === "SELECT_ONE_OPTION") {
      if (!answer.optionId) {
        throw new Error(`Missing optionId for question ${answer.questionId}`);
      }
      return prisma.answer.create({
        data: {
          questionId: answer.questionId,
          formId: form.id,
          responseId: response.id,
          options: {
            connect: {
              id: answer.optionId,
            },
          },
          answerText: "",
        },
      });
    } else if (answer.type === "SELECT_MULTIPLE_OPTIONS") {
      if (!answer.optionIds || answer.optionIds.length === 0) {
        throw new Error(`Missing optionIds for question ${answer.questionId}`);
      }
      const connectAnswers = answer.optionIds.map((option: string) => {
        return { id: option };
      });

      return prisma.answer.create({
        data: {
          questionId: answer.questionId,
          formId: form.id,
          responseId: response.id,
          options: {
            connect: [...connectAnswers],
          },
          answerText: "",
        },
      });
    } else {
      throw new Error("Not valid type");
    }
  });

  await prisma.$transaction(createAnswerOperations);

  // Check if this is the ticketing form
  if (form.title === "Ticketing Form") {
    // Extract ticket data from answers
    const questionMap = questions.reduce((map, q) => {
      map[q.id] = q.text;
      return map;
    }, {} as Record<string, string>);

    let seat_no = "";
    let name = "";
    let email = "";
    let subject = "";
    let description = "";

    answers.forEach((answer) => {
      const questionText = questionMap[answer.questionId];
      if (questionText === "Seat Number") {
        seat_no = answer.answerText || "";
      } else if (questionText === "Name") {
        name = answer.answerText || "";
      } else if (questionText === "Email") {
        email = answer.answerText || "";
      } else if (questionText === "Subject") {
        subject = answer.answerText || "";
      } else if (questionText === "Description") {
        description = answer.answerText || "";
      }
    });

    // Call the ticket creation API
    try {
      const apiResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/ticket/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seat_no,
          name,
          email,
          subject,
          description,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw new Error('Form submitted but ticket creation failed');
    }
  }

  return;
};

export const getGroupedResponsesFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  // Get all answers for the form with question and response info
  const answers = await prisma.answer.findMany({
    where: {
      formId: formId,
      question: {
        userId: session.user.id,
      },
    },
    include: {
      question: true,
      options: true,
      response: true,
    },
    orderBy: {
      response: {
        submittedAt: "desc",
      },
    },
  });

  // Group answers by response ID
  const groupedResponses: Record<string, any> = {};

  answers.forEach((answer: any) => {
    const responseId = answer.responseId;

    if (!groupedResponses[responseId]) {
      groupedResponses[responseId] = {
        id: responseId,
        submittedAt: answer.response.submittedAt,
        answers: [],
      };
    }

    // Add answer to the response group
    groupedResponses[responseId].answers.push({
      questionId: answer.questionId,
      questionText: answer.question.text,
      questionOrder: answer.question.order,
      answerText: answer.answerText,
      options: answer.options,
      questionType: answer.question.type,
    });
  });

  // Sort answers within each response by question order
  Object.values(groupedResponses).forEach((response: any) => {
    response.answers.sort((a: any, b: any) => a.questionOrder - b.questionOrder);
  });

  // Convert to array and sort by submission time (newest first)
  const responsesArray = Object.values(groupedResponses).sort(
    (a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  return responsesArray;
};

export const getResponsesFromForm = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const answers = await prisma.answer.findMany({
    where: {
      formId: formId,
      question: {
        userId: session.user.id,
      },
    },
    include: {
      question: true,
      options: true,
      response: true,
    },
  });

  const questions = await prisma.question.findMany({
    where: {
      formId: formId,
    },
    orderBy: {
      order: "asc",
    },
  });

  const questionsNames = questions.map((question) => {
    return question.text;
  });

  const totalQuestions = questions.length;

  type GroupedResponses = {
    [key: string]: AnswersWithQuestionOptionAndResponse[];
  };

  const groupedByResponse: GroupedResponses = answers.reduce(
    (acc: GroupedResponses, answer: AnswersWithQuestionOptionAndResponse) => {
      const responseId = answer.responseId;
      if (!acc[responseId]) {
        acc[responseId] = [];
      }
      acc[responseId].push(answer);
      return acc;
    },
    {}
  );

  const formattedResponses: string[][] = Object.values(groupedByResponse).map(
    (answersForResponse: AnswersWithQuestionOptionAndResponse[]) => {
      const sortedAnswers = answersForResponse.sort(
        (a, b) => a.question.order - b.question.order
      );

      const answersArray: string[] = new Array(totalQuestions).fill("");

      sortedAnswers.forEach((answer) => {
        const index = answer.question.order - 1;
        answersArray[index] =
          answer.question.type === "SELECT_ONE_OPTION"
            ? answer.options && answer.options.length === 1
              ? answer.options[0].optionText
              : ""
            : answer.answerText;
      });

      return answersArray;
    }
  );

  return [questionsNames].concat(formattedResponses);
};

export const checkIfUserIsLoggedIn = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return false;
  }
  return true;
};

export const createForm = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.form.create({
    data: {
      userId: session.user.id,
      title: "",
    },
  });

  return response;
};

export const updateFormFromUser = async (formId: string, title: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      title,
    },
  });
  return response;
};

export const getResponsesSummaryFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId: formId,
      userId: session.user.id,
    },
    include: {
      options: true,
      answers: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          options: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
  return questions;
};

export const tooglePublishFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const form = await prisma.form.findFirstOrThrow({
    where: {
      id: formId,
      userId: session.user.id,
    },
  });

  const response = await prisma.form.update({
    where: {
      id: formId,
      userId: session.user.id,
    },
    data: {
      published: !form.published,
    },
  });
  revalidatePath(`forms/${formId}`);
  return response;
};

export const updateQuestionFromUser = async (
  formId: string,
  questionId: string,
  placeholder: string | null,
  text: string | null,
  mandatory: boolean | null = null
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const dataToUpdate: any = {};
  if (text != null) {
    dataToUpdate.text = text;
  }
  if (placeholder != null) {
    dataToUpdate.placeholder = placeholder;
  }
  if (mandatory !== null) {
    dataToUpdate.mandatory = mandatory;
  }
  if (Object.keys(dataToUpdate).length === 0) {
    return;
  }
  const response = await prisma.question.update({
    where: {
      formId,
      id: questionId,
      userId: session.user.id,
    },
    data: dataToUpdate,
  });
  return response;
};

export const getQuestionsFromPublishedFormOrFromAuthor = async (
  formId: string
) => {
  const session = await getSession();

  let isTheAuthor = false;

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!form) {
    return {
      error: "Form does not exist",
    };
  }

  if (form.userId === session?.user.id) {
    isTheAuthor = true;
  }

  if (!isTheAuthor && !form.published) {
    return {
      error: "Form is not published",
    };
  }

  const response = await prisma.question.findMany({
    where: {
      formId: form.id,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  });

  return response;
};

export const getQuestionsFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const formFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!formFromUser) {
    return {
      error: "Form does not exist",
    };
  }

  if (formFromUser.userId !== session.user.id) {
    return {
      error: "Form is not from user",
    };
  }

  const response = await prisma.question.findMany({
    where: {
      formId: formFromUser.id,
      userId: session.user.id,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true,
      text: true,
      placeholder: true,
      type: true,
      order: true,
      options: true,
      mandatory: true,
    },
  });

  return response;
};

export const deleteQuestion = async (formId: string, questionId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const formFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!formFromUser) {
    return {
      error: "Form does not exist",
    };
  }

  if (formFromUser.userId !== session.user.id) {
    return {
      error: "Form is not from user",
    };
  }

  const questionToDelete = await prisma.question.findFirst({
    where: {
      id: questionId,
    },
  });

  if (!questionToDelete) {
    return {
      error: "Question does not exist",
    };
  }

  if (questionToDelete.formId != formId) {
    return {
      error: "Given questionId is not from the given form Id",
    };
  }

  const questions = await prisma.question.findMany({
    where: {
      formId,
      order: {
        gt: questionToDelete.order,
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  const updateOperations = questions.map((question) => {
    const newOrder = question.order - 1;
    return prisma.question.update({
      where: { id: question.id, formId },
      data: { order: newOrder },
    });
  });

  const deleteFunction = prisma.question.delete({
    where: {
      id: questionId,
    },
  });
  updateOperations.push(deleteFunction);

  await prisma.$transaction(updateOperations);

  revalidatePath(`forms/${formId}`);

  return;
};

export const getFormsFromUser = async () => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.form.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return response;
};

export const getFormFromUser = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const response = await prisma.form.findFirst({
    where: {
      userId: session.user.id,
      id: formId,
    },
  });

  return response;
};

export const getFormIfPublishedOrIsAuthor = async (formId: string) => {
  const session = await getSession();

  let isTheAuthor = false;

  const form = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!form) {
    redirect("/forms/e");
  }

  if (form.userId === session?.user.id) {
    isTheAuthor = true;
  }

  if (!isTheAuthor && !form.published) {
    redirect("/forms/e");
  }

  return form;
};

export const deleteForm = async (formId: string) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const formFromUser = await prisma.form.findFirst({
    where: {
      id: formId,
    },
  });

  if (!formFromUser) {
    return {
      error: "Form does not exist",
    };
  }

  if (formFromUser.userId !== session.user.id) {
    return {
      error: "Form is not from user",
    };
  }

  // Delete all related data in the correct order to maintain referential integrity
  await prisma.$transaction([
    // Delete answers first (they reference options and responses)
    prisma.answer.deleteMany({
      where: {
        formId: formId,
      },
    }),
    // Delete options (they reference questions)
    prisma.option.deleteMany({
      where: {
        question: {
          formId: formId,
        },
      },
    }),
    // Delete questions (they reference the form)
    prisma.question.deleteMany({
      where: {
        formId: formId,
      },
    }),
    // Delete responses (they might be referenced by answers, but we delete answers first)
    prisma.response.deleteMany({
      where: {
        answers: {
          some: {
            formId: formId,
          },
        },
      },
    }),
    // Finally delete the form
    prisma.form.delete({
      where: {
        id: formId,
      },
    }),
  ]);

  revalidatePath("/forms");

  return {
    success: true,
    message: "Form deleted successfully",
  };
};
