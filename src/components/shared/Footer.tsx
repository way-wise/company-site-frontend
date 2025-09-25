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

      <div className="container mx-auto px-2">
        <div className="-mx-4 flex flex-wrap">
          {/* Logo and Description Section */}
          <div className="w-full px-4 md:w-1/2 lg:w-4/12 xl:w-5/12">
            <div className="mb-12 max-w-[360px] lg:mb-16">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-4">
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

              <p className="mb-9 text-base leading-relaxed text-black dark:text-white">
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
          <div className="w-full px-4 sm:w-1/2 md:w-1/2 lg:w-8/12 xl:w-7/12">
            <div className="col-span-2 md:col-span-4 lg:col-span-7 grid grid-cols-4 gap-6 md:grid-cols-8 lg:grid-cols-12">
              {/* Services Navigation */}
              <nav className="col-span-2 md:col-span-4 lg:col-span-4">
                <h2 className="mb-6 md:mb-10 text-xl font-medium text-black dark:text-white">
                  Services
                </h2>
                <ul className="list-none m-0 p-0">
                  <li className="mb-2 leading-6">
                    <Link
                      href="/web-development"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Web Development
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/mobile-app-development"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Mobile App Development
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/graphics-design"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Graphics Design
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/digital-marketing"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Digital Marketing
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/internet-of-things"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Internet of Things (IoT)
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/cloud-engineering"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Cloud Engineering
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/application-testing-service"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Application Testing Service
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Company Navigation */}
              <nav className="col-span-2 md:col-span-4 lg:col-span-4">
                <h2 className="mb-6 md:mb-10 text-xl font-medium text-black dark:text-white">
                  Company
                </h2>
                <ul className="list-none m-0 p-0">
                  <li className="mb-2 leading-6">
                    <Link
                      href="/about-us"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      About Us
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/privacy-policy"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/terms-and-conditions"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Terms and Conditions
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Support & Help Navigation */}
              <nav className="col-span-2 md:col-span-4 lg:col-span-4">
                <h2 className="mb-6 md:mb-10 text-xl font-medium text-black dark:text-white">
                  Support & Help
                </h2>
                <ul className="list-none m-0 p-0">
                  <li className="mb-2 leading-6">
                    <Link
                      href="/contact"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li className="mb-2 leading-6">
                    <Link
                      href="/faq"
                      className="mb-1 md:mb-4 inline-block text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
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
      <div className="py-6 bg-white/20 backdrop-blur">
        <p className="text-center text-base text-gray-900 dark:text-gray-300">
          <span className="text-lg font-light">©</span>2025 Copyright Way-Wise
          Tech. All right reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
