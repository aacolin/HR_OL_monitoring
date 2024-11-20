e***REMOVED***port default class BubbleController e***REMOVED***tends DatasetController {
    static id: string;
    /**
     * @type {any}
     */
    static overrides: any;
    /**
       * Parse array of primitive values
       * @protected
       */
    protected parsePrimitiveData(meta: any, data: any, start: any, count: any): any;
    /**
       * Parse array of arrays
       * @protected
       */
    protected parseArrayData(meta: any, data: any, start: any, count: any): any;
    /**
       * Parse array of objects
       * @protected
       */
    protected parseObjectData(meta: any, data: any, start: any, count: any): any;
    /**
       * @protected
       */
    protected getMa***REMOVED***Overflow(): number;
    /**
       * @protected
       */
    protected getLabelAndValue(inde***REMOVED***: any): {
        label: any;
        value: string;
    };
    update(mode: any): void;
}
import DatasetController from "../core/core.datasetController.js";
