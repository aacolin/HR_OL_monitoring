e***REMOVED***port interface ChartArea {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

e***REMOVED***port interface Point {
  ***REMOVED***: number;
  y: number;
}

e***REMOVED***port type TRBL = {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

e***REMOVED***port type TRBLCorners = {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
};

e***REMOVED***port type CornerRadius = number | Partial<TRBLCorners>;

e***REMOVED***port type RoundedRect = {
  ***REMOVED***: number;
  y: number;
  w: number;
  h: number;
  radius?: CornerRadius
}

e***REMOVED***port type Padding = Partial<TRBL> | number | Point;

e***REMOVED***port interface SplinePoint {
  ***REMOVED***: number;
  y: number;
  skip?: boolean;

  // Both Bezier and monotone interpolations have these fields
  // but they are added in different spots
  cp1***REMOVED***?: number;
  cp1y?: number;
  cp2***REMOVED***?: number;
  cp2y?: number;
}
