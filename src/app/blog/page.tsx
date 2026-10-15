import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sampleBlogPosts } from '@/data/blog';
import { Badge } from '@/components/ui/Badge';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Production Blog & Video Insights | Vixel Media',
  description: 'In-depth essays on audience retention, pacing psychology, 3D map cartography, and short-form viral hooks.',
};

export default function BlogListingPage() {
  const featuredPost = sampleBlogPosts[0];
  const regularPosts = sampleBlogPosts.slice(1);

  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="purple" className="mb-4">
            Production Journal
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Insights on the <span className="text-gradient">Craft.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-300 leading-relaxed">
            Deconstructing pacing psychology, After Effects and GeoLayers workflows, and the data behind high-retention video content.
          </p>
        </div>

        {/* Featured Post Card */}
        {featuredPost && (
          <div className="mb-16">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block rounded-3xl overflow-hidden bg-[#14141B] border border-white/10 hover:border-violet-500/40 transition-all hover:shadow-2xl hover:shadow-violet-950/40"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="relative aspect-video lg:aspect-auto lg:col-span-7 overflow-hidden bg-black min-h-[300px]">
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge variant="purple" size="sm">Featured Essay</Badge>
                  </div>
                </div>

                <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-violet-400 font-mono">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        {featuredPost.readTime}
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-violet-300 transition-colors leading-tight">
                      {featuredPost.title}
                    </h2>

                    <p className="text-sm text-gray-300 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-800">
                        <Image
                          src={featuredPost.author.avatarUrl}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{featuredPost.author.name}</div>
                        <div className="text-[10px] text-gray-500">{featuredPost.publishedAt}</div>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden bg-[#14141B] border border-white/10 hover:border-violet-500/40 transition-all hover:shadow-2xl hover:shadow-violet-950/40"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="purple" size="sm">{post.category}</Badge>
                </div>
              </div>

              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Clock className="w-3 h-3 text-violet-400" />
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <span>{post.publishedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 mb-3">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-800">
                      <Image
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-gray-300">{post.author.name}</span>
                  </div>

                  <span className="text-xs font-semibold text-violet-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
