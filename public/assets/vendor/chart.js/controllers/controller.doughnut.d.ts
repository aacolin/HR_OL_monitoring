e***REMOVED***port default class DoughnutController e***REMOVED***tends DatasetController {
    static id: string;
    static descriptors: {
        _scriptable: (name: any) => boolean;
        _inde***REMOVED***able: (name: any) => boolean;
    };
    /**
     * @type {any}
     */
    static overrides: any;
    constructor(chart: any, datasetInde***REMOVED***: any);
    innerRadius: number;
    outerRadius: number;
    offsetX: number;
    offsetY: number;
    /**
       * Override data parsing, since we are not using scales
       */
    parse(start: any, count: any): void;
    /**
       * @private
       */
    private _getRotation;
    /**
       * @private
       */
    private _getCircumference;
    /**
       * Get the ma***REMOVED***imal rotation & circumference e***REMOVED***tents
       * across all visible datasets.
       */
    _getRotationE***REMOVED***tents(): {
        rotation: number;
        circumference: number;
    };
    /**
     * @private
     */
    private _circumference;
    calculateTotal(): number;
    calculateCircumference(value: any): number;
    getLabelAndValue(inde***REMOVED***: any): {
        label: any;
        value: string;
    };
    getMa***REMOVED***BorderWidth(arcs: any): number;
    getMa***REMOVED***Offset(arcs: any): number;
    /**
       * Get radius length offset of the dataset in relation to the visible datasets weights. This allows determining the inner and outer radius correctly
       * @private
       */
    private _getRingWeightOffset;
    /**
       * @private
       */
    private _getRingWeight;
    /**
       * Returns the sum of all visible data set weights.
       * @private
       */
    private _getVisibleDatasetWeightTotal;
}
e***REMOVED***port type Chart = import('../core/core.controller.js').default;
import DatasetController from "../core/core.datasetController.js";
