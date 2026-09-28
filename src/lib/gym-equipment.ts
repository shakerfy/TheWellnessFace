// Gym Equipment Data Model & Catalog for Public Gym Pages

export interface GymEquipmentItem {
  name: string;
  image: string;
  desc: string;
}

export function getGymEquipment(slug: string): GymEquipmentItem[] {
  const defaultImg = (id: string) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=400&q=80`;

  if (slug === "kraft-strength-club") {
    return [
      {
        name: "Poleas Ajustables Dobles",
        image: "/cable-crossover.png",
        desc: "Estación de poleas cruzadas regulable en altura para entrenamiento de fuerza.",
      },
      {
        name: "Polea Alta para Espalda (Lat Pulldown)",
        image: "/lat-pulldown.png",
        desc: "Máquina profesional con polea superior y rodillos de fijación ajustables.",
      },
      {
        name: "Camilla de Femorales Tumbado",
        image: "/prone-leg-curl.png",
        desc: "Aislamiento perfecto de isquiotibiales en posición prona.",
      },
      {
        name: "Sillón de Flexión de Piernas Sentado",
        image: "/seated-leg-curl.png",
        desc: "Trabajo biomecánico guiado para flexores de rodilla y cuádriceps.",
      },
      {
        name: "Camilla de Isquiotibiales Sentado",
        image: "/seated-hamstring-curl.png",
        desc: "Máquina de aislamiento para la cadena posterior con rango de movimiento controlado.",
      },
    ];
  }

  if (
    slug.includes("yoga") ||
    slug.includes("pilates") ||
    slug.includes("studio") ||
    slug.includes("zen")
  ) {
    return [
      {
        name: "Camas de Pilates Reformer",
        image: defaultImg("photo-1518611012118-696072aa579a"),
        desc: "Reformers de madera con resortes regulables.",
      },
      {
        name: "Mats de Yoga de Corcho",
        image: defaultImg("photo-1544367567-0f2fcb009e0b"),
        desc: "Mats ecológicos antideslizantes de alta densidad.",
      },
      {
        name: "Bloques y Correas de Soporte",
        image: defaultImg("photo-1600880292203-757bb62b4baf"),
        desc: "Accesorios para alineación y estiramientos.",
      },
      {
        name: "Pelotas de Pilates (Fitballs)",
        image: defaultImg("photo-1518310383802-640c2de311b2"),
        desc: "Diferentes tamaños para fortalecimiento de core.",
      },
      {
        name: "Rodillos de Espuma (Foam Rollers)",
        image: defaultImg("photo-1600880292089-90a7e086ee0c"),
        desc: "Para liberación miofascial y masajes.",
      },
    ];
  }

  if (slug.includes("crossfit") || slug.includes("box") || slug.includes("concept")) {
    return [
      {
        name: "Estructura Rigs para Pull-Ups",
        image: defaultImg("photo-1517838277536-f5f99be501cd"),
        desc: "Rigs multiestación para calistenia y gimnasia.",
      },
      {
        name: "Remos Concept2",
        image: defaultImg("photo-1517963879433-6ad2b056d712"),
        desc: "Ergómetros Concept2 con monitor PM5.",
      },
      {
        name: "Kettlebells de Competición",
        image: defaultImg("photo-1541534741688-6078c6bfb5c5"),
        desc: "Pesas rusas de acero de 8kg a 32kg.",
      },
      {
        name: "Med Balls de Lanzamiento",
        image: defaultImg("photo-1601422407692-ec4eeec1d9b3"),
        desc: "Wall balls con costuras reforzadas.",
      },
      {
        name: "Cajones Pliométricos",
        image: defaultImg("photo-1517838277536-f5f99be501cd"),
        desc: "Cajones de madera de 3 alturas regulables.",
      },
    ];
  }

  return [
    {
      name: "Poleas Ajustables Dobles",
      image: "/cable-crossover.png",
      desc: "Estación de poleas cruzadas regulable en altura para entrenamiento funcional y de fuerza.",
    },
    {
      name: "Polea Alta para Espalda (Lat Pulldown)",
      image: "/lat-pulldown.png",
      desc: "Máquina profesional con polea superior y rodillos de fijación ajustables para dorsales.",
    },
    {
      name: "Camilla de Femorales Tumbado",
      image: "/prone-leg-curl.png",
      desc: "Aislamiento perfecto de isquiotibiales en posición prona con rodillo acolchado autorregulable.",
    },
    {
      name: "Sillón de Flexión de Piernas Sentado",
      image: "/seated-leg-curl.png",
      desc: "Trabajo biomecánico guiado para flexores de rodilla y cuádriceps en posición sentada.",
    },
    {
      name: "Camilla de Isquiotibiales Sentado",
      image: "/seated-hamstring-curl.png",
      desc: "Máquina de aislamiento para la cadena posterior con rango de movimiento controlado.",
    },
  ];
}
