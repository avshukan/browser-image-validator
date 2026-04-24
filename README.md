# browser-image-validator

[![CI](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Small TypeScript utility for validating browser image files by MIME type, file size, and image dimensions.

> **Pre-release** — the package has not yet been published to npm. Installation via `npm install` will be available after the first release.

## Requirements

**Browser only** — uses the browser `File` API and `Image` constructor. Not intended for Node.js or server-side use.

TypeScript 5+ is recommended for full type inference.

## Usage

```ts
import { validateImage } from 'browser-image-validator';

const result = await validateImage(file, {
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
    maxFileSizeBytes: 5 * 1024 * 1024, // 5 MB
    dimensions: {
        maxWidth: 4096,
        maxHeight: 4096,
    },
});

if (result.valid) {
    console.log('Image is valid:', result.image);
    // { mimeType, sizeBytes, dimensions?: { width, height } }
} else {
    console.error('Validation failed:', result.errors);
    // Array<{ code: ImageValidationErrorCode }>
}
```

See [docs/API.md](./docs/API.md) for the full API reference including all types, options, error codes, and behavior details.

## Features

- Validates MIME type
- Validates file size
- Validates image width and height (via browser image decoding)
- Fully typed — results are discriminated unions
- Framework-agnostic

## Out of scope

- image resize / crop / preview generation
- drag-and-drop
- localization
- multiple files validation / async queue
- EXIF / aspect ratio / content-based MIME validation
- server-side validation / upload logic / UI error messages
- React, Vue, or framework-specific integrations

## Contributing

Requires Node.js ≥ 22 (development/build toolchain only).

```bash
npm ci
npm run test:run    # run tests once
npm run test        # run tests in watch mode
npm run typecheck   # TypeScript type check
npm run lint        # ESLint
npm run format      # Prettier
npm run build       # build to dist/
```

## License

MIT
