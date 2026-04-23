import { afterEach, describe, expect, it, vi } from 'vitest';

import { validateImage } from './index.js';

type ImageLoadOutcome =
    | {
          type: 'load';
          width: number;
          height: number;
      }
    | {
          type: 'error';
      };

class MockImage {
    static nextOutcomes: ImageLoadOutcome[] = [];

    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;
    naturalWidth = 0;
    naturalHeight = 0;

    set src(_value: string) {
        const outcome = MockImage.nextOutcomes.shift();

        if (outcome === undefined) {
            throw new Error('No mock image outcome configured');
        }

        if (outcome.type === 'load') {
            this.naturalWidth = outcome.width;
            this.naturalHeight = outcome.height;
            this.onload?.();
            return;
        }

        this.onerror?.();
    }
}

const originalImage = globalThis.Image;
const createObjectURLMock = vi.fn(() => 'blob:mock-url');
const revokeObjectURLMock = vi.fn();

vi.stubGlobal('URL', {
    createObjectURL: createObjectURLMock,
    revokeObjectURL: revokeObjectURLMock,
});

function createFile(options?: { type?: string; contents?: string }) {
    return new File([options?.contents ?? 'file-content'], 'test-image.bin', {
        type: options?.type ?? 'image/png',
    });
}

function mockImageLoading(...outcomes: ImageLoadOutcome[]) {
    MockImage.nextOutcomes = [...outcomes];
    vi.stubGlobal('Image', MockImage);
}

afterEach(() => {
    MockImage.nextOutcomes = [];
    createObjectURLMock.mockClear();
    revokeObjectURLMock.mockClear();

    if (originalImage === undefined) {
        vi.unstubAllGlobals();
        vi.stubGlobal('URL', {
            createObjectURL: createObjectURLMock,
            revokeObjectURL: revokeObjectURLMock,
        });
        return;
    }

    vi.stubGlobal('Image', originalImage);
});

describe('validateImage', () => {
    it('returns success without loading the image when dimensions are not requested', async () => {
        const result = await validateImage(createFile(), {
            allowedMimeTypes: ['image/png'],
            maxFileSizeBytes: 100,
        });

        expect(result).toEqual({
            valid: true,
            image: {
                mimeType: 'image/png',
                sizeBytes: 12,
            },
        });
        expect(createObjectURLMock).not.toHaveBeenCalled();
    });

    it('treats an empty dimensions object the same as omitted dimensions', async () => {
        const result = await validateImage(createFile(), {
            dimensions: {},
        });

        expect(result).toEqual({
            valid: true,
            image: {
                mimeType: 'image/png',
                sizeBytes: 12,
            },
        });
        expect(createObjectURLMock).not.toHaveBeenCalled();
    });

    it('collects MIME type and file size errors without early exit', async () => {
        const result = await validateImage(createFile({ type: 'image/gif' }), {
            allowedMimeTypes: [],
            maxFileSizeBytes: 0,
        });

        expect(result).toEqual({
            valid: false,
            errors: [
                { code: 'INVALID_FILE_TYPE' },
                { code: 'FILE_TOO_LARGE' },
            ],
        });
    });

    it('loads image dimensions and returns them on success', async () => {
        mockImageLoading({
            type: 'load',
            width: 800,
            height: 600,
        });

        const result = await validateImage(createFile(), {
            dimensions: {
                maxWidth: 1024,
                maxHeight: 768,
            },
        });

        expect(result).toEqual({
            valid: true,
            image: {
                mimeType: 'image/png',
                sizeBytes: 12,
                dimensions: {
                    width: 800,
                    height: 600,
                },
            },
        });
        expect(createObjectURLMock).toHaveBeenCalledTimes(1);
        expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
    });

    it('collects both width and height errors from loaded dimensions', async () => {
        mockImageLoading({
            type: 'load',
            width: 1200,
            height: 900,
        });

        const result = await validateImage(createFile(), {
            dimensions: {
                maxWidth: 1024,
                maxHeight: 768,
            },
        });

        expect(result).toEqual({
            valid: false,
            errors: [
                { code: 'IMAGE_WIDTH_TOO_LARGE' },
                { code: 'IMAGE_HEIGHT_TOO_LARGE' },
            ],
        });
    });

    it('preserves earlier errors when image loading fails', async () => {
        mockImageLoading({ type: 'error' });

        const result = await validateImage(createFile({ type: 'text/plain' }), {
            allowedMimeTypes: ['image/png'],
            maxFileSizeBytes: 0,
            dimensions: {
                maxWidth: 100,
            },
        });

        expect(result).toEqual({
            valid: false,
            errors: [
                { code: 'INVALID_FILE_TYPE' },
                { code: 'FILE_TOO_LARGE' },
                { code: 'IMAGE_LOAD_FAILED' },
            ],
        });
    });
});
