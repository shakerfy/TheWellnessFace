import { useState, useMemo } from "react";
import { Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DEFAULT_WHATSAPP_MEMBERS } from "./mock-data";

interface WhatsAppRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membersList?: any[];
  onSendWhatsApp: (phone: string, name: string) => void;
}

export function WhatsAppRequestDialog({
  open,
  onOpenChange,
  membersList = [],
  onSendWhatsApp,
}: WhatsAppRequestDialogProps) {
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const availableMembers = useMemo(() => {
    const combined = membersList.length > 0 ? membersList : DEFAULT_WHATSAPP_MEMBERS;
    return combined.filter((m) => {
      const q = memberSearch.toLowerCase();
      const matchName = m.name?.toLowerCase().includes(q);
      const matchPhone = m.phone?.toLowerCase().includes(q);
      return matchName || matchPhone;
    });
  }, [membersList, memberSearch]);

  const handleClose = () => {
    onOpenChange(false);
    setSelectedMember(null);
    setMemberSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg border border-border bg-card p-6 rounded-3xl shadow-2xl space-y-4">
        <DialogHeader>
          <DialogTitle className="text-base font-bold flex items-center gap-2">
            <Send className="h-5 w-5 text-emerald-600" /> Solicitar Feedback por WhatsApp
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs">
          <p className="text-muted-foreground leading-relaxed">
            Selecciona un socio de la lista activa para enviarle una invitación directa a su WhatsApp
            personal.
          </p>

          {/* Member Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar socio por nombre o número de teléfono..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full h-9 rounded-xl border border-border bg-background pl-8 pr-3 text-xs font-bold text-foreground placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>

          {/* Members List Selector */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {availableMembers.map((m) => {
              const isSelected = selectedMember?.id === m.id;
              return (
                <div
                  key={m.id || m.name}
                  onClick={() => setSelectedMember(m)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "border-emerald-500/50 bg-emerald-500/10 font-bold"
                      : "border-border/60 bg-secondary/20 hover:bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        m.photo ||
                        m.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=80&h=80&q=80"
                      }
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
                    />
                    <div>
                      <div className="font-bold text-xs text-foreground">{m.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>{m.phone || "Sin teléfono registrado"}</span>
                        {m.plan && (
                          <span className="text-[10px] bg-secondary px-1.5 py-0.2 rounded font-semibold">
                            {m.plan}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {m.phone ? (
                    <Button
                      type="button"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendWhatsApp(m.phone, m.name);
                        handleClose();
                      }}
                      className="h-7 px-3 rounded-xl text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1 shadow-xs cursor-pointer"
                    >
                      <Send className="h-3 w-3" /> Enviar
                    </Button>
                  ) : (
                    <span className="text-[10px] text-muted-foreground italic">Sin WhatsApp</span>
                  )}
                </div>
              );
            })}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl text-xs font-bold w-full sm:w-auto cursor-pointer"
            >
              Cerrar
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
