import { ServiceDetail } from "@/types";

// Import service images
import cloudEngineeringBg from "@/assets/images/services/cloud-engineering.png";
import digitalMarketingBg from "@/assets/images/services/digital-marketing.png";
import graphicsDesignBg from "@/assets/images/services/graphics-design.png";
import internetThingsBg from "@/assets/images/services/internetthings.png";
import mobileAppBg from "@/assets/images/services/mobile-application.png";
import serviceDetails from "@/assets/images/services/service-details.png";
import webAppBg from "@/assets/images/services/web-application.png";

// Import service icons
import cloudIcon from "@/assets/icons/services/cloud.svg";
import digitalIcon from "@/assets/icons/services/digital.png";
import graphicsIcon from "@/assets/icons/services/graphics.svg";
import internetIcon from "@/assets/icons/services/internet.svg";
import mobileIcon from "@/assets/icons/services/mobile.svg";
import webIcon from "@/assets/icons/services/web.png";

export const servicesData: ServiceDetail[] = [
  {
    id: 1,
    title: "Web Application",
    slug: "web-application",
    description:
      "Build responsive and scalable web applications that improve user engagement and business operations.",
    bgImage: webAppBg,
    url: "/services/web-application",
    icon: webIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "At Way-Wise Tech, we transform your digital vision into reality through cutting-edge web development solutions. Our team of skilled developers crafts websites and web applications that not only look stunning but also deliver exceptional performance and user experience. We create tailor-made websites that perfectly align with your brand identity and business goals. From small online stores to large-scale marketplaces, we build robust e-commerce platforms that drive sales and enhance customer engagement. We develop easy-to-use CMS solutions that empower you to manage your website content effortlessly. Our PWAS combine the best of web and mobile apps, offering seamless experiences across all devices. We create and integrate APIs to enhance your website's functionality and connectivity with third-party services.",
    expertiseAreas: [
      {
        number: "01",
        title: "Custom Website Development",
        description:
          "We create tailor-made websites that perfectly align\nwith your brand identity and business goals.",
      },
      {
        number: "02",
        title: "E-commerce Solutions",
        description:
          "From small shops to big marketplaces, we build e-commerce\nplatforms that boost sales and engagement.",
      },
      {
        number: "03",
        title: "Content Management Systems (CMS)",
        description:
          "We develop easy-to-use CMS solutions that empower\nyou to manage your website content effortlessly.",
      },
      {
        number: "04",
        title: "API Development and Integration",
        description:
          "We create and integrate APIs to enhance your website's\nfunctionality and connectivity with third-party services.",
      },
    ],
    serviceOutcomes: [
      "Innovative Solutions Showcase",
      "Success Stories Variety",
      "Industry-specific Transformations",
      "Business Reinvention Illustration",
      "Impactful Change Demonstrations",
      "Strategic Vision Reflection",
    ],
  },
  {
    id: 2,
    title: "Mobile Application",
    slug: "mobile-application",
    description:
      "Develop intuitive mobile apps for iOS and Android to reach customers on the go and boost retention.",
    bgImage: mobileAppBg,
    url: "/services/mobile-application",
    icon: mobileIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "Transform your business with powerful mobile applications that engage users and drive growth. Our expert team develops native and cross-platform mobile apps for iOS and Android, ensuring seamless performance and exceptional user experiences. We leverage the latest technologies including React Native, Flutter, and Swift to create apps that are fast, reliable, and scalable. From concept to deployment, we handle every aspect of mobile app development with precision and creativity.",
    expertiseAreas: [
      {
        number: "01",
        title: "Native iOS & Android Development",
        description:
          "Build high-performance native apps using Swift and Kotlin\nfor optimal user experience and device integration.",
      },
      {
        number: "02",
        title: "Cross-Platform Development",
        description:
          "Develop apps once and deploy to both iOS and Android\nusing React Native or Flutter for cost efficiency.",
      },
      {
        number: "03",
        title: "Mobile UI/UX Design",
        description:
          "Create intuitive and engaging mobile interfaces that\ndelight users and drive app retention and engagement.",
      },
      {
        number: "04",
        title: "App Maintenance & Support",
        description:
          "Provide ongoing support, updates, and optimization\nto ensure your app remains competitive and bug-free.",
      },
    ],
    serviceOutcomes: [
      "Enhanced User Engagement",
      "Cross-Platform Compatibility",
      "Scalable Architecture",
      "Seamless Performance",
      "Increased Customer Retention",
      "Revenue Growth Opportunities",
    ],
  },
  {
    id: 3,
    title: "Digital Marketing",
    slug: "digital-marketing",
    description:
      "Create targeted marketing campaigns that increase brand awareness and drive measurable conversions.",
    bgImage: digitalMarketingBg,
    url: "/services/digital-marketing",
    icon: digitalIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "Elevate your brand with data-driven digital marketing strategies that deliver real results. Our comprehensive approach combines SEO, social media marketing, content marketing, PPC advertising, and email campaigns to maximize your online presence. We analyze market trends, understand your target audience, and craft personalized campaigns that resonate with your customers. From increasing brand awareness to driving conversions, we help you achieve your business goals through strategic digital marketing.",
    expertiseAreas: [
      {
        number: "01",
        title: "Search Engine Optimization (SEO)",
        description:
          "Improve your website's visibility in search results\nand drive organic traffic with proven SEO strategies.",
      },
      {
        number: "02",
        title: "Social Media Marketing",
        description:
          "Build and engage your community across platforms\nlike Facebook, Instagram, LinkedIn, and Twitter.",
      },
      {
        number: "03",
        title: "Pay-Per-Click (PPC) Advertising",
        description:
          "Generate immediate results with targeted ad campaigns\non Google Ads, Facebook Ads, and other platforms.",
      },
      {
        number: "04",
        title: "Content Marketing & Strategy",
        description:
          "Create compelling content that attracts, educates,\nand converts your target audience into loyal customers.",
      },
    ],
    serviceOutcomes: [
      "Increased Brand Visibility",
      "Higher Conversion Rates",
      "Improved ROI",
      "Enhanced Customer Engagement",
      "Data-Driven Insights",
      "Competitive Market Position",
    ],
  },
  {
    id: 4,
    title: "Graphics Design",
    slug: "graphics-design",
    description:
      "Design visually appealing graphics that communicate your brand message effectively across platforms.",
    bgImage: graphicsDesignBg,
    url: "/services/graphics-design",
    icon: graphicsIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "Bring your brand to life with stunning visual designs that captivate and inspire. Our creative team specializes in crafting unique brand identities, eye-catching marketing materials, and engaging digital designs. From logos and branding to social media graphics and print materials, we ensure every design element reflects your brand's personality and values. We combine creativity with strategic thinking to deliver designs that not only look beautiful but also drive business results.",
    expertiseAreas: [
      {
        number: "01",
        title: "Brand Identity Design",
        description:
          "Create memorable logos, color palettes, and brand\nguidelines that establish a strong visual identity.",
      },
      {
        number: "02",
        title: "Marketing Collateral",
        description:
          "Design brochures, flyers, business cards, and other\nmaterials that effectively promote your business.",
      },
      {
        number: "03",
        title: "Digital Graphics & Social Media",
        description:
          "Produce engaging graphics for websites, social media,\nand digital campaigns that capture attention.",
      },
      {
        number: "04",
        title: "Packaging & Product Design",
        description:
          "Develop innovative packaging designs that enhance\nproduct appeal and drive sales in the market.",
      },
    ],
    serviceOutcomes: [
      "Distinctive Brand Identity",
      "Professional Visual Assets",
      "Consistent Brand Image",
      "Enhanced Market Appeal",
      "Improved Brand Recognition",
      "Creative Excellence",
    ],
  },
  {
    id: 5,
    title: "AI Integration",
    slug: "ai-integration",
    description:
      "Implement smart IoT solutions to connect devices, gather insights, and optimize processes in real time.",
    bgImage: internetThingsBg,
    url: "/services/internet-of-things",
    icon: cloudIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "Unlock the power of connected devices with our advanced IoT solutions. We design and implement smart systems that collect, analyze, and act on real-time data from sensors and devices. From smart homes to industrial automation, our IoT expertise helps businesses optimize operations, reduce costs, and create innovative products. We work with cutting-edge technologies including Arduino, Raspberry Pi, AWS IoT, and Azure IoT to build scalable and secure IoT ecosystems.",
    expertiseAreas: [
      {
        number: "01",
        title: "IoT System Architecture",
        description:
          "Design robust IoT architectures that seamlessly connect\ndevices, sensors, and cloud platforms for data flow.",
      },
      {
        number: "02",
        title: "Smart Home Solutions",
        description:
          "Develop intelligent home automation systems that\nenhance comfort, security, and energy efficiency.",
      },
      {
        number: "03",
        title: "Industrial IoT (IIoT)",
        description:
          "Implement industrial IoT solutions for predictive\nmaintenance, monitoring, and process optimization.",
      },
      {
        number: "04",
        title: "IoT Data Analytics",
        description:
          "Transform device data into actionable insights\nusing advanced analytics and machine learning.",
      },
    ],
    serviceOutcomes: [
      "Real-time Monitoring & Control",
      "Operational Efficiency",
      "Cost Reduction",
      "Predictive Maintenance",
      "Data-Driven Decision Making",
      "Scalable Infrastructure",
    ],
  },
  {
    id: 6,
    title: "Cloud Engineering",
    slug: "cloud-engineering",
    description:
      "Design and maintain secure cloud infrastructure that scales with your business needs efficiently.",
    bgImage: cloudEngineeringBg,
    url: "/services/cloud-engineering",
    icon: internetIcon,
    videoImage: serviceDetails,
    detailedDescription:
      "Modernize your infrastructure with cloud engineering solutions that provide flexibility, scalability, and security. Our cloud experts help you migrate to the cloud, optimize existing cloud environments, and build cloud-native applications. We work with leading cloud platforms including AWS, Azure, and Google Cloud to design architectures that meet your performance, security, and budget requirements. From serverless computing to containerization, we leverage the latest cloud technologies to drive innovation.",
    expertiseAreas: [
      {
        number: "01",
        title: "Cloud Migration & Strategy",
        description:
          "Plan and execute seamless cloud migrations with\nminimal disruption to your business operations.",
      },
      {
        number: "02",
        title: "Cloud Infrastructure Design",
        description:
          "Build scalable and resilient cloud architectures\nusing AWS, Azure, or Google Cloud Platform.",
      },
      {
        number: "03",
        title: "DevOps & CI/CD",
        description:
          "Implement automated deployment pipelines and DevOps\npractices for faster, more reliable software delivery.",
      },
      {
        number: "04",
        title: "Cloud Security & Compliance",
        description:
          "Ensure your cloud infrastructure meets security\nstandards and regulatory compliance requirements.",
      },
    ],
    serviceOutcomes: [
      "Scalable Infrastructure",
      "Cost Optimization",
      "Enhanced Security",
      "High Availability",
      "Faster Time to Market",
      "Disaster Recovery",
    ],
  },
];
