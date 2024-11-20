e***REMOVED***port interface RTLAdapter {
    ***REMOVED***(***REMOVED***: number): number;
    setWidth(w: number): void;
    te***REMOVED***tAlign(align: 'center' | 'left' | 'right'): 'center' | 'left' | 'right';
    ***REMOVED***Plus(***REMOVED***: number, value: number): number;
    leftForLtr(***REMOVED***: number, itemWidth: number): number;
}
e***REMOVED***port declare function getRtlAdapter(rtl: boolean, rectX: number, width: number): RTLAdapter;
e***REMOVED***port declare function overrideTe***REMOVED***tDirection(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, direction: 'ltr' | 'rtl'): void;
e***REMOVED***port declare function restoreTe***REMOVED***tDirection(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, original?: [string, string]): void;
