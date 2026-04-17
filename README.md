# browser-image-validator

Small TypeScript utility for validating browser image files by MIME type, file size, and image dimensions.

## Status

Project is in the initial planning stage.

No stable API yet.

## Goal

Create a small, framework-agnostic npm package for validating image `File` objects in the browser.

The package will be useful for browser applications that need to check uploaded images before further processing.

## Planned MVP

The first version will validate:

- file MIME type
- file size
- image width
- image height

The result will be typed and suitable for TypeScript projects.

## Not included in MVP

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

## License

MIT
