e***REMOVED***port default class PolarAreaController e***REMOVED***tends DatasetController {
    static id: string;
    /**
     * @type {any}
     */
    static overrides: any;
    constructor(chart: any, datasetInde***REMOVED***: any);
    innerRadius: number;
    outerRadius: number;
    getLabelAndValue(inde***REMOVED***: any): {
        label: any;
        value: string;
    };
    parseObjectData(meta: any, data: any, start: any, count: any): {
        r: unknown;
    }[];
    update(mode: any): void;
    /**
     * @protected
     */
    protected getMinMa***REMOVED***(): {
        min: number;
        ma***REMOVED***: number;
    };
    /**
       * @private
       */
    private _updateRadius;
    countVisibleElements(): number;
    /**
       * @private
       */
    private _computeAngle;
}
import DatasetController from "../core/core.datasetController.js";
