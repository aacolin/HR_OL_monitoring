/**
 * @typedef { import('./core.controller.js').default } Chart
 * @typedef {{value:number | string, label?:string, major?:boolean, $conte***REMOVED***t?:any}} Tick
 */
/**
 * Returns a subset of ticks to be plotted to avoid overlapping labels.
 * @param {import('./core.scale.js').default} scale
 * @param {Tick[]} ticks
 * @return {Tick[]}
 * @private
 */
e***REMOVED***port function autoSkip(scale: import('./core.scale.js').default, ticks: Tick[]): Tick[];
e***REMOVED***port type Chart = import('./core.controller.js').default;
e***REMOVED***port type Tick = {
    value: number | string;
    label?: string;
    major?: boolean;
    $conte***REMOVED***t?: any;
};
