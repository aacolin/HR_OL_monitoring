import type { ChartArea, FontSpec, Point } from '../types/inde***REMOVED***.js';
import type { TRBL, TRBLCorners } from '../types/geometric.js';
/**
 * @alias Chart.helpers.options
 * @namespace
 */
/**
 * Converts the given line height `value` in pi***REMOVED***els for a specific font `size`.
 * @param value - The lineHeight to parse (eg. 1.6, '14p***REMOVED***', '75%', '1.6em').
 * @param size - The font size (in pi***REMOVED***els) used to resolve relative `value`.
 * @returns The effective line height in pi***REMOVED***els (size * 1.2 if value is invalid).
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/line-height
 * @since 2.7.0
 */
e***REMOVED***port declare function toLineHeight(value: number | string, size: number): number;
/**
 * @param value
 * @param props
 */
e***REMOVED***port declare function _readValueToProps<K e***REMOVED***tends string>(value: number | Record<K, number>, props: K[]): Record<K, number>;
e***REMOVED***port declare function _readValueToProps<K e***REMOVED***tends string, T e***REMOVED***tends string>(value: number | Record<K & T, number>, props: Record<T, K>): Record<T, number>;
/**
 * Converts the given value into a TRBL object.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  ***REMOVED*** / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left)
 * @since 3.0.0
 */
e***REMOVED***port declare function toTRBL(value: number | TRBL | Point): Record<"left" | "top" | "bottom" | "right", number>;
/**
 * Converts the given value into a TRBL corners object (similar with css border-radius).
 * @param value - If a number, set the value to all TRBL corner components,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 * @returns The TRBL corner values (topLeft, topRight, bottomLeft, bottomRight)
 * @since 3.0.0
 */
e***REMOVED***port declare function toTRBLCorners(value: number | TRBLCorners): Record<"topLeft" | "topRight" | "bottomLeft" | "bottomRight", number>;
/**
 * Converts the given value into a padding object with pre-computed width/height.
 * @param value - If a number, set the value to all TRBL component,
 *  else, if an object, use defined properties and sets undefined ones to 0.
 *  ***REMOVED*** / y are shorthands for same value for left/right and top/bottom.
 * @returns The padding values (top, right, bottom, left, width, height)
 * @since 2.7.0
 */
e***REMOVED***port declare function toPadding(value?: number | TRBL): ChartArea;
/**
 * Parses font options and returns the font object.
 * @param options - A object that contains font options to be parsed.
 * @param fallback - A object that contains fallback font options.
 * @return The font object.
 * @private
 */
e***REMOVED***port declare function toFont(options: Partial<FontSpec>, fallback?: Partial<FontSpec>): {
    family: string;
    lineHeight: number;
    size: number;
    style: "normal" | "inherit" | "italic" | "oblique" | "initial";
    weight: number | "bold" | "normal" | "lighter" | "bolder";
    string: string;
};
/**
 * Evaluates the given `inputs` sequentially and returns the first defined value.
 * @param inputs - An array of values, falling back to the last value.
 * @param conte***REMOVED***t - If defined and the current value is a function, the value
 * is called with `conte***REMOVED***t` as first argument and the result becomes the new input.
 * @param inde***REMOVED*** - If defined and the current value is an array, the value
 * at `inde***REMOVED***` become the new input.
 * @param info - object to return information about resolution in
 * @param info.cacheable - Will be set to `false` if option is not cacheable.
 * @since 2.7.0
 */
e***REMOVED***port declare function resolve(inputs: Array<unknown>, conte***REMOVED***t?: object, inde***REMOVED***?: number, info?: {
    cacheable: boolean;
}): unknown;
/**
 * @param minma***REMOVED***
 * @param grace
 * @param beginAtZero
 * @private
 */
e***REMOVED***port declare function _addGrace(minma***REMOVED***: {
    min: number;
    ma***REMOVED***: number;
}, grace: number | string, beginAtZero: boolean): {
    min: number;
    ma***REMOVED***: number;
};
/**
 * Create a conte***REMOVED***t inheriting parentConte***REMOVED***t
 * @param parentConte***REMOVED***t
 * @param conte***REMOVED***t
 * @returns
 */
e***REMOVED***port declare function createConte***REMOVED***t<T e***REMOVED***tends object>(parentConte***REMOVED***t: null, conte***REMOVED***t: T): T;
e***REMOVED***port declare function createConte***REMOVED***t<T e***REMOVED***tends object, P e***REMOVED***tends T>(parentConte***REMOVED***t: P, conte***REMOVED***t: T): P & T;
