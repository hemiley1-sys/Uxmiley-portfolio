import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Mail, Dribbble } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    { icon: <Twitter size={20} />, href: "#" },
    { icon: <Dribbble size={20} />, href: "#" },
    { icon: <Github size={20} />, href: "#" },
    { icon: <Linkedin size={20} />, href: "#" },
  ];

  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 mb-12">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-display font-bold tracking-tighter text-glow mb-4">
              UXMILEY<span className="text-primary">.</span>
            </h2>
            <p className="text-muted-foreground max-w-xs text-sm">
              Designing experiences that feel inevitable. Crafting digital products at the intersection of beauty and logic.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {socials.map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors glass-panel"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/40 text-xs text-muted-foreground">
          <p>© {currentYear} UXMiley. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
