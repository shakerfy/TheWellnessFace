export const defaultIngredientSwaps: Record<string, string[]> = {
  yogur: [
    "1 taza de yogur griego natural sin azúcar",
    "1 taza de yogur de coco o soja",
    "1 taza de queso batido 0%",
    "1 taza de kéfir artesanal",
  ],
  banana: [
    "1 banana mediana en rodajas",
    "1 manzana roja en cubos",
    "1/2 taza de arándanos o fresas",
    "1 durazno o pera picada",
  ],
  nueces: [
    "1 puñado de nueces troceadas",
    "1 puñado de almendras tostadas",
    "1 cda de mantequilla de maní",
    "1 puñado de avellanas o pistachos",
  ],
  chía: [
    "1 cda de semillas de chía",
    "1 cda de semillas de lino",
    "1 cda de semillas de cáñamo",
  ],
  miel: [
    "1 cdita de miel cruda y canela",
    "1 cdita de sirope de agave",
    "1 toque de canela pura (sin endulzante)",
  ],
  avena: [
    "1 taza de avena integral",
    "1 taza de quinoa inflada",
    "1 taza de copos de trigo sarraceno",
    "1 taza de harina de avena",
  ],
  leche: [
    "1 taza de leche de almendras",
    "1 taza de leche descremada",
    "1 taza de bebida de avena",
    "1 taza de agua tibia + yogur",
  ],
  proteína: [
    "1 scoop de proteína aislada de vainilla",
    "3 cdas de yogur griego natural",
    "2 claras de huevo batidas",
    "2 cdas de mantequilla de maní",
  ],
  pan: [
    "2 rebanadas de pan de masa madre",
    "2 rebanadas de pan 100% integral",
    "2 tostadas de centeno",
    "1 tortilla integral",
  ],
  huevo: [
    "2-3 huevos de campo frescos",
    "1 lata de atún al natural",
    "120g de tofu revuelto con cúrcuma",
    "100g de queso cottage",
  ],
  palta: [
    "1/2 palta / aguacate maduro",
    "1 cda de aceite de oliva virgen extra",
    "2 cdas de hummus tradicional",
    "1 cda de queso crema descremado",
  ],
  pollo: [
    "150g de pechuga de pollo en tiras",
    "150g de carne magra",
    "1 lata grande de atún al natural",
    "150g de tofu marinado",
  ],
  quinoa: [
    "1 taza de quinoa cocida",
    "1 taza de arroz integral o basmati",
    "1 taza de fideos integrales",
    "1 taza de cous cous",
  ],
  brócoli: [
    "1 taza de brócoli al vapor",
    "1 taza de calabacín salteado",
    "1 taza de judías verdes",
    "1 taza de espárragos",
  ],
  salmón: [
    "1 filete de salmón fresco",
    "1 filete de merluza al horno",
    "1 pechuga de pollo a la plancha",
    "1 filete de atún fresco",
  ],
  batata: [
    "1 batata mediana asada",
    "1 papa mediana al horno",
    "1 taza de puré de calabaza",
    "1 taza de arroz jazmín",
  ],
  pavo: [
    "150g de pechuga de pavo en cubos",
    "150g de solomillo de cerdo magro",
    "1 lata de atún al natural",
    "150g de tofu firme",
  ],
  calabacín: [
    "1 calabacín mediano en rodajas",
    "1 berenjena en dados",
    "1 pimiento rojo en juliana",
    "1 taza de judías verdes",
  ],
  arroz: [
    "1 taza pequeña de arroz jazmín",
    "1 taza de fideos de arroz",
    "1 taza de quinoa cocida",
    "1 papa hervida pequeña",
  ],
};

export const INGREDIENT_MACRO_MAP: Record<
  string,
  { cal: number; p: number; c: number; f: number }
