# browser-image-validator

[![npm version](https://img.shields.io/npm/v/browser-image-validator)](https://www.npmjs.com/package/browser-image-validator)
[![CI](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml/badge.svg)](https://github.com/avshukan/browser-image-validator/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Validate browser image files before upload by MIME type, file size, and dimensions.

## Installation

```bash
npm install browser-image-validator
```

## Why this package

- Validate image files before upload on the client side
- Keep validation logic framework-agnostic
- Return typed, machine-readable error codes
- Avoid loading image dimensions unless dimension checks are enabled

## Requirements

**Browser only** — uses the browser `File` API and `Image` constructor. Not intended for Node.js or server-side use.

TypeScript 5+ is recommended for full type inference.

## Quick start

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

## Error codes

- `INVALID_FILE_TYPE`
- `FILE_TOO_LARGE`
- `IMAGE_WIDTH_TOO_LARGE`
- `IMAGE_HEIGHT_TOO_LARGE`
- `IMAGE_LOAD_FAILED`

## Common use case

Use `validateImage` before starting an upload flow to reject unsupported files early and return consistent error codes for your UI layer.

## Out of scope

- image resize / crop / preview generation
- drag-and-drop
- localization
- multiple files validation / async queue
- EXIF / aspect ratio / content-based MIME validation
- server-side validation / upload logic / UI error messages
- React, Vue, or framework-specific integrations

## Limitations

- MIME type validation relies on the browser-provided `file.type`
- The package does not inspect actual file contents
- Non-image files can still pass if you do not enable MIME or dimension checks
- ESM package intended for browser runtimes

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
