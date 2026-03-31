import recyclingModel from "../public/ecoscan_recycling_model.json";

const MATERIAL_KEYS = [
  "PET",
  "HDPE",
  "PVC",
  "LDPE",
  "PP",
  "PS",
  "Mixed_Plastic",
  "Multi_Layer",
  "Glass",
  "Aluminum",
  "Steel",
  "Paper",
  "Cardboard",
  "Tetra_Pak",
  "Fabric",
  "Wood",
  "Ceramic",
  "Rubber",
  "E_Waste",
  "Organic",
];

/** Normalize unicode dashes in model strings for UI consistency */
export function dashifyModelText(s) {
  return String(s).replace(/\u2014/g, "-").replace(/\u2013/g, "-");
}

function norm(s) {
  return String(s ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Map GPT `material_type` string (if present) to model material key.
 */
function mapFromGptMaterialTypeField(materialTypeField) {
  const t = norm(materialTypeField);
  if (!t) return null;
  const pairs = [
    ["polyethylene terephthalate", "PET"],
    ["pet plastic", "PET"],
    ["pet ", "PET"],
    [" pet", "PET"],
    ["high-density polyethylene", "HDPE"],
    ["hdpe", "HDPE"],
    ["polyvinyl chloride", "PVC"],
    ["pvc", "PVC"],
    ["low-density polyethylene", "LDPE"],
    ["ldpe", "LDPE"],
    ["polypropylene", "PP"],
    ["pp plastic", "PP"],
    ["polystyrene", "PS"],
    ["styrofoam", "PS"],
    ["thermocol", "PS"],
    ["mixed plastic", "Mixed_Plastic"],
    ["multi-layer", "Multi_Layer"],
    ["multilayer", "Multi_Layer"],
    ["laminated", "Multi_Layer"],
    ["glass", "Glass"],
    ["aluminum", "Aluminum"],
    ["aluminium", "Aluminum"],
    ["steel", "Steel"],
    ["tin", "Steel"],
    ["paper", "Paper"],
    ["cardboard", "Cardboard"],
    ["tetra pak", "Tetra_Pak"],
    ["aseptic", "Tetra_Pak"],
    ["fabric", "Fabric"],
    ["textile", "Fabric"],
    ["wood", "Wood"],
    ["ceramic", "Ceramic"],
    ["porcelain", "Ceramic"],
    ["rubber", "Rubber"],
    ["e-waste", "E_Waste"],
    ["electronic", "E_Waste"],
    ["organic", "Organic"],
    ["food-soiled", "Organic"],
    ["compost", "Organic"],
  ];
  for (const [needle, key] of pairs) {
    if (t.includes(needle)) return key;
  }
  if (t === "pet") return "PET";
  return null;
}

/**
 * Keyword map from item_name + other GPT text (longest / most specific first).
 */
function mapFromItemNameAndBlob(blob) {
  const b = norm(blob);
  if (!b) return null;

  const rules = [
    [/iphone|smartphone|old phone|cell phone|mobile phone|e-waste|e waste|laptop|charger|circuit board|battery\b|earphone|headphone|tablet|power bank|keyboard|computer mouse|electronics waste/, "E_Waste"],
    [/banana peel|vegetable scrap|apple core|egg shell|eggshell|leftover food|food scrap|tea leaves|meat bone|coconut husk|organic waste|compostable|kitchen scrap|flower waste|peel\b/, "Organic"],
    [/tetra pak|aseptic carton|juice carton|milk carton(?!\s*pvc)/, "Tetra_Pak"],
    [/chip packet|crisp packet|lays\b|snack wrapper|biscuit wrapper|candy wrapper|instant noodle pack|coffee sachet|laminated pouch|multi-layer|multilayer|blister pack|shrink wrap snack/, "Multi_Layer"],
    [/styrofoam|thermocol|polystyrene foam|foam cup|foam plate|packing peanuts/, "PS"],
    [/polyethylene terephthalate|\bpet\b|pet bottle|plastic water bottle|soda bottle(?!\s*glass)/, "PET"],
    [/hdpe|\b#2\b|detergent bottle|milk jug|shampoo bottle/, "HDPE"],
    [/\bpvc\b|\b#3\b|vinyl sheet|vinyl pipe/, "PVC"],
    [/ldpe|plastic bag|cling wrap|bread bag|\b#4\b|poly bag|carrier bag/, "LDPE"],
    [/polypropylene|\b#5\b|yogurt cup|microwaveable plastic/, "PP"],
    [/glass bottle|glass jar|pickle jar|wine bottle|beer bottle(?!\s*plastic)/, "Glass"],
    [/aluminum|aluminium|soda can|beer can|foil tray|aluminum foil|pie tin/, "Aluminum"],
    [/\bsteel\b|tin can|food can|steel container/, "Steel"],
    [/cardboard|shipping box|amazon box|cereal box|corrugated/, "Cardboard"],
    [/newspaper|magazine|envelope|office paper|notebook|printer paper/, "Paper"],
    [/t-shirt|tshirt|jeans|fabric scrap|textile|bedsheet|towel|sock|glove fabric/, "Fabric"],
    [/wooden|wood crate|chopstick|wood waste/, "Wood"],
    [/ceramic|porcelain|broken mug|broken plate|tile piece/, "Ceramic"],
    [/rubber band|tire piece|shoe sole|rubber waste/, "Rubber"],
  ];

  for (const [re, mat] of rules) {
    if (re.test(b)) return mat;
  }
  return null;
}

/**
 * Infer prediction bucket: clean_single | clean_mixed | dirty_single | dirty_mixed | average
 */
export function inferConditionKey(blob) {
  const t = norm(blob);
  if (!t) return "average";

  const dirty =
    /\b(dirty|contaminated|soiled|greasy|stained|food-soiled|oily|residue|leftover|partially eaten|pizza box|wet wipe)\b/i.test(
      t
    ) && !/\b(clean|rinsed|empty|unused|unopened|dry and clean)\b/i.test(t);
  const mixed =
    /\b(mixed material|multi-?layer|laminated|composite|blend|several types|unknown plastic|unidentified)\b/i.test(
      t
    );

  if (dirty && mixed) return "dirty_mixed";
  if (dirty) return "dirty_single";
  if (mixed) return "clean_mixed";
  if (/\b(clean|rinsed|empty|unused|unopened)\b/i.test(t)) return "clean_single";
  return "average";
}

function getInsights(material) {
  const mi = recyclingModel.material_insights?.[material];
  if (mi) return mi;
  return recyclingModel.material_insights?.Mixed_Plastic ?? {
    reasons: ["Material could not be matched precisely to the model."],
    tips: ["Segregate waste at source and follow local BMC guidelines."],
  };
}

function getPredictionPercent(material, conditionKey) {
  const preds = recyclingModel.predictions?.[material];
  if (!preds) return null;
  const v = preds[conditionKey] ?? preds.average;
  if (typeof v !== "number" || Number.isNaN(v)) return null;
  return Math.round(Math.min(100, Math.max(0, v)) * 10) / 10;
}

/**
 * @param {object} result - GPT classification JSON
 * @returns {object | null} null if not waste
 */
export function getRealityCheckFromGptResult(result) {
  if (!result || result.is_waste === false) return null;

  const itemName = String(result.item_name ?? "");
  const classification = String(result.classification ?? "").toLowerCase();
  const materialTypeGpt = String(result.material_type ?? "");
  const recyclabilityReason = String(result.recyclability_reason ?? "");
  const sortingExplanation = String(result.sorting_explanation ?? "");
  const disposalGuidance = String(result.disposal_guidance ?? "");
  const blob = [itemName, materialTypeGpt, recyclabilityReason, sortingExplanation, disposalGuidance].join(
    " "
  );

  let material =
    mapFromGptMaterialTypeField(materialTypeGpt) ||
    mapFromItemNameAndBlob(blob) ||
    mapFromItemNameAndBlob(itemName);

  if (!material) {
    material = classification === "wet" ? "Organic" : "Mixed_Plastic";
  }

  const conditionKey = inferConditionKey(blob);
  const modelInfo = recyclingModel.model_info ?? {};
  const organicInsights = recyclingModel.material_insights?.Organic;
  const compostingRate = Number(organicInsights?.composting_rate) || 65;

  /** Composting only for organic stream (mapped Organic, or wet default above). */
  const useComposting = material === "Organic";

  const mode = useComposting ? "composting" : "recycling";
  let percent;
  if (useComposting) {
    percent = compostingRate;
  } else {
    percent = getPredictionPercent(material, conditionKey);
    if (percent == null) percent = getPredictionPercent(material, "average") ?? 0;
  }

  const insights = useComposting ? getInsights("Organic") : getInsights(material);

  const reasons = Array.isArray(insights.reasons)
    ? insights.reasons.slice(0, 3).map(dashifyModelText)
    : [];
  const tips = Array.isArray(insights.tips)
    ? insights.tips.slice(0, 5).map(dashifyModelText)
    : [];

  return {
    mode,
    percent: Math.round(percent * 10) / 10,
    material,
    conditionKey,
    reasons,
    tips,
    modelName: modelInfo.name || "Random Forest",
    r2Score: modelInfo.r2_score ?? 0.9559,
    trainingSamples: (modelInfo.training_samples || 0) + (modelInfo.test_samples || 0) || 2400,
    dataSources: Array.isArray(modelInfo.data_sources) ? modelInfo.data_sources : [],
    isNearZero: percent <= 3,
  };
}

export { recyclingModel, MATERIAL_KEYS };
