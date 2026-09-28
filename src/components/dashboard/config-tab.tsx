import React, { useState, useRef } from "react";
import {
  Building2,
  Users,
  Layers,
  CalendarX,
  Wallet,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Dumbbell,
  FileCheck,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfigStaffSection } from "./config-staff-section";
import { ConfigSalasSection } from "./config-salas-section";
import { ConfigCierresSection } from "./config-cierres-section";
import { ConfigPaymentsSection } from "./config-payments-section";
import { ConfigEquipmentSection } from "./config-equipment-section";

export interface ConfigTabProps {
  staffList: any[];
  setStaffList: React.Dispatch<React.SetStateAction<any[]>>;
  amenities: { id: string; name: string; category: string; checked: boolean }[];
  setAmenities: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>
  >;
  requirements: { id: string; name: string; category: string; checked: boolean }[];
  setRequirements: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; category: string; checked: boolean }[]>
  >;
  equipment: any[];
  setEquipment: React.Dispatch<React.SetStateAction<any[]>>;
  gymPhotos: string[];
  setGymPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  weeklyHours: { day: string; intervals: { from: string; to: string }[] }[];
  setWeeklyHours: React.Dispatch<
    React.SetStateAction<{ day: string; intervals: { from: string; to: string }[] }[]>
  >;
  cancellationPolicyHours: number;
  setCancellationPolicyHours: (v: number) => void;
  blackoutDays: { id: string; date: string; reason: string }[];
  setBlackoutDays: React.Dispatch<
    React.SetStateAction<{ id: string; date: string; reason: string }[]>
  >;
  salasList: {
    id: string;
    name: string;
    capacity?: number;
    branchId?: string;
    description?: string;
  }[];
  setSalasList: React.Dispatch<
    React.SetStateAction<
      { id: string; name: string; capacity?: number; branchId?: string; description?: string }[]
    >
  >;
  checklistLogs?: any[];
  setChecklistLogs?: any;
  penaltySettings?: any;
  setPenaltySettings?: any;
  protocols?: any;
  setProtocols?: any;
}

