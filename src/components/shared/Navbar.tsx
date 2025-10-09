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
import { useEffect, useRef, useState } from "react";
import LogoutButton from "../auth/LogoutButton";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const [isUsersPortalOpen, setIsUsersPortalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, []);

  const navigationLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: `Services`,
      href: "/services",
    },
    {
      label: "About Us",
      href: "/about-us",
    },
    {
      label: "Contact Us",
      href: "/contact-us",
    },
  ];
  console.log(user);
  const portfolioLinks = [
    { label: "Web Portfolio", href: "https://portfolio.waywisetech.com/" },
    { label: "AI/ML Portfolio", href: "https://showcase.waywisetech.com/" },
    {
      label: "Marketing Portfolio",
      href: "https://digitalmarketing.waywisetech.com/",
    },
    { label: "Design Portfolio", href: "https://design.waywisetech.com/" },
  ];
  // Logic for user portal links based on user role
  // Roles: ADMIN, SUPER_ADMIN, CLIENT, EMPLOYEE
  // ADMIN/SUPER_ADMIN: dashboard link to /admin
  // CLIENT: dashboard link to /client
  // EMPLOYEE: dashboard link to /employee
  // Not logged in: Register
  const getDashboardLink = () => {
    if (!user) return { label: "Login", href: "/login" };

    // Get primary role (first role in the roles array)
    const primaryRole = user.roles?.[0]?.name;

    if (primaryRole === "ADMIN" || primaryRole === "SUPER_ADMIN") {
      return { label: "Dashboard", href: "/admin" };
    }
    if (primaryRole === "CLIENT") {
      return { label: "Dashboard", href: "/client" };
    }
    if (primaryRole === "EMPLOYEE") {
      return { label: "Dashboard", href: "/employee" };
    }
    // fallback
    return { label: "Profile", href: "/profile" };
  };

  const usersPortalLinks = [getDashboardLink()];

  // Function to check if a route is active
  const isRouteActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  // Function to handle navigation and close mobile menu
  const handleNavigation = (href: string) => {
    // Clear any existing timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Close the menu first
    setIsMobileMenuOpen(false);

    // Use setTimeout to ensure the menu closes before navigation
    navigationTimeoutRef.current = setTimeout(() => {
      router.push(href);
    }, 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-transparent  transition-shadow duration-300 ${
        isScrolled ? "shadow-sm" : "border-gray-100"
      }`}
    >
      <div className=" lg:hidden bg-[url('@/assets/images/home/contact.png')] bg-cover bg-center bg-no-repeat py-1 ">
        <div className="container lg:hidden flex items-center justify-between gap-2  rounded-md ">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white" />
            <a
              href="tel:+13105286170"
              className="text-white text-sm hover:underline block text-nowrap"
            >
              +1 (310) 528-6170
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-white" />
            <a
              href="tel:+8801748771945"
              className="text-white text-sm hover:underline block text-nowrap "
            >
              +1 (310) 756-5533
            </a>
          </div>
        </div>
      </div>
      <div
        className="relative z-10 bg-white  dark:bg-gray-dark "
        style={{
          backgroundImage: 'url("/footer-bg.jpg")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom",
          backgroundColor: "#ddd",
        }}
      >
        <div className="absolute w-full h-full left-0 top-0 -z-10 bg-gradient-to-t from-white/50 via-white/90 to-white dark:from-dark/10 dark:via-dark/90 dark:to-dark"></div>

        <div className="container flex justify-between items-center mx-auto  py-4 ">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 ">
            {/* Logo Icon */}
            <Image
              src={Logo}
              alt="Logo"
              width={56}
              height={60}
              className="w-8 h-auto  md:w-10 "
            />

            {/* Logo Text */}
            <Image
              src={LogoText}
              alt="Logo Text"
              width={214}
              height={51}
              className="w-24 md:w-32 xl:w-40 h-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="flex justify-end  items-center gap-2 xl:gap-4">
            <nav className="hidden lg:flex gap-[10px] xl:gap-4 mx-auto items-center">
              {navigationLinks.map((link) => {
                const isActive = isRouteActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-md transition-colors text-nowrap font-semibold ${
                      isActive
                        ? "text-brand  "
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
                      className={`text-md px-0    bg-transparent hover:bg-transparent data-[state=open]:bg-transparent font-semibold ${
                        pathname.startsWith("/portfolio")
                          ? "text-brand "
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
              {/* Portfolio Dropdown */}
              {/* <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    id="users-portal-trigger"
                    className={`text-md px-0 font-normal   bg-transparent hover:bg-transparent data-[state=open]:bg-transparent ${
                      pathname.startsWith("/users-portal")
                        ? "text-brand font-semibold"
                        : "text-[#1B3447] hover:text-brand"
                    }`}
                  >
                    <UserRound />
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-2">
                      {usersPortalLinks.map((item) => (
                        <li key={item.href}>
                          <NavigationMenuLink asChild>
                            <Link
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
                      {user && (
                        <li>
                          <LogoutButton />
                        </li>
                      )}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu> */}
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
              <Phone className="w-5 h-5 text-white hidden xl:block" />
              <div>
                <a
                  href="tel:+13105286170"
                  className="text-white text-sm hover:underline block text-nowrap"
                >
                  +1 (310) 528-6170
                </a>
                <a
                  href="tel:+8801748771945"
                  className="text-white text-sm hover:underline block text-nowrap "
                >
                  +1 (310) 756-5533
                </a>
              </div>
            </div>
            <Button className="hidden lg:flex bg-brand hover:bg-brand/90 px-2 xl:px-4 ">
              <Link href="/contact-us">Get a Free Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="flex justify-end items-center lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <div className="flex items-center gap-2">
                {/* Mobile Phone Button */}

                <Button className="hidden min-[370px]:flex lg:flex bg-brand hover:bg-brand/90 px-2 xl:px-4 ">
                  <Link href="/contact-us">Get a Free Quote</Link>
                </Button>

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
                <nav className="flex flex-col space-y-6 ">
                  {/* Mobile Logo */}
                  <Link href="/" className="flex items-center gap-3">
                    <Image src={Logo} alt="Logo" width={36} height={36} />
                    <Image src={LogoText} alt="Logo" width={120} height={43} />
                  </Link>
                  <hr />
                  {/* Mobile Navigation Links */}
                  {navigationLinks.map((link) => {
                    const isActive = isRouteActive(link.href);

                    return (
                      <button
                        key={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleNavigation(link.href);
                        }}
                        className={`text-lg font-medium transition-colors text-left ${
                          isActive
                            ? "text-brand"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        {link.label}
                      </button>
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
                        className={`w-4 h-4 transition-transform duration-500 ${
                          isPortfolioOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-3 ">
                      <div className="pl-4 space-y-3">
                        {portfolioLinks.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsMobileMenuOpen(false);
                              setTimeout(() => {
                                window.open(
                                  item.href,
                                  "_blank",
                                  "noopener,noreferrer"
                                );
                              }, 100);
                            }}
                            className={`block text-base transition-colors ${
                              pathname === item.href
                                ? "text-brand font-semibold"
                                : "text-gray-600 hover:text-brand"
                            }`}
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  {/* <Collapsible
                  open={isUsersPortalOpen}
                  onOpenChange={setIsUsersPortalOpen}
                >
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-gray-900">
                    <span>Users Portal</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isUsersPortalOpen ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>

                  <CollapsibleContent className="pt-3 transition-all duration-700 ease-in-out">
                    <div className="pl-4 space-y-3">
                      {usersPortalLinks.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMobileMenuOpen(false);
                            setTimeout(() => {
                              window.open(
                                item.href,
                                "_self",
                                "noopener,noreferrer"
                              );
                            }, 100);
                          }}
                          className={`block text-base transition-colors duration-700 ${
                            pathname === item.href
                              ? "text-brand font-semibold"
                              : "text-gray-600 hover:text-brand"
                          }`}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible> */}

                  <div
                    className="flex lg:hidden gap-2  rounded-md cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleNavigation("/book");
                    }}
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
                      +1 (310) 528-6170
                    </a>
                    <a
                      href="tel:+1105258461070"
                      className="text-gray-600 hover:text-brand hover:underline block"
                    >
                      +1 (310) 756-5533
                    </a>
                  </div>
                  <Button className=" bg-brand hover:bg-brand/90 px-2 xl:px-4 ">
                    <Link href="/contact-us">Get a Free Quote</Link>
                  </Button>
                  {user && (
                    <li>
                      <LogoutButton />
                    </li>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
