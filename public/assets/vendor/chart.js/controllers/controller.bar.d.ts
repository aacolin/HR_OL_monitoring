e***REMOVED***port default class BarController e***REMOVED***tends DatasetController {
    static id: string;
    /**
     * @type {any}
     */
    static overrides: any;
    /**
       * Overriding primitive data parsing since we support mi***REMOVED***ed primitive/array
       * data for float bars
       * @protected
       */
    protected parsePrimitiveData(meta: any, data: any, start: any, count: any): any[];
    /**
       * Overriding array data parsing since we support mi***REMOVED***ed primitive/array
       * data for float bars
       * @protected
       */
    protected parseArrayData(meta: any, data: any, start: any, count: any): any[];
    /**
       * Overriding object data parsing since we support mi***REMOVED***ed primitive/array
       * value-scale data for float bars
       * @protected
       */
    protected parseObjectData(meta: any, data: any, start: any, count: any): any[];
    update(mode: any): void;
    /**
       * Returns the stacks based on groups and bar visibility.
       * @param {number} [last] - The dataset inde***REMOVED***
       * @param {number} [dataInde***REMOVED***] - The data inde***REMOVED*** of the ruler
       * @returns {string[]} The list of stack IDs
       * @private
       */
    private _getStacks;
    /**
       * Returns the effective number of stacks based on groups and bar visibility.
       * @private
       */
    private _getStackCount;
    /**
       * Returns the stack inde***REMOVED*** for the given dataset based on groups and bar visibility.
       * @param {number} [datasetInde***REMOVED***] - The dataset inde***REMOVED***
       * @param {string} [name] - The stack name to find
     * @param {number} [dataInde***REMOVED***]
       * @returns {number} The stack inde***REMOVED***
       * @private
       */
    private _getStackInde***REMOVED***;
    /**
       * @private
       */
    private _getRuler;
    /**
       * Note: pi***REMOVED***el values are not clamped to the scale area.
       * @private
       */
    private _calculateBarValuePi***REMOVED***els;
    /**
       * @private
       */
    private _calculateBarInde***REMOVED***Pi***REMOVED***els;
}
import DatasetController from "../core/core.datasetController.js";
