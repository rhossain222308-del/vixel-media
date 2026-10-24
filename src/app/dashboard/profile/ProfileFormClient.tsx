'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  User, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  ExternalLink,
  Plus,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ImageUpload } from '@/components/dashboard/ImageUpload';
import { updateFounderProfileAction } from '@/lib/actions/profile';
import type { ProfileRow } from '@/types/database.types';

interface ProfileFormClientProps {
  initialProfile: ProfileRow | null;
  userEmail: string;
  userId: string;
}

export function ProfileFormClient({
  initialProfile,
  userEmail,
  userId,
}: ProfileFormClientProps) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState(initialProfile?.full_name || '');
  const [slug, setSlug] = useState(initialProfile?.slug || '');
  const [role, setRole] = useState(initialProfile?.role || '');
  const [tagline, setTagline] = useState<string>(initialProfile?.tagline || '');
  const [bio, setBio] = useState<string>(initialProfile?.bio || '');
  const [fullBio, setFullBio] = useState<string>(
    typeof initialProfile?.full_bio === 'string' ? initialProfile.full_bio : ''
  );
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url || '');
  const [coverUrl, setCoverUrl] = useState(initialProfile?.cover_url || '');
  const [contactEmail, setContactEmail] = useState(initialProfile?.contact_email || userEmail || '');
  const [location, setLocation] = useState(initialProfile?.location || 'Los Angeles / Remote');
  const [yearsExperience, setYearsExperience] = useState(initialProfile?.years_experience || 8);
  const [isPublished, setIsPublished] = useState(initialProfile?.is_published ?? true);

  // Helper to extract string tags if items are objects or strings
  const extractTags = (val: unknown, fallback: string[]): string[] => {
    if (!Array.isArray(val) || val.length === 0) return fallback;
    return val.map((item) => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'name' in item && typeof (item as { name: unknown }).name === 'string') {
        return (item as { name: string }).name;
      }
      return String(item);
    });
  };

  // Array / tag states
  const [skills, setSkills] = useState<string[]>(
    extractTags(initialProfile?.skills, ['Color Grading', 'Sound Design', 'Story Pacing'])
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  const [tools, setTools] = useState<string[]>(
    extractTags(initialProfile?.tools, ['Premiere Pro', 'DaVinci Resolve', 'After Effects'])
  );
  const [newToolInput, setNewToolInput] = useState('');

  const [clients, setClients] = useState<string[]>(
    extractTags(initialProfile?.clients, ['Nike', 'Red Bull', 'Sony Music'])
  );
  const [newClientInput, setNewClientInput] = useState('');

  const addSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const addTool = () => {
    const trimmed = newToolInput.trim();
    if (trimmed && !tools.includes(trimmed)) {
      setTools([...tools, trimmed]);
      setNewToolInput('');
    }
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const addClient = () => {
    const trimmed = newClientInput.trim();
    if (trimmed && !clients.includes(trimmed)) {
      setClients([...clients, trimmed]);
      setNewClientInput('');
    }
  };

  const removeClient = (index: number) => {
    setClients(clients.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const formData = new FormData();
    formData.append('profileId', userId);
    formData.append('fullName', fullName);
    formData.append('slug', slug);
    formData.append('role', role);
    formData.append('tagline', tagline);
    formData.append('bio', bio);
    formData.append('fullBio', fullBio);
    formData.append('avatarUrl', avatarUrl);
    formData.append('coverUrl', coverUrl);
    formData.append('contactEmail', contactEmail);
    formData.append('location', location);
    formData.append('yearsExperience', yearsExperience.toString());
    formData.append('isPublished', isPublished ? 'true' : 'false');
    formData.append('skills', JSON.stringify(skills));
    formData.append('tools', JSON.stringify(tools));
    formData.append('clients', JSON.stringify(clients));

    startTransition(async () => {
      const result = await updateFounderProfileAction(null, formData);
      if (result.success) {
        setFeedback({ type: 'success', message: result.message || 'Profile saved successfully!' });
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to update profile.' });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-wider text-violet-400 font-bold">
              Personal Profile
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-400">Strictly isolated to your user account</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Founder Profile Editor
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Edit your public persona, biography, creative specialties, and tools.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {slug && (
            <Link
              href={`/portfolio/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
              <span>Preview Public Profile</span>
            </Link>
          )}
        </div>
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 text-xs animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-200'
              : 'bg-red-950/40 border border-red-500/30 text-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          )}
          <span className="font-medium">{feedback.message}</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Identity & Images */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" />
            <span>Profile Identity & Visual Assets</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Avatar Upload */}
            <ImageUpload
              value={avatarUrl}
              onChange={setAvatarUrl}
              bucket="avatars"
              label="Profile Picture (Headshot)"
              helperText="Upload a crisp portrait photo (Square JPG, PNG, WEBP up to 10MB)"
              aspectRatio="square"
            />

            {/* Profile Banner Upload */}
            <ImageUpload
              value={coverUrl}
              onChange={setCoverUrl}
              bucket="agency-assets"
              label="Cover Hero Banner (Optional)"
              helperText="A wide backdrop banner for your personal portfolio page"
              aspectRatio="banner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Public Slug * (URL Handle)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-gray-500 font-mono">
                  vixelmedia.com/portfolio/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="alex-vance"
                  className="w-full pl-44 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm font-mono focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Unique identifier used in your portfolio link. Letters, numbers, and hyphens only.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Professional Role *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Co-Founder & Creative Director"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Studio Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Los Angeles, CA / Remote"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="alex@vixelmedia.com"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Years of Industry Experience
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={yearsExperience}
                onChange={(e) => setYearsExperience(parseInt(e.target.value, 10) || 0)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Narrative & Biographies */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span>Narrative & Biography</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Tagline / Creative Motto
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Architect of narrative pacing and cinematic video storytelling."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Short Bio (Appears on cards & team preview)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="8+ years crafting cinematic brand documentaries and high-conversion films."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-2">
                Full Bio (Appears on your dedicated portfolio page)
              </label>
              <textarea
                rows={5}
                value={fullBio}
                onChange={(e) => setFullBio(e.target.value)}
                placeholder="Detailed narrative about your background, editorial philosophy, filmmaking journey, and notable achievements."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Skills, Tools & Notable Clients */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <span>Skills, Tools & Notable Clients</span>
          </h2>

          {/* Skills Tag Manager */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-gray-300">
              Creative Skills & Disciplines
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-200 text-xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add skill (e.g. Color Grading)..."
                className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-violet-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          {/* Software Tools Tag Manager */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="block text-xs font-semibold text-gray-300">
              Software Tools & NLEs
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tools.map((tool, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-200 text-xs"
                >
                  <span>{tool}</span>
                  <button
                    type="button"
                    onClick={() => removeTool(index)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newToolInput}
                onChange={(e) => setNewToolInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTool();
                  }
                }}
                placeholder="Add tool (e.g. DaVinci Resolve Studio)..."
                className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-violet-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTool}>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>

          {/* Notable Clients Tag Manager */}
          <div className="space-y-3 pt-4 border-t border-white/5">
            <label className="block text-xs font-semibold text-gray-300">
              Notable Past Clients
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {clients.map((client, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 text-emerald-200 text-xs"
                >
                  <span>{client}</span>
                  <button
                    type="button"
                    onClick={() => removeClient(index)}
                    className="hover:text-white transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newClientInput}
                onChange={(e) => setNewClientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addClient();
                  }
                }}
                placeholder="Add client (e.g. Red Bull)..."
                className="flex-1 px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 text-xs focus:outline-none focus:border-violet-500"
              />
              <Button type="button" variant="secondary" size="sm" onClick={addClient}>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Section 4: Publication Status & Sticky Save */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14141B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPublished(!isPublished)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                isPublished ? 'bg-violet-600' : 'bg-gray-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isPublished ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {isPublished ? (
                  <>
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Profile is Publicly Published</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4 text-gray-400" />
                    <span>Profile is Hidden (Draft)</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {isPublished
                  ? 'Visible on the public About page and has an accessible /portfolio/[slug] route.'
                  : 'Hidden from public visitors while you refine your biography and portfolio.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 shadow-lg shadow-violet-900/40"
            >
              <Save className="w-4 h-4" />
              <span>{isPending ? 'Saving to Supabase...' : 'Save Profile Changes'}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
