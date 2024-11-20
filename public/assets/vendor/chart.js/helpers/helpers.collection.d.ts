/**
 * Binary search
 * @param table - the table search. must be sorted!
 * @param value - value to find
 * @param cmp
 * @private
 */
e***REMOVED***port declare function _lookup(table: number[], value: number, cmp?: (value: number) => boolean): {
    lo: number;
    hi: number;
};
e***REMOVED***port declare function _lookup<T>(table: T[], value: number, cmp: (value: number) => boolean): {
    lo: number;
    hi: number;
};
/**
 * Binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @param last - lookup last inde***REMOVED***
 * @private
 */
e***REMOVED***port declare const _lookupByKey: (table: Record<string, number>[], key: string, value: number, last?: boolean) => {
    lo: number;
    hi: number;
};
/**
 * Reverse binary search
 * @param table - the table search. must be sorted!
 * @param key - property name for the value in each entry
 * @param value - value to find
 * @private
 */
e***REMOVED***port declare const _rlookupByKey: (table: Record<string, number>[], key: string, value: number) => {
    lo: number;
    hi: number;
};
/**
 * Return subset of `values` between `min` and `ma***REMOVED***` inclusive.
 * Values are assumed to be in sorted order.
 * @param values - sorted array of values
 * @param min - min value
 * @param ma***REMOVED*** - ma***REMOVED*** value
 */
e***REMOVED***port declare function _filterBetween(values: number[], min: number, ma***REMOVED***: number): number[];
e***REMOVED***port interface ArrayListener<T> {
    _onDataPush?(...item: T[]): void;
    _onDataPop?(): void;
    _onDataShift?(): void;
    _onDataSplice?(inde***REMOVED***: number, deleteCount: number, ...items: T[]): void;
    _onDataUnshift?(...item: T[]): void;
}
/**
 * Hooks the array methods that add or remove values ('push', pop', 'shift', 'splice',
 * 'unshift') and notify the listener AFTER the array has been altered. Listeners are
 * called on the '_onData*' callbacks (e.g. _onDataPush, etc.) with same arguments.
 */
e***REMOVED***port declare function listenArrayEvents<T>(array: T[], listener: ArrayListener<T>): void;
/**
 * Removes the given array event listener and cleanup e***REMOVED***tra attached properties (such as
 * the _chartjs stub and overridden methods) if array doesn't have any more listeners.
 */
e***REMOVED***port declare function unlistenArrayEvents<T>(array: T[], listener: ArrayListener<T>): void;
/**
 * @param items
 */
e***REMOVED***port declare function _arrayUnique<T>(items: T[]): T[];
