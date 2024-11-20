/**
 * Platform class for charts that can access the DOM and global window/document properties
 * @e***REMOVED***tends BasePlatform
 */
e***REMOVED***port default class DomPlatform e***REMOVED***tends BasePlatform {
    /**
       * @param {HTMLCanvasElement} canvas
       * @param {number} [aspectRatio]
       * @return {CanvasRenderingConte***REMOVED***t2D|null}
       */
    acquireConte***REMOVED***t(canvas: HTMLCanvasElement, aspectRatio?: number): CanvasRenderingConte***REMOVED***t2D | null;
    /**
       * @param {Chart} chart
       * @param {string} type
       */
    removeEventListener(chart: Chart, type: string): void;
}
e***REMOVED***port type Chart = import('../core/core.controller.js').default;
import BasePlatform from "./platform.base.js";
