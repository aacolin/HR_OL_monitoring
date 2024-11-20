e***REMOVED***port default class BarElement e***REMOVED***tends Element<import("../types/basic.js").AnyObject, import("../types/basic.js").AnyObject> {
    static id: string;
    /**
     * @type {any}
     */
    static defaults: any;
    constructor(cfg: any);
    options: any;
    horizontal: any;
    base: any;
    width: any;
    height: any;
    inflateAmount: any;
    draw(ct***REMOVED***: any): void;
    inRange(mouseX: any, mouseY: any, useFinalPosition: any): boolean;
    inXRange(mouseX: any, useFinalPosition: any): boolean;
    inYRange(mouseY: any, useFinalPosition: any): boolean;
    getCenterPoint(useFinalPosition: any): {
        ***REMOVED***: number;
        y: number;
    };
    getRange(a***REMOVED***is: any): number;
}
e***REMOVED***port type BarProps = {
    ***REMOVED***: number;
    y: number;
    base: number;
    horizontal: boolean;
    width: number;
    height: number;
};
import Element from "../core/core.element.js";
