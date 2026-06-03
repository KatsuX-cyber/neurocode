# NeuroCode: HTML Curriculum Architecture

## Overview
This document outlines the HTML curriculum for NeuroCode, specifically designed for neurodivergent learners. The progression minimizes cognitive load, emphasizes practical application, and ensures emotional safety at every step.

**Total Estimated Time:** 15-20 hours
**Difficulty Progression:** Absolute Beginner ➔ Intermediate Web Builder
**Core Philosophy:** Low abstraction, immediate visual feedback, structured repetition.

---

## Module 1: The Digital Canvas (Absolute Beginner)
**Goal:** Understand that code creates visual structures without feeling overwhelmed by syntax.
**Estimated Time:** 2-3 hours

*   **Lesson 1.1: Hello, World (and you!)**
    *   **Objective:** Write your first line of text and see it on the screen.
    *   **Concepts:** What is HTML? The `<p>` tag.
    *   **Prerequisites:** None.
    *   **Difficulty:** Very Low.
*   **Lesson 1.2: Making Things Big and Important**
    *   **Objective:** Learn heading hierarchy (`<h1>` to `<h3>`).
    *   **Concepts:** Headings, structural importance.
    *   **Prerequisites:** Lesson 1.1.
    *   **Difficulty:** Low.
*   **Lesson 1.3: Emphasizing Your Voice**
    *   **Objective:** Bold and italicize text.
    *   **Concepts:** `<strong>` and `<em>` tags.
    *   **Prerequisites:** Lesson 1.2.
    *   **Difficulty:** Low.
*   **Mini-Project 1: A Postcard About Your Special Interest**
    *   **Objective:** Combine headings, paragraphs, and emphasis to create a simple, text-based postcard about a topic the learner loves.

---

## Module 2: Lists, Links, and Images (Beginner)
**Goal:** Learn how to group information and connect to the outside world.
**Estimated Time:** 3-4 hours

*   **Lesson 2.1: Making Lists (Unordered)**
    *   **Objective:** Create bulleted lists.
    *   **Concepts:** `<ul>` and `<li>` tags.
    *   **Prerequisites:** Module 1.
    *   **Difficulty:** Low.
*   **Lesson 2.2: Step-by-Step (Ordered Lists)**
    *   **Objective:** Create numbered instructions.
    *   **Concepts:** `<ol>` and `<li>` tags.
    *   **Prerequisites:** Lesson 2.1.
    *   **Difficulty:** Low.
*   **Lesson 2.3: Portals to Other Worlds (Links)**
    *   **Objective:** Create clickable hyperlinks.
    *   **Concepts:** The `<a>` tag and `href` attribute. (Introduction to attributes).
    *   **Prerequisites:** Module 1.
    *   **Difficulty:** Low-Medium.
*   **Lesson 2.4: Adding Visuals (Images)**
    *   **Objective:** Embed an image.
    *   **Concepts:** The `<img>` tag, `src`, and introduction to `alt` text.
    *   **Prerequisites:** Lesson 2.3.
    *   **Difficulty:** Medium.
*   **Mini-Project 2: Your Top 5 Hyperlinked List**
    *   **Objective:** Build a ranked list of favorite things, complete with images and links to learn more.

---

## Module 3: Meaningful Structure & Accessibility (Beginner-Intermediate)
**Goal:** Understand semantic HTML and why code needs to be accessible to everyone.
**Estimated Time:** 4-5 hours

*   **Lesson 3.1: The Skeleton of a Page**
    *   **Objective:** Understand the invisible structure.
    *   **Concepts:** `<html>`, `<head>`, `<body>`, `<title>`.
    *   **Prerequisites:** Module 2.
    *   **Difficulty:** Medium (requires abstract thinking, handled carefully).
*   **Lesson 3.2: Semantic Sections**
    *   **Objective:** Group content logically instead of using generic tags.
    *   **Concepts:** `<header>`, `<main>`, `<footer>`, `<article>`, `<section>`.
    *   **Prerequisites:** Lesson 3.1.
    *   **Difficulty:** Medium.
*   **Lesson 3.3: Coding for Everyone (Accessibility Focus)**
    *   **Objective:** Deep dive into `alt` text and ARIA basics for screen readers.
    *   **Concepts:** Screen readers, `alt` text best practices.
    *   **Prerequisites:** Lesson 2.4, Lesson 3.2.
    *   **Difficulty:** Medium.
*   **Revision Module: Semantic Sorting Game**
    *   **Objective:** Interactive drag-and-drop game matching content types to their correct semantic tags.

---

## Module 4: Interactivity & Forms (Intermediate)
**Goal:** Allow users to input data and interact with the page.
**Estimated Time:** 4-5 hours

*   **Lesson 4.1: Asking for Information**
    *   **Objective:** Create a basic text input.
    *   **Concepts:** `<form>`, `<input type="text">`, `<label>`.
    *   **Prerequisites:** Module 3.
    *   **Difficulty:** Medium.
*   **Lesson 4.2: Different Ways to Answer**
    *   **Objective:** Use radio buttons and checkboxes.
    *   **Concepts:** `<input type="radio">`, `<input type="checkbox">`.
    *   **Prerequisites:** Lesson 4.1.
    *   **Difficulty:** Medium-High.
*   **Lesson 4.3: Dropdowns and Text Areas**
    *   **Objective:** Use larger text fields and selection menus.
    *   **Concepts:** `<select>`, `<option>`, `<textarea>`.
    *   **Prerequisites:** Lesson 4.2.
    *   **Difficulty:** Medium-High.
*   **Lesson 4.4: Submitting the Data**
    *   **Objective:** Add submit buttons.
    *   **Concepts:** `<button type="submit">`.
    *   **Prerequisites:** Lesson 4.3.
    *   **Difficulty:** Medium.
*   **Mini-Project 3: The "Contact Me" Form**
    *   **Objective:** Build a fully semantic, accessible contact form asking for a user's name, preferences (checkboxes), and a message.

---

## Module 5: Responsive Foundations & Final Capstone (Intermediate)
**Goal:** Introduce responsive concepts and synthesize all HTML knowledge into a single cohesive project.
**Estimated Time:** 3-4 hours

*   **Lesson 5.1: The Viewport Meta Tag**
    *   **Objective:** Understand how mobile devices view websites.
    *   **Concepts:** `<meta name="viewport">`.
    *   **Prerequisites:** Lesson 3.1.
    *   **Difficulty:** Medium (Conceptual).
*   **Lesson 5.2: Grouping with Divs and Spans**
    *   **Objective:** Learn generic containers for future styling.
    *   **Concepts:** `<div>`, `<span>` (explained as "boxes" for later decoration).
    *   **Prerequisites:** Module 3.
    *   **Difficulty:** Medium.
*   **Final Capstone Project: A Personal Portfolio / Knowledge Base**
    *   **Objective:** Build a multi-page, semantically structured, accessible HTML website.
    *   **Requirements:**
        *   Must include semantic tags (`<header>`, `<main>`, `<footer>`, `<nav>`).
        *   Must include lists, links, and properly labelled images.
        *   Must include a contact form.
        *   Must pass basic automated accessibility checks (all images have `alt` tags, inputs have `<label>`s).
    *   **Outcome:** A complete, standard-compliant HTML skeleton ready for CSS in the next course.
