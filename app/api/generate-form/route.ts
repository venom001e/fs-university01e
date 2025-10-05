import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `You are a form builder AI. Generate a form based on the user's prompt.
Return a JSON object with the following structure:
{
  "title": "Form Title",
  "questions": [
    {
      "text": "Question text",
      "type": "TEXT" | "SELECT_ONE_OPTION" | "SELECT_MULTIPLE_OPTIONS" | "NUMBER" | "EMAIL" | "DATE",
      "placeholder": "Optional placeholder",
      "options": ["option1", "option2"] // only for SELECT types
    }
  ]
}

Make sure the form is relevant to the prompt and has appropriate question types.`;

    const result = await model.generateContent(`${systemPrompt}\n\nUser prompt: ${prompt}`);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let formData;
    try {
      formData = JSON.parse(text);
    } catch (parseError) {
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

    // Create the form in database
    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        title: formData.title || "AI Generated Form",
      },
    });

    // Create questions
    for (let i = 0; i < formData.questions.length; i++) {
      const questionData = formData.questions[i];

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

      // Create options if applicable
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

    return NextResponse.json({
      success: true,
      form: {
        id: form.id,
        title: form.title,
      },
    });

  } catch (error) {
    console.error("Error generating form:", error);
    return NextResponse.json(
      { error: "Failed to generate form" },
      { status: 500 }
    );
  }
}