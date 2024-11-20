/**
 * @typedef {{id: string, defaults: any, overrides?: any, defaultRoutes: any}} IChartComponent
 */
e***REMOVED***port default class TypedRegistry {
    constructor(type: any, scope: any, override: any);
    type: any;
    scope: any;
    override: any;
    items: any;
    isForType(type: any): boolean;
    /**
       * @param {IChartComponent} item
       * @returns {string} The scope where items defaults were registered to.
       */
    register(item: IChartComponent): string;
    /**
       * @param {string} id
       * @returns {object?}
       */
    get(id: string): object | null;
    /**
       * @param {IChartComponent} item
       */
    unregister(item: IChartComponent): void;
}
e***REMOVED***port type IChartComponent = {
    id: string;
    defaults: any;
    overrides?: any;
    defaultRoutes: any;
};
import defaults from "./core.defaults.js";
import { overrides } from "./core.defaults.js";
