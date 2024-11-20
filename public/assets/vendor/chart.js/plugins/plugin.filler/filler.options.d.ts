/**
 * @typedef { import('../../core/core.scale.js').default } Scale
 * @typedef { import('../../elements/element.line.js').default } LineElement
 * @typedef { import('../../types/inde***REMOVED***.js').FillTarget } FillTarget
 * @typedef { import('../../types/inde***REMOVED***.js').Comple***REMOVED***FillTarget } Comple***REMOVED***FillTarget
 */
e***REMOVED***port function _resolveTarget(sources: any, inde***REMOVED***: any, propagate: any): any;
/**
 * @param {LineElement} line
 * @param {number} inde***REMOVED***
 * @param {number} count
 */
e***REMOVED***port function _decodeFill(line: LineElement, inde***REMOVED***: number, count: number): any;
/**
 * @param {FillTarget | Comple***REMOVED***FillTarget} fill
 * @param {Scale} scale
 * @returns {number | null}
 */
e***REMOVED***port function _getTargetPi***REMOVED***el(fill: FillTarget | Comple***REMOVED***FillTarget, scale: Scale): number | null;
/**
 * @param {FillTarget | Comple***REMOVED***FillTarget} fill
 * @param {Scale} scale
 * @param {number} startValue
 * @returns {number | undefined}
 */
e***REMOVED***port function _getTargetValue(fill: FillTarget | Comple***REMOVED***FillTarget, scale: Scale, startValue: number): number | undefined;
e***REMOVED***port type Scale = import('../../core/core.scale.js').default;
e***REMOVED***port type LineElement = import('../../elements/element.line.js').default;
e***REMOVED***port type FillTarget = import('../../types/inde***REMOVED***.js').FillTarget;
e***REMOVED***port type Comple***REMOVED***FillTarget = import('../../types/inde***REMOVED***.js').Comple***REMOVED***FillTarget;
