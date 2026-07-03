import Link from "next/link";
import { PackageSearch, ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  title,
  subtitle,
  ctaLabel = "Continue Shopping",
  ctaHref = "/shop",
}: EmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center text-center py-16 px-4">
      <PackageSearch className="h-16 w-16 text-gray-300 mb-6" />
      <h3 className="text-2xl font-light mb-2 text-gray-900">{title}</h3>
      {subtitle && <p className="text-gray-500 mb-8 max-w-md">{subtitle}</p>}
      {ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
