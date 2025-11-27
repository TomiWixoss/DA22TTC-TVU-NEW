"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Terminal, ArrowLeft, Cpu, Zap, Database, Code2, GraduationCap, Star } from "lucide-react";
import { GlitchText, NeonBorder, MagneticPixels, HackerText, TechBadge } from "@/shared/components/tech";

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface SecretProfileProps {
  onBack: () => void;
}

const techStack = [
  { name: "TypeScript", level: 90, color: "#3178c6" },
  { name: "JavaScript", level: 88, color: "#f7df1e" },
  { name: "Python", level: 80, color: "#3776ab" },
  { name: "Dart/Flutter", level: 75, color: "#02569B" },
  { name: "C#", level: 70, color: "#239120" },
];

const stats = [
  { label: "REPOS", value: "71", icon: Code2 },
  { label: "STARS", value: "52", icon: Star },
  { label: "COMMITS", value: "1.4K+", icon: Database },
  { label: "KHÓA", value: "2022", icon: GraduationCap },
];

export const SecretProfile: React.FC<SecretProfileProps> = ({ onBack }) => {
  const [isHoveringBack, setIsHoveringBack] = useState(false);

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.95,
      }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      exit={{ 
        opacity: 0,
        scale: 0.95,
      }}
      transition={{ 
        duration: 0.4, 
        ease: "easeOut",
      }}
      className="fixed inset-0 z-[60] bg-black overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <MagneticPixels 
          pixelSize={3}
          gridGap={35}
          color="#00ff88"
          mouseRadius={100}
          mouseStrength={0.5}
          springStrength={0.06}
          friction={0.88}
          className="opacity-50"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      </div>

      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,136,0.03) 2px,rgba(0,255,136,0.03) 4px)" }}
      />

      {/* Main Container */}
      <div className="relative h-full flex items-center justify-center p-4 sm:p-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onBack}
          onMouseEnter={() => setIsHoveringBack(true)}
          onMouseLeave={() => setIsHoveringBack(false)}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-3 py-1.5 border border-[#00ff88]/50 text-[#00ff88] font-mono text-xs hover:bg-[#00ff88]/10 transition-all"
        >
          <ArrowLeft className={`w-3 h-3 transition-transform ${isHoveringBack ? "-translate-x-1" : ""}`} />
          <span>ESC</span>
        </motion.button>

        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6"
        >
          <TechBadge variant="warning" size="sm" pulse>CLASSIFIED</TechBadge>
        </motion.div>

        {/* Data Panel */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 15 }}
          className="w-full max-w-3xl"
        >
          <NeonBorder color="#00ff88" intensity="medium" animated>
            <div className="bg-black/90 border border-[#00ff88]/20">
              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#00ff88]/20 bg-[#00ff88]/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span className="text-[10px] font-mono text-[#00ff88]/70">PROFILE_DATA.SYS</span>
                </div>
                <span className="text-[10px] font-mono text-[#00ff88]/50">ID:TS-2024</span>
              </div>

              {/* Content Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Identity */}
                <div className="space-y-4">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border border-[#00ff88] bg-[#00ff88]/10 flex items-center justify-center">
                        <Terminal className="w-8 h-8 text-[#00ff88]" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00ff88] animate-pulse" />
                    </div>
                    <div>
                      <HackerText className="text-xl font-bold text-white" color="#00ff88" triggerOnHover={false}>
                        Nguyễn Huỳnh Phú Vinh
                      </HackerText>
                      <p className="text-xs font-mono text-[#00ff88]/60 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Trà Vinh, Việt Nam
                      </p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="p-3 border border-[#00ff88]/20 bg-[#00ff88]/5">
                    <p className="text-[10px] font-mono text-[#00ff88]/50 mb-1">CHỨC DANH</p>
                    <GlitchText className="text-sm font-mono text-white" intensity="low">
                      Sinh viên CNTT - Đại học Trà Vinh
                    </GlitchText>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {stats.map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="p-2 border border-[#00ff88]/10 bg-[#00ff88]/5 text-center"
                      >
                        <stat.icon className="w-3 h-3 text-[#00ff88]/50 mx-auto mb-1" />
                        <p className="text-xs font-mono font-bold text-[#00ff88]">{stat.value}</p>
                        <p className="text-[8px] font-mono text-[#00ff88]/40">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    <motion.a
                      href="https://github.com/NguyenHuynhPhuVinh"
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#00ff88]/30 text-[#00ff88] font-mono text-xs hover:bg-[#00ff88]/10 transition-all"
                    >
                      <GitHubIcon className="w-3 h-3" />
                      <span>GitHub</span>
                    </motion.a>
                    <motion.a
                      href="mailto:110122203@st.tvu.edu.vn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-[#00d4ff]/30 text-[#00d4ff] font-mono text-xs hover:bg-[#00d4ff]/10 transition-all"
                    >
                      <Mail className="w-3 h-3" />
                      <span>Email</span>
                    </motion.a>
                  </div>
                </div>

                {/* Right: Tech Stack */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-3 h-3 text-[#00ff88]" />
                    <span className="text-[10px] font-mono text-[#00ff88]/70">TECH_STACK</span>
                  </div>
                  
                  {techStack.map((tech, i) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.08 }}
                      className="space-y-1"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-white/80">{tech.name}</span>
                        <span className="text-[10px] font-mono" style={{ color: tech.color }}>{tech.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 border border-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${tech.level}%` }}
                          transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                          className="h-full"
                          style={{ 
                            background: `linear-gradient(90deg, ${tech.color}80, ${tech.color})`,
                            boxShadow: `0 0 8px ${tech.color}60`,
                          }}
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Bio Terminal */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 p-3 border border-[#00ff88]/10 bg-black/50 font-mono text-[10px] text-[#00ff88]/70"
                  >
                    <p className="text-[#00ff88]/40 mb-1">{">"} cat gioi_thieu.txt</p>
                    <p className="text-white/60 leading-relaxed">
                      Sinh viên năm 4 ngành Công nghệ Thông tin - Trường Kỹ thuật và Công nghệ, 
                      Đại học Trà Vinh (2022-2026). Đam mê phát triển ứng dụng với AI, 
                      tác giả của MasterContext và nhiều dự án mã nguồn mở.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-[#00ff88]/10 flex items-center justify-between">
                <span className="text-[8px] font-mono text-[#00ff88]/30">ACCESS_GRANTED</span>
                <span className="text-[8px] font-mono text-[#00ff88]/30">v2.0.24</span>
              </div>
            </div>
          </NeonBorder>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SecretProfile;
