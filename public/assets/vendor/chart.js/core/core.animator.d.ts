/**
 * @typedef { import('./core.animation.js').default } Animation
 * @typedef { import('./core.controller.js').default } Chart
 */
/**
 * Please use the module's default e***REMOVED***port which provides a singleton instance
 * Note: class is e***REMOVED***port for typedoc
 */
e***REMOVED***port class Animator {
    _request: any;
    _charts: Map<any, any>;
    _running: boolean;
    _lastDate: number;
    /**
       * @private
       */
    private _notify;
    /**
       * @private
       */
    private _refresh;
    /**
       * @private
       */
    private _update;
    /**
       * @private
       */
    private _getAnims;
    /**
       * @param {Chart} chart
       * @param {string} event - event name
       * @param {Function} cb - callback
       */
    listen(chart: Chart, event: string, cb: Function): void;
    /**
       * Add animations
       * @param {Chart} chart
       * @param {Animation[]} items - animations
       */
    add(chart: Chart, items: Animation[]): void;
    /**
       * Counts number of active animations for the chart
       * @param {Chart} chart
       */
    has(chart: Chart): boolean;
    /**
       * Start animating (all charts)
       * @param {Chart} chart
       */
    start(chart: Chart): void;
    running(chart: any): boolean;
    /**
       * Stop all animations for the chart
       * @param {Chart} chart
       */
    stop(chart: Chart): void;
    /**
       * Remove chart from Animator
       * @param {Chart} chart
       */
    remove(chart: Chart): boolean;
}
declare const _default: Animator;
e***REMOVED***port default _default;
e***REMOVED***port type Animation = import('./core.animation.js').default;
e***REMOVED***port type Chart = import('./core.controller.js').default;
