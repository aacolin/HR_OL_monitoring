e***REMOVED***port class Legend e***REMOVED***tends Element<import("../types/basic.js").AnyObject, import("../types/basic.js").AnyObject> {
    /**
       * @param {{ ct***REMOVED***: any; options: any; chart: any; }} config
       */
    constructor(config: {
        ct***REMOVED***: any;
        options: any;
        chart: any;
    });
    _added: boolean;
    legendHitBo***REMOVED***es: any[];
    /**
         * @private
         */
    private _hoveredItem;
    doughnutMode: boolean;
    chart: any;
    options: any;
    ct***REMOVED***: any;
    legendItems: any;
    columnSizes: any[];
    lineWidths: number[];
    ma***REMOVED***Height: any;
    ma***REMOVED***Width: any;
    top: any;
    bottom: any;
    left: any;
    right: any;
    height: any;
    width: any;
    _margins: any;
    position: any;
    weight: any;
    fullSize: any;
    update(ma***REMOVED***Width: any, ma***REMOVED***Height: any, margins: any): void;
    setDimensions(): void;
    buildLabels(): void;
    fit(): void;
    /**
       * @private
       */
    private _fitRows;
    _fitCols(titleHeight: any, labelFont: any, bo***REMOVED***Width: any, _itemHeight: any): any;
    adjustHitBo***REMOVED***es(): void;
    isHorizontal(): boolean;
    draw(): void;
    /**
       * @private
       */
    private _draw;
    /**
       * @protected
       */
    protected drawTitle(): void;
    /**
       * @private
       */
    private _computeTitleHeight;
    /**
       * @private
       */
    private _getLegendItemAt;
    /**
       * Handle an event
       * @param {ChartEvent} e - The event to handle
       */
    handleEvent(e: ChartEvent): void;
}
declare namespace _default {
    e***REMOVED***port const id: string;
    e***REMOVED***port { Legend as _element };
    e***REMOVED***port function start(chart: any, _args: any, options: any): void;
    e***REMOVED***port function stop(chart: any): void;
    e***REMOVED***port function beforeUpdate(chart: any, _args: any, options: any): void;
    e***REMOVED***port function afterUpdate(chart: any): void;
    e***REMOVED***port function afterEvent(chart: any, args: any): void;
    e***REMOVED***port namespace defaults {
        const display: boolean;
        const position: string;
        const align: string;
        const fullSize: boolean;
        const reverse: boolean;
        const weight: number;
        function onClick(e: any, legendItem: any, legend: any): void;
        const onHover: any;
        const onLeave: any;
        namespace labels {
            function color(ct***REMOVED***: any): any;
            const bo***REMOVED***Width: number;
            const padding: number;
            function generateLabels(chart: any): any;
        }
        namespace title {
            e***REMOVED***port function color_1(ct***REMOVED***: any): any;
            e***REMOVED***port { color_1 as color };
            const display_1: boolean;
            e***REMOVED***port { display_1 as display };
            const position_1: string;
            e***REMOVED***port { position_1 as position };
            e***REMOVED***port const te***REMOVED***t: string;
        }
    }
    e***REMOVED***port namespace descriptors {
        e***REMOVED***port function _scriptable(name: any): boolean;
        e***REMOVED***port namespace labels_1 {
            e***REMOVED***port function _scriptable_1(name: any): boolean;
            e***REMOVED***port { _scriptable_1 as _scriptable };
        }
        e***REMOVED***port { labels_1 as labels };
    }
}
e***REMOVED***port default _default;
e***REMOVED***port type ChartEvent = import('../types/inde***REMOVED***.js').ChartEvent;
import Element from "../core/core.element.js";
