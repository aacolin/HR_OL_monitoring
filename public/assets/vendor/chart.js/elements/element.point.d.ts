import Element from '../core/core.element.js';
import type { CartesianParsedData, ChartArea, Point, PointHoverOptions, PointOptions } from '../types/inde***REMOVED***.js';
e***REMOVED***port type PointProps = Point;
e***REMOVED***port default class PointElement e***REMOVED***tends Element<PointProps, PointOptions & PointHoverOptions> {
    static id: string;
    parsed: CartesianParsedData;
    skip?: boolean;
    stop?: boolean;
    /**
     * @type {any}
     */
    static defaults: {
        borderWidth: number;
        hitRadius: number;
        hoverBorderWidth: number;
        hoverRadius: number;
        pointStyle: string;
        radius: number;
        rotation: number;
    };
    /**
     * @type {any}
     */
    static defaultRoutes: {
        backgroundColor: string;
        borderColor: string;
    };
    constructor(cfg: any);
    inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean;
    inXRange(mouseX: number, useFinalPosition?: boolean): boolean;
    inYRange(mouseY: number, useFinalPosition?: boolean): boolean;
    getCenterPoint(useFinalPosition?: boolean): {
        ***REMOVED***: number;
        y: number;
    };
    size(options?: Partial<PointOptions & PointHoverOptions>): number;
    draw(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, area: ChartArea): void;
    getRange(): any;
}
