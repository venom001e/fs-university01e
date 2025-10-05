import { FORM_TEMPLATES, getTemplateById } from "../lib/templates";
import { createFormFromTemplate } from "../lib/actions/templates";

async function createSampleForms() {
  console.log("🚀 Creating sample forms using templates...");

  // Create forms using different templates
  const templatesToCreate = [
    "contact",
    "customer-feedback",
    "event-registration",
    "job-application"
  ];

  for (const templateId of templatesToCreate) {
    try {
      const template = getTemplateById(templateId);
      if (template) {
        console.log(`📝 Creating form: ${template.name}`);
        const result = await createFormFromTemplate(template);

        if ("error" in result) {
          console.error(`❌ Error: ${result.error}`);
        } else {
          console.log(`✅ Created: ${result.title} (ID: ${result.id})`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating form from template ${templateId}:`, error);
    }
  }

  console.log("🎉 Sample forms created successfully!");
  console.log("📋 You can now view these forms in your application at /forms");
}

createSampleForms().catch(console.error);