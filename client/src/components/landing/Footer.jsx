import { APP_NAME } from "@/constants/app";
import { FOOTER_LINK_GROUPS, SOCIAL_LINKS } from "@/constants/landing";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="max-w-xs space-y-4">
          <a href="#hero" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-semibold tracking-tight">
              {APP_NAME}
            </span>
          </a>
          <p className="text-sm leading-relaxed text-muted">
            The placement operating system connecting colleges, students, and
            recruiters — one profile, every opportunity.
          </p>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h3 className="text-sm font-semibold text-foreground">
              {group.heading}
            </h3>
            <ul className="mt-4 space-y-3">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
          <p>
            &copy; {year} {APP_NAME}. All rights reserved.
          </p>
          <p>Multi-College Placement &amp; Career Management Platform</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
