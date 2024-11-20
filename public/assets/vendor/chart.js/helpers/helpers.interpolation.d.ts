import type { Point, SplinePoint } from '../types/geometric.js';
/**
 * @private
 */
e***REMOVED***port declare function _pointInLine(p1: Point, p2: Point, t: number, mode?: any): {
    ***REMOVED***: number;
    y: number;
};
/**
 * @private
 */
e***REMOVED***port declare function _steppedInterpolation(p1: Point, p2: Point, t: number, mode: 'middle' | 'after' | unknown): {
    ***REMOVED***: number;
    y: number;
};
/**
 * @private
 */
e***REMOVED***port declare function _bezierInterpolation(p1: SplinePoint, p2: SplinePoint, t: number, mode?: any): {
    ***REMOVED***: number;
    y: number;
};
