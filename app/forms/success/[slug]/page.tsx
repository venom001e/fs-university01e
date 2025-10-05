import { RocketIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { getFormIfPublishedOrIsAuthor } from "@/lib/actions/actions";

import Link from "next/link";

import { Button } from "@/components/ui/button";

export default async function Page({ params }: { params: { slug: string } }) {
  const formId = params.slug;
  const form = await getFormIfPublishedOrIsAuthor(formId);

  const title = form.title;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* FSU Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.png" 
            alt="FSU Logo" 
            width={80} 
            height={80}
            className="object-contain"
          />
        </div>
        
        {/* Success Content */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircledIcon className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Submission Successful!
          </h1>
          
          <p className="text-gray-600 text-base mb-4">
            Your form "{title}" has been successfully submitted. 
            We appreciate your input and will process it shortly.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-center text-green-800">
              <RocketIcon className="h-4 w-4 mr-2" />
              <span className="font-medium text-sm">Thank you for your time!</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Link href={`/forms/viewform/${formId}`}>
              <Button className="w-full bg-purple-600 hover:bg-purple-700 py-2 text-base">
                Send Another Response
              </Button>
            </Link>
            
            <Link href="/forms">
              <Button variant="outline" className="w-full py-2 text-base">
                Back to My Forms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
