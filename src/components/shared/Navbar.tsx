"use client";
import Logo from "@/assets/images/shared/way-wise-logo.svg";
import profileGuide from "@/assets/images/shared/way-wise-profile.jpg";
import LogoText from "@/assets/images/shared/way-wise-text.png";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/context/UserContext";
import { ChevronDown, Menu, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
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

  const portfolioLinks = [
    { label: "Web Portfolio", href: "https://portfolio.waywisetech.com/" },
    { label: "AI/ML Portfolio", href: "https://showcase.waywisetech.com/" },
    {
      label: "Marketing Portfolio",
      href: "https://digitalmarketing.waywisetech.com/",
    },
    { label: "Design Portfolio", href: "https://design.waywisetech.com/" },
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
      <div className="container flex justify-between items-center mx-auto px-2  py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          {/* Logo Icon */}
          <Image
            src={Logo}
            alt="Logo"
            width={56}
            height={60}
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />

          {/* Logo Text */}
          <Image
            src={LogoText}
            alt="Logo Text"
            width={214}
            height={51}
            className="w-20 sm:w-28 md:w-36 xl:w-52 h-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="flex justify-end  items-center gap-3 xl:gap-8">
          <nav className="hidden lg:flex gap-4 xl:gap-8 mx-auto items-center">
            {navigationLinks.map((link) => {
              const isActive = isRouteActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-md transition-colors ${
                    isActive
                      ? "text-brand font-semibold"
                      : "text-[#1B3447] hover:text-brand"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Portfolio Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`text-md font-normal   bg-transparent hover:bg-transparent data-[state=open]:bg-transparent ${
                      pathname.startsWith("/portfolio")
                        ? "text-brand font-semibold"
                        : "text-[#1B3447] hover:text-brand"
                    }`}
                  >
                    Portfolio
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-2">
                      {portfolioLinks.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
                              target="_blank"
                              href={item.href}
                              className={`block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-brand focus:bg-accent focus:text-accent-foreground text-md ${
                                pathname === item.href
                                  ? "bg-accent text-brand font-semibold"
                                  : ""
                              }`}
                            >
                              <div className="text-sm font-medium leading-none">
                                {item.label}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Desktop Phone Section */}
          <div
            className="hidden lg:flex gap-2  rounded-xs cursor-pointer shadow-md"
            onClick={() => router.push("/book")}
          >
            <Image
              src={profileGuide}
              alt="Phone"
              width={66}
              height={66}
              className="w-24 h-full shadow-md rounded-xs"
            />
          </div>
          <div className="hidden lg:flex items-center justify-center gap-2  rounded-md p-2 bg-[url('@/assets/images/home/contact.png')] bg-cover bg-center bg-no-repeat">
            <Phone className="w-5 h-5 text-white" />
            <div>
              <a
                href="tel:+13105286170"
                className="text-white text-sm hover:underline block"
              >
                +1-310-528-6170
              </a>
              <a
                href="tel:+8801748771945"
                className="text-white text-sm hover:underline block"
              >
                +880 1748 771945
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="flex justify-end items-center lg:hidden">
          <Sheet>
            <div className="flex items-center gap-2">
              {/* Mobile Phone Button */}
              <div className="hidden sm:flex items-center justify-center gap-2 bg-brand rounded-md p-2">
                <Phone className="w-4 h-4 text-white" />
                <div>
                  <a
                    href="tel:+8801712345678"
                    className="text-white text-xs hover:underline block"
                  >
                    +1-310-528-6170
                  </a>
                  <a
                    href="tel:+1105258461070"
                    className="text-white text-xs hover:underline block"
                  >
                    +880 1748 771945
                  </a>
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

                {/* Mobile Portfolio Section */}
                <Collapsible
                  open={isPortfolioOpen}
                  onOpenChange={setIsPortfolioOpen}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-gray-900">
                    <span>Portfolio</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isPortfolioOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3">
                    <div className="pl-4 space-y-3">
                      {portfolioLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block text-base transition-colors ${
                            pathname === item.href
                              ? "text-brand font-semibold"
                              : "text-gray-600 hover:text-brand"
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <div
                  className="flex lg:hidden gap-2  rounded-md cursor-pointer"
                  onClick={() => router.push("/book")}
                >
                  <Image
                    src={profileGuide}
                    alt="Phone"
                    width={65}
                    height={65}
                    className="w-20 h-auto"
                  />
                </div>
                {/* Mobile Phone Numbers */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-brand" />
                    <span className="text-sm font-medium text-gray-700">
                      Contact Us
                    </span>
                  </div>
                  <a
                    href="tel:+8801712345678"
                    className="text-gray-600 hover:text-brand hover:underline block"
                  >
                    +1-310-528-6170
                  </a>
                  <a
                    href="tel:+1105258461070"
                    className="text-gray-600 hover:text-brand hover:underline block"
                  >
                    +880 1748 771945
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
