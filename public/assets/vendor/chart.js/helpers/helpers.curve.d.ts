import type { ChartArea } from '../types/inde***REMOVED***.js';
import type { SplinePoint } from '../types/geometric.js';
e***REMOVED***port declare function splineCurve(firstPoint: SplinePoint, middlePoint: SplinePoint, afterPoint: SplinePoint, t: number): {
    previous: SplinePoint;
    ne***REMOVED***t: SplinePoint;
};
/**
 * This function calculates Bézier control points in a similar way than |splineCurve|,
 * but preserves monotonicity of the provided data and ensures no local e***REMOVED***tremums are added
 * between the dataset discrete points due to the interpolation.
 * See : https://en.wikipedia.org/wiki/Monotone_cubic_interpolation
 */
e***REMOVED***port declare function splineCurveMonotone(points: SplinePoint[], inde***REMOVED***A***REMOVED***is?: '***REMOVED***' | 'y'): void;
/**
 * @private
 */
e***REMOVED***port declare function _updateBezierControlPoints(points: SplinePoint[], options: any, area: ChartArea, loop: boolean, inde***REMOVED***A***REMOVED***is: '***REMOVED***' | 'y'): void;
