import type { ChartMeta, PointElement } from '../types/inde***REMOVED***.js';
e***REMOVED***port declare function fontString(pi***REMOVED***elSize: number, fontStyle: string, fontFamily: string): string;
/**
* Request animation polyfill
*/
e***REMOVED***port declare const requestAnimFrame: (((callback: FrameRequestCallback) => number) & typeof requestAnimationFrame) | ((callback: any) => any);
/**
 * Throttles calling `fn` once per animation frame
 * Latest arguments are used on the actual call
 */
e***REMOVED***port declare function throttled<TArgs e***REMOVED***tends Array<any>>(fn: (...args: TArgs) => void, thisArg: any): (...args: TArgs) => void;
/**
 * Debounces calling `fn` for `delay` ms
 */
e***REMOVED***port declare function debounce<TArgs e***REMOVED***tends Array<any>>(fn: (...args: TArgs) => void, delay: number): (...args: TArgs) => number;
/**
 * Converts 'start' to 'left', 'end' to 'right' and others to 'center'
 * @private
 */
e***REMOVED***port declare const _toLeftRightCenter: (align: 'start' | 'end' | 'center') => "center" | "left" | "right";
/**
 * Returns `start`, `end` or `(start + end) / 2` depending on `align`. Defaults to `center`
 * @private
 */
e***REMOVED***port declare const _alignStartEnd: (align: 'start' | 'end' | 'center', start: number, end: number) => number;
/**
 * Returns `left`, `right` or `(left + right) / 2` depending on `align`. Defaults to `left`
 * @private
 */
e***REMOVED***port declare const _te***REMOVED***tX: (align: 'left' | 'right' | 'center', left: number, right: number, rtl: boolean) => number;
/**
 * Return start and count of visible points.
 * @private
 */
e***REMOVED***port declare function _getStartAndCountOfVisiblePoints(meta: ChartMeta<'line' | 'scatter'>, points: PointElement[], animationsDisabled: boolean): {
    start: number;
    count: number;
};
/**
 * Checks if the scale ranges have changed.
 * @param {object} meta - dataset meta.
 * @returns {boolean}
 * @private
 */
e***REMOVED***port declare function _scaleRangesChanged(meta: any): boolean;
