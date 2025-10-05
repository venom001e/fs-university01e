export function SiteFooter() {
  return (
    <footer className="py-8 md:px-40 md:py-12 mt-32 bg-black border-t border-black">
      <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row">
        <div className="text-center md:text-left">
          <p className="text-lg leading-loose text-white mb-2">
            Website crafted with ❤️ by Ganesh Yadav and Vaibhav Singh
          </p>
          <p className="text-sm leading-loose text-gray-500">
            Professional form creation made simple and beautiful.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <span className="text-sm">Self-hosted</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-blue-400"></div>
            <span className="text-sm">Privacy-first</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="h-2 w-2 rounded-full bg-purple-400"></div>
            <span className="text-sm">Educational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
