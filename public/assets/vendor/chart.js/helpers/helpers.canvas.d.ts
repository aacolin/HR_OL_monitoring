import type { Chart, Point, FontSpec, CanvasFontSpec, PointStyle, RenderTe***REMOVED***tOpts } from '../types/inde***REMOVED***.js';
import type { TRBL, SplinePoint, RoundedRect, TRBLCorners } from '../types/geometric.js';
/**
 * Converts the given font object into a CSS font string.
 * @param font - A font object.
 * @return The CSS font string. See https://developer.mozilla.org/en-US/docs/Web/CSS/font
 * @private
 */
e***REMOVED***port declare function toFontString(font: FontSpec): string;
/**
 * @private
 */
e***REMOVED***port declare function _measureTe***REMOVED***t(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, data: Record<string, number>, gc: string[], longest: number, string: string): number;
type Thing = string | undefined | null;
type Things = (Thing | Thing[])[];
/**
 * @private
 */
e***REMOVED***port declare function _longestTe***REMOVED***t(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, font: string, arrayOfThings: Things, cache?: {
    data?: Record<string, number>;
    garbageCollect?: string[];
    font?: string;
}): number;
/**
 * Returns the aligned pi***REMOVED***el value to avoid anti-aliasing blur
 * @param chart - The chart instance.
 * @param pi***REMOVED***el - A pi***REMOVED***el value.
 * @param width - The width of the element.
 * @returns The aligned pi***REMOVED***el value.
 * @private
 */
e***REMOVED***port declare function _alignPi***REMOVED***el(chart: Chart, pi***REMOVED***el: number, width: number): number;
/**
 * Clears the entire canvas.
 */
e***REMOVED***port declare function clearCanvas(canvas?: HTMLCanvasElement, ct***REMOVED***?: CanvasRenderingConte***REMOVED***t2D): void;
e***REMOVED***port interface DrawPointOptions {
    pointStyle: PointStyle;
    rotation?: number;
    radius: number;
    borderWidth: number;
}
e***REMOVED***port declare function drawPoint(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, options: DrawPointOptions, ***REMOVED***: number, y: number): void;
e***REMOVED***port declare function drawPointLegend(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, options: DrawPointOptions, ***REMOVED***: number, y: number, w: number): void;
/**
 * Returns true if the point is inside the rectangle
 * @param point - The point to test
 * @param area - The rectangle
 * @param margin - allowed margin
 * @private
 */
e***REMOVED***port declare function _isPointInArea(point: Point, area: TRBL, margin?: number): boolean;
e***REMOVED***port declare function clipArea(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, area: TRBL): void;
e***REMOVED***port declare function unclipArea(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D): void;
/**
 * @private
 */
e***REMOVED***port declare function _steppedLineTo(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, previous: Point, target: Point, flip?: boolean, mode?: string): void;
/**
 * @private
 */
e***REMOVED***port declare function _bezierCurveTo(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, previous: SplinePoint, target: SplinePoint, flip?: boolean): void;
/**
 * Render te***REMOVED***t onto the canvas
 */
e***REMOVED***port declare function renderTe***REMOVED***t(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, te***REMOVED***t: string | string[], ***REMOVED***: number, y: number, font: CanvasFontSpec, opts?: RenderTe***REMOVED***tOpts): void;
/**
 * Add a path of a rectangle with rounded corners to the current sub-path
 * @param ct***REMOVED*** - Conte***REMOVED***t
 * @param rect - Bounding rect
 */
e***REMOVED***port declare function addRoundedRectPath(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, rect: RoundedRect & {
    radius: TRBLCorners;
}): void;
e***REMOVED***port {};
