import type { AnyObject } from '../types/basic.js';
import type { Merge } from '../types/utils.js';
e***REMOVED***port type ResolverObjectKey = string | boolean;
e***REMOVED***port interface ResolverCache<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T> {
    [Symbol.toStringTag]: 'Object';
    _cacheable: boolean;
    _scopes: T;
    _rootScopes: T | R;
    _fallback: ResolverObjectKey;
    _keys?: string[];
    _scriptable?: boolean;
    _inde***REMOVED***able?: boolean;
    _allKeys?: boolean;
    _storage?: T[number];
    _getTarget(): T[number];
    override<S e***REMOVED***tends AnyObject>(scope: S): ResolverPro***REMOVED***y<(T[number] | S)[], T | R>;
}
e***REMOVED***port type ResolverPro***REMOVED***y<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T> = Merge<T[number]> & ResolverCache<T, R>;
e***REMOVED***port interface DescriptorDefaults {
    scriptable: boolean;
    inde***REMOVED***able: boolean;
    allKeys?: boolean;
}
e***REMOVED***port interface Descriptor {
    allKeys: boolean;
    scriptable: boolean;
    inde***REMOVED***able: boolean;
    isScriptable(key: string): boolean;
    isInde***REMOVED***able(key: string): boolean;
}
e***REMOVED***port interface Conte***REMOVED***tCache<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T> {
    _cacheable: boolean;
    _pro***REMOVED***y: ResolverPro***REMOVED***y<T, R>;
    _conte***REMOVED***t: AnyObject;
    _subPro***REMOVED***y: ResolverPro***REMOVED***y<T, R>;
    _stack: Set<string>;
    _descriptors: Descriptor;
    setConte***REMOVED***t(ct***REMOVED***: AnyObject): Conte***REMOVED***tPro***REMOVED***y<T, R>;
    override<S e***REMOVED***tends AnyObject>(scope: S): Conte***REMOVED***tPro***REMOVED***y<(T[number] | S)[], T | R>;
}
e***REMOVED***port type Conte***REMOVED***tPro***REMOVED***y<T e***REMOVED***tends AnyObject[] = AnyObject[], R e***REMOVED***tends AnyObject[] = T> = Merge<T[number]> & Conte***REMOVED***tCache<T, R>;
