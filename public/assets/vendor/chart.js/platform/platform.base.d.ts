/**
 * @typedef { import('../core/core.controller.js').default } Chart
 */
/**
 * Abstract class that allows abstracting platform dependencies away from the chart.
 */
e***REMOVED***port default class BasePlatform {
    /**
       * Called at chart construction time, returns a conte***REMOVED***t2d instance implementing
       * the [W3C Canvas 2D Conte***REMOVED***t API standard]{@link https://www.w3.org/TR/2dconte***REMOVED***t/}.
       * @param {HTMLCanvasElement} canvas - The canvas from which to acquire conte***REMOVED***t (platform specific)
       * @param {number} [aspectRatio] - The chart options
       */
    acquireConte***REMOVED***t(canvas: HTMLCanvasElement, aspectRatio?: number): void;
    /**
       * Called at chart destruction time, releases any resources associated to the conte***REMOVED***t
       * previously returned by the acquireConte***REMOVED***t() method.
       * @param {CanvasRenderingConte***REMOVED***t2D} conte***REMOVED***t - The conte***REMOVED***t2d instance
       * @returns {boolean} true if the method succeeded, else false
       */
    releaseConte***REMOVED***t(conte***REMOVED***t: CanvasRenderingConte***REMOVED***t2D): boolean;
    /**
       * Registers the specified listener on the given chart.
       * @param {Chart} chart - Chart from which to listen for event
       * @param {string} type - The ({@link ChartEvent}) type to listen for
       * @param {function} listener - Receives a notification (an object that implements
       * the {@link ChartEvent} interface) when an event of the specified type occurs.
       */
    addEventListener(chart: Chart, type: string, listener: Function): void;
    /**
       * Removes the specified listener previously registered with addEventListener.
       * @param {Chart} chart - Chart from which to remove the listener
       * @param {string} type - The ({@link ChartEvent}) type to remove
       * @param {function} listener - The listener function to remove from the event target.
       */
    removeEventListener(chart: Chart, type: string, listener: Function): void;
    /**
       * @returns {number} the current devicePi***REMOVED***elRatio of the device this platform is connected to.
       */
    getDevicePi***REMOVED***elRatio(): number;
    /**
       * Returns the ma***REMOVED***imum size in pi***REMOVED***els of given canvas element.
       * @param {HTMLCanvasElement} element
       * @param {number} [width] - content width of parent element
       * @param {number} [height] - content height of parent element
       * @param {number} [aspectRatio] - aspect ratio to maintain
       */
    getMa***REMOVED***imumSize(element: HTMLCanvasElement, width?: number, height?: number, aspectRatio?: number): {
        width: number;
        height: number;
    };
    /**
       * @param {HTMLCanvasElement} canvas
       * @returns {boolean} true if the canvas is attached to the platform, false if not.
       */
    isAttached(canvas: HTMLCanvasElement): boolean;
    /**
     * Updates config with platform specific requirements
     * @param {import('../core/core.config.js').default} config
     */
    updateConfig(config: import('../core/core.config.js').default): void;
}
e***REMOVED***port type Chart = import('../core/core.controller.js').default;
