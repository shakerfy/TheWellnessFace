export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getLocalTimeString = (d: Date = new Date()): string => {
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

export const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  try {
    const cleanStr = timeStr.trim().toUpperCase();
    const isPM =
      cleanStr.includes("PM") ||
      cleanStr.includes("P. M.") ||
      cleanStr.includes("P.M.") ||
      cleanStr.includes("P. M");
    const isAM =
      cleanStr.includes("AM") ||
      cleanStr.includes("A. M.") ||
      cleanStr.includes("A.M.") ||
      cleanStr.includes("A. M");
    const digitsOnly = cleanStr.replace(/[^0-9:]/g, "");
    const parts = digitsOnly.split(":");
    let hours = parseInt(parts[0], 10) || 0;
    const minutes = parts[1] ? parseInt(parts[1], 10) || 0 : 0;

    if (isPM && hours < 12) hours += 12;
    if (isAM && hours === 12) hours = 0;

    return hours * 60 + minutes;
  } catch {
    return 0;
  }
};

export const formatDateLabel = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate();

    const isYesterday =
      yesterday.getFullYear() === date.getFullYear() &&
      yesterday.getMonth() === date.getMonth() &&
      yesterday.getDate() === date.getDate();

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
    };
    const formatted = date.toLocaleDateString("es-ES", options);
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    if (isToday) {
      return `Hoy — ${capitalized}`;
    } else if (isYesterday) {
      return `Ayer — ${capitalized}`;
    } else {
      return capitalized;
    }
  } catch (err) {
    return dateStr;
  }
};
