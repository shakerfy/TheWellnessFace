import React from "react";
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  MessageCircle,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MemberItem, MemberHistory, MemberPayment } from "./types";

interface MemberDetailAccordionProps {
  member: MemberItem;
  history: MemberHistory;
  onStartRenew: (m: MemberItem) => void;
  onValidateApto: (memberName: string) => void;
  onGenerateAiCode: (m: MemberItem) => void;
  onViewReceipt: (receipt: { member: MemberItem; payment: MemberPayment }) => void;
}

export function MemberDetailAccordion({
  member: m,
  history,
  onStartRenew,
  onValidateApto,
  onGenerateAiCode,
  onViewReceipt,
}: MemberDetailAccordionProps) {
  return (
    <div className="sticky left-0 min-w-full p-6 space-y-5 animate-fade-in border-t border-border/60 bg-slate-50/70 dark:bg-background">
      {/* Sub-header with key member details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={m.photo}
            alt={m.name}
            className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-base text-foreground">{m.name}</h4>
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${m.color}`}
              >
                {m.status}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
              {m.dni && (
                <span>
                  DNI: <strong className="text-foreground font-semibold">{m.dni}</strong>
                </span>
              )}
              {m.dob && (
                <span>
                  Nac: <strong className="text-foreground font-semibold">{m.dob}</strong>
                </span>
              )}
              <span>
                Plan: <strong className="text-foreground font-semibold">{m.plan}</strong>
              </span>
              <span>
                Vence: <strong className="text-foreground font-semibold">{m.end}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold gap-1.5 h-8 border-border hover:bg-secondary"
            onClick={(e) => {
              e.stopPropagation();
              onStartRenew(m);
            }}
          >
            <CreditCard className="w-3.5 h-3.5 text-primary" /> Renovar
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold gap-1.5 h-8 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
            onClick={(e) => {
              e.stopPropagation();
              onValidateApto(m.name);
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Validar Apto
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-bold gap-1.5 h-8 border-primary/40 hover:bg-primary/10 text-primary"
            onClick={(e) => {
              e.stopPropagation();
              onGenerateAiCode(m);
            }}
            title="Generar código de vinculación para ChatGPT / Claude (WF-XXXX)"
          >
            <Sparkles className="w-3.5 h-3.5" /> Código IA
          </Button>
        </div>
      </div>

      <Separator />

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
          <div className="text-xl font-black text-primary">{history.attended.length}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Clases Asistidas
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
          <div className="text-xl font-black text-primary">{history.enrolled.length}</div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Próximas Agendadas
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80">
          <div
            className={`text-xl font-black ${
              history.attendanceRate === null
                ? "text-muted-foreground"
                : history.attendanceRate >= 70
                  ? "text-emerald-600 dark:text-emerald-400"
                  : history.attendanceRate >= 40
                    ? "text-amber-500"
                    : "text-destructive"
            }`}
          >
            {history.attendanceRate !== null ? `${history.attendanceRate}%` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Tasa de Asistencia
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-3.5 text-center shadow-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-border/80 flex flex-col justify-center items-center">
          <div className="text-xs font-bold text-foreground truncate mt-0.5">
            {history.lastClass ? `${history.lastClass.day}` : "—"}
          </div>
          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
            Última Asistencia
          </div>
        </div>
      </div>

      {/* Churn Alert (if risk) */}
      {history.isChurnRisk && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-destructive/10 border border-destructive/30 rounded-2xl text-xs text-destructive">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-destructive mt-0.5" />
            <div>
              <div className="font-bold">Riesgo de Baja Detectado</div>
              <div className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
                Este alumno no registra asistencias recientes. Te sugerimos contactarlo para retenerlo.
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-1 text-[11px] h-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              const cleanedPhone = m.phone.replace(/[^0-9]/g, "");
              const text = encodeURIComponent(
                `Hola ${m.name}, te extrañamos en el club. Notamos que hace unos días no vienes a entrenar y queríamos saber si estaba todo bien o si necesitabas ayuda con tus reservas. ¡Te esperamos!`,
              );
              window.open(
                `https://wa.me/${cleanedPhone || "5491100000000"}?text=${text}`,
                "_blank",
              );
            }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Enviar WhatsApp</span>
          </Button>
        </div>
      )}

      <Separator />

      {/* Detailed Information Grid - 2 Column Symmetric (Rule 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-stretch">
        {/* Ficha Médica Card */}
        <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Salud & Emergencia
              </span>
              <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                Ficha Médica
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Obra Social / Prepaga:</span>
                <span className="font-bold text-foreground">
                  {m.medicalInsurance || "No declarada"}
                  {m.affiliateNumber && ` (${m.affiliateNumber})`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Contacto Emergencia:</span>
                <span className="font-bold text-foreground">
                  {m.emergencyContactName || "No especificado"}
                  {m.emergencyContactPhone && ` · ${m.emergencyContactPhone}`}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-semibold">Certificado Apto Físico:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                    m.hasApto === "Entregado"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : m.hasApto === "Vencido"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                  }`}
                >
                  {m.hasApto === "Entregado"
                    ? `Vigente (${m.aptoExp || "1 año"})`
                    : m.hasApto === "Vencido"
                      ? "Vencido"
                      : "Pendiente"}
                </span>
              </div>

              {m.aptoDocUrl && (
                <div className="pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-8 text-[11px] rounded-xl gap-1.5 font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      const win = window.open();
                      win?.document.write(
                        `<iframe src="${m.aptoDocUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`,
                      );
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" /> Ver Documento Adjunto
                  </Button>
                </div>
              )}

              {m.medicalNotes && (
                <>
                  <Separator />
                  <div className="space-y-1 pt-1">
                    <span className="text-muted-foreground font-bold block">
                      Observaciones Médicas / Lesiones:
                    </span>
                    <p className="text-destructive font-semibold leading-relaxed bg-destructive/5 p-2.5 rounded-xl border border-destructive/20 text-[11px]">
                      {m.medicalNotes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Clases Asistidas Card */}
        <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Historial de Clases Asistidas
              </span>
              <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                {history.attended.length} asistencias
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {history.attended.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-border/40 my-auto">
                  <table className="w-full text-left text-[11px] min-w-[280px]">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold uppercase text-[9.5px]">
                        <th className="p-2.5">Clase</th>
                        <th className="p-2.5">Día</th>
                        <th className="p-2.5">Horario</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {history.attended.map((h, i) => (
                        <tr key={i} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-2.5 font-bold text-foreground">{h.className}</td>
                          <td className="p-2.5 text-muted-foreground">{h.day}</td>
                          <td className="p-2.5 text-muted-foreground">{h.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 my-auto text-center">
                  <p className="text-xs text-muted-foreground italic">
                    Sin clases asistidas registradas en el sistema.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Historial de Pagos Card */}
        <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Historial de Pagos
              </span>
              <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                {m.payments?.length || 0} registros
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {m.payments && m.payments.length > 0 ? (
                <div className="overflow-x-auto rounded-2xl border border-border/40 my-auto">
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="bg-secondary/30 border-b border-border/40 text-muted-foreground font-bold uppercase text-[9.5px]">
                        <th className="p-2.5">Fecha</th>
                        <th className="p-2.5">Plan</th>
                        <th className="p-2.5">Monto</th>
                        <th className="p-2.5">Método</th>
                        <th className="p-2.5 text-right">Recibo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                      {m.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-2.5 text-muted-foreground">{p.date}</td>
                          <td className="p-2.5 font-semibold text-foreground">{p.duration}</td>
                          <td className="p-2.5 font-bold text-primary">${p.amount}</td>
                          <td className="p-2.5 text-muted-foreground">{p.method}</td>
                          <td className="p-2.5 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-primary hover:bg-primary/10 rounded-md"
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewReceipt({ member: m, payment: p });
                              }}
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-8 my-auto text-center">
                  <p className="text-xs text-muted-foreground italic">
                    Sin registros de pagos en el historial.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Próximas Clases Agendadas Card */}
        <div className="group rounded-3xl border border-border bg-card p-5 space-y-4 transition-all duration-300 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-lg shadow-xs h-full flex flex-col justify-between">
          <div className="flex flex-col h-full justify-between space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Próximas Clases Agendadas
              </span>
              <span className="text-[10px] text-muted-foreground/70 font-semibold uppercase tracking-wider">
                {history.enrolled.length} reservas
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {history.enrolled.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1 my-auto">
                  {history.enrolled.map((e, i) => (
                    <span
                      key={i}
                      className="text-xs bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-xl border border-primary/20 flex items-center gap-1.5"
                    >
                      <span className="h-2 w-2 rounded-full bg-primary" />
                      {e.className} · {e.day} {e.time}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="py-8 my-auto text-center">
                  <p className="text-xs text-muted-foreground italic">
                    Sin reservas o clases agendadas próximamente.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
