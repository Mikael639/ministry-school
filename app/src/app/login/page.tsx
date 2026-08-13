"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { LogoImage } from "@/components/Logo";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(
    searchParams.get("erreur") === "lien_invalide"
      ? "Ce lien de confirmation n'est plus valide. Connectez-vous ou demandez un nouveau lien."
      : null
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError("Identifiants incorrects. Vérifiez votre e-mail et votre mot de passe.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-slate-950 overflow-hidden">
      {/* Halo discret en arrière-plan */}
      <div className="absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Carte de connexion compacte & sobre */}
      <div className="relative z-10 w-full max-w-[760px] rounded-2xl overflow-hidden shadow-2xl shadow-black/60 border border-slate-800 grid grid-cols-1 md:grid-cols-12 bg-white">
        
        {/* PANNEAU GAUCHE : Logo & Identité visuelle */}
        <div className="relative md:col-span-5 flex flex-col justify-center items-center bg-[#0B1526] p-8 text-white text-center overflow-hidden">
          
          {/* Arrière-plan subtil */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image
              src="/bible-glow.jpg"
              alt="Atmosphere"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1526] via-[#0B1526]/85 to-[#0B1526]" />

          {/* Contenu Logo */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Nouvelle icône noir & blanc dans badge épuré */}
            <div className="mb-4 p-2 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
              <LogoImage size={56} />
            </div>

            {/* Titre MINISTRY */}
            <h2
              className="text-xl font-bold uppercase tracking-[0.2em] text-white"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Ministry
            </h2>

            {/* Ligne SCHOOL */}
            <div className="flex items-center gap-2 my-1.5 w-full justify-center opacity-80">
              <div className="h-[1px] w-5 bg-white/40" />
              <span className="text-[0.72rem] font-semibold tracking-[0.32em] uppercase text-slate-200">
                School
              </span>
              <div className="h-[1px] w-5 bg-white/40" />
            </div>

            {/* Devise */}
            <p className="text-[0.62rem] tracking-[0.2em] uppercase font-medium text-slate-300/90 mt-0.5">
              Grandir • Servir • Impacter
            </p>
          </div>
        </div>

        {/* PANNEAU DROIT : Formulaire de connexion épuré */}
        <div className="relative md:col-span-7 flex flex-col justify-center bg-white p-6 sm:p-8">
          
          {/* Titre */}
          <div className="mb-5">
            <p className="text-xs font-medium text-slate-500">
              Bienvenue sur
            </p>
            <h1
              className="text-2xl font-bold text-slate-900 tracking-tight"
              style={{ fontFamily: "var(--font-cinzel), serif" }}
            >
              Ministry School
            </h1>
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-3">
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
                  placeholder="••••••••"
                  autoComplete="current-password"
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

            {/* Bouton de connexion */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#0B1526] hover:bg-[#162540] active:scale-[0.99] px-4 py-2.5 text-sm font-semibold text-white transition shadow-sm flex items-center justify-center gap-2 group disabled:opacity-60 cursor-pointer"
              >
                <span>{loading ? "Connexion..." : "Se connecter"}</span>
                {!loading && (
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-slate-800 focus:ring-slate-800 cursor-pointer"
                />
                <span>Se souvenir de moi</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Pour réinitialiser votre mot de passe, veuillez contacter l'administration de Ministry School."
                  )
                }
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
              >
                Mot de passe oublié ?
              </button>
            </div>

            {/* Première inscription */}
            <div className="pt-3 mt-1 border-t border-slate-100 text-xs text-center text-slate-600">
              Première fois ici ?{" "}
              <Link
                href="/inscription"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
              >
                Créer mon compte
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <LoginForm />
    </Suspense>
  );
}
