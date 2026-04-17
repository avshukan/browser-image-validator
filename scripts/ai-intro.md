# AI Context (paste this + prompt.txt into a new chat)

You are reviewing my npm package repository: **browser-image-validator**.

The project is a small TypeScript utility for validating browser image files.

---

## Current state

The project is in the initial development stage.

Current focus:

- Design a small MVP
- Keep the public API simple
- Implement image `File` validation in the browser
- Add strong TypeScript types
- Add automated tests
- Prepare the package for npm publishing

Source of truth:

- `docs/MVP.md`
- `README.md`
- `package.json`

---

## MVP scope

The package should validate browser image `File` objects.

MVP checks:

- file MIME type
- file size
- image width
- image height

The package should return a typed validation result.

---

## Not included in MVP

Do not suggest these features unless explicitly asked:

- image resize
- crop
- preview generation
- drag-and-drop
- localization
- multiple files validation
- async queue
- EXIF support
- aspect ratio validation
- content-based MIME validation
- server-side image validation
- upload logic
- UI error messages
- React, Vue, or framework-specific integrations

---

## Process

We use small incremental steps:

- first design the MVP
- then design the public API
- then initialize the package
- then implement the code
- then add tests
- then prepare README and npm publishing setup

---

## Rules

- Prefer repository docs as the source of truth
- Keep answers short and practical
- Focus on MVP scope
- Do not suggest large features outside MVP
- Do not add framework-specific code
- Ask only for files you really need
