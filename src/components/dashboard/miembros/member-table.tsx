import React, { Fragment } from "react";
import {
  Search,
  MessageCircle,
  MoreHorizontal,
  UserCheck,
  CreditCard,
  Zap,
  Snowflake,
  Sparkles,
  CheckCircle2,
  Edit2,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MemberItem, MemberPayment } from "./types";
import { getMemberHistory, getStatusBadgeColor } from "./member-helpers";
import { MemberDetailAccordion } from "./member-detail-accordion";

interface MemberTableProps {
  filteredMembers: MemberItem[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string;
  setFilterStatus: (v: string) => void;
  sortOrder: string;
  setSortOrder: (v: string) => void;
  expandedMember: string | null;
  setExpandedMember: (name: string | null) => void;
  classesList?: any[];
  onReactivateMember: (memberName: string) => void;
  onStartRenew: (m: MemberItem) => void;
  onFreezeMember: (memberName: string) => void;
  onUnfreezeMember: (memberName: string) => void;
  onGenerateAiCode: (m: MemberItem) => void;
  onValidateApto: (memberName: string) => void;
  onEditMember: (m: MemberItem) => void;
  onCancelPlan: (m: MemberItem) => void;
  onDeleteMember: (m: MemberItem) => void;
  onViewReceipt: (receipt: { member: MemberItem; payment: MemberPayment }) => void;
}

export function MemberTable({
  filteredMembers,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortOrder,
  setSortOrder,
  expandedMember,
  setExpandedMember,
  classesList,
  onReactivateMember,
  onStartRenew,
  onFreezeMember,
  onUnfreezeMember,
  onGenerateAiCode,
  onValidateApto,
  onEditMember,
  onCancelPlan,
  onDeleteMember,
  onViewReceipt,
}: MemberTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Toolbar integrada en la tabla */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o DNI..."
            className="pl-9 bg-transparent border-border h-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[170px] h-9 bg-transparent border-border">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los activos</SelectItem>
              <SelectItem value="activos">Activos</SelectItem>
              <SelectItem value="vencidos">Deuda / Vencidos</SelectItem>
              <SelectItem value="congelados">Congelados</SelectItem>
              <SelectItem value="apto">Apto Vencido</SelectItem>
              <SelectItem value="archivados">Archivados / Bajas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-transparent border-border">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name_asc">Nombre (A-Z)</SelectItem>
              <SelectItem value="name_desc">Nombre (Z-A)</SelectItem>
              <SelectItem value="end_date_asc">Vencimiento (Próximos)</SelectItem>
              <SelectItem value="end_date_desc">Vencimiento (Lejanos)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs border-b border-border">
            <tr>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Miembro</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Email</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Teléfono</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Membresía</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Vencimiento</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Método de Pago</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Estado</th>
              <th className="px-5 py-3.5 font-medium whitespace-nowrap">Asistencia</th>
              <th className="px-5 py-3.5 font-medium text-right whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMembers.map((m) => {
              const isOpen = expandedMember === m.name;
              const history = getMemberHistory(m.name, classesList);

              return (
                <Fragment key={m.name}>
                  <tr
                    className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                      isOpen ? "bg-slate-100/80 dark:bg-muted/30" : ""
                    }`}
                    onClick={() => setExpandedMember(isOpen ? null : m.name)}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={m.photo}
                          alt={m.name}
                          className="h-10 w-10 rounded-full object-cover border border-border/40 shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-foreground block">{m.name}</span>
                          {m.dni && (
                            <span className="text-[10.5px] text-muted-foreground">
                              DNI: {m.dni}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                      {m.email || `${m.name.toLowerCase().replace(/ /g, "")}@email.com`}
                    </td>
                    <td className="px-5 py-3.5 text-xs whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{m.phone}</span>
                        <a
                          href={`https://wa.me/${m.phone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:text-emerald-600 transition-colors"
                          title="Enviar WhatsApp"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-foreground whitespace-nowrap">
                      {m.plan}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground whitespace-nowrap font-medium">
                      {m.end}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      {m.paymentMethod === "Mercado Pago (Auto)" || m.isAutoRenew ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                          Mercado Pago (Auto)
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">
                          {m.paymentMethod || "Efectivo / Transferencia"}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${getStatusBadgeColor(
                          m.status,
                        )}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {history.attendanceRate !== null ? (
                          <span
                            className={`font-semibold text-xs ${
                              history.attendanceRate >= 70
                                ? "text-primary"
                                : history.attendanceRate >= 40
                                  ? "text-secondary-foreground"
                                  : "text-destructive"
                            }`}
                          >
                            {history.attendanceRate}%
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        {history.isChurnRisk && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                            Riesgo Baja
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-52 rounded-xl p-1.5 shadow-xl border-border"
                            >
                              {m.status === "cancelado" ? (
                                <DropdownMenuItem onClick={() => onReactivateMember(m.name)}>
                                  <UserCheck className="h-4 w-4 mr-2 text-emerald-500" /> Reactivar
                                  Alumno
                                </DropdownMenuItem>
                              ) : (
                                <>
                                  <DropdownMenuItem onClick={() => onStartRenew(m)}>
                                    <CreditCard className="h-4 w-4 mr-2 text-primary" /> Renovar /
                                    Cobrar
                                  </DropdownMenuItem>
                                  {m.status === "congelado" ? (
                                    <DropdownMenuItem onClick={() => onUnfreezeMember(m.name)}>
                                      <Zap className="h-4 w-4 mr-2 text-emerald-500" /> Descongelar
                                      Membresía
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => onFreezeMember(m.name)}>
                                      <Snowflake className="h-4 w-4 mr-2 text-blue-400" /> Congelar
                                      Membresía
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onClick={() => onGenerateAiCode(m)}>
                                    <Sparkles className="h-4 w-4 mr-2 text-primary" /> Vincular con IA
                                    (WF-XXXX)
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onValidateApto(m.name)}>
                                    <CheckCircle2 className="h-4 w-4 mr-2 text-primary" /> Validar
                                    Apto Médico
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => onEditMember(m)}>
                                    <Edit2 className="h-4 w-4 mr-2" /> Editar Alumno
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-amber-600 dark:text-amber-400 focus:text-amber-600"
                                    onClick={() => onCancelPlan(m)}
                                  >
                                    <ShieldAlert className="h-4 w-4 mr-2" /> Dar de baja / Archivar
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDeleteMember(m)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Eliminar Definitivamente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <span
                          className={`text-base text-muted-foreground transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded accordion: history & details */}
                  {isOpen && (
                    <tr className="bg-slate-50/70 dark:bg-background border-b border-border/60">
                      <td colSpan={9} className="p-0">
                        <MemberDetailAccordion
                          member={m}
                          history={history}
                          onStartRenew={onStartRenew}
                          onValidateApto={onValidateApto}
                          onGenerateAiCode={onGenerateAiCode}
                          onViewReceipt={onViewReceipt}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-10 w-10 text-muted-foreground/40" />
                    <p className="font-semibold text-sm">No se encontraron miembros</p>
                    <p className="text-xs text-muted-foreground/80">
                      Intenta ajustar la búsqueda o los filtros seleccionados.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