> = {
  // Avena & Carbos
  "1 taza de avena integral": { cal: 150, p: 5, c: 27, f: 3 },
  "1 taza de quinoa inflada": { cal: 120, p: 4, c: 23, f: 2 },
  "1 taza de copos de trigo sarraceno": { cal: 140, p: 5, c: 28, f: 1 },
  "1 taza de harina de avena": { cal: 160, p: 6, c: 28, f: 3 },
  "2 rebanadas de pan de masa madre": { cal: 160, p: 6, c: 32, f: 1 },
  "2 rebanadas de pan 100% integral": { cal: 140, p: 6, c: 26, f: 2 },
  "2 tostadas de centeno": { cal: 130, p: 4, c: 26, f: 1 },
  "1 tortilla integral": { cal: 130, p: 4, c: 22, f: 3 },
  "1 taza de quinoa cocida": { cal: 220, p: 8, c: 39, f: 4 },
  "1 taza de arroz integral o basmati": { cal: 215, p: 5, c: 45, f: 2 },
  "1 taza de fideos integrales": { cal: 200, p: 7, c: 42, f: 1 },
  "1 taza de cous cous": { cal: 175, p: 6, c: 36, f: 1 },
  "1 batata mediana asada": { cal: 115, p: 2, c: 27, f: 0 },
  "1 papa mediana al horno": { cal: 130, p: 3, c: 30, f: 0 },
  "1 taza de puré de calabaza": { cal: 50, p: 2, c: 12, f: 0 },
  "1 taza de arroz jazmín": { cal: 205, p: 4, c: 45, f: 0 },
  "1 taza pequeña de arroz jazmín": { cal: 160, p: 3, c: 35, f: 0 },
  "1 taza de fideos de arroz": { cal: 190, p: 3, c: 42, f: 0 },
  "1 papa hervida pequeña": { cal: 100, p: 2, c: 23, f: 0 },

  // Proteínas
  "1 scoop de proteína aislada de vainilla": { cal: 120, p: 25, c: 2, f: 1 },
  "1 scoop de proteína aislada": { cal: 120, p: 25, c: 2, f: 1 },
  "3 cdas de yogur griego natural": { cal: 60, p: 7, c: 2, f: 2 },
  "2 claras de huevo batidas": { cal: 35, p: 7, c: 0, f: 0 },
  "2 cdas de mantequilla de maní": { cal: 190, p: 8, c: 7, f: 16 },
  "2-3 huevos de campo frescos": { cal: 180, p: 14, c: 1, f: 13 },
  "1 lata de atún al natural": { cal: 130, p: 28, c: 0, f: 1 },
  "1 lata grande de atún al natural": { cal: 160, p: 35, c: 0, f: 1 },
  "120g de tofu revuelto con cúrcuma": { cal: 110, p: 12, c: 3, f: 6 },
  "100g de queso cottage": { cal: 98, p: 11, c: 3, f: 4 },
  "150g de pechuga de pollo en tiras": { cal: 195, p: 39, c: 0, f: 4 },
  "150g de carne magra": { cal: 220, p: 36, c: 0, f: 8 },
  "150g de tofu marinado": { cal: 140, p: 15, c: 4, f: 7 },
  "150g de tofu firme": { cal: 130, p: 14, c: 3, f: 7 },
  "1 filete de salmón fresco": { cal: 250, p: 26, c: 0, f: 16 },
  "1 filete de merluza al horno": { cal: 120, p: 24, c: 0, f: 2 },
  "1 pechuga de pollo a la plancha": { cal: 195, p: 39, c: 0, f: 4 },
  "1 filete de atún fresco": { cal: 180, p: 38, c: 0, f: 2 },
  "150g de pechuga de pavo en cubos": { cal: 180, p: 36, c: 0, f: 3 },
  "150g de solomillo de cerdo magro": { cal: 190, p: 34, c: 0, f: 5 },
  "1 taza de yogur griego natural sin azúcar": { cal: 130, p: 17, c: 6, f: 4 },
  "1 taza de yogur de coco o soja": { cal: 100, p: 4, c: 10, f: 5 },
  "1 taza de queso batido 0%": { cal: 90, p: 16, c: 5, f: 0 },
  "1 taza de kéfir artesanal": { cal: 110, p: 9, c: 9, f: 3 },

  // Grasas & Frutos Secos
  "1/2 palta / aguacate maduro": { cal: 120, p: 1, c: 6, f: 11 },
  "1 cda de aceite de oliva virgen extra": { cal: 120, p: 0, c: 0, f: 14 },
  "2 cdas de hummus tradicional": { cal: 70, p: 2, c: 6, f: 4 },
  "1 cda de queso crema descremado": { cal: 35, p: 2, c: 2, f: 2 },
  "1 puñado de nueces troceadas": { cal: 180, p: 4, c: 4, f: 18 },
  "1 puñado de almendras tostadas": { cal: 160, p: 6, c: 6, f: 14 },
  "1 puñado de avellanas o pistachos": { cal: 160, p: 5, c: 7, f: 14 },
  "1 cda de semillas de chía": { cal: 60, p: 2, c: 5, f: 4 },
  "1 cda de semillas de lino": { cal: 55, p: 2, c: 3, f: 4 },
  "1 cda de semillas de cáñamo": { cal: 60, p: 3, c: 1, f: 5 },

  // Frutas & Endulzantes & Vegetales
  "1/2 taza de arándanos o fresas": { cal: 40, p: 1, c: 9, f: 0 },
  "1 banana mediana en rodajas": { cal: 105, p: 1, c: 27, f: 0 },
  "1 manzana roja en cubos": { cal: 80, p: 0, c: 21, f: 0 },
  "1 durazno o pera picada": { cal: 60, p: 1, c: 15, f: 0 },
  "1 cdita de miel cruda y canela": { cal: 25, p: 0, c: 6, f: 0 },
  "1 cdita de sirope de agave": { cal: 20, p: 0, c: 5, f: 0 },
  "1 toque de canela pura (sin endulzante)": { cal: 5, p: 0, c: 1, f: 0 },
  "1 taza de brócoli al vapor": { cal: 35, p: 3, c: 6, f: 0 },
  "1 taza de calabacín salteado": { cal: 30, p: 1, c: 4, f: 1 },
  "1 calabacín mediano en rodajas": { cal: 25, p: 2, c: 4, f: 0 },
  "1 berenjena en dados": { cal: 25, p: 1, c: 6, f: 0 },
  "1 pimiento rojo en juliana": { cal: 30, p: 1, c: 7, f: 0 },
  "1 taza de judías verdes": { cal: 35, p: 2, c: 7, f: 0 },
  "1 taza de espárragos": { cal: 30, p: 3, c: 5, f: 0 },
  "1 cuenco de tomates cherry": { cal: 25, p: 1, c: 5, f: 0 },
  "1 tomate en rodajas": { cal: 22, p: 1, c: 5, f: 0 },
  "1 taza de espinacas baby": { cal: 15, p: 2, c: 2, f: 0 },
  "2 cuencos de espinacas salteadas": { cal: 40, p: 4, c: 6, f: 1 },
  "1 taza de champiñones salteados": { cal: 35, p: 3, c: 4, f: 1 },
  "1 taza de setas portobello": { cal: 30, p: 3, c: 5, f: 0 },
};

