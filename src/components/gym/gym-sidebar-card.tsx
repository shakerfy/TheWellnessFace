import React from "react";
import { Link } from "@tanstack/react-router";
import { MapPin, Navigation, Instagram } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { type Gym } from "@/lib/gyms";
import { TikTokIcon, WhatsAppIcon } from "./gym-icons";

interface GymSidebarCardProps {
  gym: Gym;
}

export function GymSidebarCard({ gym }: GymSidebarCardProps) {
  return (
    <aside className="lg:col-span-1 space-y-6">
      {/* Price & CTA Card */}
      <div className="rounded-3xl glass-smoked p-6">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Desde</div>
        <div className="mt-1 text-3xl font-light tracking-tight text-foreground">
          ${gym.priceFrom.toLocaleString("es-AR")}
          <span className="text-sm font-normal text-muted-foreground"> / mes</span>
        </div>
        <Link
          to="/auth"
          className={buttonVariants({ className: "mt-5 w-full rounded-full bg-[#E8E2D5] text-[#0E0D0C] hover:bg-[#F6F4EE] font-medium" })}
        >
          Reservar clase de prueba
        </Link>
        <Button variant="outline" className="mt-2 w-full rounded-full glass-smoked-pill">
          Contactar al gimnasio
        </Button>
        <div className="mt-5 border-t border-border pt-4 text-xs text-muted-foreground">
          Cancelación gratis hasta 4 horas antes de la clase.
        </div>
      </div>

      {/* Stylized Google Maps Placeholder */}
      <div className="glass-smoked rounded-3xl overflow-hidden hover:border-[#C5BAA8]/40 transition duration-300">
        <div
          id="google-maps-container"
          className="w-full h-40 bg-secondary/50 relative flex items-center justify-center overflow-hidden"
        >
          {/* Simulated map grid */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Pulsing gym pin */}
          <div className="relative flex items-center justify-center">
            <div className="absolute h-8 w-8 rounded-full bg-primary/20 animate-ping" />
            <div className="h-4 w-4 rounded-full bg-primary border-2 border-background" />
          </div>

          <span className="absolute bottom-2 left-2 text-[9px] bg-background/80 border border-border px-2 py-0.5 rounded-md font-mono text-muted-foreground">
            Google Maps SDK (Ready)
          </span>
        </div>

        <div className="p-4">
          <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> {gym.address}
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + " " + gym.address)}`}
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "mt-3 w-full rounded-xl text-xs gap-1.5",
            })}
          >
            <Navigation className="h-3.5 w-3.5" /> Cómo llegar
          </a>
        </div>
      </div>

      {/* Social Networks Links */}
      {(gym.instagram || gym.tiktok || gym.whatsapp) && (
        <div className="border border-border bg-card rounded-2xl p-4 space-y-3 hover:border-foreground/20 transition duration-300">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
            Redes Sociales
          </span>
          <div className="flex gap-2">
            {gym.instagram && (
              <a
                href={`https://instagram.com/${gym.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {gym.tiktok && (
              <a
                href={`https://tiktok.com/@${gym.tiktok}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                title="TikTok"
              >
                <TikTokIcon className="h-4 w-4" />
              </a>
            )}
            {gym.whatsapp && (
              <a
                href={`https://wa.me/${gym.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-secondary hover:bg-primary/10 hover:text-primary border border-border text-muted-foreground transition"
                title="WhatsApp"
              >
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
