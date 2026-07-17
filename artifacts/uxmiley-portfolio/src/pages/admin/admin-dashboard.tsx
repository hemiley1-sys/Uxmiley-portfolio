import { Link } from "wouter";
import { ArrowRight, LayoutDashboard, Type, User, Briefcase, FolderGit2, History, MessageSquareQuote, PenTool, Mail } from "lucide-react";
import { useGetHero, useGetAbout, useListSkills, useListProjects } from "@workspace/api-client-react";

export default function AdminDashboard() {
  const { data: hero } = useGetHero();
  const { data: about } = useGetAbout();
  const { data: skills } = useListSkills();
  const { data: projects } = useListProjects();

  const sections = [
    { name: "Hero Section", path: "/admin/hero", icon: Type, description: "Main heading and introductory text", stats: hero ? "Configured" : "Missing" },
    { name: "About", path: "/admin/about", icon: User, description: "Biography and statistics", stats: about?.stats?.length ? `${about.stats.length} Stats` : "No stats" },
    { name: "Skills & Services", path: "/admin/skills", icon: Briefcase, description: "Tech stack and offerings", stats: skills ? `${skills.length} Skills` : "0 Skills" },
    { name: "Projects", path: "/admin/projects", icon: FolderGit2, description: "Portfolio case studies", stats: projects ? `${projects.length} Projects` : "0 Projects" },
    { name: "Experience", path: "/admin/experience", icon: History, description: "Work history timeline" },
    { name: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote, description: "Client feedback and quotes" },
    { name: "Articles", path: "/admin/articles", icon: PenTool, description: "Blog posts and musings" },
    { name: "Contact Info", path: "/admin/contact", icon: Mail, description: "Email, location, and social links" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <LayoutDashboard className="text-primary" /> Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-2">Manage your portfolio content from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link key={section.path} href={section.path}>
              <div className="group bg-card border border-border hover:border-primary/50 rounded-xl p-6 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon size={20} />
                  </div>
                  <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 duration-300" />
                </div>
                <h3 className="font-bold text-lg mb-1">{section.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{section.description}</p>
                {section.stats && (
                  <div className="text-xs font-medium text-primary bg-primary/10 inline-flex items-center px-2 py-1 rounded w-max">
                    {section.stats}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}