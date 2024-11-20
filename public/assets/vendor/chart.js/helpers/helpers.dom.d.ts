import type Chart from '../core/core.controller.js';
import type { ChartEvent } from '../types.js';
/**
 * Note: typedefs are auto-e***REMOVED***ported, so use a made-up `dom` namespace where
 * necessary to avoid duplicates with `e***REMOVED***port * from './helpers`; see
 * https://github.com/microsoft/TypeScript/issues/46011
 * @typedef { import('../core/core.controller.js').default } dom.Chart
 * @typedef { import('../../types').ChartEvent } ChartEvent
 */
/**
 * @private
 */
e***REMOVED***port declare function _isDomSupported(): boolean;
/**
 * @private
 */
e***REMOVED***port declare function _getParentNode(domNode: HTMLCanvasElement): HTMLCanvasElement;
e***REMOVED***port declare function getStyle(el: HTMLElement, property: string): string;
/**
 * Gets an event's ***REMOVED***, y coordinates, relative to the chart area
 * @param event
 * @param chart
 * @returns ***REMOVED*** and y coordinates of the event
 */
e***REMOVED***port declare function getRelativePosition(event: Event | ChartEvent | TouchEvent | MouseEvent, chart: Chart): {
    ***REMOVED***: number;
    y: number;
};
e***REMOVED***port declare function getMa***REMOVED***imumSize(canvas: HTMLCanvasElement, bbWidth?: number, bbHeight?: number, aspectRatio?: number): {
    width: number;
    height: number;
};
/**
 * @param chart
 * @param forceRatio
 * @param forceStyle
 * @returns True if the canvas conte***REMOVED***t size or transformation has changed.
 */
e***REMOVED***port declare function retinaScale(chart: Chart, forceRatio: number, forceStyle?: boolean): boolean | void;
/**
 * Detects support for options object argument in addEventListener.
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support
 * @private
 */
e***REMOVED***port declare const supportsEventListenerOptions: boolean;
/**
 * The "used" size is the final value of a dimension property after all calculations have
 * been performed. This method uses the computed style of `element` but returns undefined
 * if the computed style is not e***REMOVED***pressed in pi***REMOVED***els. That can happen in some cases where
 * `element` has a size relative to its parent and this last one is not yet displayed,
 * for e***REMOVED***ample because of `display: none` on a parent node.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/used_value
 * @returns Size in pi***REMOVED***els or undefined if unknown.
 */
e***REMOVED***port declare function readUsedSize(element: HTMLElement, property: 'width' | 'height'): number | undefined;
