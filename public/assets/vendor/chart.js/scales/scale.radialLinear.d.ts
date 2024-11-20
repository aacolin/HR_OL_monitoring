e***REMOVED***port default class RadialLinearScale e***REMOVED***tends LinearScaleBase {
    static id: string;
    /**
     * @type {any}
     */
    static defaults: any;
    static defaultRoutes: {
        'angleLines.color': string;
        'pointLabels.color': string;
        'ticks.color': string;
    };
    static descriptors: {
        angleLines: {
            _fallback: string;
        };
    };
    /** @type {number} */
    ***REMOVED***Center: number;
    /** @type {number} */
    yCenter: number;
    /** @type {number} */
    drawingArea: number;
    /** @type {string[]} */
    _pointLabels: string[];
    _pointLabelItems: any[];
    _padding: import("../types.js").ChartArea;
    generateTickLabels(ticks: any): void;
    setCenterPoint(leftMovement: any, rightMovement: any, topMovement: any, bottomMovement: any): void;
    getInde***REMOVED***Angle(inde***REMOVED***: any): number;
    getDistanceFromCenterForValue(value: any): number;
    getValueForDistanceFromCenter(distance: any): any;
    getPointLabelConte***REMOVED***t(inde***REMOVED***: any): any;
    getPointPosition(inde***REMOVED***: any, distanceFromCenter: any, additionalAngle?: number): {
        ***REMOVED***: number;
        y: number;
        angle: number;
    };
    getPointPositionForValue(inde***REMOVED***: any, value: any): {
        ***REMOVED***: number;
        y: number;
        angle: number;
    };
    getBasePosition(inde***REMOVED***: any): {
        ***REMOVED***: number;
        y: number;
        angle: number;
    };
    getPointLabelPosition(inde***REMOVED***: any): {
        left: any;
        top: any;
        right: any;
        bottom: any;
    };
    /**
       * @protected
       */
    protected drawGrid(): void;
    /**
       * @protected
       */
    protected drawLabels(): void;
}
import LinearScaleBase from "./scale.linearbase.js";
