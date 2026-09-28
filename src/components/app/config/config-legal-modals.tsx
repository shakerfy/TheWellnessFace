import {
  Shield,
  FileDown,
  MessageSquare,
  Smartphone,
  Info,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfigLegalModalsProps {
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (open: boolean) => void;
  termsModalOpen: boolean;
  setTermsModalOpen: (open: boolean) => void;
  contactModalOpen: boolean;
  setContactModalOpen: (open: boolean) => void;
  logoutModalOpen: boolean;
  setLogoutModalOpen: (open: boolean) => void;
  deleteAccountModalOpen: boolean;
  setDeleteAccountModalOpen: (open: boolean) => void;
  onLogout: () => void;
  onDeleteAccountConfirm: () => void;
}

export function ConfigLegalModals({
  privacyModalOpen,
  setPrivacyModalOpen,
  termsModalOpen,
  setTermsModalOpen,
  contactModalOpen,
  setContactModalOpen,
  logoutModalOpen,
  setLogoutModalOpen,
  deleteAccountModalOpen,
  setDeleteAccountModalOpen,
  onLogout,
  onDeleteAccountConfirm,
}: ConfigLegalModalsProps) {
  return (
    <>
      {/* MODAL: POLÍTICAS DE PRIVACIDAD */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <Shield className="w-5 h-5 text-purple-500" /> Políticas de Privacidad
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-xs text-muted-foreground leading-relaxed max-h-[55vh] overflow-y-auto custom-scrollbar">
            <p className="font-semibold text-foreground">
              En The Wellness Face nos tomamos tu privacidad y la seguridad de tus datos biológicos
              con máxima seriedad.
            </p>
            <p>
              1. <strong>Protección de Datos Biométricos:</strong> Toda tu información de peso,
              altura, frecuencia de comidas y entrenamientos se almacena de forma encriptada
              localmente y nunca se vende a terceros.
            </p>
            <p>
              2. <strong>Uso de Inteligencia Artificial:</strong> Las consultas enviadas al AI
              Coach se procesan de forma anónima para generar recomendaciones nutricionales y
              deportivas sin vincular datos personales identificables.
            </p>
            <p>
              3. <strong>Derecho de Cancelación:</strong> Puedes solicitar en cualquier momento la
              eliminación total de tus métricas y registros de la plataforma.
            </p>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button onClick={() => setPrivacyModalOpen(false)} className="rounded-xl font-bold">
              Entendido
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: TÉRMINOS Y CONDICIONES */}
      <Dialog open={termsModalOpen} onOpenChange={setTermsModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
              <FileDown className="w-5 h-5 text-amber-500" /> Términos y Condiciones
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3 text-xs text-muted-foreground leading-relaxed max-h-[55vh] overflow-y-auto custom-scrollbar">
            <p className="font-semibold text-foreground">
              Al utilizar la plataforma The Wellness Face y el motor AI Coach, aceptas los siguientes
              términos de servicio:
            </p>
            <p>
              1. <strong>Alcance Informativo:</strong> El AI Coach brinda sugerencias de nutrición
              deportiva general y hábitos saludables. No constituye asesoramiento médico ni
              prescripción dietoterápica clínica.
            </p>
            <p>
              2. <strong>Uso Personal e Intransferible:</strong> Tu cuenta y tus reservas en centros
              asociados (gimnasios, pases y clases) son personales.
            </p>
            <p>
              3. <strong>Políticas de Reserva:</strong> Las cancelaciones de clases se rigen por la
              anticipación mínima definida por cada centro deportivo registrado.
            </p>
          </div>
          <div className="pt-3 border-t border-border/40 flex justify-end">
            <Button onClick={() => setTermsModalOpen(false)} className="rounded-xl font-bold">
              Aceptar Términos
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONTACTAR CON THE WELLNESS FACE */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-8 border border-border bg-card text-center">
          <DialogHeader className="pb-3 border-b border-border/40">
            <DialogTitle className="text-base font-bold flex items-center justify-center gap-2 text-foreground">
              <MessageSquare className="w-5 h-5 text-teal-500" /> Contactar con The Wellness Face
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 text-xs">
            <p className="text-muted-foreground">
              ¿Tienes alguna consulta o necesitas ayuda con tus clases, pagos o el AI Coach?
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <a
                href="https://wa.me/5491132421241"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition shadow-xs"
              >
                <Smartphone className="w-4 h-4" /> WhatsApp Oficial de Soporte
              </a>

              <a
                href="mailto:soporte@thewellnessface.com"
                className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-border bg-background font-semibold hover:bg-secondary transition text-foreground"
              >
                <Info className="w-4 h-4 text-indigo-500" /> Email: soporte@thewellnessface.com
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL: CONFIRMACIÓN CERRAR SESIÓN */}
      <AlertDialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <LogOut className="w-5 h-5 text-rose-500" /> ¿Cerrar sesión?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1">
              Tendrás que volver a ingresar tus credenciales para acceder a tus reservas, rutinas y
              el AI Coach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onLogout}
              className="rounded-xl bg-rose-500 hover:bg-rose-600 font-bold text-white"
            >
              Sí, cerrar sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL: CONFIRMACIÓN ELIMINAR CUENTA */}
      <AlertDialog open={deleteAccountModalOpen} onOpenChange={setDeleteAccountModalOpen}>
        <AlertDialogContent className="rounded-3xl p-6 sm:p-8 border border-rose-500/30 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-rose-500 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" /> ¿Eliminar cuenta de The Wellness Face?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Esta acción es <strong>definitiva e irreversible</strong>. Se borrarán de manera
              permanente tus datos personales, historial de clases, preferencias de nutrición y
              registro con el AI Coach.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-4 gap-2">
            <AlertDialogCancel className="rounded-xl font-semibold">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDeleteAccountConfirm}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 font-bold text-white"
            >
              Sí, eliminar mi cuenta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
