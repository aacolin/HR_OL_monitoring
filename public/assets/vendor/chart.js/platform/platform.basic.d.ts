/**
 * Platform class for charts without access to the DOM or to many element properties
 * This platform is used by default for any chart passed an OffscreenCanvas.
 * @e***REMOVED***tends BasePlatform
 */
e***REMOVED***port default class BasicPlatform e***REMOVED***tends BasePlatform {
    acquireConte***REMOVED***t(item: any): any;
    updateConfig(config: any): void;
}
import BasePlatform from "./platform.base.js";
