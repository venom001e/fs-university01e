import { NextResponse } from "next/server";
import { FORM_TEMPLATES, getTemplateById } from "@/lib/templates";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    console.log("🚀 Creating sample forms using templates...");

    // First, create or get a test user
    let testUser = await prisma.user.findFirst({
      where: { email: "test@example.com" }
    });

    if (!testUser) {
      testUser = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "testpassword"
        }
      });
      console.log("👤 Created test user");
    }

    // Create forms using different templates
    const templatesToCreate = [
      "contact",
      "customer-feedback",
      "event-registration",
      "job-application"
    ];

    const createdForms = [];

    for (const templateId of templatesToCreate) {
      try {
        const template = getTemplateById(templateId);
        if (template) {
          console.log(`📝 Creating form: ${template.name}`);

          // Create the form
          const form = await prisma.form.create({
            data: {
              userId: testUser.id,
              title: template.name,
            },
          });

          // Create questions and options from template
          for (let i = 0; i < template.questions.length; i++) {
            const questionData = template.questions[i];

            const question = await prisma.question.create({
              data: {
                formId: form.id,
                userId: testUser.id,
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

          console.log(`✅ Created: ${form.title} (ID: ${form.id})`);
          createdForms.push({
            id: form.id,
            title: form.title,
            template: template.name
          });
        }
      } catch (error) {
        console.error(`❌ Error creating form from template ${templateId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sample forms created successfully!",
      forms: createdForms,
      testUser: {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email
      }
    });

  } catch (error) {
    console.error("Error creating sample forms:", error);
    return NextResponse.json(
      { error: "Failed to create sample forms" },
      { status: 500 }
    );
  }
}