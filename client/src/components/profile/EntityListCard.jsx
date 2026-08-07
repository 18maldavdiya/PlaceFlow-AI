import { motion } from "framer-motion";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

import { cn } from "@/utils/cn";

/**
 * Shared list-item card for Projects, Experience, and Certificates — same
 * title/meta/description/actions shape across all three sections, so the
 * card markup lives once instead of three times.
 */
export function EntityListCard({
  title,
  subtitle,
  meta,
  badge,
  description,
  tags,
  links,
  onEdit,
  onDelete,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-xl border border-border p-4 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {title}
            </h3>
            {badge && (
              <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
          )}
          {meta && <p className="mt-1 text-xs text-muted">{meta}</p>}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${title}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-border/60 px-2.5 py-1 text-[11px] font-medium text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {links && links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={cn(
                "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline",
              )}
            >
              {link.label}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default EntityListCard;
