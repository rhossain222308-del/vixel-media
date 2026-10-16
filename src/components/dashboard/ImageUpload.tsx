'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { uploadAssetAction } from '@/lib/actions/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: 'avatars' | 'portfolio' | 'agency-assets' | 'services';
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'banner';
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = 'portfolio',
  label = 'Upload Image',
  helperText = 'JPG, PNG, WEBP, or GIF up to 10MB',
  aspectRatio = 'video',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Client-side file size check
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', bucket);

      const result = await uploadAssetAction(formData);

      if (result.success && result.publicUrl) {
        onChange(result.publicUrl);
      } else {
        setErrorMessage(result.error || 'Failed to upload image.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setErrorMessage(null);
  };

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square w-32 h-32'
      : aspectRatio === 'banner'
      ? 'aspect-[3/1] w-full max-h-48'
      : 'aspect-video w-full max-w-sm';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative group">
          <div
            className={`relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 ${aspectClass}`}
          >
            <Image
              src={value}
              alt="Uploaded asset preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium backdrop-blur-md transition-colors"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Image linked successfully</span>
          </div>
        </div>
      ) : (
        <div>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-white/15 hover:border-violet-500/50 bg-[#0F0F14] hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center text-center cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <UploadCloud className="w-5 h-5" />
              )}
            </div>

            <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
              {isUploading ? 'Uploading to Supabase Storage...' : 'Click or drop image to upload'}
            </span>
            <span className="text-[11px] text-gray-500 mt-1">{helperText}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
