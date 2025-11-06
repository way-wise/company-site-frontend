import SectionTitle from "@/components/modules/home/SectionTitle";

interface Skill {
  id: number;
  name: string;
  category: string;
  icon: string;
  gradient: string;
}

interface SkillGroup {
  title: string;
  description: string;
  skills: Skill[];
}

const Skills = () => {
  const webDevelopmentSkills: Skill[] = [
    {
      id: 1,
      name: "React",
      category: "Frontend",
      icon: "⚛️",
      gradient: "bg-gradient-to-br from-cyan-400 to-blue-500",
    },
    {
      id: 2,
      name: "Next.js",
      category: "Frontend",
      icon: "▲",
      gradient: "bg-gradient-to-br from-gray-800 to-black",
    },
    {
      id: 3,
      name: "TypeScript",
      category: "Language",
      icon: "📘",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      id: 4,
      name: "Node.js",
      category: "Backend",
      icon: "🟢",
      gradient: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      id: 5,
      name: "AWS",
      category: "Cloud",
      icon: "☁️",
      gradient: "bg-gradient-to-br from-orange-400 to-orange-600",
    },
    {
      id: 6,
      name: "Azure",
      category: "Cloud",
      icon: "🔵",
      gradient: "bg-gradient-to-br from-blue-400 to-blue-600",
    },
    {
      id: 7,
      name: "React Native",
      category: "Mobile",
      icon: "📱",
      gradient: "bg-gradient-to-br from-purple-400 to-purple-600",
    },
    {
      id: 8,
      name: "Flutter",
      category: "Mobile",
      icon: "🐦",
      gradient: "bg-gradient-to-br from-teal-400 to-cyan-500",
    },
    {
      id: 9,
      name: "UI/UX Design",
      category: "Design",
      icon: "🎨",
      gradient: "bg-gradient-to-br from-pink-400 to-rose-500",
    },
    {
      id: 10,
      name: "SEO",
      category: "Marketing",
      icon: "🔍",
      gradient: "bg-gradient-to-br from-yellow-400 to-amber-500",
    },
    {
      id: 11,
      name: "AI/ML",
      category: "AI",
      icon: "🤖",
      gradient: "bg-gradient-to-br from-indigo-400 to-purple-500",
    },
    {
      id: 12,
      name: "DevOps",
      category: "Infrastructure",
      icon: "⚙️",
      gradient: "bg-gradient-to-br from-slate-400 to-slate-600",
    },
  ];

  const microsoftSupportSkills: Skill[] = [
    {
      id: 13,
      name: "Identity & Access Management",
      category: "Microsoft 365",
      icon: "🔐",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-700",
    },
    {
      id: 14,
      name: "Azure AD / Entra ID",
      category: "Identity",
      icon: "🆔",
      gradient: "bg-gradient-to-br from-indigo-500 to-indigo-700",
    },
    {
      id: 15,
      name: "Exchange & Messaging",
      category: "Microsoft 365",
      icon: "📧",
      gradient: "bg-gradient-to-br from-green-500 to-green-700",
    },
    {
      id: 16,
      name: "SharePoint Online",
      category: "Microsoft 365",
      icon: "📁",
      gradient: "bg-gradient-to-br from-teal-500 to-teal-700",
    },
    {
      id: 17,
      name: "Microsoft Teams",
      category: "Collaboration",
      icon: "💬",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-700",
    },
    {
      id: 18,
      name: "Security & Compliance",
      category: "Microsoft 365",
      icon: "🛡️",
      gradient: "bg-gradient-to-br from-red-500 to-red-700",
    },
    {
      id: 19,
      name: "Microsoft Copilot",
      category: "AI Services",
      icon: "🤖",
      gradient: "bg-gradient-to-br from-violet-500 to-violet-700",
    },
    {
      id: 20,
      name: "SCIM Provisioning",
      category: "Identity",
      icon: "🔄",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    },
    {
      id: 21,
      name: "Microsoft Defender",
      category: "Security",
      icon: "🔒",
      gradient: "bg-gradient-to-br from-orange-500 to-orange-700",
    },
    {
      id: 22,
      name: "Azure Kubernetes",
      category: "Cloud",
      icon: "☸️",
      gradient: "bg-gradient-to-br from-blue-600 to-blue-800",
    },
  ];

  const skillGroups: SkillGroup[] = [
    {
      title: "Our Web Development Skills",
      description:
        "Modern web technologies and frameworks for building scalable, high-performance applications.",
      skills: webDevelopmentSkills,
    },
    {
      title: "Our Microsoft Support Skills",
      description:
        "Comprehensive Microsoft 365 and Azure expertise for enterprise-level support and implementation.",
      skills: microsoftSupportSkills,
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-t from-green-300 to-purple-500">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <SectionTitle
            title="Our Core Skills & Technologies"
            description="We leverage cutting-edge technologies and industry best practices to deliver exceptional digital solutions. Our expertise spans across modern web frameworks, cloud platforms, mobile development, Microsoft 365 services, enterprise security, and emerging technologies."
            titleClass="text-white text-4xl pb-4 xl:text-[55px] font-bold"
            descriptionClass="text-gray-100 text-base xl:text-[20px]"
          />
        </div>

        <div className="space-y-16 lg:space-y-20">
          {skillGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-8 p-3 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-black">
                  {group.title}
                </h3>
                <p className="text-gray-900 text-base md:text-lg max-w-3xl">
                  {group.description}
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-6 xl:gap-8">
                {group.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-3 md:p-6 border border-white/20 hover:bg-white/15 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl group"
                  >
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="text-4xl xl:text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        {skill.icon}
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm xl:text-lg leading-tight">
                        {skill.name}
                      </h4>
                      <span className="text-gray-700 text-[10px] xl:text-sm font-medium bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;