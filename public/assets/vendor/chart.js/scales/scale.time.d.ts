e***REMOVED***port default class TimeScale e***REMOVED***tends Scale {
    static id: string;
    /**
     * @type {any}
     */
    static defaults: any;
    /**
       * @param {object} props
       */
    constructor(props: object);
    /** @type {{data: number[], labels: number[], all: number[]}} */
    _cache: {
        data: number[];
        labels: number[];
        all: number[];
    };
    /** @type {Unit} */
    _unit: Unit;
    /** @type {Unit=} */
    _majorUnit: Unit | undefined;
    _offsets: {};
    _normalized: boolean;
    _parseOpts: {
        parser: any;
        round: any;
        isoWeekday: any;
    };
    init(scaleOpts: any, opts?: {}): void;
    _adapter: DateAdapter;
    /**
       * @param {*} raw
       * @param {number?} [inde***REMOVED***]
       * @return {number}
       */
    parse(raw: any, inde***REMOVED***?: number | null): number;
    /**
       * @private
       */
    private _getLabelBounds;
    /**
       * Returns the start and end offsets from edges in the form of {start, end}
       * where each value is a relative width to the scale and ranges between 0 and 1.
       * They add e***REMOVED***tra margins on the both sides by scaling down the original scale.
       * Offsets are added when the `offset` option is true.
       * @param {number[]} timestamps
       * @protected
       */
    protected initOffsets(timestamps?: number[]): void;
    /**
       * Generates a ma***REMOVED***imum of `capacity` timestamps between min and ma***REMOVED***, rounded to the
       * `minor` unit using the given scale time `options`.
       * Important: this method can return ticks outside the min and ma***REMOVED*** range, it's the
       * responsibility of the calling code to clamp values if needed.
       * @protected
       */
    protected _generate(): number[];
    /**
       * @param {number} value
       * @return {string}
       */
    getLabelForValue(value: number): string;
    /**
       * @param {number} value
       * @param {string|undefined} format
       * @return {string}
       */
    format(value: number, format: string | undefined): string;
    /**
       * Function to format an individual tick mark
       * @param {number} time
       * @param {number} inde***REMOVED***
       * @param {object[]} ticks
       * @param {string|undefined} [format]
       * @return {string}
       * @private
       */
    private _tickFormatFunction;
    /**
       * @param {object[]} ticks
       */
    generateTickLabels(ticks: object[]): void;
    /**
       * @param {number} value - Milliseconds since epoch (1 January 1970 00:00:00 UTC)
       * @return {number}
       */
    getDecimalForValue(value: number): number;
    /**
       * @param {number} value - Milliseconds since epoch (1 January 1970 00:00:00 UTC)
       * @return {number}
       */
    getPi***REMOVED***elForValue(value: number): number;
    /**
       * @param {number} pi***REMOVED***el
       * @return {number}
       */
    getValueForPi***REMOVED***el(pi***REMOVED***el: number): number;
    /**
       * @param {string} label
       * @return {{w:number, h:number}}
       * @private
       */
    private _getLabelSize;
    /**
       * @param {number} e***REMOVED***ampleTime
       * @return {number}
       * @private
       */
    private _getLabelCapacity;
    /**
       * @protected
       */
    protected getDataTimestamps(): any;
    /**
       * @protected
       */
    protected getLabelTimestamps(): number[];
    /**
       * @param {number[]} values
       * @protected
       */
    protected normalize(values: number[]): number[];
}
e***REMOVED***port type Unit = import('../core/core.adapters.js').TimeUnit;
e***REMOVED***port type Interval = {
    common: boolean;
    size: number;
    steps?: number;
};
e***REMOVED***port type DateAdapter = import('../core/core.adapters.js').DateAdapter;
import Scale from "../core/core.scale.js";
