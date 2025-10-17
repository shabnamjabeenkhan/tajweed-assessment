import { mutation } from "../_generated/server";

export default mutation({
  handler: async (ctx) => {
    // Check if rules already exist to prevent duplicates
    const existingRules = await ctx.db.query("tajweedRules").collect();
    if (existingRules.length > 0) {
      console.log("Tajweed rules already exist. Skipping seed.");
      return;
    }

    const tajweedRules = [
      {
        slug: "idgham",
        title: "Idgham (إدغام)",
        description: "The merging of two similar letters or sounds, where the first letter loses its identity and merges into the second. There are two types: complete (كامل) and incomplete (ناقص).",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        slug: "ikhfa",
        title: "Ikhfa (إخفاء)",
        description: "The concealment or hiding of the noon sakinah or tanween when followed by specific letters. The sound is between clear pronunciation and complete merging.",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        slug: "qalqalah",
        title: "Qalqalah (قلقلة)",
        description: "The bouncing or echoing sound produced when pronouncing specific letters (ق ط ب ج د) when they have sukoon or are at the end of a word.",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        slug: "ghunna",
        title: "Ghunna (غنة)",
        description: "The nasal sound that occurs with the letters noon (ن) and meem (م) in specific situations, lasting approximately two counts.",
        isActive: true,
        createdAt: Date.now(),
      },
      {
        slug: "madd",
        title: "Madd (مد)",
        description: "The prolongation of vowel sounds in specific contexts. There are natural (طبيعي) and connected (متصل) types, each with different lengths.",
        isActive: true,
        createdAt: Date.now(),
      },
    ];

    // Insert all rules
    for (const rule of tajweedRules) {
      await ctx.db.insert("tajweedRules", rule);
    }

    console.log(`Successfully seeded ${tajweedRules.length} Tajweed rules`);
    return { success: true, count: tajweedRules.length };
  },
});