import { useState, useRef, useMemo, useEffect, Fragment } from "react";
import {
  Building2, Users, Calendar, CreditCard, Settings, LogOut, Bell, CheckCircle2,
  AlertCircle, Search, Download, MapPin, Clock, Plus, HelpCircle, Activity,
  Trash2, Check, Edit2, Dumbbell, Image as ImageIcon, FileText, Eye, X,
  ShieldAlert, DoorOpen, MessageCircle, Star, Flag, MoreHorizontal, Wrench,
  Zap, Flame, Wheat, Droplet, Snowflake, DollarSign, Receipt, Wallet,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PiggyBank,
  BarChart2, Navigation, Scan, ShoppingCart, Package, PackagePlus, PlusCircle,
  FolderPlus, History, Truck, Send, ChevronDown, ChevronUp, Upload, QrCode,
  Printer, Filter, MoreVertical, Slash, UserCheck, UserX, Layers, Copy,
  Ticket, ShieldCheck, FileCheck, CalendarX, Sparkles, Grid, Save, Repeat,
  ChevronLeft, ChevronRight, Ban, Unlink, ExternalLink, Link2, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
  DropdownMenuLabel, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { getStudentPhoto, STAFF_SPECIALTY_PRESETS } from "./dashboard-utils";

export function AyudaTab() {
  const [activeGuide, setActiveGuide] = useState<
    "asistencias" | "clases" | "miembros" | "membresias" | "reseñas" | "config"
  >("asistencias");
  const [searchTerm, setSearchTerm] = useState("");

  const modules = [
    {
      id: "asistencias",
      name: "Asistencias",
      icon: Activity,
      desc: "Control de acceso, aforo en vivo y prevención de bajas",
    },
    {
      id: "clases",
      name: "Clases",
      icon: Calendar,
      desc: "Programación horaria, cupos y sustitución de coaches",
    },
    {
      id: "miembros",
      name: "Miembros",
      icon: Users,
      desc: "Base de alumnos, cobro de cuotas y legajos de salud",
    },
    {
      id: "membresias",
      name: "Membresías",
      icon: CreditCard,
      desc: "Planes, precios, pases por créditos y promociones",
    },
    {
      id: "reseñas",
      name: "Reseñas",
      icon: MessageCircle,
      desc: "Reputación en el marketplace y buzón de sugerencias",
    },
    {
      id: "config",
      name: "Configuración",
      icon: Settings,
      desc: "Ajustes de la sede, staff, salas y Mercado Pago",
    },
  ];

  const guideData = {
    asistencias: {
      title: "Guía del Módulo de Asistencias",
      badge: "Control de Acceso & Aforo",
      sections: [
        {
          heading: "1. PANEL DE KPIS (OCUPACIÓN Y MÉTODOS DE ACCESO)",
          text: "Métricas en tiempo real de ocupación y forma de ingreso:",
          bullets: [
            "Aforo Actual Sede: Muestra los alumnos presentes frente a la capacidad máxima (ej. 42 / 80 - 52% ocupación).",
            "Check-ins QR: Ingresos validados escaneando el código QR desde la App móvil.",
            "Check-ins GPS: Ingresos validados por geolocalización a menos de 50m del establecimiento.",
            "Recepción Manual: Accesos validados en mostrador por el personal.",
          ],
        },
        {
          heading: "2. CONTROL DE ACCESO (CHECK-IN EN RECEPCIÓN)",
          text: "Modal interactivo para validación presencial en mostrador:",
          bullets: [
            "Búsqueda instantánea por Nombre, DNI o Teléfono.",
            "Detección de Reservas del Día: Si el socio tiene clase hoy, habilita 'Confirmar Check-in' marcando la asistencia presente en la grilla.",
            "Ingreso General: Si no tiene reserva próxima, habilita el botón para ingreso a sala libre.",
            "Alerta de Apto Físico: Badges visuales notificando si el certificado médico está vigente o pendiente.",
          ],
        },
        {
          heading: "3. MONITOR DE ENTRADAS RECIENTES (LIVE FEED)",
          text: "Feed en tiempo real con las últimas entradas:",
          bullets: [
            "Foto, Nombre, Hora de Ingreso y Método de Acceso (Scan QR, GPS o Recepción).",
            "Badges de Alertas del Alumno: Notifica sobre observaciones importantes (ej. Lesión Rodilla, Pago Pendiente).",
          ],
        },
        {
          heading: "4. ALUMNOS SIN ASISTENCIA Y RIESGO CHURN",
          text: "Detección temprana para prevención de cancelaciones:",
          bullets: [
            "Detecta automáticamente alumnos activos con más de 12 días sin registrar check-in.",
            "Botón Contactar: Abre WhatsApp con un mensaje pre-redactado de fidelización.",
          ],
        },
        {
          heading: "5. HISTORIAL GENERAL Y EXPORTACIÓN CSV",
          text: "Registro histórico y reportes:",
          bullets: [
            "Filtros avanzados por fecha, método de acceso y buscador por texto.",
            "Exportar CSV: Descarga el reporte completo de asistencias para análisis en Excel.",
          ],
        },
      ],
    },
    clases: {
      title: "Guía del Módulo de Clases",
      badge: "Grilla Horaria & Reservas",
      sections: [
        {
          heading: "1. VISTAS Y NAVEGACIÓN DE LA GRILLA",
          text: "Formatos de visualización de la programación horaria:",
          bullets: [
            "Calendario Semanal: Matriz visual de lunes a domingo navegable por semanas.",
            "Vista Lista: Formato cronológico enfocado exclusivamente en las clases de hoy.",
            "Filtro por Sala y KPIs de ocupación promedio y clases llenas (Sold Out).",
          ],
        },
        {
          heading: "2. CREACIÓN DE CLASES CON VALIDACIONES INTELIGENTES",
          text: "Configuración de sesiones y prevención de conflictos:",
          bullets: [
            "Parámetros: Nombre, Coach, Sala, Día, Franja Horaria, Cupo de lugares y Costo en Créditos.",
            "Recurrencia Automática: Clonación de clases para las próximas 4, 8 o 12 semanas.",
            "Validación de Disponibilidad: Alerta si el coach no tiene disponibilidad horaria configurada.",
            "Bloqueo por Conflicto: Evita superposición de horarios del mismo profesor.",
          ],
        },
        {
          heading: "3. MAPA DE LUGARES Y CONTROL DE INSCRIPTOS",
          text: "Gestión interactiva de cupos:",
          bullets: [
            "Spots Numerados: Grilla gráfica mostrando foto, nombre y plan del alumno.",
            "Control de Asistencia: Marcación presencial de un clic (Presente / Ausente / Pendiente).",
          ],
        },
        {
          heading: "4. LISTA DE ESPERA Y CANCELACIONES",
          text: "Gestión automática de vacantes:",
          bullets: [
            "Reasignación Automática: Al cancelar una reserva con lista de espera, el cupo se otorga al siguiente alumno notificándolo por WhatsApp/Push.",
            "Opciones de Reembolso de Crédito o Re-reserva si no hay lista de espera.",
          ],
        },
        {
          heading: "5. CONTINGENCIAS Y ACCIONES",
          text: "Resolución de imprevistos operativos:",
          bullets: [
            "Sustituir Coach: Asigna un profesor sustituto recomendando aquellos con la especialidad requerida.",
            "Cancelar Clase: Suspende la sesión devolviendo créditos automáticamente a todos los inscriptos.",
          ],
        },
      ],
    },
    miembros: {
      title: "Guía del Módulo de Miembros",
      badge: "Gestión de Alumnos & Cobros",
      sections: [
        {
          heading: "1. PANEL DE KPIS DEL ALUMNADO",
          text: "Indicadores clave del estado de la base de socios:",
          bullets: ["Contadores de Alumnos Activos, En Deuda, Apto Vencido y Riesgo de Baja."],
        },
        {
          heading: "2. ALTA Y LEGAJO COMPLETO DEL ALUMNO",
          text: "Carga y edición de la ficha del socio:",
          bullets: [
            "Datos personales, contacto de emergencia y cobertura médica/obra social.",
            "Estado del Apto Físico y adjunto de certificados (PDF/Imagen).",
            "Asignación de plan con vencimiento auto-calculado y selección del Método de Pago (Efectivo, Transferencia, Mercado Pago, Posnet, Otro).",
          ],
        },
        {
          heading: "3. FICHA EXPANDIBLE Y SEGUIMIENTO",
          text: "Información detallada al tocar la fila del alumno:",
          bullets: [
            "Historial de clases e inscriptos con porcentaje de asistencia.",
            "Historial de cobros pasados y emisión de recibos.",
          ],
        },
        {
          heading: "4. RENOVACIONES Y CONGELAMIENTO",
          text: "Operatoria comercial de cuotas:",
          bullets: [
            "Registrar Pago / Renovar Plan seleccionando plan, meses y método de cobro.",
            "Congelar Membresía (Freeze) por días específicos y opción de Descongelar al regresar.",
          ],
        },
        {
          heading: "5. EXPORTACIÓN DE DATOS",
          text: "Descarga de reportes:",
          bullets: ["Exportar CSV con la nómina filtrada de alumnos para gestión administrativa."],
        },
      ],
    },
    membresias: {
      title: "Guía del Módulo de Membresías",
      badge: "Configuración de Planes & Precios",
      sections: [
        {
          heading: "1. PRECIOS Y PERIODICIDAD",
          text: "Definición de la oferta comercial:",
          bullets: [
            "Precios de lista y precio tachado promocional opcional.",
            "Periodicidad de cobro: Semanal, Mensual, Trimestral, Semestral o Anual.",
          ],
        },
        {
          heading: "2. PASE LIBRE VS PLAN POR CRÉDITOS",
          text: "Modalidades de acceso:",
          bullets: [
            "Pase Libre: Acceso ilimitado a las instalaciones.",
            "Por Créditos: Asigna un cupo mensual de clases descontables al reservar.",
          ],
        },
        {
          heading: "3. FRANJAS HORARIAS OFF-PEAK",
          text: "Pases promocionales de baja demanda:",
          bullets: [
            "Restricción de horarios (ej. de 12:00 a 16:00 hs) para pases económicos en horas valle.",
          ],
        },
        {
          heading: "4. REGLAS AVANZADAS Y AMENITIES",
          text: "Beneficios e instalaciones asociadas:",
          bullets: [
            "Costo de matrícula, días de congelamiento al año y límite diario de clases.",
            "Selección de actividades e instalaciones incluidas (Lockers, Duchas, Toallas, etc.).",
          ],
        },
        {
          heading: "5. DESTACAR Y DUPLICAR PLANES",
          text: "Herramientas de venta:",
          bullets: [
            "Plan Destacado (⭐): Otorga visibilidad prioritaria en el marketplace/app.",
            "Duplicar Plan: Clona un plan existente para crear variantes con un clic.",
          ],
        },
      ],
    },
    reseñas: {
      title: "Guía del Módulo de Reseñas",
      badge: "Reputación & Feedback",
      sections: [
        {
          heading: "1. RESEÑAS PÚBLICAS VS BUZÓN PRIVADO",
          text: "Canales de feedback:",
          bullets: [
            "Reseñas Públicas: Visibles en el marketplace para prueba social.",
            "Buzón Privado: Feedback confidencial directo para la administración.",
          ],
        },
        {
          heading: "2. KPIS Y DISTRIBUCIÓN DE ESTRELLAS",
          text: "Métricas de satisfacción:",
          bullets: [
            "Puntuación general sobre 5.0, tasa de respuesta oficial y desglose por categorías (Limpieza, Equipamiento, Staff, Precio).",
            "Gráfico de distribución porcentual de estrellas (5★ a 1★).",
          ],
        },
        {
          heading: "3. RESPUESTAS OFICIALES Y DESTACADAS",
          text: "Gestión de comentarios:",
          bullets: [
            "Publicar respuesta oficial visible del centro.",
            "Fijar los mejores testimonios en el perfil comercial.",
          ],
        },
        {
          heading: "4. SOLICITUD DE OPINIÓN POR WHATSAPP",
          text: "Incentivo de reseñas:",
          bullets: [
            "Envío directo de mensajes pre-redactados a alumnos para solicitar sus calificaciones.",
          ],
        },
      ],
    },
    config: {
      title: "Guía del Módulo de Configuración",
      badge: "Ajustes de Sede & Mercado Pago",
      sections: [
        {
          heading: "1. PERFIL, FOTOS Y HORARIOS SEMANALES",
          text: "Identidad e infraestructura:",
          bullets: [
            "Carga de fotos de la sede, redes sociales y definición de horarios de apertura por día (con soporte de turnos cortados).",
          ],
        },
        {
          heading: "2. POLÍTICAS DE CANCELACIÓN Y NORMAS",
          text: "Reglas operativas:",
          bullets: [
            "Configuración de horas de anticipación para cancelar clases sin penalización y normas de ingreso obligatorias.",
          ],
        },
        {
          heading: "3. STAFF, SALAS Y DÍAS DE CIERRE",
          text: "Recursos humanos y físicos:",
          bullets: [
            "Legajo de coaches con diplomas y agendas de disponibilidad.",
            "Creación de salas con su capacidad máxima.",
            "Registro de días de cierre o feriados que suspenden check-ins.",
          ],
        },
        {
          heading: "4. MÉTODOS DE COBRO Y MERCADO PAGO",
          text: "Canales de pago:",
          bullets: [
            "Configuración de efectivo, datos bancarios CBU/Alias, Posnet e integración OAuth con Mercado Pago para cobros automáticos.",
          ],
        },
      ],
    },
  };

  const currentGuideData = guideData[activeGuide];

  const filteredSections = currentGuideData.sections.filter((s) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      s.heading.toLowerCase().includes(q) ||
      s.text.toLowerCase().includes(q) ||
      s.bullets.some((b) => b.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in text-foreground">
      {/* Header Block */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Centro de Ayuda y Manuales de Uso
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-1">
            Guía explicativa paso a paso para operar eficientemente cada módulo de Studio Pulse
            Smart.
          </p>
        </div>

        <div className="relative shrink-0 w-full md:w-72">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tema o funcionalidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-9 rounded-xl text-xs bg-background border-border"
          />
        </div>
      </div>

      {/* Navigation Subtabs (6 Modules) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {modules.map((m) => {
          const Icon = m.icon;
          const isActive = activeGuide === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setActiveGuide(m.id as any)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-full ${
                isActive
                  ? "border-primary bg-primary/10 shadow-xs translate-y-[-2px]"
                  : "border-border bg-card hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-xl ${
                    isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </div>
              <div>
                <span className="font-bold text-xs text-foreground block">{m.name}</span>
                <span className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">
                  {m.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Guide Content Display */}
      <div className="rounded-3xl border border-border bg-card shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
              Manual del Módulo
            </span>
            <h3 className="text-base font-extrabold text-foreground mt-0.5">
              {currentGuideData.title}
            </h3>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {currentGuideData.badge}
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filteredSections.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border/80 bg-background shadow-2xs hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/50 pb-2">
                  {sec.heading}
                </h4>
                <p className="text-xs font-medium text-foreground leading-relaxed">{sec.text}</p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {sec.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}

          {filteredSections.length === 0 && (
            <div className="col-span-2 py-8 text-center text-xs text-muted-foreground">
              No se encontraron apartados que coincidan con "{searchTerm}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
