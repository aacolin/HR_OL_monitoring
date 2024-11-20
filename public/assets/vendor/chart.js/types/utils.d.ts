/* eslint-disable @typescript-eslint/ban-types */

// DeepPartial implementation taken from the utility-types NPM package, which is
// Copyright (c) 2016 Piotr Witek <piotrek.witek@gmail.com> (http://piotrwitek.github.io)
// and used under the terms of the MIT license
e***REMOVED***port type DeepPartial<T> = T e***REMOVED***tends Function
  ? T
  : T e***REMOVED***tends Array<infer U>
    ? _DeepPartialArray<U>
    : T e***REMOVED***tends object
      ? _DeepPartialObject<T>
      : T | undefined;

type _DeepPartialArray<T> = Array<DeepPartial<T>>
type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> };

e***REMOVED***port type DistributiveArray<T> = [T] e***REMOVED***tends [unknown] ? Array<T> : never

// https://stackoverflow.com/a/50375286
e***REMOVED***port type UnionToIntersection<U> = (U e***REMOVED***tends unknown ? (k: U) => void : never) e***REMOVED***tends (k: infer I) => void ? I : never;

e***REMOVED***port type AllKeys<T> = T e***REMOVED***tends any ? keyof T : never;

e***REMOVED***port type PickType<T, K e***REMOVED***tends AllKeys<T>> = T e***REMOVED***tends { [k in K]?: any }
  ? T[K]
  : undefined;

e***REMOVED***port type Merge<T e***REMOVED***tends object> = {
  [k in AllKeys<T>]: PickType<T, k>;
};
