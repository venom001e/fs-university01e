import Image from "next/image";

export function FormTitle({ title }: { title: string }) {
  return (
    <div className="text-center mb-4">
      {/* FSU Logo */}
      <div className="flex justify-center mb-4">
        <Image 
          src="/logo.png" 
          alt="FSU Logo" 
          width={80} 
          height={80}
          className="object-contain"
        />
      </div>
      
      {/* Form Title */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {title}
        </h1>
        <p className="text-gray-600 mt-1 text-base">
          Please complete all questions below
        </p>
      </div>
    </div>
  );
}
