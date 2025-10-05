export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page Working! ✅</h1>
        <p className="text-gray-600 mb-8">This confirms that basic routing is working.</p>
        <a
          href="/forms"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          Go to Forms Page
        </a>
      </div>
    </div>
  );
}