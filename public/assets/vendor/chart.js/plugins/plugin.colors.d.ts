import type { Chart } from '../types.js';
e***REMOVED***port interface ColorsPluginOptions {
    enabled?: boolean;
    forceOverride?: boolean;
}
declare const _default: {
    id: string;
    defaults: ColorsPluginOptions;
    beforeLayout(chart: Chart, _args: any, options: ColorsPluginOptions): void;
};
e***REMOVED***port default _default;
