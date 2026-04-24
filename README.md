# browser-image-validator

[![CI](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/browser-image-validator)](https://www.npmjs.com/package/browser-image-validator)
[![npm downloads](https://img.shields.io/npm/dm/browser-image-validator)](https://www.npmjs.com/package/browser-image-validator)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/browser-image-validator)](https://bundlephobia.com/package/browser-image-validator)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-brightgreen?logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Small TypeScript utility for validating browser image files by MIME type, file size, and image dimensions.

## Installation

```bash
npm install browser-image-validator
```

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
    // result.image: { mimeType, sizeBytes, dimensions?: { width, height } }
} else {
    console.error('Validation failed:', result.errors);
    // result.errors: Array<{ code: ImageValidationErrorCode }>
}
```

## API

### `validateImage(file, options)`

Validates a browser `File` object against the provided constraints.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `file` | `File` | The browser `File` object to validate |
| `options` | `ValidateImageOptions` | Validation constraints (all optional) |
| `options.allowedMimeTypes` | `string[]` | Allowed MIME types (e.g. `['image/jpeg']`). If omitted, MIME type is not checked. |
| `options.maxFileSizeBytes` | `number` | Maximum file size in bytes. If omitted, size is not checked. |
| `options.dimensions.maxWidth` | `number` | Maximum image width in pixels. |
| `options.dimensions.maxHeight` | `number` | Maximum image height in pixels. |

**Returns:** `Promise<ValidateImageResult>`

### Error codes

| Code | Description |
|------|-------------|
| `INVALID_FILE_TYPE` | File MIME type is not in `allowedMimeTypes` |
| `FILE_TOO_LARGE` | File size exceeds `maxFileSizeBytes` |
| `IMAGE_WIDTH_TOO_LARGE` | Image width exceeds `maxWidth` |
| `IMAGE_HEIGHT_TOO_LARGE` | Image height exceeds `maxHeight` |
| `IMAGE_LOAD_FAILED` | Browser failed to decode the image |

## Requirements

- **Browser only** — the package uses the browser `File` API and `Image` constructor. It is not intended for Node.js or server-side use.
- TypeScript 5+ recommended for full type inference.

## Features

- Validates MIME type
- Validates file size
- Validates image width and height (via browser image decoding)
- Fully typed — results are discriminated unions, suitable for TypeScript projects
- Framework-agnostic — works with any browser-based application

## Out of scope

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

## Contributing

```bash
npm ci
npm run test        # run tests in watch mode
npm run test:run    # run tests once
npm run typecheck   # TypeScript type check
npm run lint        # ESLint
npm run format      # Prettier
npm run build       # build to dist/
```

## License

MIT
