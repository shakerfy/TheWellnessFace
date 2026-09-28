import { useState, useMemo } from "react";
import { toast } from "sonner";
import { INITIAL_FOOD_NOTE_ITEMS } from "@/lib/scan-data";

export function useFoodNotes() {
  const [foodNoteItems, setFoodNoteItems] = useState<string[]>(INITIAL_FOOD_NOTE_ITEMS);

  const activeFoodItems = useMemo(() => {
    return foodNoteItems.map((it) => it.trim()).filter((it) => it.length > 0);
  }, [foodNoteItems]);

  const totalNotesItemsCount = activeFoodItems.length;

  const handleNoteItemChange = (itemIndex: number, value: string) => {
    setFoodNoteItems((prev) => {
      const next = [...prev];
      next[itemIndex] = value;
      return next;
    });
  };

  const handleNoteItemKeyDown = (
    itemIndex: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setFoodNoteItems((prev) => {
        const next = [...prev];
        next.splice(itemIndex + 1, 0, "");
        return next;
      });
      setTimeout(() => {
        const nextInput = document.querySelector(
          `input[data-note-idx="${itemIndex + 1}"]`,
        ) as HTMLInputElement | null;
        nextInput?.focus();
      }, 50);
    } else if (e.key === "Backspace") {
      if (foodNoteItems[itemIndex] === "" && foodNoteItems.length > 1) {
        e.preventDefault();
        setFoodNoteItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
        setTimeout(() => {
          const prevIdx = Math.max(0, itemIndex - 1);
          const prevInput = document.querySelector(
            `input[data-note-idx="${prevIdx}"]`,
          ) as HTMLInputElement | null;
          prevInput?.focus();
        }, 50);
      }
    }
  };

  const handleAddNoteItem = () => {
    setFoodNoteItems((prev) => [...prev, ""]);
    setTimeout(() => {
      const nextIdx = foodNoteItems.length;
      const input = document.querySelector(
        `input[data-note-idx="${nextIdx}"]`,
      ) as HTMLInputElement | null;
      input?.focus();
    }, 50);
  };

  const handleRemoveNoteItem = (itemIndex: number) => {
    if (foodNoteItems.length <= 1) {
      setFoodNoteItems([""]);
      return;
    }
    setFoodNoteItems((prev) => prev.filter((_, idx) => idx !== itemIndex));
  };

  const handleResetNotes = () => {
    setFoodNoteItems(INITIAL_FOOD_NOTE_ITEMS);
    toast.info("Notas restauradas con el ejemplo estándar");
  };

  const handleClearNotes = () => {
    setFoodNoteItems([""]);
    toast.info("Notas vaciadas");
  };

  return {
    foodNoteItems,
    setFoodNoteItems,
    activeFoodItems,
    totalNotesItemsCount,
    handleNoteItemChange,
    handleNoteItemKeyDown,
    handleAddNoteItem,
    handleRemoveNoteItem,
    handleResetNotes,
    handleClearNotes,
  };
}
