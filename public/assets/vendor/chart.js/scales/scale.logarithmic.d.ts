e***REMOVED***port default class LogarithmicScale e***REMOVED***tends Scale {
    static id: string;
    /**
     * @type {any}
     */
    static defaults: any;
    /** @type {number} */
    start: number;
    /** @type {number} */
    end: number;
    /** @type {number} */
    _startValue: number;
    _valueRange: number;
    parse(raw: any, inde***REMOVED***: any): number;
    _zero: boolean;
    handleTickRangeOptions(): void;
    /**
       * @param {number} value
       * @return {string}
       */
    getLabelForValue(value: number): string;
    getPi***REMOVED***elForValue(value: any): number;
    getValueForPi***REMOVED***el(pi***REMOVED***el: any): number;
}
import Scale from "../core/core.scale.js";
