"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { LogoImage } from "@/components/Logo";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";

const MINISTRIES = [
  { slug: "apotre", name: "Apôtre" },
  { slug: "prophete", name: "Prophète" },
  { slug: "evangeliste", name: "Évangéliste" },
  { slug: "pasteur", name: "Pasteur" },
  { slug: "docteur", name: "Docteur" },
];

export default function InscriptionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ministrySlug, setMinistrySlug] = useState("");
  const [preferredDay, setPreferredDay] = useState("samedi");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName,
          ministry_slug: ministrySlug,
          preferred_day: preferredDay,
        },
      },
    });

    setLoading(false);

    if (signUpError) {
      const code = signUpError.code ?? "";
      const message = signUpError.message.toLowerCase();

      if (code === "over_email_send_rate_limit" || message.includes("rate limit")) {
        setError(
          "Trop de demandes d'inscription en peu de temps. Merci de réessayer dans quelques minutes."
        );
      } else if (code === "email_address_invalid" || message.includes("invalid")) {
        setError("Cette adresse e-mail n'est pas valide. Vérifiez votre saisie.");
      } else if (message.includes("already")) {
        setError("Un compte existe déjà avec cette adresse e-mail.");
      } else {
        setError("L'inscription n'a pas abouti. Vérifiez vos informations et réessayez.");
      }
      return;
    }

    // Selon la configuration, la session peut être ouverte immédiatement
    // ou nécessiter une confirmation par e-mail.
    if (data.session) {
      router.push("/");
      router.refresh();
      return;
    }

    setSuccess(true);
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-950 overflow-hidden">
      {/* Halo discret en arrière-plan */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[860px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-slate-800 grid grid-cols-1 md:grid-cols-12 bg-white">
        {/* PANNEAU GAUCHE : Logo & Identité visuelle */}
        <div className="relative md:col-span-5 flex flex-col justify-center items-center bg-[#0B1526] p-8 text-white text-center overflow-hidden">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image src="/bible-glow.jpg" alt="Atmosphere" fill className="object-cover object-center" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1526] via-[#0B1526]/85 to-[#0B1526]" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-4 p-2 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
              <LogoImage size={56} />
            </div>

            <h2
              className="text-xl font-bold uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Ministry
            </h2>

            <div className="flex items-center gap-2 my-1.5 w-full justify-center opacity-80">
              <div className="h-[1px] w-5 bg-white/40" />
              <span className="text-[0.72rem] font-semibold tracking-[0.32em] uppercase text-slate-200">
                School
              </span>
              <div className="h-[1px] w-5 bg-white/40" />
            </div>

            <p className="text-[0.62rem] tracking-[0.2em] uppercase font-medium text-slate-300/90 mt-0.5">
              Grandir • Servir • Impacter
            </p>

            <p className="mt-6 text-xs leading-relaxed text-slate-300/80 max-w-[220px]">
              Rejoignez le parcours de formation et grandissez dans votre appel.
            </p>
          </div>
        </div>

        {/* PANNEAU DROIT : Formulaire d'inscription */}
        <div className="relative md:col-span-7 flex flex-col justify-center bg-white p-6 sm:p-8">
          {success ? (
            <div className="text-center py-6">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={24} />
              </div>
              <h1
                className="text-xl font-bold text-slate-900 tracking-tight"
                style={{ fontFamily: "var(--font-cinzel), serif" }}
              >
                Inscription enregistrée
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Un e-mail de confirmation vous a été envoyé. Une fois votre adresse validée, votre
                accès sera ouvert dès la réception de votre règlement.
              </p>
              <Link
                href="/login"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#0B1526] hover:bg-[#162540] px-4 py-2.5 text-sm font-semibold text-white transition"
              >
                Aller à la connexion
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-xs font-medium text-slate-500">Première inscription</p>
                <h1
                  className="text-2xl font-bold text-slate-900 tracking-tight"
                  style={{ fontFamily: "var(--font-cinzel), serif" }}
                >
                  Créer mon compte
                </h1>
              </div>

              {error && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Nom complet */}
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-slate-700 mb-1">
                    Nom et prénom
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <User size={15} />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800"
                      placeholder="Michael Coulibaly"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-slate-700 mb-1">
                    E-mail
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Mail size={15} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800"
                      placeholder="votre@email.com"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Ministère + Jour */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="ministry"
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
                      Ministère
                    </label>
                    <select
                      id="ministry"
                      required
                      value={ministrySlug}
                      onChange={(e) => setMinistrySlug(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 cursor-pointer"
                    >
                      <option value="" disabled>
                        Choisir…
                      </option>
                      {MINISTRIES.map((m) => (
                        <option key={m.slug} value={m.slug}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="day" className="block text-xs font-medium text-slate-700 mb-1">
                      Jour de cours
                    </label>
                    <select
                      id="day"
                      value={preferredDay}
                      onChange={(e) => setPreferredDay(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800 cursor-pointer"
                    >
                      <option value="samedi">Samedi</option>
                      <option value="dimanche">Dimanche</option>
                    </select>
                  </div>
                </div>

                {/* Mot de passe */}
                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-slate-700 mb-1">
                    Mot de passe
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Lock size={15} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-9 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800"
                      placeholder="8 caractères minimum"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-700 transition p-1"
                      aria-label={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirmation */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-slate-400 pointer-events-none">
                      <Lock size={15} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-800 focus:bg-white focus:ring-1 focus:ring-slate-800"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                {/* Bouton */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-lg bg-[#0B1526] hover:bg-[#162540] active:scale-[0.99] px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
                  >
                    <span>{loading ? "Création du compte..." : "Créer mon compte"}</span>
                    {!loading && (
                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    )}
                  </button>
                </div>

                <p className="text-[0.7rem] leading-relaxed text-slate-500 pt-1">
                  Votre accès aux cours sera activé dès la réception de votre règlement.
                </p>

                <div className="pt-1 text-xs text-center text-slate-600">
                  Vous avez déjà un compte ?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
                  >
                    Se connecter
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
