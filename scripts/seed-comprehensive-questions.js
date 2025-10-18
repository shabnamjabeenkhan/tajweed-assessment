#!/usr/bin/env node

// Script to seed comprehensive Tajweed questions into Convex database
// Run with: node scripts/seed-comprehensive-questions.js

import { ConvexHttpClient } from "convex/browser";

// Get deployment URL from environment
const deploymentUrl = process.env.VITE_CONVEX_URL;
if (!deploymentUrl) {
  console.error("❌ VITE_CONVEX_URL environment variable not set");
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

// Rule slug mappings - we need to find the correct rule IDs
const ruleMapping = {
  "ith-har": "Al-Ith'har", // We need to create this rule or find existing
  "idghaam": "Al-Idghaam", // May exist as "idgham"
  "iqlaab": "Al-Iqlaab", // Need to create
  "ikhfaa": "Al-Ikhfaa" // May exist as "ikhfa"
};

// All our comprehensive questions organized by rule
const allQuestions = {
  // AL-ITH'HAR QUESTIONS (12 questions)
  "ith-har": [
    {
      prompt: "What is the literal meaning of Al-Ith'har (الإِظْهَار)?",
      options: ["To hide something", "To make something clear", "To merge sounds", "To bounce the sound"],
      correctOptionIndex: 1,
      explanation: "Al-Ith'har literally means 'to make something clear'. This reflects how noon sakinah and tanween are pronounced clearly when followed by throat letters."
    },
    {
      prompt: "How many letters cause Al-Ith'har when they follow noon sakinah or tanween?",
      options: ["4 letters", "5 letters", "6 letters", "7 letters"],
      correctOptionIndex: 2,
      explanation: "There are 6 Al-Ith'har letters: ء، ه، ع، ح، غ، خ. These are also known as the throat letters (Huroof Halqiyah)."
    },
    {
      prompt: "Al-Ith'har letters are also known by what other name?",
      options: ["Qalqalah letters", "Huroof Halqiyah", "Madd letters", "Ghunna letters"],
      correctOptionIndex: 1,
      explanation: "Al-Ith'har letters are also called 'Huroof Halqiyah' (throat letters) because they are all pronounced from the throat area."
    },
    {
      prompt: "Which of these is NOT an Al-Ith'har letter?",
      options: ["ء (Hamza)", "ن (Noon)", "ع (Ain)", "ح (Ha)"],
      correctOptionIndex: 1,
      explanation: "ن (Noon) is not an Al-Ith'har letter. The 6 Al-Ith'har letters are: ء، ه، ع، ح، غ، خ"
    },
    {
      prompt: "Which letter causes Al-Ith'har: غ، ب، ت، م?",
      options: ["ب", "ت", "م", "غ"],
      correctOptionIndex: 3,
      explanation: "غ (Ghain) is one of the 6 Al-Ith'har letters. The others (ب، ت، م) cause different rules like Idghaam or Iqlaab."
    },
    {
      prompt: "When noon sakinah is followed by خ (Kha), what rule applies?",
      options: ["Al-Idghaam", "Al-Iqlaab", "Al-Ith'har", "Al-Ikhfaa"],
      correctOptionIndex: 2,
      explanation: "خ (Kha) is one of the 6 Al-Ith'har letters, so Al-Ith'har applies. The noon sakinah is pronounced clearly."
    },
    {
      prompt: "Complete the Al-Ith'har letters: ء، ه، ع، ح، غ، ___",
      options: ["ب", "خ", "ن", "م"],
      correctOptionIndex: 1,
      explanation: "The complete list of Al-Ith'har letters is: ء، ه، ع، ح، غ، خ. These six letters are all throat letters."
    },
    {
      prompt: "Which of these letters would cause Al-Ith'har if it followed tanween?",
      options: ["ي", "ر", "ه", "ل"],
      correctOptionIndex: 2,
      explanation: "ه (Ha) is one of the Al-Ith'har letters. When it follows tanween, Al-Ith'har is applied and the tanween is pronounced clearly."
    },
    {
      prompt: "In the rule of Al-Ith'har, how should noon sakinah be pronounced?",
      options: ["Hidden completely", "Merged with the next letter", "Clearly with no merging", "With a nasal sound"],
      correctOptionIndex: 2,
      explanation: "In Al-Ith'har, noon sakinah (or tanween) is pronounced clearly with no merging or additional sounds when followed by any of the 6 throat letters."
    },
    {
      prompt: "What happens to tanween when it's followed by an Al-Ith'har letter?",
      options: ["It becomes silent", "It merges completely", "It's pronounced clearly", "It becomes muffled"],
      correctOptionIndex: 2,
      explanation: "When tanween is followed by any Al-Ith'har letter (ء، ه، ع، ح، غ، خ), it is pronounced clearly without any merging or hiding."
    },
    {
      prompt: "Al-Ith'har is one of how many main rules for noon sakinah and tanween?",
      options: ["3 rules", "4 rules", "5 rules", "6 rules"],
      correctOptionIndex: 1,
      explanation: "There are 4 main rules for noon sakinah and tanween: 1) Al-Ith'har, 2) Al-Idghaam, 3) Al-Iqlaab, and 4) Al-Ikhfaa."
    },
    {
      prompt: "Why are Al-Ith'har letters called 'throat letters'?",
      options: ["They sound harsh", "They are pronounced from the throat", "They are silent letters", "They cause echoing"],
      correctOptionIndex: 1,
      explanation: "Al-Ith'har letters (ء، ه، ع، ح، غ، خ) are called throat letters (Huroof Halqiyah) because they are all articulated from the throat area."
    }
  ],

  // AL-IDGHAAM QUESTIONS (14 questions)
  "idghaam": [
    {
      prompt: "What is the literal meaning of Al-Idghaam (الإِدْغَام)?",
      options: ["To make clear", "To hide", "To merge something into something else", "To bounce"],
      correctOptionIndex: 2,
      explanation: "Al-Idghaam literally means 'to merge something into something else'. This describes how noon sakinah or tanween merges into the following letter."
    },
    {
      prompt: "How many types of Al-Idghaam are there?",
      options: ["1 type", "2 types", "3 types", "4 types"],
      correctOptionIndex: 1,
      explanation: "There are 2 types of Al-Idghaam: 1) Idghaam with Ghunna (4 letters), and 2) Idghaam without Ghunna (2 letters)."
    },
    {
      prompt: "The letters of Al-Idghaam are collected in which word?",
      options: ["يَنْمُو", "يَرْمَلُون", "صِنْوَان", "قِنْوَان"],
      correctOptionIndex: 1,
      explanation: "All 6 Al-Idghaam letters (ي، ر، م، ل، و، ن) are collected in the word يَرْمَلُون for easy memorization."
    },
    {
      prompt: "How many Al-Idghaam letters are there in total?",
      options: ["4 letters", "5 letters", "6 letters", "7 letters"],
      correctOptionIndex: 2,
      explanation: "There are 6 Al-Idghaam letters total: ي، ر، م، ل، و، ن - 4 with Ghunna (ي، ن، م، و) and 2 without Ghunna (ل، ر)."
    },
    {
      prompt: "Which letters cause Idghaam WITH Ghunna?",
      options: ["ي، ر، م، ل", "ي، ن، م، و", "ل، ر، ن، م", "ء، ه، ع، ح"],
      correctOptionIndex: 1,
      explanation: "The 4 letters that cause Idghaam with Ghunna are: ي، ن، م، و. They are collected in the word يَنْمُو."
    },
    {
      prompt: "What is the duration of Ghunna?",
      options: ["1 Harakah", "2 Harakah", "3 Harakah", "4 Harakah"],
      correctOptionIndex: 1,
      explanation: "Ghunna has a duration of 2 Harakah. It is a light nasal sound produced from the nose during Idghaam with Ghunna."
    },
    {
      prompt: "The letters for Idghaam with Ghunna are collected in which word?",
      options: ["يَرْمَلُون", "يَنْمُو", "صِنْوَان", "بُنْيَان"],
      correctOptionIndex: 1,
      explanation: "The 4 letters that cause Idghaam with Ghunna (ي، ن، م، و) are collected in the word يَنْمُو."
    },
    {
      prompt: "When noon sakinah is followed by و (Waw), what type of Idghaam occurs?",
      options: ["Idghaam without Ghunna", "Idghaam with Ghunna", "Al-Ith'har", "Al-Ikhfaa"],
      correctOptionIndex: 1,
      explanation: "و (Waw) is one of the 4 letters that cause Idghaam with Ghunna. The noon sakinah merges with a nasal sound lasting 2 Harakah."
    },
    {
      prompt: "Which letters cause Idghaam WITHOUT Ghunna?",
      options: ["ي، و", "ن، م", "ل، ر", "ع، ح"],
      correctOptionIndex: 2,
      explanation: "The 2 letters that cause Idghaam without Ghunna are ل (Lam) and ر (Ra). No nasal sound is produced with these letters."
    },
    {
      prompt: "When tanween is followed by ر (Ra), what happens?",
      options: ["It's pronounced clearly", "It merges with Ghunna", "It merges without Ghunna", "It becomes silent"],
      correctOptionIndex: 2,
      explanation: "ر (Ra) causes Idghaam without Ghunna. The tanween merges into the Ra with no nasal sound, just emphasis on the Ra."
    },
    {
      prompt: "How many places in the Quran have Idghaam with Ghunna in one word?",
      options: ["2 places", "3 places", "4 places", "5 places"],
      correctOptionIndex: 2,
      explanation: "There are 4 places in the Quran where Idghaam with Ghunna occurs in one word: صِنْوَانٌ، قِنْوَانٌ، الدُّنْيَا، بُنْيَانٌ. These are read with Ith'har instead."
    },
    {
      prompt: "The word صِنْوَانٌ in the Quran is read with which rule?",
      options: ["Idghaam with Ghunna", "Idghaam without Ghunna", "Al-Ith'har", "Al-Ikhfaa"],
      correctOptionIndex: 2,
      explanation: "صِنْوَانٌ is one of 4 special cases where Idghaam with Ghunna occurs in one word, but it's read with Al-Ith'har instead."
    },
    {
      prompt: "What appears on the succeeding letter in Idghaam?",
      options: ["Sukoon", "Fatha", "Shaddah", "Kasra"],
      correctOptionIndex: 2,
      explanation: "In Idghaam, a Shaddah appears on the succeeding letter because the noon sakinah/tanween merges into it, creating emphasis."
    },
    {
      prompt: "Al-Idghaam will only appear in how many words?",
      options: ["One word", "Two words", "Three words", "Any number of words"],
      correctOptionIndex: 1,
      explanation: "Al-Idghaam only appears in two separate words - the noon sakinah/tanween at the end of one word merges with the Idghaam letter at the beginning of the next word."
    }
  ],

  // AL-IQLAAB QUESTIONS (12 questions)
  "iqlaab": [
    {
      prompt: "What is the literal meaning of Al-Iqlaab (الإِقْلاَب)?",
      options: ["To merge", "To hide", "To change something into something else", "To make clear"],
      correctOptionIndex: 2,
      explanation: "Al-Iqlaab literally means 'to change something into something else', which describes how noon sakinah or tanween changes into meem when followed by ba."
    },
    {
      prompt: "How many letters cause Al-Iqlaab?",
      options: ["1 letter", "2 letters", "4 letters", "6 letters"],
      correctOptionIndex: 0,
      explanation: "Only 1 letter causes Al-Iqlaab: ب (Ba). This makes Al-Iqlaab the simplest rule to remember among the four rules of noon sakinah and tanween."
    },
    {
      prompt: "Which letter causes Al-Iqlaab when it follows noon sakinah or tanween?",
      options: ["م (Meem)", "ب (Ba)", "ن (Noon)", "ل (Lam)"],
      correctOptionIndex: 1,
      explanation: "ب (Ba) is the only letter that causes Al-Iqlaab. When it follows noon sakinah or tanween, they change into meem."
    },
    {
      prompt: "In Al-Iqlaab, noon sakinah or tanween is substituted with which letter?",
      options: ["ن (Noon)", "ب (Ba)", "م (Meem)", "و (Waw)"],
      correctOptionIndex: 2,
      explanation: "In Al-Iqlaab, noon sakinah or tanween is substituted with م (Meem). So it sounds like 'meem + ba' instead of 'noon + ba'."
    },
    {
      prompt: "How is Al-Iqlaab recited in terms of sound quality?",
      options: ["Like clear Ith'har", "Like complete Idghaam", "Between Idghaam and Ikhfaa", "With strong Ghunna"],
      correctOptionIndex: 2,
      explanation: "Al-Iqlaab is recited with a sound between Idghaam and Ikhfaa - not completely merged like Idghaam, but not completely hidden like Ikhfaa."
    },
    {
      prompt: "When applying Al-Iqlaab, what happens to the original noon sakinah sound?",
      options: ["It remains as noon", "It becomes completely silent", "It changes to meem sound", "It becomes elongated"],
      correctOptionIndex: 2,
      explanation: "The original noon sakinah sound changes completely to a meem sound. You pronounce 'meem + ba' instead of 'noon + ba'."
    },
    {
      prompt: "The sound quality of Al-Iqlaab is most similar to which other rule?",
      options: ["Al-Ith'har only", "Al-Idghaam only", "A combination of Idghaam and Ikhfaa", "Pure Ghunna"],
      correctOptionIndex: 2,
      explanation: "Al-Iqlaab has a unique sound quality that combines elements of both Idghaam (merging) and Ikhfaa (concealment), making it distinct from other rules."
    },
    {
      prompt: "What is the relationship between meem and ba that makes Al-Iqlaab natural?",
      options: ["They are throat letters", "They are both lip letters", "They cause Ghunna", "They are Qalqalah letters"],
      correctOptionIndex: 1,
      explanation: "Both meem (م) and ba (ب) are lip letters (articulated from the lips), making the transition from noon to meem before ba more natural and smooth."
    },
    {
      prompt: "If you see noon sakinah followed by ب in the Quran, which rule applies?",
      options: ["Al-Ith'har", "Al-Idghaam", "Al-Iqlaab", "Al-Ikhfaa"],
      correctOptionIndex: 2,
      explanation: "When noon sakinah is followed by ب (Ba), Al-Iqlaab always applies. The noon changes to meem sound."
    },
    {
      prompt: "If you see tanween followed by ب at the beginning of the next word, what do you do?",
      options: ["Pronounce tanween clearly", "Merge tanween with ba", "Change tanween to meem sound", "Skip the tanween"],
      correctOptionIndex: 2,
      explanation: "When tanween is followed by ب, apply Al-Iqlaab by changing the tanween to meem sound, creating a meem + ba pronunciation."
    },
    {
      prompt: "Al-Iqlaab can occur with both noon sakinah and tanween in how many words?",
      options: ["Only in one word", "Only in two words", "In any number of words", "Never in the same word"],
      correctOptionIndex: 1,
      explanation: "Like other noon sakinah and tanween rules, Al-Iqlaab occurs when these sounds are at the end of one word and ب is at the beginning of the next word (two words)."
    },
    {
      prompt: "Among the four rules of noon sakinah and tanween, which is the easiest to identify?",
      options: ["Al-Ith'har (6 letters)", "Al-Idghaam (6 letters)", "Al-Iqlaab (1 letter)", "Al-Ikhfaa (15 letters)"],
      correctOptionIndex: 2,
      explanation: "Al-Iqlaab is the easiest to identify because it has only 1 triggering letter (ب), compared to Al-Ith'har (6), Al-Idghaam (6), and Al-Ikhfaa (15 letters)."
    }
  ],

  // AL-IKHFAA QUESTIONS (15 questions)
  "ikhfaa": [
    {
      prompt: "What is the literal meaning of Al-Ikhfaa (الإِخْفَاء)?",
      options: ["To merge", "To conceal something", "To change", "To make clear"],
      correctOptionIndex: 1,
      explanation: "Al-Ikhfaa literally means 'to conceal something', which describes how noon sakinah or tanween is concealed when followed by any of the 15 Ikhfaa letters."
    },
    {
      prompt: "How many letters cause Al-Ikhfaa?",
      options: ["6 letters", "10 letters", "15 letters", "20 letters"],
      correctOptionIndex: 2,
      explanation: "There are 15 letters that cause Al-Ikhfaa: ت، ث، ج، د، ذ، ز، س، ش، ص، ض، ط، ظ، ف، ق، ك"
    },
    {
      prompt: "What is the duration of Ghunna in Al-Ikhfaa?",
      options: ["1 Harakah", "2 Harakah", "3 Harakah", "No Ghunna"],
      correctOptionIndex: 1,
      explanation: "In Al-Ikhfaa, the Ghunna lasts for 2 Harakah, the same duration as in Idghaam with Ghunna, but with a concealed sound quality."
    },
    {
      prompt: "The sound quality of Al-Ikhfaa is between which two rules?",
      options: ["Ith'har and Iqlaab", "Ith'har and Idghaam", "Idghaam and Iqlaab", "Iqlaab and Ghunna"],
      correctOptionIndex: 1,
      explanation: "Al-Ikhfaa has a sound quality between Al-Ith'har (clear) and Al-Idghaam (merged) - it's concealed but not completely merged."
    },
    {
      prompt: "Which of these letters causes Al-Ikhfaa?",
      options: ["ر", "ل", "ت", "ه"],
      correctOptionIndex: 2,
      explanation: "ت (Ta) is one of the 15 Al-Ikhfaa letters. ر and ل cause Idghaam, while ه causes Ith'har."
    },
    {
      prompt: "The first line of the memorization poem for Al-Ikhfaa letters starts with:",
      options: ["صِفْ ذَا ثَنَا", "يَرْمَلُون", "يَنْمُو", "همزة هاء"],
      correctOptionIndex: 0,
      explanation: "The memorization poem starts with 'صِفْ ذَا ثَنَا كَمْ جَادَ شَخْصٌ قَدْ سَمَا' - each word's first letter is an Ikhfaa letter."
    },
    {
      prompt: "Which letter from this group does NOT cause Al-Ikhfaa?",
      options: ["ص", "ض", "ب", "ط"],
      correctOptionIndex: 2,
      explanation: "ب (Ba) does not cause Al-Ikhfaa; it causes Al-Iqlaab. ص، ض، and ط are all Al-Ikhfaa letters."
    },
    {
      prompt: "When noon sakinah is followed by ف (Fa), which rule applies?",
      options: ["Al-Ith'har", "Al-Idghaam", "Al-Iqlaab", "Al-Ikhfaa"],
      correctOptionIndex: 3,
      explanation: "ف (Fa) is one of the 15 Al-Ikhfaa letters, so Al-Ikhfaa applies with concealed pronunciation and 2-count Ghunna."
    },
    {
      prompt: "If the Al-Ikhfaa letter is a full mouth letter, how does this affect the sound?",
      options: ["The sound becomes lighter", "The sound becomes thicker", "No change in sound", "The Ghunna disappears"],
      correctOptionIndex: 1,
      explanation: "When the Al-Ikhfaa letter is a full mouth letter (like ص، ض، ط، ظ), the concealed sound also becomes thicker and fuller."
    },
    {
      prompt: "If the Al-Ikhfaa letter is an empty mouth letter, what happens to the concealed sound?",
      options: ["It becomes thicker", "It becomes an empty mouth sound", "It becomes longer", "It becomes silent"],
      correctOptionIndex: 1,
      explanation: "When the Al-Ikhfaa letter is an empty mouth letter, the concealed sound quality also becomes lighter and more empty."
    },
    {
      prompt: "Which of these is a full mouth Al-Ikhfaa letter that affects sound quality?",
      options: ["ت", "ث", "ص", "س"],
      correctOptionIndex: 2,
      explanation: "ص (Sad) is a full mouth letter among the Al-Ikhfaa letters, so it makes the concealed sound thicker and fuller."
    },
    {
      prompt: "The concealment in Al-Ikhfaa includes which sound element?",
      options: ["No nasal sound", "2-count Ghunna", "4-count Ghunna", "Silent pause"],
      correctOptionIndex: 1,
      explanation: "Al-Ikhfaa includes a 2-count Ghunna (nasal sound) along with the concealment, making it distinct from pure concealment."
    },
    {
      prompt: "How many total letters are covered by all four rules of noon sakinah and tanween?",
      options: ["26 letters", "27 letters", "28 letters", "All Arabic letters"],
      correctOptionIndex: 2,
      explanation: "All 28 Arabic letters are covered: Al-Ith'har (6) + Al-Idghaam (6) + Al-Iqlaab (1) + Al-Ikhfaa (15) = 28 letters total."
    },
    {
      prompt: "Which rule has the most letters to memorize?",
      options: ["Al-Ith'har (6 letters)", "Al-Idghaam (6 letters)", "Al-Iqlaab (1 letter)", "Al-Ikhfaa (15 letters)"],
      correctOptionIndex: 3,
      explanation: "Al-Ikhfaa has the most letters (15) to memorize, making it the most complex rule in terms of letter recognition."
    },
    {
      prompt: "When tanween is followed by ق (Qaf), what is the correct pronunciation?",
      options: ["Clear pronunciation", "Complete merging", "Concealed with 2-count Ghunna", "Changed to meem"],
      correctOptionIndex: 2,
      explanation: "ق (Qaf) is an Al-Ikhfaa letter, so tanween is concealed with a 2-count Ghunna, creating a sound between clear and merged."
    }
  ]
};

async function main() {
  console.log("🚀 Starting comprehensive question seeding...");

  try {
    // Step 1: Get all active rules
    console.log("📋 Fetching existing rules...");
    const rules = await client.query("tajweedRules:getActiveRules");

    console.log(`Found ${rules.length} rules:`, rules.map(r => `${r.title} (${r.slug})`));

    // Step 2: Map our question sets to actual rule IDs
    const ruleMappings = {
      "ith-har": rules.find(r => r.slug === "ith-har")?._id || null,
      "idghaam": rules.find(r => r.slug === "idgham")?._id || null, // Note: "idgham" not "idghaam"
      "iqlaab": rules.find(r => r.slug === "iqlaab")?._id || null,
      "ikhfaa": rules.find(r => r.slug === "ikhfa")?._id || null // Note: "ikhfa" not "ikhfaa"
    };

    console.log("🔗 Rule mappings:", ruleMappings);

    // Step 3: Create missing rules first
    for (const [ruleSlug, ruleId] of Object.entries(ruleMappings)) {
      if (!ruleId) {
        console.log(`❌ Missing rule: ${ruleSlug} - need to create it first`);
        // We'll need to create these rules manually or map to existing ones
      }
    }

    // Step 4: Add questions for existing rules
    let totalAdded = 0;

    for (const [questionRuleKey, questions] of Object.entries(allQuestions)) {
      let ruleId = null;

      // Map our question keys to actual rule IDs
      if (questionRuleKey === "ith-har") {
        ruleId = rules.find(r => r.slug === "ith-har")?._id;
      } else if (questionRuleKey === "idghaam") {
        ruleId = rules.find(r => r.slug === "idgham")?._id;
      } else if (questionRuleKey === "iqlaab") {
        ruleId = rules.find(r => r.slug === "iqlaab")?._id;
      } else if (questionRuleKey === "ikhfaa") {
        ruleId = rules.find(r => r.slug === "ikhfa")?._id;
      }

      if (!ruleId) {
        console.log(`⏭️  Skipping ${questionRuleKey} - rule not found in database`);
        continue;
      }

      console.log(`📝 Adding ${questions.length} questions for ${questionRuleKey}...`);

      // Get existing questions to avoid duplicates
      const existingQuestions = await client.query("questions:getQuestionsByRule", { ruleId });
      console.log(`   Existing questions: ${existingQuestions.length}`);

      // Add each question
      let addedCount = 0;
      for (const question of questions) {
        // Check if question already exists (basic duplicate check on prompt)
        const isDuplicate = existingQuestions.some(eq => eq.prompt === question.prompt);

        if (!isDuplicate) {
          try {
            await client.mutation("questions:createQuestion", {
              ruleId,
              ...question
            });
            addedCount++;
          } catch (error) {
            console.error(`   ❌ Error adding question: ${error.message}`);
          }
        }
      }

      console.log(`   ✅ Added ${addedCount} new questions (${questions.length - addedCount} duplicates skipped)`);
      totalAdded += addedCount;
    }

    console.log(`\n🎉 Successfully added ${totalAdded} questions total!`);
    console.log("\n📊 Next steps:");
    console.log("1. Check the quiz interface - it should now have 10+ questions per rule");
    console.log("2. Create missing rules if needed (Al-Ith'har, Al-Iqlaab)");
    console.log("3. Test quiz functionality");

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run the script
main();