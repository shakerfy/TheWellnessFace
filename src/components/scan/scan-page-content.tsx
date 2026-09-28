import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  FoodScannerTutorialDialog,
  STORAGE_KEY_TUTORIAL_SEEN,
} from "@/components/food-scanner-tutorial";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNutritionSettings } from "@/lib/nutrition-settings";
import { calculateTimingFit } from "@/lib/timing-fit";
import {
  MealCalloutPin,
  MealIngredientItem,
  NutritionVectorBadge,
  FoodScanCategory,
  COMMON_FOODS_DATABASE,
  CAL_AI_SAMPLE_MEALS,
  inferContextualMealType,
  generateContextualAiInsight,
} from "@/lib/scan-data";
import {
  ScanViewfinder,
  ScanNutritionReport,
  ScanFixScreen,
  AddIngredientModal,
  LogEmptyFoodModal,
  parseFoodNotesToIngredients,
  parseAiPromptAction,
} from "@/components/scan";
import { useCameraStream } from "./use-camera-stream";
import { useFoodNotes } from "./use-food-notes";

export function ScanPageContent() {
  const navigate = useNavigate();
  useNutritionSettings();

  // Screen State: "scanner" (Live Camera Viewfinder) | "nutrition" (Unified Bio Report) | "fix" (AI Correction)
  const [currentScreen, setCurrentScreen] = useState<"scanner" | "nutrition" | "fix">("scanner");

  // Food Scanner Precision Tutorial Dialog State (auto-opens if first time)
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== "undefined") {
      const seen = localStorage.getItem(STORAGE_KEY_TUTORIAL_SEEN);
      return seen !== "true";
    }
    return false;
  });

  // Selected sample & custom capture
  const [selectedSampleIndex, setSelectedSampleIndex] = useState(0);
  const initialSample = CAL_AI_SAMPLE_MEALS[selectedSampleIndex];
  const [customImage, setCustomImage] = useState<string | null>(null);
  const activeImage = customImage || initialSample.img;

  // Scanner UI & Category States
  const [, setSelectedCategory] = useState<FoodScanCategory>("comida");
  const [scanMode, setScanMode] = useState<"scan_food" | "voice_log" | "database" | "barcode" | "food_label">("scan_food");
  const [eatingReason, setEatingReason] = useState<"rutina" | "social" | "placer" | "confort">("rutina");

  // Camera stream custom hook
  const isCameraEnabled =
    currentScreen === "scanner" && !customImage && scanMode !== "food_label" && scanMode !== "database";
  const camera = useCameraStream({ enabled: isCameraEnabled });

  // Food notes custom hook
  const foodNotes = useFoodNotes();

  // Empty food modal states
  const [showLogEmptyFoodModal, setShowLogEmptyFoodModal] = useState(false);
  const [emptyFoodName, setEmptyFoodName] = useState("");
  const [emptyFoodCalories, setEmptyFoodCalories] = useState("120");
  const [emptyFoodProtein, setEmptyFoodProtein] = useState("10");
  const [emptyFoodCarbs, setEmptyFoodCarbs] = useState("12");
  const [emptyFoodFat, setEmptyFoodFat] = useState("3");
  const [emptyFoodServing, setEmptyFoodServing] = useState("1 porción");

  const libraryInputRef = useRef<HTMLInputElement>(null);
  const [isScanningLaser, setIsScanningLaser] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Nutrition Report & breakdown data
  const [title, setTitle] = useState(initialSample.title);
  const [reportTitle, setReportTitle] = useState(initialSample.reportTitle);
  const [mealTime, setMealTime] = useState(initialSample.time || "12:46 PM");
  const [narrative, setNarrative] = useState(initialSample.narrative);
  const [bioScore, setBioScore] = useState(initialSample.bioScore);
  const [bioGrade, setBioGrade] = useState(initialSample.bioGrade);
  const [bioQualityLabel, setBioQualityLabel] = useState(initialSample.bioQualityLabel);
  const [, setHighlightNutrient] = useState<string>(
    initialSample.highlightNutrient || "Source of Vitamin C",
  );
  const [, setHighlightAmount] = useState<string>(
    initialSample.highlightAmount || "25mg",
  );
  const [, setServingLabel] = useState<string>(
    initialSample.servingLabel || "100g per day",
  );
  const [bioGaugeIndex, setBioGaugeIndex] = useState(initialSample.bioGaugeIndex);
  const [vectorBadges, setVectorBadges] = useState<NutritionVectorBadge[]>(
    initialSample.vectorBadges,
  );
  const [mealType, setMealType] = useState(initialSample.mealType || "Almuerzo");
  const [servings, setServings] = useState(initialSample.servings);
  const [healthScore, setHealthScore] = useState(initialSample.healthScore);
  const [, setCalloutPins] = useState<MealCalloutPin[]>(initialSample.calloutPins);
  const [ingredients, setIngredients] = useState<MealIngredientItem[]>(initialSample.ingredients);

  // Fix screen states
  const [aiPromptText, setAiPromptText] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAddFoodOpen, setIsAddFoodOpen] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const [selectedAddFood, setSelectedAddFood] = useState(COMMON_FOODS_DATABASE[0]);
  const [addGrams, setAddGrams] = useState(100);
  const [nextMealFocus, setNextMealFocus] = useState<string | null>(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("twf_next_meal_focus") : null;
    } catch (_) {
      return null;
    }
  });

  const handleSelectSample = (idx: number) => {
    setSelectedSampleIndex(idx);
    const s = CAL_AI_SAMPLE_MEALS[idx];
    if (s.category) {
      setSelectedCategory(s.category);
    }
    setCustomImage(s.img);
    setTitle(s.title);
    setReportTitle(s.reportTitle);
    setMealTime(s.time || "12:46 PM");
    setNarrative(s.narrative);
    setBioScore(s.bioScore);
    setBioGrade(s.bioGrade);
    setBioQualityLabel(s.bioQualityLabel);
    setHighlightNutrient(s.highlightNutrient || s.bioQualityLabel || "Source of Vitamin C");
    setHighlightAmount(s.highlightAmount || "25mg");
    setServingLabel(s.servingLabel || (s.servings === 1 ? "100g per day" : `${s.servings} porciones`));
    setBioGaugeIndex(s.bioGaugeIndex);
    setVectorBadges(s.vectorBadges);
    setMealType(s.mealType);
    setServings(s.servings);
    setHealthScore(s.healthScore);
    setCalloutPins(s.calloutPins);
    setIngredients(s.ingredients);
    setShowOptions(false);
    toast.success(`Plato seleccionado: ${s.title}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const uploadedImg = reader.result as string;
        setCustomImage(uploadedImg);
        toast.success("Foto cargada con éxito");
        setIsScanningLaser(true);
        setTimeout(() => {
          setIsScanningLaser(false);
          camera.stopStream();
          setCurrentScreen("nutrition");
        }, 450);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCaptureScan = () => {
    setIsScanningLaser(true);
    if (!customImage) {
      const snapshot = camera.captureSnapshot();
      if (snapshot) {
        setCustomImage(snapshot);
      }
    }

    setTimeout(() => {
      setIsScanningLaser(false);
      camera.stopStream();
      setCurrentScreen("nutrition");
    }, 450);
  };

  // Base Nutrient Calculations
  const baseCalories = useMemo(
    () => ingredients.reduce((acc, i) => acc + i.calories, 0),
    [ingredients],
  );
  const baseProtein = useMemo(
    () => ingredients.reduce((acc, i) => acc + i.protein, 0),
    [ingredients],
  );
  const baseCarbs = useMemo(() => ingredients.reduce((acc, i) => acc + i.carbs, 0), [ingredients]);
  const baseFat = useMemo(() => ingredients.reduce((acc, i) => acc + i.fat, 0), [ingredients]);
  const baseFiber = useMemo(() => ingredients.reduce((acc, i) => acc + i.fiber, 0), [ingredients]);

  const totalCalories = Math.round(baseCalories * servings);
  const totalProtein = Math.round(baseProtein * servings);
  const totalCarbs = Math.round(baseCarbs * servings);
  const totalFat = Math.round(baseFat * servings);
  const totalFiber = Math.round(baseFiber * servings * 10) / 10;

  const handleUpdateGrams = (id: string, delta: number) => {
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newGrams = Math.max(5, item.grams + delta);
        const factor = newGrams / 100;
        return {
          ...item,
          grams: newGrams,
          calories: Math.round(item.calPer100g * factor),
          protein: Math.round(item.pPer100g * factor * 10) / 10,
          carbs: Math.round(item.cPer100g * factor * 10) / 10,
          fat: Math.round(item.fPer100g * factor * 10) / 10,
          fiber: Math.round(item.fiberPer100g * factor * 10) / 10,
        };
      }),
    );
  };

  const handleSetExactGrams = (id: string, exactDisplayGrams: number) => {
    const baseGrams = Math.max(5, Math.round(exactDisplayGrams / (servings || 1)));
    setIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const factor = baseGrams / 100;
        return {
          ...item,
          grams: baseGrams,
          calories: Math.round(item.calPer100g * factor),
          protein: Math.round(item.pPer100g * factor * 10) / 10,
          carbs: Math.round(item.cPer100g * factor * 10) / 10,
          fat: Math.round(item.fPer100g * factor * 10) / 10,
          fiber: Math.round(item.fiberPer100g * factor * 10) / 10,
        };
      }),
    );
  };

  const handleRenameIngredient = (id: string, newName: string) => {
    setIngredients((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item)),
    );
  };

  const handleDeleteIngredient = (id: string) => {
    const idx = ingredients.findIndex((i) => i.id === id);
    if (idx === -1) return;
    const removedItem = ingredients[idx];
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch (_) {}
    }
    setIngredients((prev) => prev.filter((i) => i.id !== id));
    toast.info(`"${removedItem.name}" eliminado del plato`, {
      duration: 5000,
      action: {
        label: "Deshacer",
        onClick: () => {
          setIngredients((prev) => {
            const next = [...prev];
            next.splice(idx, 0, removedItem);
            return next;
          });
        },
      },
    });
  };

  const filteredFoods = COMMON_FOODS_DATABASE.filter((f) =>
    f.name.toLowerCase().includes(foodSearchQuery.toLowerCase()),
  );

  const handleAddIngredientSubmit = () => {
    const factor = addGrams / 100;
    const isCustomQuery =
      foodSearchQuery.trim().length > 0 &&
      filteredFoods.length === 0;
    const sourceFood = isCustomQuery
      ? {
          name: foodSearchQuery.trim(),
          category: "carbs" as const,
          calPer100g: 140,
          pPer100g: 8,
          cPer100g: 16,
          fPer100g: 4.5,
          fiberPer100g: 2,
        }
      : selectedAddFood;

    const newItem: MealIngredientItem = {
      id: `food-${Date.now()}`,
      name: sourceFood.name,
      category: sourceFood.category,
      grams: addGrams,
      calories: Math.round(sourceFood.calPer100g * factor),
      protein: Math.round(sourceFood.pPer100g * factor * 10) / 10,
      carbs: Math.round(sourceFood.cPer100g * factor * 10) / 10,
      fat: Math.round(sourceFood.fPer100g * factor * 10) / 10,
      fiber: Math.round(sourceFood.fiberPer100g * factor * 10) / 10,
      calPer100g: sourceFood.calPer100g,
      pPer100g: sourceFood.pPer100g,
      cPer100g: sourceFood.cPer100g,
      fPer100g: sourceFood.fPer100g,
      fiberPer100g: sourceFood.fiberPer100g,
    };
    setIngredients((prev) => [...prev, newItem]);
    setFoodSearchQuery("");
    setIsAddFoodOpen(false);
    toast.success(`+ ${sourceFood.name} (${addGrams}g) agregado`);
  };

  const handleApplyAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPromptText.trim()) return;

    setIsAiThinking(true);
    setTimeout(() => {
      const action = parseAiPromptAction(aiPromptText);
      if (action.type === "remove") {
        setIngredients((prev) =>
          prev.filter((i) => !i.name.toLowerCase().includes(action.targetWord)),
        );
        toast.success(`✓ Se quitó "${action.targetWord}" del plato`);
      } else if (action.type === "double") {
        setServings((s) => s * 2);
        toast.success("✓ Porción duplicada");
      } else if (action.type === "half") {
        setServings((s) => Math.max(0.5, Math.round((s / 2) * 10) / 10));
        toast.success("✓ Ajustado a media porción");
      } else if (action.type === "add") {
        setIngredients((prev) => [...prev, action.item]);
        toast.success(`✓ IA ajustó el plato (+ ${action.item.name})`);
      }

      setIsAiThinking(false);
      setAiPromptText("");
    }, 450);
  };

  const handleSaveToDiary = useCallback(
    (overrides?: {
      customImg?: string;
      customTitle?: string;
      customReportTitle?: string;
      customIngredients?: MealIngredientItem[];
      customNarrative?: string;
    }) => {
      camera.stopStream();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;
      const timeStr = now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });

      let stored: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("shakerfy_user_timeline_items");
          if (raw) stored = JSON.parse(raw);
          if (!Array.isArray(stored)) stored = [];
        } catch {
          stored = [];
        }
      }

      const context = inferContextualMealType(stored);
      const resolvedMealType = context.mealType || mealType || "Almuerzo";

      const effectiveIngredients = overrides?.customIngredients || ingredients;
      const effectiveCalories =
        effectiveIngredients.reduce((acc, i) => acc + (i.calories || 0), 0) || totalCalories;
      const effectiveProtein =
        effectiveIngredients.reduce((acc, i) => acc + (i.protein || 0), 0) || totalProtein;
      const effectiveCarbs =
        effectiveIngredients.reduce((acc, i) => acc + (i.carbs || 0), 0) || totalCarbs;
      const effectiveFat =
        effectiveIngredients.reduce((acc, i) => acc + (i.fat || 0), 0) || totalFat;
      const effectiveFiber =
        Math.round(
          (effectiveIngredients.reduce((acc, i) => acc + (i.fiber || 0), 0) || totalFiber) * 10,
        ) / 10;
      const effectiveTitle =
        overrides?.customReportTitle || overrides?.customTitle || reportTitle || title;
      const effectiveImg = overrides?.customImg || activeImage;
      const effectiveNarrative = overrides?.customNarrative || narrative;

      const dynamicInsight = generateContextualAiInsight({
        baseNarrative: effectiveNarrative,
        isPreWorkout: context.isPreWorkout,
        isPostWorkout: context.isPostWorkout,
        isNightWindow: context.isNightWindow,
        bioScore: bioScore,
        eatingReason,
      });

      let resolvedTimingFit = null;
      try {
        resolvedTimingFit = calculateTimingFit(
          {
            time: timeStr,
            date: dateStr,
            bioScore,
            vectorBadges,
            title: effectiveTitle,
          },
          stored,
        );
      } catch (e) {
        console.warn("Timing fit calculation skipped:", e);
      }

      const newMealItem = {
        id: `meal-${Date.now()}`,
        createdAt: now.toISOString(),
        type: "meal",
        mealType: resolvedMealType,
        time: timeStr,
        date: dateStr,
        title: effectiveTitle,
        subtitle: `${resolvedMealType} • Reporte Nutricional`,
        img: effectiveImg,
        calories: effectiveCalories,
        kcal: effectiveCalories,
        protein: effectiveProtein,
        carbs: effectiveCarbs,
        fat: effectiveFat,
        fiber: effectiveFiber,
        sugar: Math.round(effectiveCarbs * 0.15),
        sodium: 240,
        healthScore: healthScore || 8,
        bioScore: bioScore || 82,
        bioGrade: bioGrade || "A-",
        scoreGrade: bioGrade || "A-",
        bioQualityLabel: bioQualityLabel || "Densidad Nutritiva Óptima",
        bioGaugeIndex: bioGaugeIndex || 3,
        ingredients: effectiveIngredients,
        desc: `${effectiveTitle} (${effectiveCalories} kcal, ${effectiveProtein}g P, ${effectiveCarbs}g C, ${effectiveFat}g G)`,
        summary: dynamicInsight,
        coachFeedback: dynamicInsight,
        tag: "Nutrición Consciente",
        vectorBadges: vectorBadges,
        timingFit: resolvedTimingFit,
        consumed: true,
      };

      if (typeof window !== "undefined") {
        const updated = [newMealItem, ...stored];
        localStorage.setItem("shakerfy_user_timeline_items", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("shakerfy:timeline-update"));
      }

      toast.success("✓ Comida guardada en tu diario", {
        description: `${effectiveTitle} • ${effectiveCalories} kcal`,
        action: {
          label: "Ver Diario",
          onClick: () => navigate({ to: "/app", search: { tab: "diario" } }),
        },
      });

      navigate({ to: "/app", search: { tab: "diario" } });
    },
    [
      camera,
      mealType,
      ingredients,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      totalFiber,
      reportTitle,
      title,
      activeImage,
      narrative,
      bioScore,
      vectorBadges,
      healthScore,
      bioGrade,
      bioQualityLabel,
      bioGaugeIndex,
      servings,
      eatingReason,
      navigate,
    ],
  );

  const handleAnalyzeFoodNotes = () => {
    const itemsToAnalyze: string[] = foodNotes.foodNoteItems
      .map((it) => it.trim())
      .filter((it) => it.length > 0);

    if (itemsToAnalyze.length === 0) {
      toast.error("Escribe al menos un alimento antes de analizar", {
        description: "Ej: '4 huevos', '2 tostadas', '1 manzana'",
      });
      return;
    }

    toast.success("Analizando alimentos escritos con IA...", {
      description: `${itemsToAnalyze.length} alimentos detectados en tus notas`,
    });

    const parsedIngredients = parseFoodNotesToIngredients(itemsToAnalyze);

    const primaryTitle =
      parsedIngredients.length > 0
        ? `Registro: ${parsedIngredients.slice(0, 2).map((p) => p.name.split(" ")[0]).join(" & ")}`
        : "Notas de Alimentos";

    setTitle(primaryTitle);
    setReportTitle("Registro Nutricional Markdown IA");
    setMealTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setMealType("Comida");
    setIngredients(parsedIngredients);
    setServings(1);
    setNarrative(
      `Análisis completo de tus notas de comida: ${itemsToAnalyze.length} alimentos registrados. Distribución balanceada de macronutrientes, micronutrientes y aporte de fibra natural sin ultraprocesados.`,
    );
    setBioScore(88);
    setBioGrade("A-");
    setBioQualityLabel("Comida Real & Densidad Nutritiva Óptima");
    setBioGaugeIndex(3);
    setHighlightNutrient("Vitamina C y Fibra Natural");
    setHighlightAmount("45mg");

    setVectorBadges([
      {
        id: "v-proc",
        category: "processing",
        badgeText: "Mínimamente procesado",
        description: "Alimentos enteros sin aditivos artificiales.",
      },
      {
        id: "v-fib",
        category: "fiber",
        badgeText: "Alta fibra",
        description: "Fibra soluble e insoluble de frutas y granos enteros.",
      },
      {
        id: "v-prot",
        category: "protein",
        badgeText: "Proteína magra",
        description: "Aporte proteico biológicamente completo.",
      },
      {
        id: "v-sug",
        category: "sugar",
        badgeText: "Sin azúcar añadido",
        description: "Carbohidratos de fuentes naturales intactas.",
      },
      {
        id: "v-fat",
        category: "fat",
        badgeText: "Grasas saludables",
        description: "Ácidos grasos esenciales monoinsaturados y omega.",
      },
      {
        id: "v-grain",
        category: "grains",
        badgeText: "Granos enteros",
        description: "Energía glucídica de liberación sostenida.",
      },
      {
        id: "v-sod",
        category: "sodium",
        badgeText: "Bajo en sodio",
        description: "Perfil cardiovascular óptimo.",
      },
    ]);

    setCalloutPins([
      { name: parsedIngredients[0]?.name || "Desayuno", calories: parsedIngredients[0]?.calories || 150, topPct: 35, leftPct: 25 },
      { name: parsedIngredients[1]?.name || "Complemento", calories: parsedIngredients[1]?.calories || 80, topPct: 45, rightPct: 25 },
    ]);

    setCustomImage("https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=800&auto=format&fit=crop&q=80");

    setIsScanningLaser(true);
    setTimeout(() => {
      setIsScanningLaser(false);
      camera.stopStream();
      setCurrentScreen("nutrition");
    }, 450);
  };

  const handleSaveEmptyFood = () => {
    const name = emptyFoodName.trim() || "Alimento Personalizado";
    const cal = Math.max(0, parseInt(emptyFoodCalories, 10) || 100);
    const p = Math.max(0, parseFloat(emptyFoodProtein) || 0);
    const c = Math.max(0, parseFloat(emptyFoodCarbs) || 0);
    const f = Math.max(0, parseFloat(emptyFoodFat) || 0);

    const newFood = {
      name,
      calories: cal,
      protein: p,
      carbs: c,
      fat: f,
      category: "carbs" as const,
    };

    const factor = (addGrams || 100) / 100;
    const newItem: MealIngredientItem = {
      id: `food-${Date.now()}`,
      name: newFood.name,
      category: p > 15 ? "protein" : c > 15 ? "carbs" : "fats",
      grams: addGrams || 100,
      calories: Math.round(cal * factor),
      protein: Math.round(p * factor * 10) / 10,
      carbs: Math.round(c * factor * 10) / 10,
      fat: Math.round(f * factor * 10) / 10,
      fiber: 0,
      calPer100g: cal,
      pPer100g: p,
      cPer100g: c,
      fPer100g: f,
      fiberPer100g: 0,
    };

    setIngredients((prev) => [...prev, newItem]);
    setShowLogEmptyFoodModal(false);
    setEmptyFoodName("");
    toast.success(`✓ ${name} agregado al plato`);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 w-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none transition-colors duration-300",
        scanMode === "food_label" || scanMode === "database"
          ? "bg-slate-50/70 dark:bg-background text-foreground"
          : "bg-slate-950 text-foreground",
      )}
    >
      {/* SCREEN 1: SCANNER FULL SCREEN */}
      {currentScreen === "scanner" && (
        <ScanViewfinder
          videoRef={camera.videoRef}
          customImage={customImage}
          activeImage={activeImage}
          cameraFacing={camera.cameraFacing}
          selectedCameraId={camera.selectedCameraId}
          flashlightOn={camera.flashlightOn}
          isScanningLaser={isScanningLaser}
          isCameraLoading={camera.isCameraLoading}
          cameraError={camera.cameraError}
          scanMode={scanMode}
          isCameraActive={camera.isCameraActive}
          availableCameras={camera.availableCameras}
          selectedSampleIndex={selectedSampleIndex}
          showOptions={showOptions}
          nextMealFocus={nextMealFocus}
          eatingReason={eatingReason}
          foodNoteItems={foodNotes.foodNoteItems}
          totalNotesItemsCount={foodNotes.totalNotesItemsCount}
          libraryInputRef={libraryInputRef}
          onNavigateBack={() => {
            if (scanMode === "food_label" || scanMode === "database") {
              setScanMode("scan_food");
            } else if (scanMode === "barcode") {
              setScanMode("database");
            } else {
              navigate({ to: "/app", search: { tab: "diario" } });
            }
          }}
          onSetScanMode={setScanMode}
          onToggleCameraFacing={camera.handleToggleCameraFacing}
          onOpenTutorial={() => setShowTutorial(true)}
          onToggleOptions={() => setShowOptions(!showOptions)}
          onSelectCamera={(id, label) => {
            setCustomImage(null);
            camera.setSelectedCameraId(id);
            camera.setActiveCameraLabel(label);
            setShowOptions(false);
            toast.success(`Cámara: ${label}`);
          }}
          onSelectSample={handleSelectSample}
          onActivateLiveCamera={() => {
            setCustomImage(null);
            setShowOptions(false);
          }}
          onResetNotes={foodNotes.handleResetNotes}
          onClearNotes={foodNotes.handleClearNotes}
          onNoteItemChange={foodNotes.handleNoteItemChange}
          onNoteItemKeyDown={foodNotes.handleNoteItemKeyDown}
          onAddNoteItem={foodNotes.handleAddNoteItem}
          onRemoveNoteItem={foodNotes.handleRemoveNoteItem}
          onAnalyzeFoodNotes={handleAnalyzeFoodNotes}
          onSetEatingReason={(reason) => {
            setEatingReason(reason);
            if ("vibrate" in navigator) navigator.vibrate(15);
          }}
          onDismissNextMealFocus={() => {
            setNextMealFocus(null);
            try {
              localStorage.removeItem("twf_next_meal_focus");
            } catch (_) {}
          }}
          onFileUpload={handleFileUpload}
          onTriggerCapture={triggerCaptureScan}
          onRetryCamera={camera.startCamera}
        />
      )}

      {/* SCREEN 2: BIO-REPORTE NUTRICIONAL DE LA IA */}
      {currentScreen === "nutrition" && (
        <ScanNutritionReport
          activeImage={activeImage}
          reportTitle={reportTitle}
          title={title}
          mealTime={mealTime}
          narrative={narrative}
          bioScore={bioScore}
          vectorBadges={vectorBadges}
          totalProtein={totalProtein}
          totalFiber={totalFiber}
          totalFat={totalFat}
          totalCarbs={totalCarbs}
          ingredients={ingredients}
          servings={servings}
          selectedSampleIndex={selectedSampleIndex}
          customImage={customImage}
          showOptions={showOptions}
          onBackToScanner={() => setCurrentScreen("scanner")}
          onToggleOptions={() => setShowOptions(!showOptions)}
          onSelectSample={handleSelectSample}
          onNavigateToFix={() => setCurrentScreen("fix")}
          onSaveToDiary={() => handleSaveToDiary()}
        />
      )}

      {/* SCREEN 3: FIX RESULTS & EDIT INGREDIENTS SUB-SCREEN */}
      {currentScreen === "fix" && (
        <ScanFixScreen
          reportTitle={reportTitle}
          title={title}
          servings={servings}
          aiPromptText={aiPromptText}
          isAiThinking={isAiThinking}
          ingredients={ingredients}
          onBackToNutrition={() => setCurrentScreen("nutrition")}
          onTitleChange={(val) => {
            setReportTitle(val);
            setTitle(val);
          }}
          onServingsChange={setServings}
          onAiPromptChange={setAiPromptText}
          onApplyAiPrompt={handleApplyAiPrompt}
          onOpenAddIngredient={() => setIsAddFoodOpen(true)}
          onRenameIngredient={handleRenameIngredient}
          onUpdateGrams={handleUpdateGrams}
          onSetExactGrams={handleSetExactGrams}
          onDeleteIngredient={handleDeleteIngredient}
          onSaveToDiary={() => handleSaveToDiary()}
        />
      )}

      {/* Add Food Dialog Modal */}
      <AddIngredientModal
        open={isAddFoodOpen}
        onOpenChange={setIsAddFoodOpen}
        foodSearchQuery={foodSearchQuery}
        onFoodSearchChange={setFoodSearchQuery}
        filteredFoods={filteredFoods}
        selectedAddFood={selectedAddFood}
        onSelectFood={setSelectedAddFood}
        addGrams={addGrams}
        onAddGramsChange={setAddGrams}
        onSubmit={handleAddIngredientSubmit}
      />

      {/* Log Empty Food Dialog Modal */}
      <LogEmptyFoodModal
        open={showLogEmptyFoodModal}
        onOpenChange={setShowLogEmptyFoodModal}
        emptyFoodName={emptyFoodName}
        onEmptyFoodNameChange={setEmptyFoodName}
        emptyFoodCalories={emptyFoodCalories}
        onEmptyFoodCaloriesChange={setEmptyFoodCalories}
        emptyFoodServing={emptyFoodServing}
        onEmptyFoodServingChange={setEmptyFoodServing}
        emptyFoodProtein={emptyFoodProtein}
        onEmptyFoodProteinChange={setEmptyFoodProtein}
        emptyFoodCarbs={emptyFoodCarbs}
        onEmptyFoodCarbsChange={setEmptyFoodCarbs}
        emptyFoodFat={emptyFoodFat}
        onEmptyFoodFatChange={setEmptyFoodFat}
        onSave={handleSaveEmptyFood}
      />

      {/* Food Scanner Precision Guide / Tutorial Modal */}
      <FoodScannerTutorialDialog
        open={showTutorial}
        onOpenChange={setShowTutorial}
      />
    </div>
  );
}
