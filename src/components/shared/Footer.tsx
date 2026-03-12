import Logo from "@/assets/images/shared/way-wise-logo.svg";
import LogoText from "@/assets/images/shared/way-wise-text.png";
import Image from "next/image";
import Link from "next/link";
import CalendlyButton from "./CalendlyButton";

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

			<div className="container ">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
					{/* Logo and Description Section */}
					<div className="lg:col-span-5">
						<div className="mb-4 lg:mb-16">
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

							<p className=" md:mr-6 text-sm sm:text-base leading-relaxed text-gray-600 dark:text-white">
								Way Wise Tech is a leading Web and Software Development Company in the USA, delivering innovative custom software development solutions for businesses worldwide. Our experienced team specializes in web application development, mobile app development, and enterprise software solutions, helping organizations build scalable and high-performance digital products. Through modern technologies, cloud engineering services, and full-stack development expertise, we empower businesses to accelerate growth and achieve successful digital transformation with secure, reliable, and results-driven software solutions.
							</p>

							{/* Social Media Links */}
							<div className="mt-3 flex gap-5 items-center">
								<Link
									href="https://www.facebook.com/WayWiseTech/"
									target="_blank"
									className="text-black hover:text-black transition-colors"
									aria-label="Facebook"
								>
									<svg
										fill="#000000"
										width="40px"
										height="40px"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g id="SVGRepo_bgCarrier" strokeWidth={0} />
										<g
											id="SVGRepo_tracerCarrier"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<g id="SVGRepo_iconCarrier">
											{" "}
											<path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />{" "}
										</g>
									</svg>
								</Link>

								<Link
									href="https://github.com/way-wise"
									target="_blank"
									className="text-black hover:text-black transition-colors"
									aria-label="Github"
								>
									<svg
										width="30px"
										height="30px"
										viewBox="0 0 20 20"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										fill="#000000"
									>
										<g id="SVGRepo_bgCarrier" strokeWidth={0} />
										<g
											id="SVGRepo_tracerCarrier"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<g id="SVGRepo_iconCarrier">
											{" "}
											<title>github [#142]</title>{" "}
											<desc>Created with Sketch.</desc> <defs> </defs>{" "}
											<g
												id="Page-1"
												stroke="none"
												strokeWidth={1}
												fill="none"
												fillRule="evenodd"
											>
												{" "}
												<g
													id="Dribbble-Light-Preview"
													transform="translate(-140.000000, -7559.000000)"
													fill="#000000"
												>
													{" "}
													<g
														id="icons"
														transform="translate(56.000000, 160.000000)"
													>
														{" "}
														<path
															d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399"
															id="github-[#142]"
														>
															{" "}
														</path>{" "}
													</g>{" "}
												</g>{" "}
											</g>{" "}
										</g>
									</svg>
								</Link>
								<Link
									href="https://www.youtube.com/@WayWiseTech"
									target="_blank"
									className="text-black hover:text-black transition-colors"
									aria-label="YouTube"
								>
									<svg
										width="30"
										height="30"
										viewBox="0 -3 20 20"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										fill="#000000"
									>
										<g id="SVGRepo_bgCarrier" strokeWidth={0} />
										<g
											id="SVGRepo_tracerCarrier"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<g id="SVGRepo_iconCarrier">
											{" "}
											<title>youtube [#168]</title>{" "}
											<desc>Created with Sketch.</desc> <defs> </defs>{" "}
											<g
												id="Page-1"
												stroke="none"
												strokeWidth={1}
												fill="none"
												fillRule="evenodd"
											>
												{" "}
												<g
													id="Dribbble-Light-Preview"
													transform="translate(-300.000000, -7442.000000)"
													fill="#000000"
												>
													{" "}
													<g
														id="icons"
														transform="translate(56.000000, 160.000000)"
													>
														{" "}
														<path
															d="M251.988432,7291.58588 L251.988432,7285.97425 C253.980638,7286.91168 255.523602,7287.8172 257.348463,7288.79353 C255.843351,7289.62824 253.980638,7290.56468 251.988432,7291.58588 M263.090998,7283.18289 C262.747343,7282.73013 262.161634,7282.37809 261.538073,7282.26141 C259.705243,7281.91336 248.270974,7281.91237 246.439141,7282.26141 C245.939097,7282.35515 245.493839,7282.58153 245.111335,7282.93357 C243.49964,7284.42947 244.004664,7292.45151 244.393145,7293.75096 C244.556505,7294.31342 244.767679,7294.71931 245.033639,7294.98558 C245.376298,7295.33761 245.845463,7295.57995 246.384355,7295.68865 C247.893451,7296.0008 255.668037,7296.17532 261.506198,7295.73552 C262.044094,7295.64178 262.520231,7295.39147 262.895762,7295.02447 C264.385932,7293.53455 264.28433,7285.06174 263.090998,7283.18289"
															id="youtube-[#168]"
														>
															{" "}
														</path>{" "}
													</g>{" "}
												</g>{" "}
											</g>{" "}
										</g>
									</svg>
								</Link>
								<Link
									href="https://www.linkedin.com/company/waywisetech"
									target="_blank"
									className="text-black hover:text-black transition-colors"
									aria-label="Linkedin"
								>
									<svg
										fill="#000000"
										version="1.1"
										xmlns="http://www.w3.org/2000/svg"
										xmlnsXlink="http://www.w3.org/1999/xlink"
										width="30px"
										height="30px"
										viewBox="0 0 512 512"
										xmlSpace="preserve"
									>
										<g id="SVGRepo_bgCarrier" strokeWidth={0} />
										<g
											id="SVGRepo_tracerCarrier"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<g id="SVGRepo_iconCarrier">
											{" "}
											<g id="7935ec95c421cee6d86eb22ecd125aef">
												{" "}
												<path
													style={{
														display: "inline",
														fillRule: "evenodd",
														clipRule: "evenodd",
													}}
													d="M116.504,500.219V170.654H6.975v329.564H116.504 L116.504,500.219z M61.751,125.674c38.183,0,61.968-25.328,61.968-56.953c-0.722-32.328-23.785-56.941-61.252-56.941 C24.994,11.781,0.5,36.394,0.5,68.722c0,31.625,23.772,56.953,60.53,56.953H61.751L61.751,125.674z M177.124,500.219 c0,0,1.437-298.643,0-329.564H286.67v47.794h-0.727c14.404-22.49,40.354-55.533,99.44-55.533 c72.085,0,126.116,47.103,126.116,148.333v188.971H401.971V323.912c0-44.301-15.848-74.531-55.497-74.531 c-30.254,0-48.284,20.38-56.202,40.08c-2.897,7.012-3.602,16.861-3.602,26.711v184.047H177.124L177.124,500.219z"
												>
													{" "}
												</path>{" "}
											</g>{" "}
										</g>
									</svg>
								</Link>
							</div>
						</div>
					</div>

					{/* Navigation Links Section */}
					<div className="lg:col-span-7">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-6">
							{/* Services Navigation */}
							<nav className="w-full">
								<h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
									Services
								</h2>
								<ul className="list-none m-0 p-0 space-y-2 sm:space-y-3">
									<li>
										<Link
											href="/services/web-application"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Web Development
										</Link>
									</li>
									<li>
										<Link
											href="/services/mobile-application"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Mobile App Development
										</Link>
									</li>
									<li>
										<Link
											href="/services/graphics-design"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Graphics Design
										</Link>
									</li>
									<li>
										<Link
											href="/services/digital-marketing"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Digital Marketing
										</Link>
									</li>
									<li>
										<Link
											href="/services/ai-integration"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											AI Integration
										</Link>
									</li>
									<li>
										<Link
											href="/services/cloud-engineering"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Cloud Engineering
										</Link>
									</li>
								</ul>
							</nav>

							{/* Company Navigation */}
							<nav className="w-full">
								<h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
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
								<h2 className="mb-4 sm:mb-6 text-lg sm:text-xl font-bold text-black dark:text-white">
									Support & Help
								</h2>
								<ul className="list-none m-0 p-0 space-y-2 sm:space-y-3">
									<li>
										<div className="">
											<CalendlyButton
												buttonText="Book a Meeting"
												url="https://calendly.com/way-wise-tech/marketing-growth-call"
												className="max-w-[200px] !py-3 !text-sm !px-6"
											/>
										</div>
									</li>
									<li>
										<Link
											href="/contact-us"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Contact Us
										</Link>
									</li>
									<li>
										<Link
											href="/blog"
											className="inline-block text-sm sm:text-base text-black duration-300 hover:text-primary dark:text-gray-300 dark:hover:text-primary no-underline"
										>
											Blog
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
						Copyright Way-Wise Tech. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