export function ConfigTab({
  staffList,
  setStaffList,
  amenities,
  setAmenities,
  requirements,
  setRequirements,
  equipment,
  setEquipment,
  gymPhotos,
  setGymPhotos,
  weeklyHours,
  setWeeklyHours,
  cancellationPolicyHours,
  setCancellationPolicyHours,
  blackoutDays,
  setBlackoutDays,
  salasList,
  setSalasList,
}: ConfigTabProps) {
  const [subTab, setSubTab] = useState("basico");

  // Drag to scroll for nav
  const navScrollRef = useRef<HTMLDivElement>(null);
  const [isNavDragging, setIsNavDragging] = useState(false);
  const [navStartX, setNavStartX] = useState(0);
  const [navScrollLeft, setNavScrollLeft] = useState(0);

  const handleNavMouseDown = (e: React.MouseEvent) => {
    if (!navScrollRef.current) return;
    setIsNavDragging(true);
    setNavStartX(e.pageX - navScrollRef.current.offsetLeft);
    setNavScrollLeft(navScrollRef.current.scrollLeft);
  };
  const handleNavMouseLeave = () => setIsNavDragging(false);
  const handleNavMouseUp = () => setIsNavDragging(false);
  const handleNavMouseMove = (e: React.MouseEvent) => {
    if (!isNavDragging || !navScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - navScrollRef.current.offsetLeft;
    const walk = (x - navStartX) * 2;
    navScrollRef.current.scrollLeft = navScrollLeft - walk;
  };

  // Profile social states
  const [instagram, setInstagram] = useState("kraft.strength");
  const [tiktok, setTiktok] = useState("kraft.strength");
  const [whatsapp, setWhatsapp] = useState("5491132421241");

  // Gym Photos ref and handlers
  const gymFileRef = useRef<HTMLInputElement>(null);
  const handleGymPhotosUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const objectUrls = filesArray.map((file) => URL.createObjectURL(file));
    setGymPhotos((prev) => [...prev, ...objectUrls]);
  };

  const handleRemoveGymPhoto = (index: number) => {
    setGymPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 7-Day Split Hours Handlers
  const handleAddHourInterval = (dayIndex: number) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: [...copy[dayIndex].intervals, { from: "09:00", to: "13:00" }],
      };
      return copy;
    });
  };

  const handleRemoveHourInterval = (dayIndex: number, intervalIndex: number) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals: copy[dayIndex].intervals.filter((_, idx) => idx !== intervalIndex),
      };
      return copy;
    });
  };

  const handleUpdateHourInterval = (
    dayIndex: number,
    intervalIndex: number,
    field: "from" | "to",
    value: string,
  ) => {
    setWeeklyHours((prev) => {
      const copy = [...prev];
      const intervals = [...copy[dayIndex].intervals];
      intervals[intervalIndex] = {
        ...intervals[intervalIndex],
        [field]: value,
      };
      copy[dayIndex] = {
        ...copy[dayIndex],
        intervals,
      };
      return copy;
    });
  };

  // Amenities and Requirements toggle handlers
  const handleToggleAmenity = (id: string) => {
    setAmenities((prev) => prev.map((a) => (a.id === id ? { ...a, checked: !a.checked } : a)));
  };

  const handleToggleRequirement = (id: string) => {
    setRequirements((prev) => prev.map((r) => (r.id === id ? { ...r, checked: !r.checked } : r)));
  };

  const amenityCategories = Array.from(new Set(amenities.map((a) => a.category)));
  const requirementCategories = Array.from(new Set(requirements.map((r) => r.category)));

  return (
    <div className="space-y-6">
      {/* Sub tabs navigation */}
      <div
        ref={navScrollRef}
        onMouseDown={handleNavMouseDown}
        onMouseLeave={handleNavMouseLeave}
        onMouseUp={handleNavMouseUp}
        onMouseMove={handleNavMouseMove}
        className="border-b border-border flex gap-4 pb-0 overflow-x-auto [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing select-none"
      >
        {[
          { id: "basico", label: "Perfil", icon: Building2 },
          { id: "politicas", label: "Políticas de Cancelación", icon: ShieldCheck },
          { id: "amenities", label: "Amenities & Servicios", icon: Sparkles },
          { id: "equipamiento", label: "Equipamiento", icon: Dumbbell },
          { id: "requisitos", label: "Normas de Ingreso", icon: FileCheck },
          { id: "staff", label: "Staff", icon: Users },
          { id: "salas", label: "Salas / Salones", icon: Layers },
          { id: "cierres", label: "Días de Cierre", icon: CalendarX },
          { id: "metodos_pago", label: "Métodos de Cobro", icon: Wallet },
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = subTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setSubTab(sub.id)}
              className={`pb-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              {sub.label}
            </button>
          );
        })}
      </div>

      <>
        {/* Subtab 1: Basic Config & 7-Day Scheduler */}
        {subTab === "basico" && (
          <div className="space-y-6 max-w-3xl">
            {/* Photos */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-sm">Galería de Fotos</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Sube imágenes de tu centro.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl gap-1.5"
                  onClick={() => gymFileRef.current?.click()}
                >
                  <Plus className="h-4 w-4" /> Subir Fotos
                </Button>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={gymFileRef}
                  onChange={handleGymPhotosUpload}
                  className="hidden"
                />
              </div>

              <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
                {gymPhotos.map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-video rounded-xl overflow-hidden border border-border group"
                  >
                    <img src={photo} alt={`Gym ${index}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGymPhoto(index)}
                      className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 7-Day Daily Hours Scheduler */}
            <div className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <div>
                <h3 className="font-bold text-sm">Horarios Semanales (7 Días)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configura individualmente cada día, soportando horarios cortados/partidos.
                </p>
              </div>

              <div className="space-y-4 divide-y divide-border/60">
                {weeklyHours.map((dayHour, dayIdx) => (
                  <div
                    key={dayHour.day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3 first:pt-0"
                  >
                    <div className="w-24 text-sm font-bold text-foreground">{dayHour.day}</div>

                    <div className="flex-1 space-y-2">
                      {dayHour.intervals.map((interval, intervalIdx) => (
                        <div key={intervalIdx} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={interval.from}
                            onChange={(e) =>
                              handleUpdateHourInterval(dayIdx, intervalIdx, "from", e.target.value)
                            }
                            className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                          />
                          <span className="text-xs text-muted-foreground">a</span>
                          <input
                            type="time"
                            value={interval.to}
                            onChange={(e) =>
                              handleUpdateHourInterval(dayIdx, intervalIdx, "to", e.target.value)
                            }
                            className="px-2 py-1 rounded-lg border border-border bg-background text-xs focus-visible:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveHourInterval(dayIdx, intervalIdx)}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                      {dayHour.intervals.length === 0 && (
                        <span className="text-xs text-muted-foreground italic bg-secondary/40 px-2.5 py-1 rounded-md inline-block">
                          Cerrado
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="self-start sm:self-center text-xs gap-1 py-1 h-8 rounded-lg"
                      onClick={() => handleAddHourInterval(dayIdx)}
                    >
                      <Plus className="h-3.5 w-3.5" /> Turno
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl">
              <h3 className="font-bold text-sm">Perfil de la Sede</h3>
              <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Nombre Comercial
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      defaultValue="Kraft Strength Club"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Dirección Física
                    </label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      defaultValue="Av. Santa Fe 3421, Palermo, CABA"
                    />
                  </div>
                </div>

                {/* Social Media Inputs */}
                <div className="grid gap-4 sm:grid-cols-3 border-t border-border/60 pt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      Instagram (Usuario)
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                      placeholder="kraft.strength"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      TikTok (Usuario)
                    </label>
                    <input
                      type="text"
                      value={tiktok}
                      onChange={(e) => setTiktok(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                      placeholder="kraft.strength"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">
                      WhatsApp (Número)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                      placeholder="5491132421241"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95"
                  onClick={() => {
                    const saveBtn = document.getElementById("profile-save-badge");
                    if (saveBtn) {
                      saveBtn.classList.remove("hidden");
                      setTimeout(() => saveBtn.classList.add("hidden"), 3000);
                    }
                  }}
                >
                  Guardar Cambios
                </Button>
                <span
                  id="profile-save-badge"
                  className="hidden text-xs font-bold text-primary animate-fade-in"
                >
                  ✅ Datos del gimnasio y redes sociales actualizados correctamente.
                </span>
              </form>
            </div>
          </div>
        )}

        {/* Subtab 2: Reservation & Cancellation Policies */}
        {subTab === "politicas" && (
          <div className="space-y-6 max-w-2xl bg-card border border-border p-6 rounded-3xl text-foreground">
            <div>
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-primary" /> Políticas de Reservas e
                Inasistencias
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define los límites y restricciones para cancelaciones y penalizaciones por faltas.
              </p>
            </div>

            <div className="space-y-6 text-sm">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Tiempo límite de cancelación anticipada (Horas)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    max="48"
                    value={cancellationPolicyHours}
                    onChange={(e) => setCancellationPolicyHours(parseInt(e.target.value) || 0)}
                    className="flex h-10 w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none"
                  />
                  <span className="text-xs text-muted-foreground">
                    Los alumnos sólo podrán cancelar la clase hasta {cancellationPolicyHours} horas
                    antes del inicio sin penalización.
                  </span>
                </div>
              </div>

              <Button
                type="button"
                className="rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/95"
                onClick={() => {
                  const saveBadge = document.getElementById("policy-save-badge");
                  if (saveBadge) {
                    saveBadge.classList.remove("hidden");
                    setTimeout(() => saveBadge.classList.add("hidden"), 3000);
                  }
                }}
              >
                Guardar Políticas
              </Button>
              <span
                id="policy-save-badge"
                className="hidden text-xs font-bold text-primary animate-fade-in block"
              >
                ✅ Políticas de cancelación e inasistencia actualizadas correctamente.
              </span>
            </div>
          </div>
        )}

        {/* Subtab 3: Amenities */}
        {subTab === "amenities" && (
          <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl">
            <div>
              <h3 className="font-bold text-sm">Amenities y Servicios Adicionales</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Define los servicios de infraestructura que ofrece tu centro.
              </p>
            </div>

            <div className="space-y-6">
              {amenityCategories.map((category) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
                    {category}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {amenities
                      .filter((a) => a.category === category)
                      .map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition"
                        >
                          <div className="text-sm font-semibold">{a.name}</div>
                          <input
                            type="checkbox"
                            checked={a.checked}
                            onChange={() => handleToggleAmenity(a.id)}
                            className="h-5 w-10 accent-primary rounded-full cursor-pointer"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab 4: Equipamiento */}
        {subTab === "equipamiento" && (
          <ConfigEquipmentSection equipment={equipment} setEquipment={setEquipment} />
        )}

        {/* Subtab 5: Normas y Requisitos */}
        {subTab === "requisitos" && (
          <div className="space-y-6 max-w-3xl bg-card border border-border p-6 rounded-3xl">
            <div>
              <h3 className="font-bold text-sm">Normas y Requisitos de Ingreso</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Controla las exigencias de higiene y documentación.
              </p>
            </div>

            <div className="space-y-6">
              {requirementCategories.map((category) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1.5">
                    {category}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {requirements
                      .filter((r) => r.category === category)
                      .map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition"
                        >
                          <div className="text-sm font-semibold">{r.name}</div>
                          <input
                            type="checkbox"
                            checked={r.checked}
                            onChange={() => handleToggleRequirement(r.id)}
                            className="h-5 w-10 accent-primary rounded-full cursor-pointer"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subtab 6: Staff */}
        {subTab === "staff" && (
          <ConfigStaffSection staffList={staffList} setStaffList={setStaffList} />
        )}

        {/* Subtab 7: Salas */}
        {subTab === "salas" && (
          <ConfigSalasSection salasList={salasList} setSalasList={setSalasList} />
        )}

        {/* Subtab 8: Días de Cierre */}
        {subTab === "cierres" && (
          <ConfigCierresSection
            blackoutDays={blackoutDays}
            setBlackoutDays={setBlackoutDays}
          />
        )}

        {/* Subtab 9: Métodos de Cobro & Pagos Digitales */}
        {subTab === "metodos_pago" && <ConfigPaymentsSection />}
      </>
    </div>
  );
}
