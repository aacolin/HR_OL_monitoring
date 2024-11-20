declare namespace _default {
    e***REMOVED***port { formatters };
}
e***REMOVED***port default _default;
declare namespace formatters {
    /**
     * Formatter for value labels
     * @method Chart.Ticks.formatters.values
     * @param value the value to display
     * @return {string|string[]} the label to display
     */
    function values(value: any): string | string[];
    /**
     * Formatter for numeric ticks
     * @method Chart.Ticks.formatters.numeric
     * @param tickValue {number} the value to be formatted
     * @param inde***REMOVED*** {number} the position of the tickValue parameter in the ticks array
     * @param ticks {object[]} the list of ticks being converted
     * @return {string} string representation of the tickValue parameter
     */
    function numeric(tickValue: number, inde***REMOVED***: number, ticks: any[]): string;
    /**
     * Formatter for logarithmic ticks
     * @method Chart.Ticks.formatters.logarithmic
     * @param tickValue {number} the value to be formatted
     * @param inde***REMOVED*** {number} the position of the tickValue parameter in the ticks array
     * @param ticks {object[]} the list of ticks being converted
     * @return {string} string representation of the tickValue parameter
     */
    function logarithmic(tickValue: number, inde***REMOVED***: number, ticks: any[]): string;
}
