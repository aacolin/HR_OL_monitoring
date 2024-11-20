import type { AnyObject } from '../types/basic.js';
import type { ChartMeta } from '../types/inde***REMOVED***.js';
import type { ResolverObjectKey, ResolverCache, ResolverPro***REMOVED***y, DescriptorDefaults, Descriptor, Conte***REMOVED***tPro***REMOVED***y } from './helpers.config.types.js';
e***REMOVED***port * from './helpers.config.types.js';
/**
 * Creates a Pro***REMOVED***y for resolving raw values for options.
 * @param scopes - The option scopes to look for values, in resolution order
 * @param prefi***REMOVED***es - The prefi***REMOVED***es for values, in resolution order.
 * @param rootScopes - The root option scopes
 * @param fallback - Parent scopes fallback
 * @param getTarget - callback for getting the target for changed values
 * @returns Pro***REMOVED***y
 * @private
 */
e***REMOVED***port declare function _createResolver<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T>(scopes: T, prefi***REMOVED***es?: string[], rootScopes?: R, fallback?: ResolverObjectKey, getTarget?: () => AnyObject): any;
/**
 * Returns an Pro***REMOVED***y for resolving option values with conte***REMOVED***t.
 * @param pro***REMOVED***y - The Pro***REMOVED***y returned by `_createResolver`
 * @param conte***REMOVED***t - Conte***REMOVED***t object for scriptable/inde***REMOVED***able options
 * @param subPro***REMOVED***y - The pro***REMOVED***y provided for scriptable options
 * @param descriptorDefaults - Defaults for descriptors
 * @private
 */
e***REMOVED***port declare function _attachConte***REMOVED***t<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T>(pro***REMOVED***y: ResolverPro***REMOVED***y<T, R>, conte***REMOVED***t: AnyObject, subPro***REMOVED***y?: ResolverPro***REMOVED***y<T, R>, descriptorDefaults?: DescriptorDefaults): Conte***REMOVED***tPro***REMOVED***y<T, R>;
/**
 * @private
 */
e***REMOVED***port declare function _descriptors(pro***REMOVED***y: ResolverCache, defaults?: DescriptorDefaults): Descriptor;
e***REMOVED***port declare function _parseObjectDataRadialScale(meta: ChartMeta<'line' | 'scatter'>, data: AnyObject[], start: number, count: number): {
    r: unknown;
}[];
