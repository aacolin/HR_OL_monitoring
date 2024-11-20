e***REMOVED***port function _segments(line: any, target: any, property: any): ({
    source: any;
    target: {
        property: any;
        start: any;
        end: any;
    };
    start: any;
    end: any;
} | {
    source: {
        start: number;
        end: number;
        loop: boolean;
        style?: any;
    };
    target: {
        start: number;
        end: number;
        loop: boolean;
        style?: any;
    };
    start: {
        [***REMOVED***: number]: any;
    };
    end: {
        [***REMOVED***: number]: any;
    };
})[];
e***REMOVED***port function _getBounds(property: any, first: any, last: any, loop: any): {
    property: any;
    start: any;
    end: any;
};
e***REMOVED***port function _pointsFromSegments(boundary: any, line: any): any[];
e***REMOVED***port function _findSegmentEnd(start: any, end: any, points: any): any;
