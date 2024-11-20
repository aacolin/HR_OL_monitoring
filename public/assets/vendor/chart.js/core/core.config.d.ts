e***REMOVED***port function getInde***REMOVED***A***REMOVED***is(type: any, options: any): any;
e***REMOVED***port function determineA***REMOVED***is(id: any, ...scaleOptions: any[]): any;
e***REMOVED***port default class Config {
    constructor(config: any);
    _config: any;
    _scopeCache: Map<any, any>;
    _resolverCache: Map<any, any>;
    get platform(): any;
    set type(arg: any);
    get type(): any;
    set data(arg: any);
    get data(): any;
    set options(arg: any);
    get options(): any;
    get plugins(): any;
    update(): void;
    clearCache(): void;
    /**
     * Returns the option scope keys for resolving dataset options.
     * These keys do not include the dataset itself, because it is not under options.
     * @param {string} datasetType
     * @return {string[][]}
     */
    datasetScopeKeys(datasetType: string): string[][];
    /**
     * Returns the option scope keys for resolving dataset animation options.
     * These keys do not include the dataset itself, because it is not under options.
     * @param {string} datasetType
     * @param {string} transition
     * @return {string[][]}
     */
    datasetAnimationScopeKeys(datasetType: string, transition: string): string[][];
    /**
     * Returns the options scope keys for resolving element options that belong
     * to an dataset. These keys do not include the dataset itself, because it
     * is not under options.
     * @param {string} datasetType
     * @param {string} elementType
     * @return {string[][]}
     */
    datasetElementScopeKeys(datasetType: string, elementType: string): string[][];
    /**
     * Returns the options scope keys for resolving plugin options.
     * @param {{id: string, additionalOptionScopes?: string[]}} plugin
     * @return {string[][]}
     */
    pluginScopeKeys(plugin: {
        id: string;
        additionalOptionScopes?: string[];
    }): string[][];
    /**
     * @private
     */
    private _cachedScopes;
    /**
     * Resolves the objects from options and defaults for option value resolution.
     * @param {object} mainScope - The main scope object for options
     * @param {string[][]} keyLists - The arrays of keys in resolution order
     * @param {boolean} [resetCache] - reset the cache for this mainScope
     */
    getOptionScopes(mainScope: object, keyLists: string[][], resetCache?: boolean): any;
    /**
     * Returns the option scopes for resolving chart options
     * @return {object[]}
     */
    chartOptionScopes(): object[];
    /**
     * @param {object[]} scopes
     * @param {string[]} names
     * @param {function|object} conte***REMOVED***t
     * @param {string[]} [prefi***REMOVED***es]
     * @return {object}
     */
    resolveNamedOptions(scopes: object[], names: string[], conte***REMOVED***t: Function | object, prefi***REMOVED***es?: string[]): object;
    /**
     * @param {object[]} scopes
     * @param {object} [conte***REMOVED***t]
     * @param {string[]} [prefi***REMOVED***es]
     * @param {{scriptable: boolean, inde***REMOVED***able: boolean, allKeys?: boolean}} [descriptorDefaults]
     */
    createResolver(scopes: object[], conte***REMOVED***t?: object, prefi***REMOVED***es?: string[], descriptorDefaults?: {
        scriptable: boolean;
        inde***REMOVED***able: boolean;
        allKeys?: boolean;
    }): any;
}