export const calculateSuggestionMacros = (ingredients: any[]) => {
  let totalCal = 0;
  let totalP = 0;
  let totalC = 0;
  let totalF = 0;

  for (const ing of ingredients) {
    const name =
      typeof ing === "object" && ing !== null ? ing.name : String(ing);
    const m = INGREDIENT_MACRO_MAP[name];
    if (m) {
      totalCal += m.cal;
      totalP += m.p;
      totalC += m.c;
      totalF += m.f;
    } else {
      totalCal += 70;
      totalP += 4;
      totalC += 8;
      totalF += 2;
    }
  }

  return {
    calories: Math.max(50, totalCal),
    protein: Math.max(2, totalP),
    carbs: Math.max(2, totalC),
    fat: Math.max(1, totalF),
  };
};

export const resolveSuggestionIngredients = (item: any) => {
  if (Array.isArray(item.ingredients) && item.ingredients.length > 0) {
    return item.ingredients;
  }
  const text = `${item.title || ""} ${item.desc || ""} ${item.narrative || ""}`.toLowerCase();
  const detected: any[] = [];

  const checkMap: Array<{ key: string; defaultName: string; options: string[] }> = [
    {
      key: "avena",
      defaultName: "1 taza de avena integral",
      options: defaultIngredientSwaps.avena,
    },
    {
      key: "proteína",
      defaultName: "1 scoop de proteína aislada de vainilla",
      options: defaultIngredientSwaps.proteína,
    },
    {
      key: "frutos rojos",
      defaultName: "1/2 taza de arándanos o fresas",
      options: defaultIngredientSwaps.banana,
    },
    {
      key: "arándanos",
      defaultName: "1/2 taza de arándanos o fresas",
      options: defaultIngredientSwaps.banana,
    },
    {
      key: "chía",
      defaultName: "1 cda de semillas de chía",
      options: defaultIngredientSwaps.chía,
    },
    {
      key: "pan",
      defaultName: "2 rebanadas de pan de masa madre",
      options: defaultIngredientSwaps.pan,
    },
    {
      key: "tostada",
      defaultName: "2 rebanadas de pan de masa madre",
      options: defaultIngredientSwaps.pan,
    },
    {
      key: "tostón",
      defaultName: "2 rebanadas de pan de masa madre",
      options: defaultIngredientSwaps.pan,
    },
    {
      key: "huevo",
      defaultName: "2-3 huevos de campo frescos",
      options: defaultIngredientSwaps.huevo,
    },
    {
      key: "palta",
      defaultName: "1/2 palta / aguacate maduro",
      options: defaultIngredientSwaps.palta,
    },
    {
      key: "aguacate",
      defaultName: "1/2 palta / aguacate maduro",
      options: defaultIngredientSwaps.palta,
    },
    {
      key: "tomate",
      defaultName: "1 cuenco de tomates cherry",
      options: [
        "1 cuenco de tomates cherry",
        "1 tomate en rodajas",
        "1 taza de espinacas baby",
      ],
    },
    {
      key: "pollo",
      defaultName: "150g de pechuga de pollo en tiras",
      options: defaultIngredientSwaps.pollo,
    },
    {
      key: "pechuga",
      defaultName: "150g de pechuga de pollo en tiras",
      options: defaultIngredientSwaps.pollo,
    },
    {
      key: "quinoa",
      defaultName: "1 taza de quinoa cocida",
      options: defaultIngredientSwaps.quinoa,
    },
    {
      key: "brócoli",
      defaultName: "1 taza de brócoli al vapor",
      options: defaultIngredientSwaps.brócoli,
    },
    {
      key: "salmón",
      defaultName: "1 filete de salmón fresco",
      options: defaultIngredientSwaps.salmón,
    },
    {
      key: "batata",
      defaultName: "1 batata mediana asada",
      options: defaultIngredientSwaps.batata,
    },
    {
      key: "papa",
      defaultName: "1 batata mediana asada",
      options: defaultIngredientSwaps.batata,
    },
    {
      key: "yogur",
      defaultName: "1 taza de yogur griego natural sin azúcar",
      options: defaultIngredientSwaps.yogur,
    },
    {
      key: "banana",
      defaultName: "1 banana mediana en rodajas",
      options: defaultIngredientSwaps.banana,
    },
    {
      key: "nueces",
      defaultName: "1 puñado de nueces troceadas",
      options: defaultIngredientSwaps.nueces,
    },
    {
      key: "almendras",
      defaultName: "1 puñado de almendras tostadas",
      options: defaultIngredientSwaps.nueces,
    },
    {
      key: "miel",
      defaultName: "1 cdita de miel cruda y canela",
      options: defaultIngredientSwaps.miel,
    },
    {
      key: "pavo",
      defaultName: "150g de pechuga de pavo en cubos",
      options: defaultIngredientSwaps.pavo,
    },
    {
      key: "calabacín",
      defaultName: "1 calabacín mediano en rodajas",
      options: defaultIngredientSwaps.calabacín,
    },
    {
      key: "arroz",
      defaultName: "1 taza pequeña de arroz jazmín",
      options: defaultIngredientSwaps.arroz,
    },
    {
      key: "espinaca",
      defaultName: "2 cuencos de espinacas salteadas",
      options: [
        "2 cuencos de espinacas salteadas",
        "1 taza de brócoli al vapor",
        "1 taza de judías verdes",
      ],
    },
    {
      key: "champiñ",
      defaultName: "1 taza de champiñones salteados",
      options: [
        "1 taza de champiñones salteados",
        "1 taza de setas portobello",
        "1 taza de espárragos",
      ],
    },
  ];

  const addedKeys = new Set<string>();
  for (const entry of checkMap) {
    if (text.includes(entry.key) && !addedKeys.has(entry.key)) {
      addedKeys.add(entry.key);
      detected.push({
        id: `ing-${detected.length + 1}`,
        name: entry.defaultName,
        selectedIndex: 0,
        options: entry.options,
      });
    }
  }

  if (detected.length === 0) {
    return [
      {
        id: "ing-1",
        name: "150g de pechuga de pollo en tiras",
        selectedIndex: 0,
        options: defaultIngredientSwaps.pollo,
      },
      {
        id: "ing-2",
        name: "1 taza de quinoa cocida",
        selectedIndex: 0,
        options: defaultIngredientSwaps.quinoa,
      },
      {
        id: "ing-3",
        name: "1 taza de brócoli al vapor",
        selectedIndex: 0,
        options: defaultIngredientSwaps.brócoli,
      },
      {
        id: "ing-4",
        name: "1/2 palta / aguacate maduro",
        selectedIndex: 0,
        options: defaultIngredientSwaps.palta,
      },
    ];
  }
  return detected;
};

