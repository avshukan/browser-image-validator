# API

## Main function

The package exposes one main function:

```
validateImage(file, options)
```

## Function signature

```
export async function validateImage(
    file: File,
    options: ValidateImageOptions,
): Promise<ValidateImageResult>;
```

## Options

`options` is required.

All properties inside `options` are optional.

```
export type ValidateImageOptions = {
    allowedMimeTypes?: string[];
    maxFileSizeBytes?: number;
    maxWidth?: number;
    maxHeight?: number;
};
```

## Result

The function returns a typed discriminated union.

```
export type ValidateImageResult =
    | {
            valid: true;
            image: ValidatedImageInfo;
        }
    | {
            valid: false;
            errors: ImageValidationError[];
        };
```

## Success result

```
export type ValidatedImageInfo = {
    mimeType: string;
    sizeBytes: number;
    width: number;
    height: number;
};
```

## Error result

```
export type ImageValidationError = {
    code: ImageValidationErrorCode;
};
```

Error objects intentionally contain only machine-readable codes.

## Error codes

```
export type ImageValidationErrorCode =
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'IMAGE_WIDTH_TOO_LARGE'
    | 'IMAGE_HEIGHT_TOO_LARGE'
    | 'IMAGE_LOAD_FAILED';
```

## Behavior rules

### General rules

- If an option is not provided, the related validation check is skipped.
- The function may return multiple validation errors in one result.
- The function does not throw validation errors as part of normal validation flow.
- The function returns `valid: true` only if all enabled checks pass.

### Validation order

The validation flow works in this order:

1. validate MIME type
2. validate file size
3. load image
4. validate width
5. validate height

The function does not use early exit for MIME type or file size validation.

The function always attempts to load the image.

If image loading fails, the function adds `IMAGE_LOAD_FAILED`.

If image loading fails, width and height checks are not performed.

Any MIME type or file size errors collected before image loading failure are preserved in the final result.

### MIME type validation

If `allowedMimeTypes` is provided, the function checks whether `file.type` is included in that list.

If not included, the function adds:

- `INVALID_FILE_TYPE`

If `allowedMimeTypes` is an empty array, no MIME type is allowed.

MIME type validation is based on browser-provided `file.type` and does not inspect the actual file contents.

### File size validation

If `maxFileSizeBytes` is provided, the function checks whether `file.size` exceeds that limit.

If it exceeds the limit, the function adds:

- `FILE_TOO_LARGE`

### Image loading

The function always attempts to load the image in order to obtain image dimensions for the success result.

If image loading fails, the function adds:

- `IMAGE_LOAD_FAILED`

### Width validation

If `maxWidth` is provided and the loaded image width exceeds that limit, the function adds:

- `IMAGE_WIDTH_TOO_LARGE`

### Height validation

If `maxHeight` is provided and the loaded image height exceeds that limit, the function adds:

- `IMAGE_HEIGHT_TOO_LARGE`

## Example usage

```
const result = await validateImage(file, {
    allowedMimeTypes: ['image/jpeg', 'image/png'],
    maxFileSizeBytes: 2 * 1024 * 1024,
    maxWidth: 4096,
    maxHeight: 4096,
});

if (!result.valid) {
    console.log(result.errors);
}
```

## Non-goals for this API

This API does not include:

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
