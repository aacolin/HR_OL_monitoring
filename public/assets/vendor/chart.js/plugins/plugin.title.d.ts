e***REMOVED***port class Title e***REMOVED***tends Element<import("../types/basic.js").AnyObject, import("../types/basic.js").AnyObject> {
    /**
       * @param {{ ct***REMOVED***: any; options: any; chart: any; }} config
       */
    constructor(config: {
        ct***REMOVED***: any;
        options: any;
        chart: any;
    });
    chart: any;
    options: any;
    ct***REMOVED***: any;
    _padding: import("../types.js").ChartArea;
    top: number;
    bottom: any;
    left: number;
    right: any;
    width: any;
    height: any;
    position: any;
    weight: any;
    fullSize: any;
    update(ma***REMOVED***Width: any, ma***REMOVED***Height: any): void;
    isHorizontal(): boolean;
    _drawArgs(offset: any): {
        titleX: any;
        titleY: any;
        ma***REMOVED***Width: number;
        rotation: number;
    };
    draw(): void;
}
declare namespace _default {
    e***REMOVED***port const id: string;
    e***REMOVED***port { Title as _element };
    e***REMOVED***port function start(chart: any, _args: any, options: any): void;
    e***REMOVED***port function stop(chart: any): void;
    e***REMOVED***port function beforeUpdate(chart: any, _args: any, options: any): void;
    e***REMOVED***port namespace defaults {
        e***REMOVED***port const align: string;
        e***REMOVED***port const display: boolean;
        e***REMOVED***port namespace font {
            const weight: string;
        }
        e***REMOVED***port const fullSize: boolean;
        e***REMOVED***port const padding: number;
        e***REMOVED***port const position: string;
        e***REMOVED***port const te***REMOVED***t: string;
        const weight_1: number;
        e***REMOVED***port { weight_1 as weight };
    }
    e***REMOVED***port namespace defaultRoutes {
        const color: string;
    }
    e***REMOVED***port namespace descriptors {
        const _scriptable: boolean;
        const _inde***REMOVED***able: boolean;
    }
}
e***REMOVED***port default _default;
import Element from "../core/core.element.js";
