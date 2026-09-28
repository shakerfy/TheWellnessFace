export const getStudentPhoto = (name: string) => {
  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % avatars.length;
  return avatars[index];
};

export const STAFF_SPECIALTY_PRESETS = [
  "CrossFit",
  "Entrenamiento Funcional",
  "Levantamiento Olímpico",
  "Powerlifting",
  "Calistenia",
  "Fuerza de Potencia",
  "Spinning",
  "HIIT / Tabata",
  "Boxeo Recreativo",
  "Kickboxing",
  "Zumba",
  "Ritmos / Dance",
  "Yoga Vinyasa",
  "Yoga Hatha",
  "Pilates Reformer",
  "Pilates Mat",
  "Barré",
  "Estiramiento / Flex",
  "GAP",
  "AquaGym",
  "Running Club",
];
