# Content Seeding & Initial Data

**Priority:** Foundation (After Database)
**Estimated Time:** 1-2 days
**Dependencies:** Database Schema (Task 01)

## Overview
Create and seed the initial Tajweed rules and questions to enable MVP testing. Focus on 3-5 core Tajweed rules with 10+ quality questions each.

## Tasks

### 2.1 Research and Define Initial Tajweed Rules
- **Description:** Create seed data for 3-5 initial Tajweed rules
- **Acceptance Criteria:**
  - Research and define 5 core Tajweed rules: Idgham, Ikhfa, Qalqalah, Ghunna, Madd
  - Each rule has clear title, description, and slug
  - Rules are beginner-friendly and commonly taught
- **Deliverables:**
  - Rules definition document
  - Slug naming convention (e.g., `idgham`, `ikhfa-haqeeqi`)

### 2.2 Create Question Bank
- **Description:** Create 10+ multiple-choice questions per rule with explanations
- **Acceptance Criteria:**
  - Minimum 10 questions per rule (50+ total)
  - Each question has 4 multiple-choice options
  - Only one correct answer per question
  - Clear, educational explanations for correct answers
  - Questions test practical application, not just theory
- **Question Format:**
  ```json
  {
    "prompt": "Which letter requires Idgham when followed by noon sakinah?",
    "options": ["ب", "ت", "ن", "ك"],
    "correctOptionIndex": 2,
    "explanation": "The letter ن (noon) is one of the six letters that cause Idgham when preceded by noon sakinah or tanween."
  }
  ```

### 2.3 Write Migration Script
- **Description:** Write Convex migration script to populate initial rules and questions
- **Acceptance Criteria:**
  - Script safely populates `tajweedRules` table
  - Script safely populates `questions` table with proper foreign keys
  - Script is idempotent (can run multiple times safely)
  - Script includes rollback capability
- **Files to Create:**
  - `convex/migrations/001_seed_initial_content.ts`
  - `scripts/seed-content.json` (data file)

### 2.4 Add Question Validation
- **Description:** Add validation for question format (4 options, single correct answer)
- **Acceptance Criteria:**
  - Validates exactly 4 options per question
  - Validates correctOptionIndex is between 0-3
  - Validates all required fields are present
  - Validates explanation is not empty
  - Provides clear error messages for invalid data
- **Files to Create/Modify:**
  - `convex/questions.ts` (validation functions)
  - `convex/utils/validation.ts`

### 2.5 Create Content Management Functions
- **Description:** Create Convex functions for content creators to manage rules and questions
- **Acceptance Criteria:**
  - Function to add new rules (admin only)
  - Function to add new questions to existing rules
  - Function to deactivate/reactivate questions
  - Function to update question explanations
- **Files to Create:**
  - `convex/admin/contentManagement.ts`

## Sample Tajweed Rules to Include

### 1. Idgham (Merging)
- Focus on the 6 letters that cause merging with noon sakinah
- Questions about identifying when to apply Idgham

### 2. Ikhfa Haqeeqi (Concealment)
- 15 letters that cause concealment
- Questions about proper pronunciation technique

### 3. Qalqalah (Echoing)
- The 5 letters of Qalqalah: ق ط ب ج د
- Questions about when echoing is applied

### 4. Ghunna (Nasal Sound)
- Noon and meem mushaddad
- Questions about duration and application

### 5. Madd (Prolongation)
- Natural and obligatory prolongation
- Questions about count duration (2, 4, 6 beats)

## Definition of Done
- 5 Tajweed rules defined and seeded
- 50+ high-quality questions created and seeded
- Migration script successfully populates database
- Content validation is working
- Admin functions for content management are available
- All content is beginner-appropriate and educationally sound