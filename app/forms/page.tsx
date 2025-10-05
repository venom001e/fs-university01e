import { getFormsFromUser } from "@/lib/actions/actions";
import { format } from "date-fns";
import { columns } from "@/components/formsTable/columns";
import { DataTable } from "@/components/formsTable/data-table";
import { CreateFormDialog } from "@/components/create-form-dialog";
import Image from "next/image";

export default async function Forms() {
  const formsFromUser = await getFormsFromUser();

  if ("error" in formsFromUser) {
    return null;
  }

  const formsFromUserFormatted = formsFromUser.map((element: any) => {
    return {
      ...element,
      createdAt: format(element.createdAt, "dd/MM/yyyy"),
      updatedAt: format(element.updatedAt, "dd/MM/yyyy"),
      shortId: element.id.substring(0, 8),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
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
        
        {/* Header Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
            Your Forms
          </h1>
          <p className="text-gray-600 text-center text-base">
            Create, manage, and analyze your survey forms
          </p>
        </div>

        <div className="mb-6">
          <CreateFormDialog />
        </div>

        {formsFromUserFormatted.length > 0 ? (
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <DataTable data={formsFromUserFormatted} columns={columns} />
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">No forms yet</h3>
            <p className="text-gray-600 mb-6 text-base">
              Create your first form to get started!
            </p>
            <CreateFormDialog />
          </div>
        )}
      </div>
    </div>
  );
}
