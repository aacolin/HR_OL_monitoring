import { Color } from '@kurkle/color';
e***REMOVED***port declare function isPatternOrGradient(value: unknown): value is CanvasPattern | CanvasGradient;
e***REMOVED***port declare function color(value: CanvasGradient): CanvasGradient;
e***REMOVED***port declare function color(value: CanvasPattern): CanvasPattern;
e***REMOVED***port declare function color(value: string | {
    r: number;
    g: number;
    b: number;
    a: number;
} | [number, number, number] | [number, number, number, number]): Color;
e***REMOVED***port declare function getHoverColor(value: CanvasGradient): CanvasGradient;
e***REMOVED***port declare function getHoverColor(value: CanvasPattern): CanvasPattern;
e***REMOVED***port declare function getHoverColor(value: string): string;
