export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  questions: {
    text: string;
    placeholder?: string;
    type: "SHORT_RESPONSE" | "SELECT_ONE_OPTION" | "SELECT_MULTIPLE_OPTIONS";
    options?: string[];
  }[];
}

export const FORM_TEMPLATES: FormTemplate[] = [
  {
    id: "contact",
    name: "Contact Form",
    description: "Collect contact information from visitors",
    icon: "📞",
    category: "Business",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Subject",
        placeholder: "What's this about?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Message",
        placeholder: "Tell us how we can help you...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How did you hear about us?",
        type: "SELECT_ONE_OPTION",
        options: ["Google Search", "Social Media", "Friend/Family", "Advertisement", "Other"]
      }
    ]
  },
  {
    id: "ticketing",
    name: "Ticketing Form",
    description: "Form to generate support tickets",
    icon: "🎫",
    category: "Support",
    questions: [
      {
        text: "Seat Number",
        placeholder: "Enter your seat number",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Name",
        placeholder: "Enter your name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Subject",
        placeholder: "Subject of your ticket",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Description",
        placeholder: "Describe your issue or request",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "event-registration",
    name: "Event Registration",
    description: "Register attendees for your event",
    icon: "🎉",
    category: "Events",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Organization/Company",
        placeholder: "Your organization name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Job Title",
        placeholder: "Your job title",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Dietary Restrictions",
        type: "SELECT_ONE_OPTION",
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
      },
      {
        text: "Special Accommodations",
        placeholder: "Any special needs or accommodations?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How did you hear about this event?",
        type: "SELECT_ONE_OPTION",
        options: ["Email", "Social Media", "Website", "Friend/Colleague", "Advertisement", "Other"]
      }
    ]
  },
  {
    id: "customer-feedback",
    name: "Customer Feedback",
    description: "Gather feedback from your customers",
    icon: "⭐",
    category: "Business",
    questions: [
      {
        text: "How satisfied are you with our product/service?",
        type: "SELECT_ONE_OPTION",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
      },
      {
        text: "What did you like most about our product/service?",
        placeholder: "Please share your positive experiences...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What areas can we improve?",
        placeholder: "Please share any suggestions for improvement...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Would you recommend us to others?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes, definitely", "Yes, maybe", "Not sure", "Probably not", "No, definitely not"]
      },
      {
        text: "How likely are you to purchase from us again?",
        type: "SELECT_ONE_OPTION",
        options: ["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"]
      },
      {
        text: "Overall satisfaction",
        type: "SELECT_ONE_OPTION",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
      }
    ]
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Collect job applications from candidates",
    icon: "💼",
    category: "HR",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Position Applied For",
        placeholder: "e.g., Software Developer, Marketing Manager",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Years of Experience",
        type: "SELECT_ONE_OPTION",
        options: ["0-1 years", "1-3 years", "3-5 years", "5-10 years", "10+ years"]
      },
      {
        text: "Current Employment Status",
        type: "SELECT_ONE_OPTION",
        options: ["Employed", "Unemployed", "Self-employed", "Student", "Retired"]
      },
      {
        text: "Education Level",
        type: "SELECT_ONE_OPTION",
        options: ["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"]
      },
      {
        text: "Why are you interested in this position?",
        placeholder: "Tell us about your motivation...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Relevant Skills",
        placeholder: "List your key skills and competencies...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Availability",
        type: "SELECT_ONE_OPTION",
        options: ["Immediately", "Within 2 weeks", "Within 1 month", "Within 3 months", "More than 3 months"]
      }
    ]
  },
  {
    id: "product-survey",
    name: "Product Survey",
    description: "Survey customers about your product",
    icon: "📊",
    category: "Marketing",
    questions: [
      {
        text: "How often do you use our product?",
        type: "SELECT_ONE_OPTION",
        options: ["Daily", "Weekly", "Monthly", "Occasionally", "First time"]
      },
      {
        text: "What features do you use most?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Core functionality", "Advanced features", "Reporting", "Integration", "Mobile app", "Customer support"]
      },
      {
        text: "Rate the ease of use",
        type: "SELECT_ONE_OPTION",
        options: ["Very Easy", "Easy", "Moderate", "Difficult", "Very Difficult"]
      },
      {
        text: "What features would you like to see added?",
        placeholder: "Please suggest new features...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How likely are you to recommend our product?",
        type: "SELECT_ONE_OPTION",
        options: ["10 - Extremely likely", "9", "8", "7", "6", "5", "4", "3", "2", "1 - Not at all likely"]
      },
      {
        text: "Overall satisfaction",
        type: "SELECT_ONE_OPTION",
        options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
      }
    ]
  },
  {
    id: "rsvp",
    name: "RSVP Form",
    description: "Collect RSVPs for your event",
    icon: "📅",
    category: "Events",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Will you be attending?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes, I'll be there!", "No, I can't make it", "Maybe (please contact me)"]
      },
      {
        text: "Number of guests attending with you",
        type: "SELECT_ONE_OPTION",
        options: ["0", "1", "2", "3", "4", "5+"]
      },
      {
        text: "Meal preference",
        type: "SELECT_ONE_OPTION",
        options: ["Chicken", "Fish", "Vegetarian", "Vegan", "No preference"]
      },
      {
        text: "Any special dietary requirements?",
        placeholder: "Allergies, restrictions, etc.",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Questions or comments?",
        placeholder: "Anything else we should know?",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "order-form",
    name: "Order Form",
    description: "Collect orders from customers",
    icon: "🛒",
    category: "Sales",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Shipping Address",
        placeholder: "Street address, city, state, zip code",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Product/Service",
        type: "SELECT_ONE_OPTION",
        options: ["Product A", "Product B", "Product C", "Service A", "Service B", "Custom Order"]
      },
      {
        text: "Quantity",
        type: "SELECT_ONE_OPTION",
        options: ["1", "2", "3", "4", "5", "6-10", "11-20", "20+"]
      },
      {
        text: "Special Instructions",
        placeholder: "Any special requests or customizations?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How did you hear about us?",
        type: "SELECT_ONE_OPTION",
        options: ["Google Search", "Social Media", "Friend/Family", "Email", "Advertisement", "Other"]
      }
    ]
  },
  {
    id: "quiz",
    name: "Quiz/Test",
    description: "Create quizzes and assessments",
    icon: "📝",
    category: "Education",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What is 2 + 2?",
        type: "SELECT_ONE_OPTION",
        options: ["3", "4", "5", "6"]
      },
      {
        text: "Which of these are programming languages?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Python", "HTML", "JavaScript", "Microsoft Word", "Java", "Photoshop"]
      },
      {
        text: "Explain your answer to question 3",
        placeholder: "Provide reasoning for your choice...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Rate your confidence in your answers",
        type: "SELECT_ONE_OPTION",
        options: ["Very confident", "Somewhat confident", "Not very confident", "Just guessing"]
      }
    ]
  },
  {
    id: "restaurant-feedback",
    name: "Restaurant Feedback",
    description: "Collect feedback from restaurant customers",
    icon: "🍽️",
    category: "Hospitality",
    questions: [
      {
        text: "How would you rate your overall dining experience?",
        type: "SELECT_ONE_OPTION",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
      },
      {
        text: "How would you rate the food quality?",
        type: "SELECT_ONE_OPTION",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
      },
      {
        text: "How would you rate the service?",
        type: "SELECT_ONE_OPTION",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
      },
      {
        text: "How would you rate the ambiance?",
        type: "SELECT_ONE_OPTION",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
      },
      {
        text: "What did you enjoy most about your visit?",
        placeholder: "Please share your favorite part of the experience...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What could we improve?",
        placeholder: "Please share any suggestions for improvement...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Would you recommend us to others?",
        type: "SELECT_ONE_OPTION",
        options: ["Definitely", "Probably", "Not sure", "Probably not", "Definitely not"]
      },
      {
        text: "How likely are you to visit again?",
        type: "SELECT_ONE_OPTION",
        options: ["Very likely", "Likely", "Neutral", "Unlikely", "Very unlikely"]
      }
    ]
  },
  {
    id: "wedding-rsvp",
    name: "Wedding RSVP",
    description: "Elegant RSVP form for wedding invitations",
    icon: "💒",
    category: "Events",
    questions: [
      {
        text: "Will you be attending our wedding celebration?",
        type: "SELECT_ONE_OPTION",
        options: ["Joyfully accepts", "Regretfully declines"]
      },
      {
        text: "Full Name",
        placeholder: "Please enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Number of guests attending (including yourself)",
        type: "SELECT_ONE_OPTION",
        options: ["1", "2", "3", "4", "5", "6+"]
      },
      {
        text: "Meal preference for reception",
        type: "SELECT_ONE_OPTION",
        options: ["Chicken", "Fish", "Vegetarian", "Vegan", "No preference"]
      },
      {
        text: "Do you have any dietary restrictions?",
        placeholder: "Please specify any allergies or dietary needs",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Are you bringing any children?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes", "No"]
      },
      {
        text: "Would you like to leave a message for the couple?",
        placeholder: "Share your well wishes...",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "course-evaluation",
    name: "Course Evaluation",
    description: "Student feedback for course improvement",
    icon: "📚",
    category: "Education",
    questions: [
      {
        text: "Course Name",
        placeholder: "Enter the course name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Instructor Name",
        placeholder: "Enter the instructor's name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Overall course rating",
        type: "SELECT_ONE_OPTION",
        options: ["Excellent", "Very Good", "Good", "Fair", "Poor"]
      },
      {
        text: "The course content was well-organized",
        type: "SELECT_ONE_OPTION",
        options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
      },
      {
        text: "The instructor was knowledgeable",
        type: "SELECT_ONE_OPTION",
        options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
      },
      {
        text: "The course materials were helpful",
        type: "SELECT_ONE_OPTION",
        options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
      },
      {
        text: "The assignments were valuable",
        type: "SELECT_ONE_OPTION",
        options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
      },
      {
        text: "What did you like most about this course?",
        placeholder: "Please share your positive experiences...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What suggestions do you have for improvement?",
        placeholder: "Please share any constructive feedback...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Would you recommend this course to others?",
        type: "SELECT_ONE_OPTION",
        options: ["Definitely", "Probably", "Not sure", "Probably not", "Definitely not"]
      }
    ]
  },
  {
    id: "product-launch",
    name: "Product Launch Interest",
    description: "Gauge interest in upcoming product launch",
    icon: "🚀",
    category: "Marketing",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number (optional)",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How did you hear about our upcoming product?",
        type: "SELECT_ONE_OPTION",
        options: ["Email newsletter", "Social media", "Website", "Friend/colleague", "Advertisement", "Other"]
      },
      {
        text: "On a scale of 1-10, how interested are you in our new product?",
        type: "SELECT_ONE_OPTION",
        options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
      },
      {
        text: "Which features are you most excited about?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["New design", "Better performance", "Advanced features", "Lower price", "Better quality", "Easier to use"]
      },
      {
        text: "What is your budget range for this type of product?",
        type: "SELECT_ONE_OPTION",
        options: ["Under $50", "$50-$100", "$100-$250", "$250-$500", "$500-$1000", "Over $1000"]
      },
      {
        text: "When are you planning to make a purchase?",
        type: "SELECT_ONE_OPTION",
        options: ["Immediately", "Within 1 month", "Within 3 months", "Within 6 months", "Within 1 year", "Just researching"]
      },
      {
        text: "Any questions or comments?",
        placeholder: "Feel free to ask questions or share your thoughts...",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "conference-registration",
    name: "Conference Registration",
    description: "Professional conference registration form",
    icon: "🎤",
    category: "Events",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Job Title",
        placeholder: "Your current job title",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Organization/Company",
        placeholder: "Your organization name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Registration Type",
        type: "SELECT_ONE_OPTION",
        options: ["Full Conference Pass", "Single Day Pass", "Student Pass", "VIP Pass", "Speaker"]
      },
      {
        text: "Dietary Preferences",
        type: "SELECT_ONE_OPTION",
        options: ["No restrictions", "Vegetarian", "Vegan", "Gluten-free", "Kosher", "Halal", "Other"]
      },
      {
        text: "Special Accommodations Needed",
        placeholder: "Please specify any accessibility needs or special requirements",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Topics you're most interested in",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Technology", "Business", "Marketing", "Design", "Leadership", "Innovation", "Networking"]
      },
      {
        text: "How did you hear about this conference?",
        type: "SELECT_ONE_OPTION",
        options: ["Website", "Email", "Social media", "Colleague", "Advertisement", "Previous attendee", "Other"]
      },
      {
        text: "Any questions or special requests?",
        placeholder: "Please let us know if you have any questions...",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "pet-adoption",
    name: "Pet Adoption Application",
    description: "Screening form for potential pet adopters",
    icon: "🐾",
    category: "Non-Profit",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Home Address",
        placeholder: "Street address, city, state, zip code",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Housing Type",
        type: "SELECT_ONE_OPTION",
        options: ["House", "Apartment", "Condo", "Townhouse", "Mobile home", "Other"]
      },
      {
        text: "Do you own or rent your home?",
        type: "SELECT_ONE_OPTION",
        options: ["Own", "Rent", "Live with parents/family", "Other"]
      },
      {
        text: "Do you have a yard or outdoor space?",
        type: "SELECT_ONE_OPTION",
        options: ["Large yard", "Small yard", "Balcony/patio", "No outdoor space"]
      },
      {
        text: "Have you owned pets before?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes, currently", "Yes, in the past", "No, first time"]
      },
      {
        text: "What type of pet are you interested in?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Dog", "Cat", "Bird", "Small mammal", "Reptile", "Fish", "Not sure yet"]
      },
      {
        text: "Do you have other pets in the home?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes", "No"]
      },
      {
        text: "If yes, please describe your current pets",
        placeholder: "Species, age, temperament, etc.",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Why do you want to adopt a pet?",
        placeholder: "Please share your reasons for wanting to adopt...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "How many hours per day will the pet be alone?",
        type: "SELECT_ONE_OPTION",
        options: ["0-2 hours", "2-4 hours", "4-8 hours", "8+ hours"]
      },
      {
        text: "Who will be the primary caregiver?",
        placeholder: "Please list all family members who will care for the pet",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Emergency Contact",
        placeholder: "Name and phone number of someone to contact in case of emergency",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "newsletter-signup",
    name: "Newsletter Signup",
    description: "Collect email addresses for your newsletter",
    icon: "📧",
    category: "Marketing",
    questions: [
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "First Name",
        placeholder: "Enter your first name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Last Name",
        placeholder: "Enter your last name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What topics are you interested in?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Technology", "Business", "Health & Wellness", "Entertainment", "Education", "Travel", "Food & Cooking"]
      },
      {
        text: "How often would you like to receive updates?",
        type: "SELECT_ONE_OPTION",
        options: ["Daily", "Weekly", "Monthly", "Occasionally"]
      },
      {
        text: "How did you hear about us?",
        type: "SELECT_ONE_OPTION",
        options: ["Social Media", "Friend/Family", "Google Search", "Advertisement", "Website", "Other"]
      }
    ]
  },
  {
    id: "volunteer-application",
    name: "Volunteer Application",
    description: "Recruit volunteers for your organization",
    icon: "🤝",
    category: "Non-Profit",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Date of Birth",
        placeholder: "MM/DD/YYYY",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Emergency Contact",
        placeholder: "Name and phone number",
        type: "SHORT_RESPONSE"
      },
      {
        text: "What volunteer roles interest you?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Event Planning", "Fundraising", "Administrative", "Teaching/Mentoring", "Community Outreach", "Environmental", "Animal Care"]
      },
      {
        text: "How many hours per week can you volunteer?",
        type: "SELECT_ONE_OPTION",
        options: ["1-5 hours", "5-10 hours", "10-20 hours", "20+ hours"]
      },
      {
        text: "What days are you available?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      {
        text: "Do you have any special skills or experience?",
        placeholder: "Please describe any relevant skills, certifications, or experience...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Why do you want to volunteer with us?",
        placeholder: "Tell us about your motivation...",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "membership-application",
    name: "Membership Application",
    description: "Application form for organization membership",
    icon: "🏛️",
    category: "Business",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Organization/Company",
        placeholder: "Your organization name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Job Title",
        placeholder: "Your current job title",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Industry",
        type: "SELECT_ONE_OPTION",
        options: ["Technology", "Healthcare", "Finance", "Education", "Manufacturing", "Retail", "Consulting", "Other"]
      },
      {
        text: "Membership Type",
        type: "SELECT_ONE_OPTION",
        options: ["Individual", "Corporate", "Student", "Non-Profit", "Lifetime"]
      },
      {
        text: "How did you hear about our organization?",
        type: "SELECT_ONE_OPTION",
        options: ["Website", "Social Media", "Email", "Colleague", "Event", "Advertisement", "Other"]
      },
      {
        text: "What are your primary interests in joining?",
        type: "SELECT_MULTIPLE_OPTIONS",
        options: ["Networking", "Professional Development", "Industry Insights", "Community Involvement", "Leadership Opportunities"]
      },
      {
        text: "Special requests or comments",
        placeholder: "Any additional information you'd like to share...",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "workshop-registration",
    name: "Workshop Registration",
    description: "Register participants for workshops",
    icon: "🎓",
    category: "Education",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Organization/Company",
        placeholder: "Your organization name (optional)",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Job Title/Role",
        placeholder: "Your current job title or role",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Experience Level",
        type: "SELECT_ONE_OPTION",
        options: ["Beginner", "Intermediate", "Advanced", "Expert"]
      },
      {
        text: "What are your learning objectives?",
        placeholder: "What do you hope to achieve from this workshop?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Do you have any special dietary requirements?",
        type: "SELECT_ONE_OPTION",
        options: ["None", "Vegetarian", "Vegan", "Gluten-free", "Kosher", "Halal", "Other"]
      },
      {
        text: "How did you hear about this workshop?",
        type: "SELECT_ONE_OPTION",
        options: ["Email", "Website", "Social Media", "Colleague", "Advertisement", "Previous Attendee", "Other"]
      },
      {
        text: "Questions or comments",
        placeholder: "Any questions or special accommodations needed?",
        type: "SHORT_RESPONSE"
      }
    ]
  },
  {
    id: "bug-report",
    name: "Bug Report",
    description: "Collect bug reports from users",
    icon: "🐛",
    category: "Technical",
    questions: [
      {
        text: "Your Name",
        placeholder: "Enter your name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Application/Website URL",
        placeholder: "Where did you encounter the bug?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Browser/Device Information",
        placeholder: "e.g., Chrome 120.0, iPhone Safari, Windows 11",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Bug Severity",
        type: "SELECT_ONE_OPTION",
        options: ["Critical - App unusable", "High - Major feature broken", "Medium - Feature impaired", "Low - Minor issue", "Cosmetic - Visual issue only"]
      },
      {
        text: "Steps to Reproduce",
        placeholder: "Please describe step-by-step how to reproduce the bug...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Expected Behavior",
        placeholder: "What should happen?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Actual Behavior",
        placeholder: "What actually happened?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Screenshots or Additional Information",
        placeholder: "Please provide any additional details, screenshots, or error messages...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Can you reproduce this issue consistently?",
        type: "SELECT_ONE_OPTION",
        options: ["Yes, every time", "Sometimes", "Only once", "Not sure"]
      }
    ]
  },
  {
    id: "photography-contest",
    name: "Photography Contest Entry",
    description: "Collect entries for photography contests",
    icon: "📸",
    category: "Creative",
    questions: [
      {
        text: "Full Name",
        placeholder: "Enter your full name",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Email Address",
        placeholder: "your.email@example.com",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Phone Number",
        placeholder: "+1 (555) 123-4567",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Photo Title",
        placeholder: "Give your photo a creative title",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Photo Description",
        placeholder: "Describe your photo and the story behind it...",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Category",
        type: "SELECT_ONE_OPTION",
        options: ["Portrait", "Landscape", "Street Photography", "Nature", "Architecture", "Abstract", "Other"]
      },
      {
        text: "Camera Equipment Used",
        placeholder: "Camera model, lens, etc.",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Location",
        placeholder: "Where was this photo taken?",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Technical Details",
        placeholder: "Aperture, shutter speed, ISO, etc.",
        type: "SHORT_RESPONSE"
      },
      {
        text: "Permission to Use",
        type: "SELECT_ONE_OPTION",
        options: ["Yes, I grant permission to use this photo for promotional purposes", "No, this entry is for competition only"]
      }
    ]
  }
];

export function getTemplateById(id: string): FormTemplate | undefined {
  return FORM_TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): FormTemplate[] {
  return FORM_TEMPLATES.filter(template => template.category === category);
}

export function getAllCategories(): string[] {
  const categories = FORM_TEMPLATES.map(template => template.category);
  return Array.from(new Set(categories));
}