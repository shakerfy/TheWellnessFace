import React from "react";
import { Toaster } from "@/components/ui/sonner";
import {
  GymClassItem,
  StaffMember,
  ConfirmDialogState,
  PromptDialogState,
  CancelSpotDialogState,
} from "./types";
import {
  EnrollMemberModal,
  WaitlistMemberModal,
  SubstituteCoachModal,
  CancelSpotModal,
  GenericConfirmDialog,
  GenericPromptDialog,
} from "./class-enroll-modals";

export interface ClassModalsHostProps {
  // Enroll modal
  enrollModalClass: GymClassItem | null;
  enrollTargetSpotIndex: number | null;
  enrollSearchTerm: string;
  setEnrollSearchTerm: (v: string) => void;
  enrollPlanFilter: string;
  setEnrollPlanFilter: (v: string) => void;
  availableMembersToEnroll: any[];
  onEnrollMember: (memberName: string) => void;
  onCloseEnrollModal: () => void;

  // Waitlist modal
  waitlistModalClass: GymClassItem | null;
  waitlistSearchTerm: string;
  setWaitlistSearchTerm: (v: string) => void;
  waitlistPlanFilter: string;
  setWaitlistPlanFilter: (v: string) => void;
  availableMembersToWaitlist: any[];
  onAddToWaitlist: (studentName: string) => void;
  onCloseWaitlistModal: () => void;

  // Substitute modal
  substituteCoachModalClass: GymClassItem | null;
  substituteSearchTerm: string;
  setSubstituteSearchTerm: (v: string) => void;
  availableCoachesToSubstitute: StaffMember[];
  onAssignSubstitute: (s: StaffMember) => void;
  onCloseSubstituteModal: () => void;

  // Cancel spot modal
  cancelSpotDialog: CancelSpotDialogState | null;
  cancelOption: "refund" | "rereserva";
  setCancelOption: (v: "refund" | "rereserva") => void;
  onConfirmCancelSpot: () => void;
  onCloseCancelSpot: () => void;

  // Generic dialogs
  confirmDialog: ConfirmDialogState | null;
  onCloseConfirmDialog: () => void;
  promptDialog: PromptDialogState | null;
  promptInputValue: string;
  setPromptInputValue: (v: string) => void;
  onClosePromptDialog: () => void;
}

export function ClassModalsHost({
  enrollModalClass,
  enrollTargetSpotIndex,
  enrollSearchTerm,
  setEnrollSearchTerm,
  enrollPlanFilter,
  setEnrollPlanFilter,
  availableMembersToEnroll,
  onEnrollMember,
  onCloseEnrollModal,
  waitlistModalClass,
  waitlistSearchTerm,
  setWaitlistSearchTerm,
  waitlistPlanFilter,
  setWaitlistPlanFilter,
  availableMembersToWaitlist,
  onAddToWaitlist,
  onCloseWaitlistModal,
  substituteCoachModalClass,
  substituteSearchTerm,
  setSubstituteSearchTerm,
  availableCoachesToSubstitute,
  onAssignSubstitute,
  onCloseSubstituteModal,
  cancelSpotDialog,
  cancelOption,
  setCancelOption,
  onConfirmCancelSpot,
  onCloseCancelSpot,
  confirmDialog,
  onCloseConfirmDialog,
  promptDialog,
  promptInputValue,
  setPromptInputValue,
  onClosePromptDialog,
}: ClassModalsHostProps) {
  return (
    <>
      <EnrollMemberModal
        enrollModalClass={enrollModalClass}
        enrollTargetSpotIndex={enrollTargetSpotIndex}
        enrollSearchTerm={enrollSearchTerm}
        setEnrollSearchTerm={setEnrollSearchTerm}
        enrollPlanFilter={enrollPlanFilter}
        setEnrollPlanFilter={setEnrollPlanFilter}
        availableMembersToEnroll={availableMembersToEnroll}
        onEnrollMember={onEnrollMember}
        onClose={onCloseEnrollModal}
      />

      <WaitlistMemberModal
        waitlistModalClass={waitlistModalClass}
        waitlistSearchTerm={waitlistSearchTerm}
        setWaitlistSearchTerm={setWaitlistSearchTerm}
        waitlistPlanFilter={waitlistPlanFilter}
        setWaitlistPlanFilter={setWaitlistPlanFilter}
        availableMembersToWaitlist={availableMembersToWaitlist}
        onAddToWaitlist={onAddToWaitlist}
        onClose={onCloseWaitlistModal}
      />

      <SubstituteCoachModal
        substituteCoachModalClass={substituteCoachModalClass}
        substituteSearchTerm={substituteSearchTerm}
        setSubstituteSearchTerm={setSubstituteSearchTerm}
        availableCoachesToSubstitute={availableCoachesToSubstitute}
        onAssignSubstitute={onAssignSubstitute}
        onClose={onCloseSubstituteModal}
      />

      <CancelSpotModal
        cancelSpotDialog={cancelSpotDialog}
        cancelOption={cancelOption}
        setCancelOption={setCancelOption}
        onConfirmCancelSpot={onConfirmCancelSpot}
        onClose={onCloseCancelSpot}
      />

      <GenericConfirmDialog
        confirmDialog={confirmDialog}
        onClose={onCloseConfirmDialog}
      />

      <GenericPromptDialog
        promptDialog={promptDialog}
        inputValue={promptInputValue}
        setInputValue={setPromptInputValue}
        onClose={onClosePromptDialog}
      />

      <Toaster position="top-right" richColors />
    </>
  );
}
