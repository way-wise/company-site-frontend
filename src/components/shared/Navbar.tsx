"use client";
import Logo from "@/assets/images/shared/way-wise-logo.svg";
import profileGuide from "@/assets/images/shared/way-wise-profile.jpg";
import LogoText from "@/assets/images/shared/way-wise-text.png";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/UserContext";
import { Menu, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useAuth();

  console.log(user);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: `Service We Provide`,
      href: "/services",
    },
    {
      label: "About Us",
      href: "/about-us",
    },
    {
      label: "Contact",
      href: "/contact-us",
    },
  ];

  // Function to check if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : "border-gray-100"
      }`}
    >
      <div className="container flex justify-between items-center mx-auto px-4 md:px-5 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image
            src={Logo}
            alt="Logo"
            width={56}
            height={60}
            className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
          <Image
            src={LogoText}
            alt="Logo"
            width={214}
            height={51}
            className="w-32 h-auto lg:w-52"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="flex items-center gap-8">
          <nav className="hidden lg:flex gap-8 mx-auto">
            {navigationLinks.map((link) => {
              const isActive = isRouteActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-lg transition-colors ${
                    isActive
                      ? "text-brand font-semibold"
                      : "text-[#1B3447] hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Phone Section */}
          <div
            className=" gap-2  rounded-md cursor-pointer"
            onClick={() => router.push("/book")}
          >
            <Image
              src={profileGuide}
              alt="Phone"
              width={70}
              height={70}
              className="w-full h-full"
            />
          </div>
          <div className="hidden lg:flex items-center justify-center gap-2 bg-brand rounded-md p-2">
            <Phone className="w-5 h-5 text-white" />
            <div>
              <p className="text-white text-sm">+880 1712 345678</p>
              <p className="text-white text-sm">+110 5258 461070</p>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center lg:hidden">
          <Sheet>
            <div className="flex items-center gap-2">
              {/* Mobile Phone Button */}
              <div className="hidden sm:flex items-center justify-center gap-2 bg-brand rounded-md p-2">
                <Phone className="w-4 h-4 text-white" />
                <div>
                  <p className="text-white text-xs">+880 1712 345678</p>
                  <p className="text-white text-xs">+110 5258 461070</p>
                </div>
              </div>

              <SheetTrigger asChild>
                <Button size="icon" className="bg-brand hover:bg-brand/90">
                  <Menu className="h-5 w-5 text-white" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
            </div>

            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-white p-6"
            >
              <nav className="flex flex-col space-y-6 pt-6">
                {/* Mobile Logo */}
                <Link href="/" className="flex items-center gap-3">
                  <Image src={Logo} alt="Logo" width={56} height={60} />
                  <Image src={LogoText} alt="Logo" width={180} height={43} />
                </Link>

                {/* Mobile Navigation Links */}
                {navigationLinks.map((link) => {
                  const isActive = isRouteActive(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`text-lg font-medium transition-colors ${
                        isActive
                          ? "text-brand"
                          : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                {/* Mobile Phone Numbers */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-brand" />
                    <span className="text-sm font-medium text-gray-700">
                      Contact Us
                    </span>
                  </div>
                  <p className="text-gray-600">+880 1712 345678</p>
                  <p className="text-gray-600">+110 5258 461070</p>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
