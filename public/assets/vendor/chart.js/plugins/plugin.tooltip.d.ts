e***REMOVED***port class Tooltip e***REMOVED***tends Element<import("../types/basic.js").AnyObject, import("../types/basic.js").AnyObject> {
    /**
     * @namespace Chart.Tooltip.positioners
     */
    static positioners: {
        /**
           * Average mode places the tooltip at the average position of the elements shown
           */
        average(items: any): false | {
            ***REMOVED***: number;
            y: number;
        };
        /**
           * Gets the tooltip position nearest of the item nearest to the event position
           */
        nearest(items: any, eventPosition: any): false | {
            ***REMOVED***: any;
            y: any;
        };
    };
    constructor(config: any);
    opacity: number;
    _active: any[];
    _eventPosition: any;
    _size: {
        width: number;
        height: number;
    };
    _cachedAnimations: Readonly<Animations>;
    _tooltipItems: any[];
    $animations: any;
    $conte***REMOVED***t: any;
    chart: any;
    options: any;
    dataPoints: {
        chart: import("../core/core.controller.js").default;
        label: any;
        parsed: any;
        raw: any;
        formattedValue: any;
        dataset: any;
        dataInde***REMOVED***: number;
        datasetInde***REMOVED***: number;
        element: Element<import("../types/basic.js").AnyObject, import("../types/basic.js").AnyObject>;
    }[];
    title: any;
    beforeBody: any;
    body: any[];
    afterBody: any;
    footer: any;
    ***REMOVED***Align: any;
    yAlign: any;
    ***REMOVED***: any;
    y: any;
    height: number;
    width: number;
    caretX: any;
    caretY: any;
    labelColors: any[];
    labelPointStyles: any[];
    labelTe***REMOVED***tColors: any[];
    initialize(options: any): void;
    /**
       * @private
       */
    private _resolveAnimations;
    /**
       * @protected
       */
    protected getConte***REMOVED***t(): any;
    getTitle(conte***REMOVED***t: any, options: any): any;
    getBeforeBody(tooltipItems: any, options: any): any;
    getBody(tooltipItems: any, options: any): any[];
    getAfterBody(tooltipItems: any, options: any): any;
    getFooter(tooltipItems: any, options: any): any;
    /**
       * @private
       */
    private _createItems;
    update(changed: any, replay: any): void;
    drawCaret(tooltipPoint: any, ct***REMOVED***: any, size: any, options: any): void;
    getCaretPosition(tooltipPoint: any, size: any, options: any): {
        ***REMOVED***1: any;
        ***REMOVED***2: any;
        ***REMOVED***3: any;
        y1: any;
        y2: any;
        y3: any;
    };
    drawTitle(pt: any, ct***REMOVED***: any, options: any): void;
    /**
       * @private
       */
    private _drawColorBo***REMOVED***;
    drawBody(pt: any, ct***REMOVED***: any, options: any): void;
    drawFooter(pt: any, ct***REMOVED***: any, options: any): void;
    drawBackground(pt: any, ct***REMOVED***: any, tooltipSize: any, options: any): void;
    /**
       * Update ***REMOVED***/y animation targets when _active elements are animating too
       * @private
       */
    private _updateAnimationTarget;
    /**
     * Determine if the tooltip will draw anything
     * @returns {boolean} True if the tooltip will render
     */
    _willRender(): boolean;
    draw(ct***REMOVED***: any): void;
    /**
       * Get active elements in the tooltip
       * @returns {Array} Array of elements that are active in the tooltip
       */
    getActiveElements(): any[];
    /**
       * Set active elements in the tooltip
       * @param {array} activeElements Array of active datasetInde***REMOVED***/inde***REMOVED*** pairs.
       * @param {object} eventPosition Synthetic event position used in positioning
       */
    setActiveElements(activeElements: any[], eventPosition: object): void;
    _ignoreReplayEvents: boolean;
    /**
       * Handle an event
       * @param {ChartEvent} e - The event to handle
       * @param {boolean} [replay] - This is a replayed event (from update)
       * @param {boolean} [inChartArea] - The event is inside chartArea
       * @returns {boolean} true if the tooltip changed
       */
    handleEvent(e: ChartEvent, replay?: boolean, inChartArea?: boolean): boolean;
    /**
       * Helper for determining the active elements for event
       * @param {ChartEvent} e - The event to handle
       * @param {InteractionItem[]} lastActive - Previously active elements
       * @param {boolean} [replay] - This is a replayed event (from update)
       * @param {boolean} [inChartArea] - The event is inside chartArea
       * @returns {InteractionItem[]} - Active elements
       * @private
       */
    private _getActiveElements;
    /**
       * Determine if the active elements + event combination changes the
       * tooltip position
       * @param {array} active - Active elements
       * @param {ChartEvent} e - Event that triggered the position change
       * @returns {boolean} True if the position has changed
       */
    _positionChanged(active: any[], e: ChartEvent): boolean;
}
declare namespace _default {
    e***REMOVED***port const id: string;
    e***REMOVED***port { Tooltip as _element };
    e***REMOVED***port { positioners };
    e***REMOVED***port function afterInit(chart: any, _args: any, options: any): void;
    e***REMOVED***port function beforeUpdate(chart: any, _args: any, options: any): void;
    e***REMOVED***port function reset(chart: any, _args: any, options: any): void;
    e***REMOVED***port function afterDraw(chart: any): void;
    e***REMOVED***port function afterEvent(chart: any, args: any): void;
    e***REMOVED***port namespace defaults {
        e***REMOVED***port const enabled: boolean;
        e***REMOVED***port const e***REMOVED***ternal: any;
        e***REMOVED***port const position: string;
        e***REMOVED***port const backgroundColor: string;
        e***REMOVED***port const titleColor: string;
        e***REMOVED***port namespace titleFont {
            const weight: string;
        }
        e***REMOVED***port const titleSpacing: number;
        e***REMOVED***port const titleMarginBottom: number;
        e***REMOVED***port const titleAlign: string;
        e***REMOVED***port const bodyColor: string;
        e***REMOVED***port const bodySpacing: number;
        e***REMOVED***port const bodyFont: {};
        e***REMOVED***port const bodyAlign: string;
        e***REMOVED***port const footerColor: string;
        e***REMOVED***port const footerSpacing: number;
        e***REMOVED***port const footerMarginTop: number;
        e***REMOVED***port namespace footerFont {
            const weight_1: string;
            e***REMOVED***port { weight_1 as weight };
        }
        e***REMOVED***port const footerAlign: string;
        e***REMOVED***port const padding: number;
        e***REMOVED***port const caretPadding: number;
        e***REMOVED***port const caretSize: number;
        e***REMOVED***port const cornerRadius: number;
        e***REMOVED***port function bo***REMOVED***Height(ct***REMOVED***: any, opts: any): any;
        e***REMOVED***port function bo***REMOVED***Width(ct***REMOVED***: any, opts: any): any;
        e***REMOVED***port const multiKeyBackground: string;
        e***REMOVED***port const displayColors: boolean;
        e***REMOVED***port const bo***REMOVED***Padding: number;
        e***REMOVED***port const borderColor: string;
        e***REMOVED***port const borderWidth: number;
        e***REMOVED***port namespace animation {
            const duration: number;
            const easing: string;
        }
        e***REMOVED***port namespace animations {
            namespace numbers {
                const type: string;
                const properties: string[];
            }
            namespace opacity {
                const easing_1: string;
                e***REMOVED***port { easing_1 as easing };
                const duration_1: number;
                e***REMOVED***port { duration_1 as duration };
            }
        }
        e***REMOVED***port { defaultCallbacks as callbacks };
    }
    e***REMOVED***port namespace defaultRoutes {
        const bodyFont_1: string;
        e***REMOVED***port { bodyFont_1 as bodyFont };
        const footerFont_1: string;
        e***REMOVED***port { footerFont_1 as footerFont };
        const titleFont_1: string;
        e***REMOVED***port { titleFont_1 as titleFont };
    }
    e***REMOVED***port namespace descriptors {
        e***REMOVED***port function _scriptable(name: any): boolean;
        e***REMOVED***port const _inde***REMOVED***able: boolean;
        e***REMOVED***port namespace callbacks {
            const _scriptable_1: boolean;
            e***REMOVED***port { _scriptable_1 as _scriptable };
            const _inde***REMOVED***able_1: boolean;
            e***REMOVED***port { _inde***REMOVED***able_1 as _inde***REMOVED***able };
        }
        e***REMOVED***port namespace animation_1 {
            const _fallback: boolean;
        }
        e***REMOVED***port { animation_1 as animation };
        e***REMOVED***port namespace animations_1 {
            const _fallback_1: string;
            e***REMOVED***port { _fallback_1 as _fallback };
        }
        e***REMOVED***port { animations_1 as animations };
    }
    e***REMOVED***port const additionalOptionScopes: string[];
}
e***REMOVED***port default _default;
e***REMOVED***port type Chart = import('../platform/platform.base.js').Chart;
e***REMOVED***port type ChartEvent = import('../types/inde***REMOVED***.js').ChartEvent;
e***REMOVED***port type ActiveElement = import('../types/inde***REMOVED***.js').ActiveElement;
e***REMOVED***port type InteractionItem = import('../core/core.interaction.js').InteractionItem;
import Element from "../core/core.element.js";
import Animations from "../core/core.animations.js";
declare namespace positioners {
    /**
       * Average mode places the tooltip at the average position of the elements shown
       */
    function average(items: any): false | {
        ***REMOVED***: number;
        y: number;
    };
    /**
       * Gets the tooltip position nearest of the item nearest to the event position
       */
    function nearest(items: any, eventPosition: any): false | {
        ***REMOVED***: any;
        y: any;
    };
}
declare namespace defaultCallbacks {
    e***REMOVED***port { noop as beforeTitle };
    e***REMOVED***port function title(tooltipItems: any): any;
    e***REMOVED***port { noop as afterTitle };
    e***REMOVED***port { noop as beforeBody };
    e***REMOVED***port { noop as beforeLabel };
    e***REMOVED***port function label(tooltipItem: any): any;
    e***REMOVED***port function labelColor(tooltipItem: any): {
        borderColor: any;
        backgroundColor: any;
        borderWidth: any;
        borderDash: any;
        borderDashOffset: any;
        borderRadius: number;
    };
    e***REMOVED***port function labelTe***REMOVED***tColor(): any;
    e***REMOVED***port function labelPointStyle(tooltipItem: any): {
        pointStyle: any;
        rotation: any;
    };
    e***REMOVED***port { noop as afterLabel };
    e***REMOVED***port { noop as afterBody };
    e***REMOVED***port { noop as beforeFooter };
    e***REMOVED***port { noop as footer };
    e***REMOVED***port { noop as afterFooter };
}
import { noop } from "../helpers/helpers.core.js";
