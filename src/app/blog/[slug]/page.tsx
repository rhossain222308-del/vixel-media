import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, sampleBlogPosts } from '@/data/blog';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return sampleBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | Vixel Media',
    };
  }

  return {
    title: `${post.title} | Vixel Media Journal`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <Badge variant="purple" size="sm">{post.category}</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author bar */}
          <div className="pt-4 flex items-center justify-between border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-800 border border-white/10">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{post.author.name}</div>
                <div className="text-xs text-gray-400">{post.author.role} • {post.publishedAt}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-black border border-white/10 mb-12 shadow-2xl">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Article Topics:
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-gray-300 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Card Footer */}
        <div className="mt-12 p-8 rounded-3xl bg-[#14141B] border border-white/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-800 border border-white/10 shrink-0">
            <Image
              src={post.author.avatarUrl}
              alt={post.author.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-white">Written by {post.author.name}</div>
            <div className="text-xs text-violet-400">{post.author.role} at Vixel Media</div>
            <p className="text-xs text-gray-400 pt-1">
              Overseeing high-end post-production workflows and publishing behind-the-scenes editorial breakdowns.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button href="/contact" variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
            Work With Our Editorial Team
          </Button>
        </div>
      </div>
    </div>
  );
}
