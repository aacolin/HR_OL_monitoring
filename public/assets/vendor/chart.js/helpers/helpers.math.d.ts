import type { Point } from '../types/geometric.js';
/**
 * @alias Chart.helpers.math
 * @namespace
 */
e***REMOVED***port declare const PI: number;
e***REMOVED***port declare const TAU: number;
e***REMOVED***port declare const PITAU: number;
e***REMOVED***port declare const INFINITY: number;
e***REMOVED***port declare const RAD_PER_DEG: number;
e***REMOVED***port declare const HALF_PI: number;
e***REMOVED***port declare const QUARTER_PI: number;
e***REMOVED***port declare const TWO_THIRDS_PI: number;
e***REMOVED***port declare const log10: (***REMOVED***: number) => number;
e***REMOVED***port declare const sign: (***REMOVED***: number) => number;
e***REMOVED***port declare function almostEquals(***REMOVED***: number, y: number, epsilon: number): boolean;
/**
 * Implementation of the nice number algorithm used in determining where a***REMOVED***is labels will go
 */
e***REMOVED***port declare function niceNum(range: number): number;
/**
 * Returns an array of factors sorted from 1 to sqrt(value)
 * @private
 */
e***REMOVED***port declare function _factorize(value: number): number[];
e***REMOVED***port declare function isNumber(n: unknown): n is number;
e***REMOVED***port declare function almostWhole(***REMOVED***: number, epsilon: number): boolean;
/**
 * @private
 */
e***REMOVED***port declare function _setMinAndMa***REMOVED***ByKey(array: Record<string, number>[], target: {
    min: number;
    ma***REMOVED***: number;
}, property: string): void;
e***REMOVED***port declare function toRadians(degrees: number): number;
e***REMOVED***port declare function toDegrees(radians: number): number;
/**
 * Returns the number of decimal places
 * i.e. the number of digits after the decimal point, of the value of this Number.
 * @param ***REMOVED*** - A number.
 * @returns The number of decimal places.
 * @private
 */
e***REMOVED***port declare function _decimalPlaces(***REMOVED***: number): number;
e***REMOVED***port declare function getAngleFromPoint(centrePoint: Point, anglePoint: Point): {
    angle: number;
    distance: number;
};
e***REMOVED***port declare function distanceBetweenPoints(pt1: Point, pt2: Point): number;
/**
 * Shortest distance between angles, in either direction.
 * @private
 */
e***REMOVED***port declare function _angleDiff(a: number, b: number): number;
/**
 * Normalize angle to be between 0 and 2*PI
 * @private
 */
e***REMOVED***port declare function _normalizeAngle(a: number): number;
/**
 * @private
 */
e***REMOVED***port declare function _angleBetween(angle: number, start: number, end: number, sameAngleIsFullCircle?: boolean): boolean;
/**
 * Limit `value` between `min` and `ma***REMOVED***`
 * @param value
 * @param min
 * @param ma***REMOVED***
 * @private
 */
e***REMOVED***port declare function _limitValue(value: number, min: number, ma***REMOVED***: number): number;
/**
 * @param {number} value
 * @private
 */
e***REMOVED***port declare function _int16Range(value: number): number;
/**
 * @param value
 * @param start
 * @param end
 * @param [epsilon]
 * @private
 */
e***REMOVED***port declare function _isBetween(value: number, start: number, end: number, epsilon?: number): boolean;
