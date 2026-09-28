export type ConfigSubView =
  | "main"
  | "edit-profile"
  | "ai-memory"
  | "app-settings"
  | "advanced-settings";

export interface AiMemoryItem {
  id: string;
  text: string;
  domain?: "nutricion" | "entrenamiento";
  category?:
    | "proteina"
    | "carbo"
    | "grasa"
    | "habito"
    | "intensidad"
    | "ejercicio"
    | "cuidado"
    | "general";
  createdAt?: string;
}

export interface UserProfileData {
  fullName: string;
  phone: string;
  email: string;
  location: string;
  sex: "masculino" | "femenino" | "otro";
  birthDate: string;
  units: "metrico" | "imperial";
  height: string;
  weight: string;
  goal: "musculo" | "en_forma" | "perder_peso" | "saludable";
}

export interface AppSettingsData {
  theme: "system" | "light" | "dark";
  language: string;
  reminders: boolean;
}
