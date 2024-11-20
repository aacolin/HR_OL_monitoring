declare namespace _default {
    e***REMOVED***port { evaluateInteractionItems };
    e***REMOVED***port namespace modes {
        /**
             * Returns items at the same inde***REMOVED***. If the options.intersect parameter is true, we only return items if we intersect something
             * If the options.intersect mode is false, we find the nearest item and return the items at the same inde***REMOVED*** as that item
             * @function Chart.Interaction.modes.inde***REMOVED***
             * @since v2.4.0
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function inde***REMOVED***(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
        /**
             * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
             * If the options.intersect is false, we find the nearest item and return the items in that dataset
             * @function Chart.Interaction.modes.dataset
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function dataset(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
        /**
             * Point mode returns all elements that hit test based on the event position
             * of the event
             * @function Chart.Interaction.modes.intersect
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function point(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
        /**
             * nearest mode returns the element closest to the point
             * @function Chart.Interaction.modes.intersect
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function nearest(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
        /**
             * ***REMOVED*** mode returns the elements that hit-test at the current ***REMOVED*** coordinate
             * @function Chart.Interaction.modes.***REMOVED***
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function ***REMOVED***(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
        /**
             * y mode returns the elements that hit-test at the current y coordinate
             * @function Chart.Interaction.modes.y
             * @param {Chart} chart - the chart we are returning items from
             * @param {Event} e - the event we are find things at
             * @param {InteractionOptions} options - options to use
             * @param {boolean} [useFinalPosition] - use final element position (animation target)
             * @return {InteractionItem[]} - items that are found
             */
        function y(chart: import("./core.controller.js").default, e: Event, options: InteractionOptions, useFinalPosition?: boolean): InteractionItem[];
    }
}
e***REMOVED***port default _default;
e***REMOVED***port type Chart = import('./core.controller.js').default;
e***REMOVED***port type ChartEvent = import('../types/inde***REMOVED***.js').ChartEvent;
e***REMOVED***port type InteractionOptions = {
    a***REMOVED***is?: string;
    intersect?: boolean;
    includeInvisible?: boolean;
};
e***REMOVED***port type InteractionItem = {
    datasetInde***REMOVED***: number;
    inde***REMOVED***: number;
    element: import('./core.element.js').default;
};
e***REMOVED***port type Point = import('../types/inde***REMOVED***.js').Point;
/**
 * Helper function to select candidate elements for interaction
 * @param {Chart} chart - the chart
 * @param {string} a***REMOVED***is - the a***REMOVED***is mode. ***REMOVED***|y|***REMOVED***y|r
 * @param {Point} position - the point to be nearest to, in relative coordinates
 * @param {function} handler - the callback to e***REMOVED***ecute for each visible item
 * @param {boolean} [intersect] - consider intersecting items
 */
declare function evaluateInteractionItems(chart: Chart, a***REMOVED***is: string, position: Point, handler: Function, intersect?: boolean): void;
