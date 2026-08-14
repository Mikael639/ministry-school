"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  calendar: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20c0-3.2 2.9-5.5 6.5-5.5s6.5 2.3 6.5 5.5" />
      <path d="M16.5 4.8c1.6.4 2.75 1.8 2.75 3.45s-1.15 3.05-2.75 3.45" />
      <path d="M21.5 20c0-2.6-1.9-4.6-4.5-5.3" />
    </svg>
  ),
  megaphone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M3 10v4a1 1 0 0 0 1 1h2l4 4V5L6 9H4a1 1 0 0 0-1 1Z" />
      <path d="M14 8.5c1.1.9 1.1 6.1 0 7M17.5 6c2.2 1.7 2.2 10.3 0 12" />
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  ),
  compass: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-2 5-3-1.5 2-5 3 1.5Z" />
    </svg>
  ),
  globe: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9Z" />
    </svg>
  ),
  building: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1" />
    </svg>
  ),
  user: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
    </svg>
  ),
};

const studentSections: NavSection[] = [
  {
    title: "Principale",
    items: [{ label: "Dashboard", href: "/etudiant", icon: icons.dashboard }],
  },
  {
    title: "Calendrier",
    items: [{ label: "Mon calendrier", href: "/etudiant/calendrier", icon: icons.calendar }],
  },
  {
    title: "Pédagogie",
    items: [
      { label: "Mes cours", href: "/etudiant/cours", icon: icons.book },
      { label: "Ma formation", href: "/etudiant/palier", icon: icons.layers },
      { label: "Ministère", href: "/etudiant/formation", icon: icons.compass },
    ],
  },
  {
    title: "Compte",
    items: [{ label: "Profil", href: "/etudiant/profil", icon: icons.user }],
  },
];

const teacherSections: NavSection[] = [
  {
    title: "Principale",
    items: [{ label: "Dashboard", href: "/enseignant", icon: icons.dashboard }],
  },
  {
    title: "Calendrier",
    items: [{ label: "Mon calendrier", href: "/enseignant/calendrier", icon: icons.calendar }],
  },
  {
    title: "Pédagogie",
    items: [
      { label: "Supports & consignes", href: "/enseignant/supports", icon: icons.megaphone },
      { label: "Vue promo", href: "/enseignant/programme", icon: icons.globe },
      { label: "Socles", href: "/enseignant/socles", icon: icons.layers },
    ],
  },
  {
    title: "Suivi",
    items: [{ label: "Mes étudiants", href: "/enseignant/etudiants", icon: icons.users }],
  },
  {
    title: "Compte",
    items: [{ label: "Profil", href: "/enseignant/profil", icon: icons.user }],
  },
];

const adminSections: NavSection[] = [
  {
    title: "Principale",
    items: [{ label: "Dashboard", href: "/admin", icon: icons.dashboard }],
  },
  {
    title: "Suivi",
    items: [
      { label: "Séances", href: "/admin/seances", icon: icons.calendar },
      { label: "Utilisateurs", href: "/admin/utilisateurs", icon: icons.users },
    ],
  },
  {
    title: "Compte",
    items: [{ label: "Profil", href: "/admin/profil", icon: icons.user }],
  },
];

export default function Sidebar({ role }: { role: "student" | "teacher" | "admin" }) {
  const pathname = usePathname();
  const sections =
    role === "student" ? studentSections : role === "teacher" ? teacherSections : adminSections;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border bg-background md:flex md:flex-col">
      <div className="px-5 py-5 text-foreground">
        <Logo size={30} />
      </div>

      <nav className="flex-1 space-y-6 px-3 pb-6">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wide text-muted">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition ${
                        active
                          ? "bg-accent/10 font-medium text-accent"
                          : "text-foreground/80 hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      <span className={active ? "text-accent" : "text-muted"}>{item.icon}</span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
