"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewVerticalIcon } from "@radix-ui/react-icons";

import Image from "next/image";

import { docsConfig } from "@/config/docs";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import Logout from "./logout";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function MainNav({ isUserLogged }: { isUserLogged: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="mr-4 hidden md:block">
      <div className="border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex h-16 items-center px-48">
          <div className="flex items-center cursor-pointer px-1 group">
            <div className="cursor-pointer flex items-center transition-all duration-300 group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="FS University Logo"
                width={140}
                height={45}
                className="cursor-pointer hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            {!isUserLogged && (
              <div className="flex items-center space-x-3">
                <Link href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Register
                </Link>
              </div>
            )}
            {isUserLogged && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600 px-3 py-1 rounded-full bg-gray-100/80 border border-gray-200">
                  Welcome back!
                </div>
                <Logout />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileNav({ isUserLogged }: { isUserLogged: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur md:hidden">
      <div className="container flex h-14 items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <ViewVerticalIcon className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileLink
              href="/"
              className="flex items-center"
              onOpenChange={setOpen}
            >
              <div className="flex items-center ml-6">
                <Image width={35} height={35} alt="FS University Logo" src={"/logo.png"} className="rounded-lg" />
                <span className="font-bold ml-2 text-lg">FS University</span>
              </div>
            </MobileLink>
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                {docsConfig.mainNav?.map(
                  (item) =>
                    item.href && (
                      <MobileLink
                        key={item.href}
                        href={item.href}
                        onOpenChange={setOpen}
                      >
                        {item.title}
                      </MobileLink>
                    )
                )}
              </div>
              <div className="flex flex-col space-y-2">
                {docsConfig.sidebarNav.map((item, index) => (
                  <div key={index} className="flex flex-col space-y-3 pt-6">
                    <h4 className="font-medium">{item.title}</h4>
                    {item?.items?.length &&
                      item.items.map((item) => {
                        if (item.title === "Login") {
                          if (!isUserLogged) {
                            return (
                              <MobileLink
                                key={item.title}
                                href="/login"
                                onOpenChange={setOpen}
                                className="text-muted-foreground"
                              >
                                Login
                              </MobileLink>
                            );
                          }
                          return null;
                        } else if (item.title === "Register") {
                          if (!isUserLogged) {
                            return (
                              <MobileLink
                                key={item.title}
                                href="/register"
                                onOpenChange={setOpen}
                                className="text-muted-foreground"
                              >
                                Register
                              </MobileLink>
                            );
                          }
                          return null;
                        } else if (item.title === "Logout") {
                          if (isUserLogged) {
                            return <Logout key={item.title} />;
                          }
                          return null;
                        }
                        return (
                          <React.Fragment key={item.href}>
                            {!item.disabled &&
                              (item.href ? (
                                <MobileLink
                                  href={item.href}
                                  onOpenChange={setOpen}
                                  className="text-muted-foreground"
                                >
                                  {item.title}
                                </MobileLink>
                              ) : (
                                item.title
                              ))}
                          </React.Fragment>
                        );
                      })}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

interface MobileLinkProps {
  href: string;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
