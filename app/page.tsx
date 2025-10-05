import { Button } from "@/components/ui/button";
import Link from "next/link";
import { checkIfUserIsLoggedIn } from "@/lib/actions/actions";
import { RegisterDialog } from "./registerDialog";
import { StarIcon } from "@radix-ui/react-icons";
import { SiteFooter } from "@/components/site-footer";
import { MainNav, MobileNav } from "@/components/main-nav";
import Image from "next/image";

export default async function Home() {
  const isUserLogged = await checkIfUserIsLoggedIn();

  return (
    <div className="min-h-screen bg-white text-black">
      <MainNav isUserLogged={isUserLogged} />
      <MobileNav isUserLogged={isUserLogged} />
      {/* Hero Section */}
      <section className="px-4 pt-20 pb-20 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* FSU Logo */}
          <div className="flex justify-center mb-8">
            <Image 
              src="/logo.png" 
              alt="FS University Logo"
              width={100} 
              height={100}
              className="object-contain"
            />
          </div>
          
          <div className="mb-8">
            <div className="inline-flex items-center rounded-full bg-blue-100 border border-blue-200 px-6 py-3 text-sm font-medium text-blue-800">
              <StarIcon className="mr-3 h-5 w-5 text-blue-600" />
              Professional Form Builder
            </div>
          </div>

          <div className="mb-8 text-center">
            <h1 className="text-5xl font-[\'Libre_Baskerville\',_serif] font-semibold tracking-tight md:text-6xl text-black">
              The refreshingly
            </h1>
            <h1 className="text-5xl font-[\'Libre_Baskerville\',_serif] font-semibold tracking-tight md:text-6xl text-black">
              different survey builder
            </h1>
          </div>

          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-700">
            Build stunning forms with our drag-and-drop builder.
            Collect responses and export to Excel.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            {isUserLogged ? (
              <Link href="/forms">
                <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 text-lg font-semibold text-white">
                  Start Creating Forms
                </Button>
              </Link>
            ) : (
              <RegisterDialog />
            )}
          </div>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <Image
              src="/heroimage.png"
              alt="Form Builder Demo"
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
