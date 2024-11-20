e***REMOVED***port default class CategoryScale e***REMOVED***tends Scale {
    static id: string;
    /**
     * @type {any}
     */
    static defaults: any;
    /** @type {number} */
    _startValue: number;
    _valueRange: number;
    _addedLabels: any[];
    init(scaleOptions: any): void;
    parse(raw: any, inde***REMOVED***: any): number;
    buildTicks(): {
        value: any;
    }[];
    getLabelForValue(value: any): any;
    getPi***REMOVED***elForValue(value: any): number;
    getPi***REMOVED***elForTick(inde***REMOVED***: any): number;
    getValueForPi***REMOVED***el(pi***REMOVED***el: any): number;
}
import Scale from "../core/core.scale.js";
