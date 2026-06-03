# NeuroCode: AI Generation Pipeline

## 1. Overview
The NeuroCode AI Generation Pipeline ensures that all educational content—whether pre-generated or dynamically adapted in real-time—adheres strictly to our cognitive accessibility, emotional safety, and technical accuracy standards. This pipeline is the engine that maintains the "NeuroCode feel."

## 2. Generation Workflow

The process of generating a lesson involves a multi-step pipeline to guarantee consistency and safety:

### Step 1: Context Injection
Before generating content, the AI is injected with the global system context:
*   **`aicontext.md`**: Core neurodivergent pedagogical philosophy.
*   **`lesson_rules.md`**: Strict formatting and cognitive load limits.
*   **Learner Profile Context (Dynamic)**: User's special interests, current cognitive load capacity, and historical struggle areas.

### Step 2: Draft Generation
The AI generates the initial ARPERC (Anchor, Reveal, Practice, Evaluate, Reward, Consolidate) blocks based on the specific curriculum objective (e.g., from `curriculum_html.md`).

### Step 3: Self-Correction & Validation (The "Filter" Pass)
The AI (or a secondary validation agent) reviews the draft against strict heuristic checks:
*   *Does any paragraph exceed 3 sentences?*
*   *Is the tone emotionally safe? (No negative reinforcement)*
*   *Are the concepts isolated? (No teaching two things at once)*
*   *Is the JSON schema perfectly valid?*

### Step 4: Final Output
The system outputs the structured JSON lesson payload for the frontend to render via the NeuroCode React components.

## 3. Curriculum Context Preservation

To ensure the AI does not repeat itself or introduce concepts out of order:
*   **State Tracking:** The AI prompt must always include a `mastered_concepts` array and an `upcoming_concepts` array.
*   **Strict Bounds:** The AI is strictly forbidden from using tags or syntax that are not in the `mastered_concepts` array. If teaching `<img>`, it cannot wrap the image in a `<div>` unless `<div>` has been explicitly mastered.

## 4. Avoiding Repetition & Maintaining Engagement
*   **Dynamic Theming:** To prevent mechanical repetition, the AI utilizes the learner's specified "Special Interests" (e.g., trains, space exploration, botany) to theme the practice exercises.
*   **Variable Encouragement:** The AI pulls from a varied, rotating list of validation phrases so feedback doesn't feel robotic or insincere.

## 5. Emotional Safety & Complexity Evolution

*   **Adaptive Complexity:** If a user requests a "Hint Level 3" more than twice in a lesson, the pipeline automatically detects high cognitive load. Subsequent lessons are dynamically generated to be 20% shorter, with smaller conceptual leaps.
*   **Safe Failure States:** The AI validation logic must anticipate common mistakes (e.g., forgetting a closing tag) and generate specific, gentle catch-phrases for those specific errors, rather than a generic "Incorrect syntax" error.

## 6. Extending the System (Future Languages)

This pipeline is designed to be language-agnostic. When NeuroCode expands to CSS, JavaScript, or Java, the AI pipeline remains identical:
1.  Create a `curriculum_[language].md` defining the micro-steps.
2.  Update the AI context to map the new language's abstract concepts to concrete analogies.
3.  The Generation Pipeline (Context Injection ➔ Draft ➔ Validation ➔ Output) continues to enforce the `lesson_rules.md`, ensuring that even complex Java object-oriented principles are taught with the exact same low-cognitive-load, emotionally safe approach as basic HTML.
