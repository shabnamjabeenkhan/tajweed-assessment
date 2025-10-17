#!/usr/bin/env bun

/**
 * Database Seeding Script
 *
 * This script runs the migration functions to seed the Tajweed quiz database
 * with rules and questions. Run this after setting up your Convex database.
 *
 * Usage:
 *   bun run scripts/seed-database.ts
 */

import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.VITE_CONVEX_URL;

if (!CONVEX_URL) {
  console.error("❌ VITE_CONVEX_URL environment variable is required");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Seed Tajweed rules first
    console.log("📝 Seeding Tajweed rules...");
    const rulesResult = await client.mutation("migrations/001_seed_tajweed_rules:default" as any);
    console.log("✅ Rules seeded:", rulesResult);

    // Seed questions after rules
    console.log("❓ Seeding questions...");
    const questionsResult = await client.mutation("migrations/002_seed_questions:default" as any);
    console.log("✅ Questions seeded:", questionsResult);

    console.log("🎉 Database seeding completed successfully!");
    console.log(`📊 Total rules: ${rulesResult?.count || 5}`);
    console.log(`📊 Total questions: ${questionsResult?.count || 55}`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();