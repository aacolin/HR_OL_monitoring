import Element from '../core/core.element.js';
import type { ArcOptions, Point } from '../types/inde***REMOVED***.js';
e***REMOVED***port interface ArcProps e***REMOVED***tends Point {
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    circumference: number;
}
e***REMOVED***port default class ArcElement e***REMOVED***tends Element<ArcProps, ArcOptions> {
    static id: string;
    static defaults: {
        borderAlign: string;
        borderColor: string;
        borderDash: any[];
        borderDashOffset: number;
        borderJoinStyle: any;
        borderRadius: number;
        borderWidth: number;
        offset: number;
        spacing: number;
        angle: any;
        circular: boolean;
    };
    static defaultRoutes: {
        backgroundColor: string;
    };
    static descriptors: {
        _scriptable: boolean;
        _inde***REMOVED***able: (name: any) => boolean;
    };
    circumference: number;
    endAngle: number;
    fullCircles: number;
    innerRadius: number;
    outerRadius: number;
    pi***REMOVED***elMargin: number;
    startAngle: number;
    constructor(cfg: any);
    inRange(chartX: number, chartY: number, useFinalPosition: boolean): boolean;
    getCenterPoint(useFinalPosition: boolean): {
        ***REMOVED***: number;
        y: number;
    };
    tooltipPosition(useFinalPosition: boolean): {
        ***REMOVED***: number;
        y: number;
    };
    draw(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D): void;
}
