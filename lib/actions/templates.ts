"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { FormTemplate } from "@/lib/templates";

export const createFormFromTemplate = async (template: FormTemplate) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  // Create the form
  const form = await prisma.form.create({
    data: {
      userId: session.user.id,
      title: template.name,
    },
  });

  // Create questions and options from template
  for (let i = 0; i < template.questions.length; i++) {
    const questionData = template.questions[i];

    const question = await prisma.question.create({
      data: {
        formId: form.id,
        userId: session.user.id,
        text: questionData.text,
        placeholder: questionData.placeholder || "",
        type: questionData.type,
        order: i + 1,
      },
    });

    // Create options if the question type requires them
    if ((questionData.type === "SELECT_ONE_OPTION" || questionData.type === "SELECT_MULTIPLE_OPTIONS") && questionData.options) {
      for (let j = 0; j < questionData.options.length; j++) {
        await prisma.option.create({
          data: {
            questionId: question.id,
            optionText: questionData.options[j],
            order: j + 1,
          },
        });
      }
    }
  }

  return form;
};