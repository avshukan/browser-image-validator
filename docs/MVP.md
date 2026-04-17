# MVP

## Project name

`browser-image-validator`

## Package idea

A small TypeScript utility for validating browser image files.

The package should validate image `File` objects before they are used in a browser application.

## Main goal

Create a small, high-quality, framework-agnostic npm package.

The package should be simple enough for a first professional npm package, but useful enough to be used later in real pet projects.

## Target environment

Browser.

The package is not intended for Node.js image processing in the MVP.

## Target user

Frontend or fullstack developers who need simple image validation before upload or client-side processing.

## MVP checks

The package should validate:

- file MIME type
- file size
- image width
- image height

## Expected API direction

The package should expose one main function.

Example direction:

    const result = await validateImage(file, {
        maxFileSizeBytes: 2 * 1024 * 1024,
        maxWidth: 4096,
        maxHeight: 4096,
    });

The exact API is not final yet.

## Expected result direction

The result should be typed.

Example direction:

    type ValidateImageResult =
        | {
              valid: true;
              image: {
                  width: number;
                  height: number;
                  size: number;
                  type: string;
              };
          }
        | {
              valid: false;
              errors: ImageValidationError[];
          };

The exact result model is not final yet.

## Planned error codes

Initial error codes:

- `INVALID_FILE_TYPE`
- `FILE_TOO_LARGE`
- `IMAGE_WIDTH_TOO_LARGE`
- `IMAGE_HEIGHT_TOO_LARGE`
- `IMAGE_LOAD_FAILED`

The exact error model is not final yet.

## Framework policy

The package must be framework-agnostic.

It should not depend on:

- React
- Vue
- Angular
- UI components
- CSS
- form libraries

## Not included in MVP

The following features are intentionally excluded:

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

## Success criteria

The MVP is successful if:

- the package has a small and clear public API
- the package is written in TypeScript
- the package has typed validation results
- the package has automated tests
- the package has a useful README
- the package can be published to npm
