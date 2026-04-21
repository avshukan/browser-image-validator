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

export async function validateImage(
    file: File,
    options: ValidateImageOptions,
): Promise<ValidateImageResult> {
    void file;
    void options;
    throw new Error('Not implemented');
}
