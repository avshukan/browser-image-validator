export type ImageValidationErrorCode =
    | 'INVALID_FILE_TYPE'
    | 'FILE_TOO_LARGE'
    | 'IMAGE_WIDTH_TOO_LARGE'
    | 'IMAGE_HEIGHT_TOO_LARGE'
    | 'IMAGE_LOAD_FAILED';

export type ImageValidationError = {
    code: ImageValidationErrorCode;
};

export type ValidateImageOptions = {
    allowedMimeTypes?: string[];
    maxFileSizeBytes?: number;
    dimensions?: {
        maxWidth?: number;
        maxHeight?: number;
    };
};

export type ValidatedImageInfo = {
    mimeType: string;
    sizeBytes: number;
    dimensions?: {
        width: number;
        height: number;
    };
};

export type ValidateImageResult =
    | {
          valid: true;
          image: ValidatedImageInfo;
      }
    | {
          valid: false;
          errors: ImageValidationError[];
      };

function validateMimeType(
    file: File,
    allowedMimeTypes: string[] | undefined,
): ImageValidationError | null {
    if (allowedMimeTypes === undefined) {
        return null;
    }

    if (!allowedMimeTypes.includes(file.type)) {
        return { code: 'INVALID_FILE_TYPE' };
    }

    return null;
}

function validateFileSize(
    file: File,
    maxFileSizeBytes: number | undefined,
): ImageValidationError | null {
    if (maxFileSizeBytes === undefined) {
        return null;
    }

    if (file.size > maxFileSizeBytes) {
        return { code: 'FILE_TOO_LARGE' };
    }

    return null;
}

async function readImageDimensions(
    file: File,
): Promise<NonNullable<ValidatedImageInfo['dimensions']>> {
    return new Promise((resolve, reject) => {
        const imageUrl = URL.createObjectURL(file);
        const image = new Image();

        const cleanup = () => {
            URL.revokeObjectURL(imageUrl);
        };

        image.onload = () => {
            cleanup();
            resolve({
                width: image.naturalWidth,
                height: image.naturalHeight,
            });
        };

        image.onerror = () => {
            cleanup();
            reject(new Error('Failed to load image'));
        };

        image.src = imageUrl;
    });
}

export async function validateImage(
    file: File,
    options: ValidateImageOptions,
): Promise<ValidateImageResult> {
    const errors: ImageValidationError[] = [];

    const mimeTypeError = validateMimeType(file, options.allowedMimeTypes);
    if (mimeTypeError !== null) {
        errors.push(mimeTypeError);
    }

    const fileSizeError = validateFileSize(file, options.maxFileSizeBytes);
    if (fileSizeError !== null) {
        errors.push(fileSizeError);
    }

    const shouldReadDimensions =
        errors.length === 0 &&
        (options.dimensions?.maxWidth !== undefined || options.dimensions?.maxHeight !== undefined);

    let dimensions: ValidatedImageInfo['dimensions'];

    if (shouldReadDimensions) {
        try {
            dimensions = await readImageDimensions(file);
        } catch {
            errors.push({ code: 'IMAGE_LOAD_FAILED' });
        }
    }

    if (dimensions !== undefined) {
        if (
            options.dimensions?.maxWidth !== undefined &&
            dimensions.width > options.dimensions.maxWidth
        ) {
            errors.push({ code: 'IMAGE_WIDTH_TOO_LARGE' });
        }

        if (
            options.dimensions?.maxHeight !== undefined &&
            dimensions.height > options.dimensions.maxHeight
        ) {
            errors.push({ code: 'IMAGE_HEIGHT_TOO_LARGE' });
        }
    }

    if (errors.length > 0) {
        return {
            valid: false,
            errors,
        };
    }

    const image: ValidatedImageInfo = {
        mimeType: file.type,
        sizeBytes: file.size,
    };

    if (dimensions !== undefined) {
        image.dimensions = dimensions;
    }

    return {
        valid: true,
        image,
    };
}
