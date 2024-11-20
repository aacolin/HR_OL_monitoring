e***REMOVED***port default class LinearScaleBase e***REMOVED***tends Scale {
    /** @type {number} */
    start: number;
    /** @type {number} */
    end: number;
    /** @type {number} */
    _startValue: number;
    /** @type {number} */
    _endValue: number;
    _valueRange: number;
    parse(raw: any, inde***REMOVED***: any): number;
    handleTickRangeOptions(): void;
    getTickLimit(): number;
    /**
       * @protected
       */
    protected computeTickLimit(): number;
    getLabelForValue(value: any): string;
}
import Scale from "../core/core.scale.js";
