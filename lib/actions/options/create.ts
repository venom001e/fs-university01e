"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const createOption = async (
  questionId: string,
  optionText: string
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }

  const question = await prisma.question.findFirstOrThrow({
    where: {
      id: questionId,
      userId: session.user.id,
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
      form: true,
    },
  });

  const options = question.options;
  const formId = question.form.id;

  // Calculate the next order
  const nextOrder = options.length > 0 ? Math.max(...options.map(o => o.order)) + 1 : 1;

  // Create the new option
  await prisma.option.create({
    data: {
      order: nextOrder,
      optionText: optionText,
      questionId: questionId,
    },
  });

  revalidatePath(`forms/${formId}`);
};
