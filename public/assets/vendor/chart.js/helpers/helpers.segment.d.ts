/**
 * Returns the sub-segment(s) of a line segment that fall in the given bounds
 * @param {object} segment
 * @param {number} segment.start - start inde***REMOVED*** of the segment, referring the points array
 * @param {number} segment.end - end inde***REMOVED*** of the segment, referring the points array
 * @param {boolean} segment.loop - indicates that the segment is a loop
 * @param {object} [segment.style] - segment style
 * @param {PointElement[]} points - the points that this segment refers to
 * @param {object} [bounds]
 * @param {string} bounds.property - the property of a `PointElement` we are bounding. `***REMOVED***`, `y` or `angle`.
 * @param {number} bounds.start - start value of the property
 * @param {number} bounds.end - end value of the property
 * @private
 **/
e***REMOVED***port function _boundSegment(segment: {
    start: number;
    end: number;
    loop: boolean;
    style?: object;
}, points: PointElement[], bounds?: {
    property: string;
    start: number;
    end: number;
}): {
    start: number;
    end: number;
    loop: boolean;
    style?: object;
}[];
/**
 * Returns the segments of the line that are inside given bounds
 * @param {LineElement} line
 * @param {object} [bounds]
 * @param {string} bounds.property - the property we are bounding with. `***REMOVED***`, `y` or `angle`.
 * @param {number} bounds.start - start value of the `property`
 * @param {number} bounds.end - end value of the `property`
 * @private
 */
e***REMOVED***port function _boundSegments(line: LineElement, bounds?: {
    property: string;
    start: number;
    end: number;
}): {
    start: number;
    end: number;
    loop: boolean;
    style?: object;
}[];
/**
 * Compute the continuous segments that define the whole line
 * There can be skipped points within a segment, if spanGaps is true.
 * @param {LineElement} line
 * @param {object} [segmentOptions]
 * @return {Segment[]}
 * @private
 */
e***REMOVED***port function _computeSegments(line: LineElement, segmentOptions?: object): Segment[];
e***REMOVED***port type LineElement = import('../elements/element.line.js').default;
e***REMOVED***port type PointElement = import('../elements/element.point.js').default;
e***REMOVED***port type Segment = {
    start: number;
    end: number;
    loop: boolean;
    style?: any;
};
