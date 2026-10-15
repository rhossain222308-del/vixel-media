'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Founder, Project } from '@/types';
import { 
  Sparkles, 
  MapPin, 
  Award, 
  ArrowRight, 
  Film, 
  Wrench, 
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VideoCard } from '@/components/video/VideoCard';
import { VideoPlayerModal } from '@/components/video/VideoPlayerModal';
import { sampleFounders } from '@/data/founders';

interface PortfolioDetailViewProps {
  founder: Founder;
  projects: Project[];
}

export const PortfolioDetailView: React.FC<PortfolioDetailViewProps> = ({
  founder,
  projects,
}) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const otherFounder = sampleFounders.find((f) => f.id !== founder.id);

  return (
    <div className="py-8 sm:py-14 md:py-20">
      {/* Video Modal */}
      <VideoPlayerModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Sample Profile Staging Notice Banner */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-amber-200 leading-tight">
              <strong>Staged Co-Founder Portfolio:</strong> This profile uses sample metadata. In Phase 2, co-founders will log in via Supabase to edit their portfolio, upload new cuts, and manage projects.
            </span>
          </div>
          <Badge variant="sample" size="sm">Staged Profile</Badge>
        </div>

        {/* Profile Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-[#14141B] border border-white/10 shadow-2xl">
          {/* Cover photo */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-black">
            {founder.coverUrl && (
              <Image
                src={founder.coverUrl}
                alt=""
                fill
                priority
                className="object-cover opacity-40"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#14141B] via-[#14141B]/60 to-transparent" />
          </div>

          {/* Profile details bar */}
          <div className="relative px-6 sm:px-10 pb-8 sm:pb-10 -mt-24 sm:-mt-28 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-[#14141B] shadow-2xl bg-gray-900 shrink-0">
                <Image
                  src={founder.avatarUrl}
                  alt={founder.name}
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="purple" size="sm">Co-Founder</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-violet-400" />
                    {founder.location}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-violet-300 font-mono">
                    {founder.yearsExperience}+ Years Production
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
                  {founder.name}
                </h1>
                <p className="text-sm sm:text-base text-violet-400 font-medium mt-1">
                  {founder.role}
                </p>
              </div>
            </div>

            {/* CTAs & Socials */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Button
                href={`/contact?founder=${encodeURIComponent(founder.name)}`}
                variant="primary"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Book with {founder.name.split(' ')[0]}
              </Button>

              <div className="flex items-center justify-center gap-2">
                {founder.socials.youtube && (
                  <a
                    href={founder.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <YoutubeIcon size={16} />
                  </a>
                )}
                {founder.socials.instagram && (
                  <a
                    href={founder.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <InstagramIcon size={16} />
                  </a>
                )}
                {founder.socials.linkedin && (
                  <a
                    href={founder.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <LinkedinIcon size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Column: About Me, Skills, Tools, Clients */}
          <div className="space-y-8">
            {/* About Me Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B] border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                About Me
              </h2>

              <p className="text-xs sm:text-sm text-gray-300 italic mb-4 border-l-2 border-violet-500/50 pl-3">
                &ldquo;{founder.tagline}&rdquo;
              </p>

              <div className="space-y-3 text-xs sm:text-sm text-gray-400 leading-relaxed">
                {founder.fullBio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Skills & Competencies */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B] border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-400" />
                Specialized Skills
              </h2>

              <div className="space-y-4">
                {founder.skills.map((skill, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-gray-300">{skill.name}</span>
                      <span className="text-violet-400 font-mono">{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-500"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tools Used */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B] border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-violet-400" />
                Production Software & Hardware
              </h2>

              <div className="grid grid-cols-1 gap-2.5">
                {founder.tools.map((tool, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white">{tool.name}</span>
                    <span className="text-violet-400 font-mono text-[11px]">{tool.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#14141B] border border-white/10">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-violet-400" />
                Production Experience
              </h2>

              <div className="space-y-5 border-l border-white/10 ml-2 pl-4">
                {founder.experience.map((exp, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-violet-500 border-2 border-[#14141B]" />
                    <div className="text-[11px] font-mono text-violet-400">{exp.year}</div>
                    <div className="text-sm font-semibold text-white mt-0.5">{exp.role}</div>
                    <div className="text-xs text-gray-400">{exp.companyOrClient}</div>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Clients */}
            <div className="p-6 rounded-3xl bg-[#14141B] border border-white/10">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Selected Collaborations:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {founder.sampleClients.map((client, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300 font-mono"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2 Columns: Best Works Video Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Signature Works & Edits
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Curated projects edited and directed personally by {founder.name}.
                </p>
              </div>
              <span className="text-xs font-mono text-violet-400 bg-violet-950/40 px-3 py-1 rounded-full border border-violet-500/30">
                {projects.length} Works Showcase
              </span>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <VideoCard
                    key={project.id}
                    project={project}
                    onSelect={handleOpenProject}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-[#14141B] border border-white/10 text-center">
                <Film className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-white">No founder projects linked yet</h3>
                <p className="text-xs text-gray-400">Additional video cuts will be ingested via Supabase CMS.</p>
              </div>
            )}

            {/* Switch to Other Founder */}
            {otherFounder && (
              <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-mono uppercase">Explore Co-Founder</div>
                  <div className="text-sm font-bold text-white">{otherFounder.name} — {otherFounder.role}</div>
                </div>
                <Button
                  href={`/portfolio/${otherFounder.slug}`}
                  variant="outline"
                  size="sm"
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  View {otherFounder.name.split(' ')[0]}&apos;s Portfolio
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
