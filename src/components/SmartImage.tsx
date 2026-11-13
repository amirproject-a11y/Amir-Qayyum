import { useState } from 'react';
import { Factory } from 'lucide-react';

interface SmartImageProps {
  src?: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

export function SmartImage({ src, alt, fallbackTitle, className = '' }: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Factory className="w-8 h-8 text-slate-400 mb-2" />
        <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-[200px]">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
