import Logo from "@/assets/images/shared/way-wise-logo.svg";
import LogoText from "@/assets/images/shared/way-wise-text.png";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="relative z-10 bg-white pt-16 dark:bg-gray-dark md:pt-20 lg:pt-24"
      style={{
        backgroundImage: 'url("/footer-bg.jpg")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "#ddd",
      }}
    >
      <div className="absolute w-full h-full left-0 top-0 -z-10 bg-gradient-to-t from-white/10 via-white/90 to-white dark:from-dark/10 dark:via-dark/90 dark:to-dark"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Logo and Description Section */}
          <div className="lg:col-span-5">
            <div className="mb-12 lg:mb-16">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-6">
                <Image
                  src={Logo}
                  alt="Logo"
                  width={56}
                  height={60}
                  className="w-8 h-8 md:w-12 md:h-12 lg:w-14 lg:h-14 flex-shrink-0"
                />
                <Image
                  src={LogoText}
                  alt="Logo"
                  width={214}
                  height={51}
                  className="w-32 h-auto lg:w-52 flex-shrink-0"
                />
              </Link>

              <p className="mb-9 text-sm sm:text-base leading-relaxed text-black dark:text-white">
                As a leading software development firm with a worldwide reach,
                we specialize in crafting cutting-edge solutions that drive your
                business forward. Our team of experienced developers and tech
                visionaries is dedicated to delivering customized software
                solutions that cater to diverse industry needs and meet the
                highest standards of quality.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center"></div>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6">
              {/* Services Navigation */}
              <nav className="w-full">
                <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-medium text-black dark:text-white">
                  Services
                </h2>
                <ul className="list-none m-0 p-0 space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/web-development"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Web Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/mobile-app-development"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Mobile App Development
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/graphics-design"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Graphics Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/digital-marketing"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Digital Marketing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/internet-of-things"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Internet of Things (IoT)
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/cloud-engineering"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Cloud Engineering
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/application-testing-service"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Application Testing Service
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Company Navigation */}
              <nav className="w-full">
                <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-medium text-black dark:text-white">
                  Company
                </h2>
                <ul className="list-none m-0 p-0 space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/about-us"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Terms and Conditions
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Support & Help Navigation */}
              <nav className="w-full">
                <h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-medium text-black dark:text-white">
                  Support & Help
                </h2>
                <ul className="list-none m-0 p-0 space-y-2 sm:space-y-3">
                  <li>
                    <Link
                      href="/contact"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="py-4 sm:py-6 bg-white/20 backdrop-blur mt-8 sm:mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs sm:text-sm lg:text-base text-gray-900 dark:text-gray-300">
            <span className="text-sm sm:text-lg font-light">©</span>2025
            Copyright Way-Wise Tech. All right reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