export const simplifyIngredientShortName = (fullName: string): string => {
  return fullName
    .replace(
      /^(\d+(-\d+)?|\d+\/\d+|\d+(\.\d+)?)\s*(taza|tazas|cdita|cditas|cda|cdas|scoop|scoops|puñado|puñados|rebanada|rebanadas|tostada|tostadas|lata|latas|filete|filetes|porción|porciones|cuenco|cuencos|g|gr|ml)\s*(de\s*)?/i,
      "",
    )
    .replace(
      /\s*(en rodajas|en cubos|en tiras|troceadas|tostadas|cocida|al vapor|salteado|salteados|al horno|a la plancha|natural|sin azúcar|fresco|frescos|maduro|artesanal|0%|descremada|tibia|cruda|pura|rústico|caliente|descremado)\b/gi,
      "",
    )
    .trim();
};

export const generateDynamicSuggestionTitle = (
  ingredients: any[],
  currentTitle: string = "",
): string => {
  const cap = (s: string) => (!s ? "" : s.charAt(0).toUpperCase() + s.slice(1));
  if (!ingredients || ingredients.length === 0) return cap(currentTitle);
  const names = ingredients.map((ing) => {
    const raw =
      typeof ing === "object" && ing !== null ? ing.name : String(ing);
    return cap(simplifyIngredientShortName(raw));
  });

  const lowerCurrent = currentTitle.toLowerCase();

  // 1. Tostón / Tostadas
  if (
    lowerCurrent.includes("tost") ||
    lowerCurrent.includes("pan") ||
    names.some((n) => /pan|centeno|masa madre/i.test(n))
  ) {
    const bread =
      names.find((n) => /pan|tostada|centeno|masa madre|tortilla/i.test(n)) ||
      "Masa Madre";
    const protein =
      names.find((n) => /huevo|tofu|atún|cottage|pollo/i.test(n)) ||
      "Huevos Revueltos";
    const accent =
      names.find((n) => /palta|aguacate|tomate|hummus|queso/i.test(n)) || "Palta";
    return cap(`Tostón de ${bread} con ${protein} & ${accent}`);
  }

  // 2. Bowl de Yogur / Merienda
  if (
    lowerCurrent.includes("yogur") ||
    names.some((n) => /yogur|kéfir|queso/i.test(n))
  ) {
    const base =
      names.find((n) => /yogur|kéfir|queso/i.test(n)) || "Yogur Griego";
    const fruit =
      names.find((n) =>
        /banana|manzana|arándano|fresa|fruto|durazno/i.test(n),
      ) || "Fruta Fresca";
    const nut =
      names.find((n) => /nuez|nueces|almendra|maní|avellana|semilla/i.test(n)) ||
      "Frutos Secos";
    return cap(`Bowl de ${base} con ${fruit} & ${nut}`);
  }

  // 3. Bowl de Avena / Desayuno
  if (
    lowerCurrent.includes("avena") ||
    names.some((n) => /avena|quinoa inflada|sarraceno/i.test(n))
  ) {
    const carb =
      names.find((n) => /avena|quinoa|sarraceno/i.test(n)) || "Avena Integral";
    const fruit =
      names.find((n) => /arándano|fresa|fruto|banana|manzana/i.test(n)) ||
      "Frutos Rojos";
    const protein =
      names.find((n) => /proteína|yogur|clara/i.test(n)) || "Proteína";
    return cap(`Bowl de ${carb} con ${fruit} & ${protein}`);
  }

  // 4. Bowl de Quinoa / Granos
  if (
    lowerCurrent.includes("quinoa") ||
    (names.some((n) => /quinoa|arroz|fideo/i.test(n)) &&
      names.some((n) => /pollo|carne|tofu/i.test(n)))
  ) {
    const carb =
      names.find((n) => /quinoa|arroz|fideo|cous cous/i.test(n)) || "Quinoa";
    const protein =
      names.find((n) => /pollo|carne|tofu|atún|salmón|pavo/i.test(n)) ||
      "Pechuga Grillada";
    const veggie =
      names.find((n) =>
        /brócoli|calabacín|judía|espárrago|palta|tomate|espinaca/i.test(n),
      ) || "Vegetales";
    return cap(`Bowl de ${carb} con ${protein} & ${veggie}`);
  }

  // 5. Proteína Principal con Guarniciones
  const mainProtein = names.find((n) =>
    /salmón|merluza|pescado|atún|pollo|pavo|tofu|huevo|carne/i.test(n),
  );
  const mainCarb = names.find((n) =>
    /batata|papa|calabaza|arroz|quinoa/i.test(n),
  );
  const mainVeggie = names.find((n) =>
    /espinaca|brócoli|vegetal|judía|espárrago|champiñón|ensalada|tomate|calabacín/i.test(
      n,
    ),
  );

  if (mainProtein && (mainCarb || mainVeggie)) {
    const secondPart =
      mainCarb && mainVeggie
        ? ` con ${mainCarb} & ${mainVeggie}`
        : mainCarb
          ? ` con ${mainCarb}`
          : ` con ${mainVeggie}`;
    return cap(`${mainProtein}${secondPart}`);
  }

  // 6. Salteado Ligero (Cena)
  if (
    lowerCurrent.includes("salteado") ||
    lowerCurrent.includes("pavo") ||
    names.some((n) => /saltead/i.test(n))
  ) {
    const protein =
      names.find((n) => /pavo|pollo|tofu|cerdo/i.test(n)) || "Pavo";
    const veggie =
      names.find((n) => /calabacín|berenjena|pimiento|champiñón/i.test(n)) ||
      "Vegetales Salteados";
    const carb =
      names.find((n) => /arroz|quinoa|papa/i.test(n)) || "Arroz Jazmín";
    return cap(`Salteado de ${protein} con ${veggie} & ${carb}`);
  }

  const p1 = names[0] || "Plato Saludable";
  const p2 = names[1] ? ` con ${names[1]}` : "";
  const p3 = names[2] ? ` & ${names[2]}` : "";
  return cap(`${p1}${p2}${p3}`);
};

export const generateDynamicEducationalInsight = (
  ingredients: any[],
  contextBadge: string = "",
): string => {
  const isPostWorkout = /post-entreno|recarga/i.test(contextBadge);
  const isNight = /nocturna|cena/i.test(contextBadge);
  const isMorning = /desayuno|matutina|energético/i.test(contextBadge);

  if (isPostWorkout) {
    return "Combinación ideal para reponer energía y ayudar a tus músculos a recuperarse después del entrenamiento.";
  }
  if (isNight) {
    return "Plato ligero y de fácil digestión para nutrirte bien y favorecer un descanso profundo.";
  }
  if (isMorning) {
    return "Energía constante y buena saciedad para empezar la mañana con claridad y vitalidad.";
  }
  return "Combinación equilibrada de proteína y energía limpia para mantenerte activo durante el día sin pesadez.";
};
