/* eslint-disable @typescript-eslint/ban-types */
import {DeepPartial, DistributiveArray, UnionToIntersection} from './utils.js';

import {TimeUnit} from '../core/core.adapters.js';
import PointElement from '../elements/element.point.js';
import {EasingFunction} from '../helpers/helpers.easing.js';
import {AnimationEvent} from './animation.js';
import {AnyObject, EmptyObject} from './basic.js';
import {Color} from './color.js';
import Element from '../core/core.element.js';
import {ChartArea, Padding, Point} from './geometric.js';
import {LayoutItem, LayoutPosition} from './layout.js';
import {ColorsPluginOptions} from '../plugins/plugin.colors.js';

e***REMOVED***port {EasingFunction} from '../helpers/helpers.easing.js';
e***REMOVED***port {default as ArcElement, ArcProps} from '../elements/element.arc.js';
e***REMOVED***port {default as PointElement, PointProps} from '../elements/element.point.js';
e***REMOVED***port {Animation, Animations, Animator, AnimationEvent} from './animation.js';
e***REMOVED***port {Color} from './color.js';
e***REMOVED***port {ChartArea, Point} from './geometric.js';
e***REMOVED***port {LayoutItem, LayoutPosition} from './layout.js';

e***REMOVED***port interface ScriptableConte***REMOVED***t<TType e***REMOVED***tends ChartType> {
  active: boolean;
  chart: Chart;
  dataInde***REMOVED***: number;
  dataset: UnionToIntersection<ChartDataset<TType>>;
  datasetInde***REMOVED***: number;
  type: string;
  mode: string;
  parsed: UnionToIntersection<ParsedDataType<TType>>;
  raw: unknown;
}

e***REMOVED***port interface ScriptableLineSegmentConte***REMOVED***t {
  type: 'segment',
  p0: PointElement,
  p1: PointElement,
  p0DataInde***REMOVED***: number,
  p1DataInde***REMOVED***: number,
  datasetInde***REMOVED***: number
}

e***REMOVED***port type Scriptable<T, TConte***REMOVED***t> = T | ((ct***REMOVED***: TConte***REMOVED***t, options: AnyObject) => T | undefined);
e***REMOVED***port type ScriptableOptions<T, TConte***REMOVED***t> = { [P in keyof T]: Scriptable<T[P], TConte***REMOVED***t> };
e***REMOVED***port type ScriptableAndScriptableOptions<T, TConte***REMOVED***t> = Scriptable<T, TConte***REMOVED***t> | ScriptableOptions<T, TConte***REMOVED***t>;
e***REMOVED***port type ScriptableAndArray<T, TConte***REMOVED***t> = readonly T[] | Scriptable<T, TConte***REMOVED***t>;
e***REMOVED***port type ScriptableAndArrayOptions<T, TConte***REMOVED***t> = { [P in keyof T]: ScriptableAndArray<T[P], TConte***REMOVED***t> };

e***REMOVED***port interface ParsingOptions {
  /**
   * How to parse the dataset. The parsing can be disabled by specifying parsing: false at chart options or dataset. If parsing is disabled, data must be sorted and in the formats the associated chart type and scales use internally.
   */
  parsing:
  {
    [key: string]: string;
  }
  | false;

  /**
   * Chart.js is fastest if you provide data with indices that are unique, sorted, and consistent across datasets and provide the normalized: true option to let Chart.js know that you have done so.
   */
  normalized: boolean;
}

e***REMOVED***port interface ControllerDatasetOptions e***REMOVED***tends ParsingOptions {
  /**
   * The base a***REMOVED***is of the chart. '***REMOVED***' for vertical charts and 'y' for horizontal charts.
   * @default '***REMOVED***'
   */
  inde***REMOVED***A***REMOVED***is: '***REMOVED***' | 'y';
  /**
   * How to clip relative to chartArea. Positive value allows overflow, negative value clips that many pi***REMOVED***els inside chartArea. 0 = clip at chartArea. Clipping can also be configured per side: `clip: {left: 5, top: false, right: -2, bottom: 0}`
   */
  clip: number | ChartArea | false;
  /**
   * The label for the dataset which appears in the legend and tooltips.
   */
  label: string;
  /**
   * The drawing order of dataset. Also affects order for stacking, tooltip and legend.
   */
  order: number;

  /**
   * The ID of the group to which this dataset belongs to (when stacked, each group will be a separate stack).
   */
  stack: string;
  /**
     * Configures the visibility state of the dataset. Set it to true, to hide the dataset from the chart.
   * @default false
   */
  hidden: boolean;
}

e***REMOVED***port interface BarControllerDatasetOptions
  e***REMOVED***tends ControllerDatasetOptions,
  ScriptableAndArrayOptions<BarOptions, ScriptableConte***REMOVED***t<'bar'>>,
  ScriptableAndArrayOptions<CommonHoverOptions, ScriptableConte***REMOVED***t<'bar'>>,
  AnimationOptions<'bar'> {
  /**
   * The ID of the ***REMOVED*** a***REMOVED***is to plot this dataset on.
   */
  ***REMOVED***A***REMOVED***isID: string;
  /**
   * The ID of the y a***REMOVED***is to plot this dataset on.
   */
  yA***REMOVED***isID: string;

  /**
   * Percent (0-1) of the available width each bar should be within the category width. 1.0 will take the whole category width and put the bars right ne***REMOVED***t to each other.
   * @default 0.9
   */
  barPercentage: number;
  /**
   * Percent (0-1) of the available width each category should be within the sample width.
   * @default 0.8
   */
  categoryPercentage: number;

  /**
   * Manually set width of each bar in pi***REMOVED***els. If set to 'fle***REMOVED***', it computes "optimal" sample widths that globally arrange bars side by side. If not set (default), bars are equally sized based on the smallest interval.
   */
  barThickness: number | 'fle***REMOVED***';

  /**
   * Set this to ensure that bars are not sized thicker than this.
   */
  ma***REMOVED***BarThickness: number;

  /**
   * Set this to ensure that bars have a minimum length in pi***REMOVED***els.
   */
  minBarLength: number;

  /**
   * Point style for the legend
   * @default 'circle;
   */
  pointStyle: PointStyle;

  /**
   * Should the bars be grouped on inde***REMOVED*** a***REMOVED***is
   * @default true
   */
  grouped: boolean;
}

e***REMOVED***port interface BarControllerChartOptions {
  /**
   * Should null or undefined values be omitted from drawing
   */
  skipNull?: boolean;
}

e***REMOVED***port type BarController = DatasetController
e***REMOVED***port declare const BarController: ChartComponent & {
  prototype: BarController;
  new (chart: Chart, datasetInde***REMOVED***: number): BarController;
};

e***REMOVED***port interface BubbleControllerDatasetOptions
  e***REMOVED***tends ControllerDatasetOptions,
  ScriptableAndArrayOptions<PointOptions, ScriptableConte***REMOVED***t<'bubble'>>,
  ScriptableAndArrayOptions<PointHoverOptions, ScriptableConte***REMOVED***t<'bubble'>> {
  /**
   * The ID of the ***REMOVED*** a***REMOVED***is to plot this dataset on.
   */
  ***REMOVED***A***REMOVED***isID: string;
  /**
   * The ID of the y a***REMOVED***is to plot this dataset on.
   */
  yA***REMOVED***isID: string;
}

e***REMOVED***port interface BubbleDataPoint e***REMOVED***tends Point {
  /**
   * Bubble radius in pi***REMOVED***els (not scaled).
   */
  r?: number;
}

e***REMOVED***port type BubbleController = DatasetController
e***REMOVED***port declare const BubbleController: ChartComponent & {
  prototype: BubbleController;
  new (chart: Chart, datasetInde***REMOVED***: number): BubbleController;
};

e***REMOVED***port interface LineControllerDatasetOptions
  e***REMOVED***tends ControllerDatasetOptions,
  ScriptableAndArrayOptions<PointPrefi***REMOVED***edOptions, ScriptableConte***REMOVED***t<'line'>>,
  ScriptableAndArrayOptions<PointPrefi***REMOVED***edHoverOptions, ScriptableConte***REMOVED***t<'line'>>,
  ScriptableOptions<Omit<LineOptions, keyof CommonElementOptions>, ScriptableConte***REMOVED***t<'line'>>,
  ScriptableAndArrayOptions<CommonElementOptions, ScriptableConte***REMOVED***t<'line'>>,
  ScriptableOptions<Omit<LineHoverOptions, keyof CommonHoverOptions>, ScriptableConte***REMOVED***t<'line'>>,
  ScriptableAndArrayOptions<CommonHoverOptions, ScriptableConte***REMOVED***t<'line'>>,
  AnimationOptions<'line'> {
  /**
   * The ID of the ***REMOVED*** a***REMOVED***is to plot this dataset on.
   */
  ***REMOVED***A***REMOVED***isID: string;
  /**
   * The ID of the y a***REMOVED***is to plot this dataset on.
   */
  yA***REMOVED***isID: string;

  /**
   * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the ma***REMOVED***imum gap length to span. The unit of the value depends on the scale used.
   * @default false
   */
  spanGaps: boolean | number;

  showLine: boolean;
}

e***REMOVED***port interface LineControllerChartOptions {
  /**
   * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the ma***REMOVED***imum gap length to span. The unit of the value depends on the scale used.
   * @default false
   */
  spanGaps: boolean | number;
  /**
   * If false, the lines between points are not drawn.
   * @default true
   */
  showLine: boolean;
}

e***REMOVED***port type LineController = DatasetController
e***REMOVED***port declare const LineController: ChartComponent & {
  prototype: LineController;
  new (chart: Chart, datasetInde***REMOVED***: number): LineController;
};

e***REMOVED***port type ScatterControllerDatasetOptions = LineControllerDatasetOptions;

e***REMOVED***port type ScatterDataPoint = Point

e***REMOVED***port type ScatterControllerChartOptions = LineControllerChartOptions;

e***REMOVED***port type ScatterController = LineController
e***REMOVED***port declare const ScatterController: ChartComponent & {
  prototype: ScatterController;
  new (chart: Chart, datasetInde***REMOVED***: number): ScatterController;
};

e***REMOVED***port interface DoughnutControllerDatasetOptions
  e***REMOVED***tends ControllerDatasetOptions,
  ScriptableAndArrayOptions<ArcOptions, ScriptableConte***REMOVED***t<'doughnut'>>,
  ScriptableAndArrayOptions<ArcHoverOptions, ScriptableConte***REMOVED***t<'doughnut'>>,
  AnimationOptions<'doughnut'> {

  /**
   * Sweep to allow arcs to cover.
   * @default 360
   */
  circumference: number;

  /**
   * Arc offset (in pi***REMOVED***els).
   */
  offset: number | number[];

  /**
   * Starting angle to draw this dataset from.
   * @default 0
   */
  rotation: number;

  /**
   * The relative thickness of the dataset. Providing a value for weight will cause the pie or doughnut dataset to be drawn with a thickness relative to the sum of all the dataset weight values.
   * @default 1
   */
  weight: number;

  /**
   * Similar to the `offset` option, but applies to all arcs. This can be used to to add spaces
   * between arcs
   * @default 0
   */
  spacing: number;
}

e***REMOVED***port interface DoughnutAnimationOptions {
  /**
   *   If true, the chart will animate in with a rotation animation. This property is in the options.animation object.
   * @default true
   */
  animateRotate: boolean;

  /**
   * If true, will animate scaling the chart from the center outwards.
   * @default false
   */
  animateScale: boolean;
}

e***REMOVED***port interface DoughnutControllerChartOptions {
  /**
   * Sweep to allow arcs to cover.
   * @default 360
   */
  circumference: number;

  /**
   * The portion of the chart that is cut out of the middle. ('50%' - for doughnut, 0 - for pie)
   * String ending with '%' means percentage, number means pi***REMOVED***els.
   * @default 50
   */
  cutout: Scriptable<number | string, ScriptableConte***REMOVED***t<'doughnut'>>;

  /**
   * Arc offset (in pi***REMOVED***els).
   */
  offset: number | number[];

  /**
   * The outer radius of the chart. String ending with '%' means percentage of ma***REMOVED***imum radius, number means pi***REMOVED***els.
   * @default '100%'
   */
  radius: Scriptable<number | string, ScriptableConte***REMOVED***t<'doughnut'>>;

  /**
   * Starting angle to draw arcs from.
   * @default 0
   */
  rotation: number;

  /**
   * Spacing between the arcs
   * @default 0
   */
  spacing: number;

  animation: false | DoughnutAnimationOptions;
}

e***REMOVED***port type DoughnutDataPoint = number;

e***REMOVED***port interface DoughnutController e***REMOVED***tends DatasetController {
  readonly innerRadius: number;
  readonly outerRadius: number;
  readonly offsetX: number;
  readonly offsetY: number;

  calculateTotal(): number;
  calculateCircumference(value: number): number;
}

e***REMOVED***port declare const DoughnutController: ChartComponent & {
  prototype: DoughnutController;
  new (chart: Chart, datasetInde***REMOVED***: number): DoughnutController;
};

e***REMOVED***port interface DoughnutMetaE***REMOVED***tensions {
  total: number;
}

e***REMOVED***port type PieControllerDatasetOptions = DoughnutControllerDatasetOptions;
e***REMOVED***port type PieControllerChartOptions = DoughnutControllerChartOptions;
e***REMOVED***port type PieAnimationOptions = DoughnutAnimationOptions;

e***REMOVED***port type PieDataPoint = DoughnutDataPoint;
e***REMOVED***port type PieMetaE***REMOVED***tensions = DoughnutMetaE***REMOVED***tensions;

e***REMOVED***port type PieController = DoughnutController
e***REMOVED***port declare const PieController: ChartComponent & {
  prototype: PieController;
  new (chart: Chart, datasetInde***REMOVED***: number): PieController;
};

e***REMOVED***port interface PolarAreaControllerDatasetOptions e***REMOVED***tends DoughnutControllerDatasetOptions {
  /**
   * Arc angle to cover. - for polar only
   * @default circumference / (arc count)
   */
  angle: number;
}

e***REMOVED***port type PolarAreaAnimationOptions = DoughnutAnimationOptions;

e***REMOVED***port interface PolarAreaControllerChartOptions {
  /**
   * Starting angle to draw arcs for the first item in a dataset. In degrees, 0 is at top.
   * @default 0
   */
  startAngle: number;

  animation: false | PolarAreaAnimationOptions;
}

e***REMOVED***port interface PolarAreaController e***REMOVED***tends DoughnutController {
  countVisibleElements(): number;
}
e***REMOVED***port declare const PolarAreaController: ChartComponent & {
  prototype: PolarAreaController;
  new (chart: Chart, datasetInde***REMOVED***: number): PolarAreaController;
};

e***REMOVED***port interface RadarControllerDatasetOptions
  e***REMOVED***tends ControllerDatasetOptions,
  ScriptableAndArrayOptions<PointOptions & PointHoverOptions & PointPrefi***REMOVED***edOptions & PointPrefi***REMOVED***edHoverOptions, ScriptableConte***REMOVED***t<'radar'>>,
  ScriptableAndArrayOptions<LineOptions & LineHoverOptions, ScriptableConte***REMOVED***t<'radar'>>,
  AnimationOptions<'radar'> {
  /**
   * The ID of the ***REMOVED*** a***REMOVED***is to plot this dataset on.
   */
  ***REMOVED***A***REMOVED***isID: string;
  /**
   * The ID of the y a***REMOVED***is to plot this dataset on.
   */
  yA***REMOVED***isID: string;

  /**
   * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the ma***REMOVED***imum gap length to span. The unit of the value depends on the scale used.
   */
  spanGaps: boolean | number;

  /**
   * If false, the line is not drawn for this dataset.
   */
  showLine: boolean;
}

e***REMOVED***port type RadarControllerChartOptions = LineControllerChartOptions;

e***REMOVED***port type RadarController = DatasetController
e***REMOVED***port declare const RadarController: ChartComponent & {
  prototype: RadarController;
  new (chart: Chart, datasetInde***REMOVED***: number): RadarController;
};
interface ChartMetaCommon<TElement e***REMOVED***tends Element = Element, TDatasetElement e***REMOVED***tends Element = Element> {
  type: string;
  controller: DatasetController;
  order: number;

  label: string;
  inde***REMOVED***: number;
  visible: boolean;

  stack: number;

  inde***REMOVED***A***REMOVED***is: '***REMOVED***' | 'y';

  data: TElement[];
  dataset?: TDatasetElement;

  hidden: boolean;

  ***REMOVED***A***REMOVED***isID?: string;
  yA***REMOVED***isID?: string;
  rA***REMOVED***isID?: string;
  iA***REMOVED***isID: string;
  vA***REMOVED***isID: string;

  ***REMOVED***Scale?: Scale;
  yScale?: Scale;
  rScale?: Scale;
  iScale?: Scale;
  vScale?: Scale;

  _sorted: boolean;
  _stacked: boolean | 'single';
  _parsed: unknown[];
}

e***REMOVED***port type ChartMeta<
  TType e***REMOVED***tends ChartType = ChartType,
  TElement e***REMOVED***tends Element = Element,
  TDatasetElement e***REMOVED***tends Element = Element,
> = DeepPartial<
{ [key in ChartType]: ChartTypeRegistry[key]['metaE***REMOVED***tensions'] }[TType]
> & ChartMetaCommon<TElement, TDatasetElement>;

e***REMOVED***port interface ActiveDataPoint {
  datasetInde***REMOVED***: number;
  inde***REMOVED***: number;
}

e***REMOVED***port interface ActiveElement e***REMOVED***tends ActiveDataPoint {
  element: Element;
}

e***REMOVED***port declare class Chart<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  readonly platform: BasePlatform;
  readonly id: string;
  readonly canvas: HTMLCanvasElement;
  readonly ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D;
  readonly config: ChartConfiguration<TType, TData, TLabel> | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>;
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
  readonly bo***REMOVED***es: LayoutItem[];
  readonly currentDevicePi***REMOVED***elRatio: number;
  readonly chartArea: ChartArea;
  readonly scales: { [key: string]: Scale };
  readonly attached: boolean;

  readonly legend?: LegendElement<TType>; // Only available if legend plugin is registered and enabled
  readonly tooltip?: TooltipModel<TType>; // Only available if tooltip plugin is registered and enabled

  data: ChartData<TType, TData, TLabel>;
  options: ChartOptions<TType>;

  constructor(item: ChartItem, config: ChartConfiguration<TType, TData, TLabel> | ChartConfigurationCustomTypesPerDataset<TType, TData, TLabel>);

  clear(): this;
  stop(): this;

  resize(width?: number, height?: number): void;
  ensureScalesHaveIDs(): void;
  buildOrUpdateScales(): void;
  buildOrUpdateControllers(): void;
  reset(): void;
  update(mode?: UpdateMode | ((ct***REMOVED***: { datasetInde***REMOVED***: number }) => UpdateMode)): void;
  render(): void;
  draw(): void;

  isPointInArea(point: Point): boolean;
  getElementsAtEventForMode(e: Event, mode: string, options: InteractionOptions, useFinalPosition: boolean): InteractionItem[];

  getSortedVisibleDatasetMetas(): ChartMeta[];
  getDatasetMeta(datasetInde***REMOVED***: number): ChartMeta;
  getVisibleDatasetCount(): number;
  isDatasetVisible(datasetInde***REMOVED***: number): boolean;
  setDatasetVisibility(datasetInde***REMOVED***: number, visible: boolean): void;
  toggleDataVisibility(inde***REMOVED***: number): void;
  getDataVisibility(inde***REMOVED***: number): boolean;
  hide(datasetInde***REMOVED***: number, dataInde***REMOVED***?: number): void;
  show(datasetInde***REMOVED***: number, dataInde***REMOVED***?: number): void;

  getActiveElements(): ActiveElement[];
  setActiveElements(active: ActiveDataPoint[]): void;

  destroy(): void;
  toBase64Image(type?: string, quality?: unknown): string;
  bindEvents(): void;
  unbindEvents(): void;
  updateHoverStyle(items: InteractionItem[], mode: 'dataset', enabled: boolean): void;

  notifyPlugins(hook: string, args?: AnyObject): boolean | void;

  isPluginEnabled(pluginId: string): boolean;

  getConte***REMOVED***t(): { chart: Chart, type: string };

  static readonly defaults: Defaults;
  static readonly overrides: Overrides;
  static readonly version: string;
  static readonly instances: { [key: string]: Chart };
  static readonly registry: Registry;
  static getChart(key: string | CanvasRenderingConte***REMOVED***t2D | HTMLCanvasElement): Chart | undefined;
  static register(...items: ChartComponentLike[]): void;
  static unregister(...items: ChartComponentLike[]): void;
}

e***REMOVED***port declare const registerables: readonly ChartComponentLike[];

e***REMOVED***port declare type ChartItem =
  | string
  | CanvasRenderingConte***REMOVED***t2D
  | HTMLCanvasElement
  | { canvas: HTMLCanvasElement }
  | ArrayLike<CanvasRenderingConte***REMOVED***t2D | HTMLCanvasElement>;

e***REMOVED***port declare enum UpdateModeEnum {
  resize = 'resize',
  reset = 'reset',
  none = 'none',
  hide = 'hide',
  show = 'show',
  default = 'default',
  active = 'active'
}

e***REMOVED***port type UpdateMode = keyof typeof UpdateModeEnum;

e***REMOVED***port declare class DatasetController<
  TType e***REMOVED***tends ChartType = ChartType,
  TElement e***REMOVED***tends Element = Element,
  TDatasetElement e***REMOVED***tends Element = Element,
  TParsedData = ParsedDataType<TType>,
> {
  constructor(chart: Chart, datasetInde***REMOVED***: number);

  readonly chart: Chart;
  readonly inde***REMOVED***: number;
  readonly _cachedMeta: ChartMeta<TType, TElement, TDatasetElement>;
  enableOptionSharing: boolean;
  // If true, the controller supports the decimation
  // plugin. Defaults to `false` for all controllers
  // e***REMOVED***cept the LineController
  supportsDecimation: boolean;

  linkScales(): void;
  getAllParsedValues(scale: Scale): number[];
  protected getLabelAndValue(inde***REMOVED***: number): { label: string; value: string };
  updateElements(elements: TElement[], start: number, count: number, mode: UpdateMode): void;
  update(mode: UpdateMode): void;
  updateInde***REMOVED***(datasetInde***REMOVED***: number): void;
  protected getMa***REMOVED***Overflow(): boolean | number;
  draw(): void;
  reset(): void;
  getDataset(): ChartDataset;
  getMeta(): ChartMeta<TType, TElement, TDatasetElement>;
  getScaleForId(scaleID: string): Scale | undefined;
  configure(): void;
  initialize(): void;
  addElements(): void;
  buildOrUpdateElements(resetNewElements?: boolean): void;

  getStyle(inde***REMOVED***: number, active: boolean): AnyObject;
  protected resolveDatasetElementOptions(mode: UpdateMode): AnyObject;
  protected resolveDataElementOptions(inde***REMOVED***: number, mode: UpdateMode): AnyObject;
  /**
   * Utility for checking if the options are shared and should be animated separately.
   * @protected
   */
  protected getSharedOptions(options: AnyObject): undefined | AnyObject;
  /**
   * Utility for determining if `options` should be included in the updated properties
   * @protected
   */
  protected includeOptions(mode: UpdateMode, sharedOptions: AnyObject): boolean;
  /**
   * Utility for updating an element with new properties, using animations when appropriate.
   * @protected
   */

  protected updateElement(element: TElement | TDatasetElement, inde***REMOVED***: number | undefined, properties: AnyObject, mode: UpdateMode): void;
  /**
   * Utility to animate the shared options, that are potentially affecting multiple elements.
   * @protected
   */

  protected updateSharedOptions(sharedOptions: AnyObject, mode: UpdateMode, newOptions: AnyObject): void;
  removeHoverStyle(element: TElement, datasetInde***REMOVED***: number, inde***REMOVED***: number): void;
  setHoverStyle(element: TElement, datasetInde***REMOVED***: number, inde***REMOVED***: number): void;

  parse(start: number, count: number): void;
  protected parsePrimitiveData(meta: ChartMeta<TType, TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
  protected parseArrayData(meta: ChartMeta<TType, TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
  protected parseObjectData(meta: ChartMeta<TType, TElement, TDatasetElement>, data: AnyObject[], start: number, count: number): AnyObject[];
  protected getParsed(inde***REMOVED***: number): TParsedData;
  protected applyStack(scale: Scale, parsed: unknown[]): number;
  protected updateRangeFromParsed(
    range: { min: number; ma***REMOVED***: number },
    scale: Scale,
    parsed: unknown[],
    stack: boolean | string
  ): void;
  protected getMinMa***REMOVED***(scale: Scale, canStack?: boolean): { min: number; ma***REMOVED***: number };
}

e***REMOVED***port interface DatasetControllerChartComponent e***REMOVED***tends ChartComponent {
  defaults: {
    datasetElementType?: string | null | false;
    dataElementType?: string | null | false;
  };
}

e***REMOVED***port interface Defaults e***REMOVED***tends CoreChartOptions<ChartType>, ElementChartOptions<ChartType>, PluginChartOptions<ChartType> {

  scale: ScaleOptionsByType;
  scales: {
    [key in ScaleType]: ScaleOptionsByType<key>;
  };

  set(values: AnyObject): AnyObject;
  set(scope: string, values: AnyObject): AnyObject;
  get(scope: string): AnyObject;

  describe(scope: string, values: AnyObject): AnyObject;
  override(scope: string, values: AnyObject): AnyObject;

  /**
   * Routes the named defaults to fallback to another scope/name.
   * This routing is useful when those target values, like defaults.color, are changed runtime.
   * If the values would be copied, the runtime change would not take effect. By routing, the
   * fallback is evaluated at each access, so its always up to date.
   *
   * E***REMOVED***ample:
   *
   *   defaults.route('elements.arc', 'backgroundColor', '', 'color')
   *    - reads the backgroundColor from defaults.color when undefined locally
   *
   * @param scope Scope this route applies to.
   * @param name Property name that should be routed to different namespace when not defined here.
   * @param targetScope The namespace where those properties should be routed to.
   * Empty string ('') is the root of defaults.
   * @param targetName The target name in the target scope the property should be routed to.
   */
  route(scope: string, name: string, targetScope: string, targetName: string): void;
}

e***REMOVED***port type Overrides = {
  [key in ChartType]:
  CoreChartOptions<key> &
  ElementChartOptions<key> &
  PluginChartOptions<key> &
  DatasetChartOptions<ChartType> &
  ScaleChartOptions<key> &
  ChartTypeRegistry[key]['chartOptions'];
}

e***REMOVED***port declare const defaults: Defaults;
e***REMOVED***port interface InteractionOptions {
  a***REMOVED***is?: string;
  intersect?: boolean;
  includeInvisible?: boolean;
}

e***REMOVED***port interface InteractionItem {
  element: Element;
  datasetInde***REMOVED***: number;
  inde***REMOVED***: number;
}

e***REMOVED***port type InteractionModeFunction = (
  chart: Chart,
  e: ChartEvent,
  options: InteractionOptions,
  useFinalPosition?: boolean
) => InteractionItem[];

e***REMOVED***port interface InteractionModeMap {
  /**
   * Returns items at the same inde***REMOVED***. If the options.intersect parameter is true, we only return items if we intersect something
   * If the options.intersect mode is false, we find the nearest item and return the items at the same inde***REMOVED*** as that item
   */
  inde***REMOVED***: InteractionModeFunction;

  /**
   * Returns items in the same dataset. If the options.intersect parameter is true, we only return items if we intersect something
   * If the options.intersect is false, we find the nearest item and return the items in that dataset
   */
  dataset: InteractionModeFunction;
  /**
   * Point mode returns all elements that hit test based on the event position
   * of the event
   */
  point: InteractionModeFunction;
  /**
   * nearest mode returns the element closest to the point
   */
  nearest: InteractionModeFunction;
  /**
   * ***REMOVED*** mode returns the elements that hit-test at the current ***REMOVED*** coordinate
   */
  ***REMOVED***: InteractionModeFunction;
  /**
   * y mode returns the elements that hit-test at the current y coordinate
   */
  y: InteractionModeFunction;
}

e***REMOVED***port type InteractionMode = keyof InteractionModeMap;

e***REMOVED***port declare const Interaction: {
  modes: InteractionModeMap;

  /**
   * Helper function to select candidate elements for interaction
   */
  evaluateInteractionItems(
    chart: Chart,
    a***REMOVED***is: InteractionA***REMOVED***is,
    position: Point,
    handler: (element: Element & VisualElement, datasetInde***REMOVED***: number, inde***REMOVED***: number) => void,
    intersect?: boolean
  ): InteractionItem[];
};

e***REMOVED***port declare const layouts: {
  /**
   * Register a bo***REMOVED*** to a chart.
   * A bo***REMOVED*** is simply a reference to an object that requires layout. eg. Scales, Legend, Title.
   * @param {Chart} chart - the chart to use
   * @param {LayoutItem} item - the item to add to be laid out
   */
  addBo***REMOVED***(chart: Chart, item: LayoutItem): void;

  /**
   * Remove a layoutItem from a chart
   * @param {Chart} chart - the chart to remove the bo***REMOVED*** from
   * @param {LayoutItem} layoutItem - the item to remove from the layout
   */
  removeBo***REMOVED***(chart: Chart, layoutItem: LayoutItem): void;

  /**
   * Sets (or updates) options on the given `item`.
   * @param {Chart} chart - the chart in which the item lives (or will be added to)
   * @param {LayoutItem} item - the item to configure with the given options
   * @param options - the new item options.
   */
  configure(
    chart: Chart,
    item: LayoutItem,
    options: { fullSize?: number; position?: LayoutPosition; weight?: number }
  ): void;

  /**
   * Fits bo***REMOVED***es of the given chart into the given size by having each bo***REMOVED*** measure itself
   * then running a fitting algorithm
   * @param {Chart} chart - the chart
   * @param {number} width - the width to fit into
   * @param {number} height - the height to fit into
   */
  update(chart: Chart, width: number, height: number): void;
};

e***REMOVED***port interface Plugin<TType e***REMOVED***tends ChartType = ChartType, O = AnyObject> e***REMOVED***tends E***REMOVED***tendedPlugin<TType, O> {
  id: string;

  /**
   * The events option defines the browser events that the plugin should listen.
   * @default ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
   */
  events?: (keyof HTMLElementEventMap)[]

  /**
   * @desc Called when plugin is installed for this chart instance. This hook is also invoked for disabled plugins (options === false).
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @since 3.0.0
   */
  install?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called when a plugin is starting. This happens when chart is created or plugin is enabled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @since 3.0.0
   */
  start?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called when a plugin stopping. This happens when chart is destroyed or plugin is disabled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @since 3.0.0
   */
  stop?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before initializing `chart`.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  beforeInit?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called after `chart` has been initialized and before the first update.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterInit?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before updating `chart`. If any plugin returns `false`, the update
   * is cancelled (and thus subsequent render(s)) until another `update` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {UpdateMode} args.mode - The update mode
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart update.
   */
  beforeUpdate?(chart: Chart<TType>, args: { mode: UpdateMode, cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after `chart` has been updated and before rendering. Note that this
   * hook will not be called if the chart update has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {UpdateMode} args.mode - The update mode
   * @param {object} options - The plugin options.
   */
  afterUpdate?(chart: Chart<TType>, args: { mode: UpdateMode }, options: O): void;
  /**
   * @desc Called during the update process, before any chart elements have been created.
   * This can be used for data decimation by changing the data array inside a dataset.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  beforeElementsUpdate?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called during chart reset
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @since version 3.0.0
   */
  reset?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before updating the `chart` datasets. If any plugin returns `false`,
   * the datasets update is cancelled until another `update` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {UpdateMode} args.mode - The update mode.
   * @param {object} options - The plugin options.
   * @returns {boolean} false to cancel the datasets update.
   * @since version 2.1.5
   */
  beforeDatasetsUpdate?(chart: Chart<TType>, args: { mode: UpdateMode }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` datasets have been updated. Note that this hook
   * will not be called if the datasets update has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {UpdateMode} args.mode - The update mode.
   * @param {object} options - The plugin options.
   * @since version 2.1.5
   */
  afterDatasetsUpdate?(chart: Chart<TType>, args: { mode: UpdateMode, cancelable: true }, options: O): void;
  /**
   * @desc Called before updating the `chart` dataset at the given `args.inde***REMOVED***`. If any plugin
   * returns `false`, the datasets update is cancelled until another `update` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {number} args.inde***REMOVED*** - The dataset inde***REMOVED***.
   * @param {object} args.meta - The dataset metadata.
   * @param {UpdateMode} args.mode - The update mode.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart datasets drawing.
   */
  beforeDatasetUpdate?(chart: Chart<TType>, args: { inde***REMOVED***: number; meta: ChartMeta, mode: UpdateMode, cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` datasets at the given `args.inde***REMOVED***` has been updated. Note
   * that this hook will not be called if the datasets update has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {number} args.inde***REMOVED*** - The dataset inde***REMOVED***.
   * @param {object} args.meta - The dataset metadata.
   * @param {UpdateMode} args.mode - The update mode.
   * @param {object} options - The plugin options.
   */
  afterDatasetUpdate?(chart: Chart<TType>, args: { inde***REMOVED***: number; meta: ChartMeta, mode: UpdateMode, cancelable: false }, options: O): void;
  /**
   * @desc Called before laying out `chart`. If any plugin returns `false`,
   * the layout update is cancelled until another `update` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart layout.
   */
  beforeLayout?(chart: Chart<TType>, args: { cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called before scale data limits are calculated. This hook is called separately for each scale in the chart.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Scale} args.scale - The scale.
   * @param {object} options - The plugin options.
   */
  beforeDataLimits?(chart: Chart<TType>, args: { scale: Scale }, options: O): void;
  /**
   * @desc Called after scale data limits are calculated. This hook is called separately for each scale in the chart.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Scale} args.scale - The scale.
   * @param {object} options - The plugin options.
   */
  afterDataLimits?(chart: Chart<TType>, args: { scale: Scale }, options: O): void;
  /**
   * @desc Called before scale builds its ticks. This hook is called separately for each scale in the chart.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Scale} args.scale - The scale.
   * @param {object} options - The plugin options.
   */
  beforeBuildTicks?(chart: Chart<TType>, args: { scale: Scale }, options: O): void;
  /**
   * @desc Called after scale has build its ticks. This hook is called separately for each scale in the chart.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Scale} args.scale - The scale.
   * @param {object} options - The plugin options.
   */
  afterBuildTicks?(chart: Chart<TType>, args: { scale: Scale }, options: O): void;
  /**
   * @desc Called after the `chart` has been laid out. Note that this hook will not
   * be called if the layout update has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterLayout?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before rendering `chart`. If any plugin returns `false`,
   * the rendering is cancelled until another `render` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart rendering.
   */
  beforeRender?(chart: Chart<TType>, args: { cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` has been fully rendered (and animation completed). Note
   * that this hook will not be called if the rendering has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterRender?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before drawing `chart` at every animation frame. If any plugin returns `false`,
   * the frame drawing is cancelled untilanother `render` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart drawing.
   */
  beforeDraw?(chart: Chart<TType>, args: { cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` has been drawn. Note that this hook will not be called
   * if the drawing has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterDraw?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * @desc Called before drawing the `chart` datasets. If any plugin returns `false`,
   * the datasets drawing is cancelled until another `render` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart datasets drawing.
   */
  beforeDatasetsDraw?(chart: Chart<TType>, args: { cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` datasets have been drawn. Note that this hook
   * will not be called if the datasets drawing has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterDatasetsDraw?(chart: Chart<TType>, args: EmptyObject, options: O, cancelable: false): void;
  /**
   * @desc Called before drawing the `chart` dataset at the given `args.inde***REMOVED***` (datasets
   * are drawn in the reverse order). If any plugin returns `false`, the datasets drawing
   * is cancelled until another `render` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {number} args.inde***REMOVED*** - The dataset inde***REMOVED***.
   * @param {object} args.meta - The dataset metadata.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart datasets drawing.
   */
  beforeDatasetDraw?(chart: Chart<TType>, args: { inde***REMOVED***: number; meta: ChartMeta }, options: O): boolean | void;
  /**
   * @desc Called after the `chart` datasets at the given `args.inde***REMOVED***` have been drawn
   * (datasets are drawn in the reverse order). Note that this hook will not be called
   * if the datasets drawing has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {number} args.inde***REMOVED*** - The dataset inde***REMOVED***.
   * @param {object} args.meta - The dataset metadata.
   * @param {object} options - The plugin options.
   */
  afterDatasetDraw?(chart: Chart<TType>, args: { inde***REMOVED***: number; meta: ChartMeta }, options: O): void;
  /**
   * @desc Called before processing the specified `event`. If any plugin returns `false`,
   * the event will be discarded.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {ChartEvent} args.event - The event object.
   * @param {boolean} args.replay - True if this event is replayed from `Chart.update`
   * @param {boolean} args.inChartArea - The event position is inside chartArea
   * @param {object} options - The plugin options.
   */
  beforeEvent?(chart: Chart<TType>, args: { event: ChartEvent, replay: boolean, cancelable: true, inChartArea: boolean }, options: O): boolean | void;
  /**
   * @desc Called after the `event` has been consumed. Note that this hook
   * will not be called if the `event` has been previously discarded.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {ChartEvent} args.event - The event object.
   * @param {boolean} args.replay - True if this event is replayed from `Chart.update`
   * @param {boolean} args.inChartArea - The event position is inside chartArea
   * @param {boolean} [args.changed] - Set to true if the plugin needs a render. Should only be changed to true, because this args object is passed through all plugins.
   * @param {object} options - The plugin options.
   */
  afterEvent?(chart: Chart<TType>, args: { event: ChartEvent, replay: boolean, changed?: boolean, cancelable: false, inChartArea: boolean }, options: O): void;
  /**
   * @desc Called after the chart as been resized.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {number} args.size - The new canvas display size (eq. canvas.style width & height).
   * @param {object} options - The plugin options.
   */
  resize?(chart: Chart<TType>, args: { size: { width: number, height: number } }, options: O): void;
  /**
   * Called before the chart is being destroyed.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  beforeDestroy?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * Called after the chart has been destroyed.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   */
  afterDestroy?(chart: Chart<TType>, args: EmptyObject, options: O): void;
  /**
   * Called after chart is destroyed on all plugins that were installed for that chart. This hook is also invoked for disabled plugins (options === false).
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {object} options - The plugin options.
   * @since 3.0.0
   */
  uninstall?(chart: Chart<TType>, args: EmptyObject, options: O): void;

  /**
   * Default options used in the plugin
   */
  defaults?: Partial<O>;
}

e***REMOVED***port declare type ChartComponentLike = ChartComponent | ChartComponent[] | { [key: string]: ChartComponent } | Plugin | Plugin[];

/**
 * Please use the module's default e***REMOVED***port which provides a singleton instance
 * Note: class is e***REMOVED***ported for typedoc
 */
e***REMOVED***port interface Registry {
  readonly controllers: TypedRegistry<DatasetController>;
  readonly elements: TypedRegistry<Element>;
  readonly plugins: TypedRegistry<Plugin>;
  readonly scales: TypedRegistry<Scale>;

  add(...args: ChartComponentLike[]): void;
  remove(...args: ChartComponentLike[]): void;

  addControllers(...args: ChartComponentLike[]): void;
  addElements(...args: ChartComponentLike[]): void;
  addPlugins(...args: ChartComponentLike[]): void;
  addScales(...args: ChartComponentLike[]): void;

  getController(id: string): DatasetController | undefined;
  getElement(id: string): Element | undefined;
  getPlugin(id: string): Plugin | undefined;
  getScale(id: string): Scale | undefined;
}

e***REMOVED***port declare const registry: Registry;

e***REMOVED***port interface Tick {
  value: number;
  label?: string | string[];
  major?: boolean;
}

e***REMOVED***port interface CoreScaleOptions {
  /**
   * Controls the a***REMOVED***is global visibility (visible when true, hidden when false). When display: 'auto', the a***REMOVED***is is visible only if at least one associated dataset is visible.
   * @default true
   */
  display: boolean | 'auto';
  /**
   * Align pi***REMOVED***el values to device pi***REMOVED***els
   */
  alignToPi***REMOVED***els: boolean;
  /**
   * Background color of the scale area.
   */
  backgroundColor: Color;
  /**
   * Reverse the scale.
   * @default false
   */
  reverse: boolean;
  /**
   * Clip the dataset drawing against the size of the scale instead of chart area.
   * @default true
   */
  clip: boolean;
  /**
   * The weight used to sort the a***REMOVED***is. Higher weights are further away from the chart area.
   * @default true
   */
  weight: number;
  /**
   * User defined minimum value for the scale, overrides minimum value from data.
   */
  min: unknown;
  /**
   * User defined ma***REMOVED***imum value for the scale, overrides ma***REMOVED***imum value from data.
   */
  ma***REMOVED***: unknown;
  /**
   * Adjustment used when calculating the ma***REMOVED***imum data value.
   */
  suggestedMin: unknown;
  /**
   * Adjustment used when calculating the minimum data value.
   */
  suggestedMa***REMOVED***: unknown;
  /**
   * Callback called before the update process starts.
   */
  beforeUpdate(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before dimensions are set.
   */
  beforeSetDimensions(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after dimensions are set.
   */
  afterSetDimensions(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before data limits are determined.
   */
  beforeDataLimits(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after data limits are determined.
   */
  afterDataLimits(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before ticks are created.
   */
  beforeBuildTicks(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after ticks are created. Useful for filtering ticks.
   */
  afterBuildTicks(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before ticks are converted into strings.
   */
  beforeTickToLabelConversion(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after ticks are converted into strings.
   */
  afterTickToLabelConversion(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before tick rotation is determined.
   */
  beforeCalculateLabelRotation(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after tick rotation is determined.
   */
  afterCalculateLabelRotation(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs before the scale fits to the canvas.
   */
  beforeFit(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs after the scale fits to the canvas.
   */
  afterFit(a***REMOVED***is: Scale): void;
  /**
   * Callback that runs at the end of the update process.
   */
  afterUpdate(a***REMOVED***is: Scale): void;
}

e***REMOVED***port interface Scale<O e***REMOVED***tends CoreScaleOptions = CoreScaleOptions> e***REMOVED***tends Element<unknown, O>, LayoutItem {
  readonly id: string;
  readonly type: string;
  readonly ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D;
  readonly chart: Chart;

  ma***REMOVED***Width: number;
  ma***REMOVED***Height: number;

  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;

  a***REMOVED***is: string;
  labelRotation: number;
  min: number;
  ma***REMOVED***: number;
  ticks: Tick[];
  getMatchingVisibleMetas(type?: string): ChartMeta[];

  drawTitle(chartArea: ChartArea): void;
  drawLabels(chartArea: ChartArea): void;
  drawGrid(chartArea: ChartArea): void;

  /**
   * @param {number} pi***REMOVED***el
   * @return {number}
   */
  getDecimalForPi***REMOVED***el(pi***REMOVED***el: number): number;
  /**
   * Utility for getting the pi***REMOVED***el location of a percentage of scale
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param {number} decimal
   * @return {number}
   */
  getPi***REMOVED***elForDecimal(decimal: number): number;
  /**
   * Returns the location of the tick at the given inde***REMOVED***
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param {number} inde***REMOVED***
   * @return {number}
   */
  getPi***REMOVED***elForTick(inde***REMOVED***: number): number;
  /**
   * Used to get the label to display in the tooltip for the given value
   * @param {*} value
   * @return {string}
   */
  getLabelForValue(value: number): string;

  /**
   * Returns the grid line width at given value
   */
  getLineWidthForValue(value: number): number;

  /**
   * Returns the location of the given data point. Value can either be an inde***REMOVED*** or a numerical value
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param {*} value
   * @param {number} [inde***REMOVED***]
   * @return {number}
   */
  getPi***REMOVED***elForValue(value: number, inde***REMOVED***?: number): number;

  /**
   * Used to get the data value from a given pi***REMOVED***el. This is the inverse of getPi***REMOVED***elForValue
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @param {number} pi***REMOVED***el
   * @return {*}
   */
  getValueForPi***REMOVED***el(pi***REMOVED***el: number): number | undefined;

  getBaseValue(): number;
  /**
   * Returns the pi***REMOVED***el for the minimum chart value
   * The coordinate (0, 0) is at the upper-left corner of the canvas
   * @return {number}
   */
  getBasePi***REMOVED***el(): number;

  init(options: O): void;
  parse(raw: unknown, inde***REMOVED***?: number): unknown;
  getUserBounds(): { min: number; ma***REMOVED***: number; minDefined: boolean; ma***REMOVED***Defined: boolean };
  getMinMa***REMOVED***(canStack: boolean): { min: number; ma***REMOVED***: number };
  getTicks(): Tick[];
  getLabels(): string[];
  getLabelItems(chartArea?: ChartArea): LabelItem[];
  beforeUpdate(): void;
  configure(): void;
  afterUpdate(): void;
  beforeSetDimensions(): void;
  setDimensions(): void;
  afterSetDimensions(): void;
  beforeDataLimits(): void;
  determineDataLimits(): void;
  afterDataLimits(): void;
  beforeBuildTicks(): void;
  buildTicks(): Tick[];
  afterBuildTicks(): void;
  beforeTickToLabelConversion(): void;
  generateTickLabels(ticks: Tick[]): void;
  afterTickToLabelConversion(): void;
  beforeCalculateLabelRotation(): void;
  calculateLabelRotation(): void;
  afterCalculateLabelRotation(): void;
  beforeFit(): void;
  fit(): void;
  afterFit(): void;

  isFullSize(): boolean;
}
e***REMOVED***port declare class Scale {
  constructor(cfg: {id: string, type: string, ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, chart: Chart});
}

e***REMOVED***port interface ScriptableScaleConte***REMOVED***t {
  chart: Chart;
  scale: Scale;
  inde***REMOVED***: number;
  tick: Tick;
}

e***REMOVED***port interface ScriptableScalePointLabelConte***REMOVED***t {
  chart: Chart;
  scale: Scale;
  inde***REMOVED***: number;
  label: string;
  type: string;
}

e***REMOVED***port interface RenderTe***REMOVED***tOpts {
  /**
   * The fill color of the te***REMOVED***t. If unset, the e***REMOVED***isting
   * fillStyle property of the canvas is unchanged.
   */
  color?: Color;

  /**
   * The width of the strikethrough / underline
   * @default 2
   */
  decorationWidth?: number;

  /**
   * The ma***REMOVED*** width of the te***REMOVED***t in pi***REMOVED***els
   */
  ma***REMOVED***Width?: number;

  /**
   * A rotation to be applied to the canvas
   * This is applied after the translation is applied
   */
  rotation?: number;

  /**
   * Apply a strikethrough effect to the te***REMOVED***t
   */
  strikethrough?: boolean;

  /**
   * The color of the te***REMOVED***t stroke. If unset, the e***REMOVED***isting
   * strokeStyle property of the conte***REMOVED***t is unchanged
   */
  strokeColor?: Color;

  /**
   * The te***REMOVED***t stroke width. If unset, the e***REMOVED***isting
   * lineWidth property of the conte***REMOVED***t is unchanged
   */
  strokeWidth?: number;

  /**
   * The te***REMOVED***t alignment to use. If unset, the e***REMOVED***isting
   * te***REMOVED***tAlign property of the conte***REMOVED***t is unchanged
   */
  te***REMOVED***tAlign?: CanvasTe***REMOVED***tAlign;

  /**
   * The te***REMOVED***t baseline to use. If unset, the e***REMOVED***isting
   * te***REMOVED***tBaseline property of the conte***REMOVED***t is unchanged
   */
  te***REMOVED***tBaseline?: CanvasTe***REMOVED***tBaseline;

  /**
   * If specified, a translation to apply to the conte***REMOVED***t
   */
  translation?: [number, number];

  /**
   * Underline the te***REMOVED***t
   */
  underline?: boolean;

  /**
   * Dimensions for drawing the label backdrop
   */
  backdrop?: BackdropOptions;
}

e***REMOVED***port interface BackdropOptions {
  /**
   * Left position of backdrop as pi***REMOVED***el
   */
  left: number;

  /**
   * Top position of backdrop as pi***REMOVED***el
   */
  top: number;

  /**
   * Width of backdrop in pi***REMOVED***els
   */
  width: number;

  /**
   * Height of backdrop in pi***REMOVED***els
   */
  height: number;

  /**
   * Color of label backdrops.
   */
  color: Scriptable<Color, ScriptableScaleConte***REMOVED***t>;
}

e***REMOVED***port interface LabelItem {
  label: string | string[];
  font: CanvasFontSpec;
  te***REMOVED***tOffset: number;
  options: RenderTe***REMOVED***tOpts;
}

e***REMOVED***port declare const Ticks: {
  formatters: {
    /**
     * Formatter for value labels
     * @param value the value to display
     * @return {string|string[]} the label to display
     */
    values(value: unknown): string | string[];
    /**
     * Formatter for numeric ticks
     * @param tickValue the value to be formatted
     * @param inde***REMOVED*** the position of the tickValue parameter in the ticks array
     * @param ticks the list of ticks being converted
     * @return string representation of the tickValue parameter
     */
    numeric(tickValue: number, inde***REMOVED***: number, ticks: { value: number }[]): string;
    /**
     * Formatter for logarithmic ticks
     * @param tickValue the value to be formatted
     * @param inde***REMOVED*** the position of the tickValue parameter in the ticks array
     * @param ticks the list of ticks being converted
     * @return string representation of the tickValue parameter
     */
    logarithmic(tickValue: number, inde***REMOVED***: number, ticks: { value: number }[]): string;
  };
};

e***REMOVED***port interface TypedRegistry<T> {
  /**
   * @param {ChartComponent} item
   * @returns {string} The scope where items defaults were registered to.
   */
  register(item: ChartComponent): string;
  get(id: string): T | undefined;
  unregister(item: ChartComponent): void;
}

e***REMOVED***port interface ChartEvent {
  type:
  | 'conte***REMOVED***tmenu'
  | 'mouseenter'
  | 'mousedown'
  | 'mousemove'
  | 'mouseup'
  | 'mouseout'
  | 'click'
  | 'dblclick'
  | 'keydown'
  | 'keypress'
  | 'keyup'
  | 'resize';
  native: Event | null;
  ***REMOVED***: number | null;
  y: number | null;
}
e***REMOVED***port interface ChartComponent {
  id: string;
  defaults?: AnyObject;
  defaultRoutes?: { [property: string]: string };

  beforeRegister?(): void;
  afterRegister?(): void;
  beforeUnregister?(): void;
  afterUnregister?(): void;
}

e***REMOVED***port type InteractionA***REMOVED***is = '***REMOVED***' | 'y' | '***REMOVED***y' | 'r';

e***REMOVED***port interface CoreInteractionOptions {
  /**
   * Sets which elements appear in the tooltip. See Interaction Modes for details.
   * @default 'nearest'
   */
  mode: InteractionMode;
  /**
   * if true, the hover mode only applies when the mouse position intersects an item on the chart.
   * @default true
   */
  intersect: boolean;

  /**
   * Defines which directions are used in calculating distances. Defaults to '***REMOVED***' for 'inde***REMOVED***' mode and '***REMOVED***y' in dataset and 'nearest' modes.
   */
  a***REMOVED***is: InteractionA***REMOVED***is;

  /**
   * if true, the invisible points that are outside of the chart area will also be included when evaluating interactions.
   * @default false
   */
  includeInvisible: boolean;
}

e***REMOVED***port interface CoreChartOptions<TType e***REMOVED***tends ChartType> e***REMOVED***tends ParsingOptions, AnimationOptions<TType> {

  datasets: {
    [key in ChartType]: ChartTypeRegistry[key]['datasetOptions']
  }

  /**
   * The base a***REMOVED***is of the chart. '***REMOVED***' for vertical charts and 'y' for horizontal charts.
   * @default '***REMOVED***'
   */
  inde***REMOVED***A***REMOVED***is: '***REMOVED***' | 'y';

  /**
   * How to clip relative to chartArea. Positive value allows overflow, negative value clips that many pi***REMOVED***els inside chartArea. 0 = clip at chartArea. Clipping can also be configured per side: `clip: {left: 5, top: false, right: -2, bottom: 0}`
   */
  clip: number | ChartArea | false;

  /**
   * base color
   * @see Defaults.color
   */
  color: Scriptable<Color, ScriptableConte***REMOVED***t<TType>>;
  /**
   * base background color
   * @see Defaults.backgroundColor
   */
  backgroundColor: Scriptable<Color, ScriptableConte***REMOVED***t<TType>>;
  /**
   * base border color
   * @see Defaults.borderColor
   */
  borderColor: Scriptable<Color, ScriptableConte***REMOVED***t<TType>>;
  /**
   * base font
   * @see Defaults.font
   */
  font: Partial<FontSpec>;
  /**
   * Resizes the chart canvas when its container does (important note...).
   * @default true
   */
  responsive: boolean;
  /**
   * Maintain the original canvas aspect ratio (width / height) when resizing. For this option to work properly the chart must be in its own dedicated container.
   * @default true
   */
  maintainAspectRatio: boolean;
  /**
   * Delay the resize update by give amount of milliseconds. This can ease the resize process by debouncing update of the elements.
   * @default 0
   */
  resizeDelay: number;

  /**
   * Canvas aspect ratio (i.e. width / height, a value of 1 representing a square canvas). Note that this option is ignored if the height is e***REMOVED***plicitly defined either as attribute or via the style.
   * @default 2
   */
  aspectRatio: number;

  /**
   * Locale used for number formatting (using `Intl.NumberFormat`).
   * @default user's browser setting
   */
  locale: string;

  /**
   * Called when a resize occurs. Gets passed two arguments: the chart instance and the new size.
   */
  onResize(chart: Chart, size: { width: number; height: number }): void;

  /**
   * Override the window's default devicePi***REMOVED***elRatio.
   * @default window.devicePi***REMOVED***elRatio
   */
  devicePi***REMOVED***elRatio: number;

  interaction: CoreInteractionOptions;

  hover: CoreInteractionOptions;

  /**
   * The events option defines the browser events that the chart should listen to for tooltips and hovering.
   * @default ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
   */
  events: (keyof HTMLElementEventMap)[]

  /**
   * Called when any of the events fire. Passed the event, an array of active elements (bars, points, etc), and the chart.
   */
  onHover(event: ChartEvent, elements: ActiveElement[], chart: Chart): void;

  /**
   * Called if the event is of type 'mouseup' or 'click'. Passed the event, an array of active elements, and the chart.
   */
  onClick(event: ChartEvent, elements: ActiveElement[], chart: Chart): void;

  layout: Partial<{
    autoPadding: boolean;
    padding: Scriptable<Padding, ScriptableConte***REMOVED***t<TType>>;
  }>;
}

e***REMOVED***port type AnimationSpec<TType e***REMOVED***tends ChartType> = {
  /**
   * The number of milliseconds an animation takes.
   * @default 1000
   */
  duration?: Scriptable<number, ScriptableConte***REMOVED***t<TType>>;
  /**
   * Easing function to use
   * @default 'easeOutQuart'
   */
  easing?: Scriptable<EasingFunction, ScriptableConte***REMOVED***t<TType>>;

  /**
   * Delay before starting the animations.
   * @default 0
   */
  delay?: Scriptable<number, ScriptableConte***REMOVED***t<TType>>;

  /**
   *   If set to true, the animations loop endlessly.
   * @default false
   */
  loop?: Scriptable<boolean, ScriptableConte***REMOVED***t<TType>>;
}

e***REMOVED***port type AnimationsSpec<TType e***REMOVED***tends ChartType> = {
  [name: string]: false | AnimationSpec<TType> & {
    properties: string[];

    /**
     * Type of property, determines the interpolator used. Possible values: 'number', 'color' and 'boolean'. Only really needed for 'color', because typeof does not get that right.
     */
    type: 'color' | 'number' | 'boolean';

    fn: <T>(from: T, to: T, factor: number) => T;

    /**
     * Start value for the animation. Current value is used when undefined
     */
    from: Scriptable<Color | number | boolean, ScriptableConte***REMOVED***t<TType>>;
    /**
     *
     */
    to: Scriptable<Color | number | boolean, ScriptableConte***REMOVED***t<TType>>;
  }
}

e***REMOVED***port type TransitionSpec<TType e***REMOVED***tends ChartType> = {
  animation: AnimationSpec<TType>;
  animations: AnimationsSpec<TType>;
}

e***REMOVED***port type TransitionsSpec<TType e***REMOVED***tends ChartType> = {
  [mode: string]: TransitionSpec<TType>
}

e***REMOVED***port type AnimationOptions<TType e***REMOVED***tends ChartType> = {
  animation: false | AnimationSpec<TType> & {
    /**
     * Callback called on each step of an animation.
     */
    onProgress?: (this: Chart, event: AnimationEvent) => void;
    /**
     * Callback called when all animations are completed.
     */
    onComplete?: (this: Chart, event: AnimationEvent) => void;
  };
  animations: AnimationsSpec<TType>;
  transitions: TransitionsSpec<TType>;
};

e***REMOVED***port interface FontSpec {
  /**
   * Default font family for all te***REMOVED***t, follows CSS font-family options.
   * @default "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
   */
  family: string;
  /**
   * Default font size (in p***REMOVED***) for te***REMOVED***t. Does not apply to radialLinear scale point labels.
   * @default 12
   */
  size: number;
  /**
   * Default font style. Does not apply to tooltip title or footer. Does not apply to chart title. Follows CSS font-style options (i.e. normal, italic, oblique, initial, inherit)
   * @default 'normal'
   */
  style: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit';
  /**
   * Default font weight (boldness). (see MDN).
   */
  weight: 'normal' | 'bold' | 'lighter' | 'bolder' | number | null;
  /**
   * Height of an individual line of te***REMOVED***t (see MDN).
   * @default 1.2
   */
  lineHeight: number | string;
}

e***REMOVED***port interface CanvasFontSpec e***REMOVED***tends FontSpec {
  string: string;
}

e***REMOVED***port type Te***REMOVED***tAlign = 'left' | 'center' | 'right';
e***REMOVED***port type Align = 'start' | 'center' | 'end';

e***REMOVED***port interface VisualElement {
  draw(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, area?: ChartArea): void;
  inRange(mouseX: number, mouseY: number, useFinalPosition?: boolean): boolean;
  inXRange(mouseX: number, useFinalPosition?: boolean): boolean;
  inYRange(mouseY: number, useFinalPosition?: boolean): boolean;
  getCenterPoint(useFinalPosition?: boolean): Point;
  getRange?(a***REMOVED***is: '***REMOVED***' | 'y'): number;
}

e***REMOVED***port interface CommonElementOptions {
  borderWidth: number;
  borderColor: Color;
  backgroundColor: Color;
}

e***REMOVED***port interface CommonHoverOptions {
  hoverBorderWidth: number;
  hoverBorderColor: Color;
  hoverBackgroundColor: Color;
}

e***REMOVED***port interface Segment {
  start: number;
  end: number;
  loop: boolean;
}

e***REMOVED***port interface ArcBorderRadius {
  outerStart: number;
  outerEnd: number;
  innerStart: number;
  innerEnd: number;
}

e***REMOVED***port interface ArcOptions e***REMOVED***tends CommonElementOptions {
  /**
   * Arc stroke alignment.
   */
  borderAlign: 'center' | 'inner';
  /**
   * Line dash. See MDN.
   * @default []
   */
  borderDash: number[];
  /**
   * Line dash offset. See MDN.
   * @default 0.0
   */
  borderDashOffset: number;
  /**
   * Line join style. See MDN. Default is 'round' when `borderAlign` is 'inner', else 'bevel'.
   */
  borderJoinStyle: CanvasLineJoin;

  /**
   * Sets the border radius for arcs
   * @default 0
   */
  borderRadius: number | ArcBorderRadius;

  /**
   * Arc offset (in pi***REMOVED***els).
   */
  offset: number;

  /**
   * If false, Arc will be flat.
   * @default true
   */
  circular: boolean;

  /**
   * Spacing between arcs
   */
  spacing: number
}

e***REMOVED***port interface ArcHoverOptions e***REMOVED***tends CommonHoverOptions {
  hoverBorderDash: number[];
  hoverBorderDashOffset: number;
  hoverOffset: number;
}

e***REMOVED***port interface LineProps {
  points: Point[]
}

e***REMOVED***port interface LineOptions e***REMOVED***tends CommonElementOptions {
  /**
   * Line cap style. See MDN.
   * @default 'butt'
   */
  borderCapStyle: CanvasLineCap;
  /**
   * Line dash. See MDN.
   * @default []
   */
  borderDash: number[];
  /**
   * Line dash offset. See MDN.
   * @default 0.0
   */
  borderDashOffset: number;
  /**
   * Line join style. See MDN.
   * @default 'miter'
   */
  borderJoinStyle: CanvasLineJoin;
  /**
   *   true to keep Bézier control inside the chart, false for no restriction.
   * @default true
   */
  capBezierPoints: boolean;
  /**
   * Interpolation mode to apply.
   * @default 'default'
   */
  cubicInterpolationMode: 'default' | 'monotone';
  /**
   * Bézier curve tension (0 for no Bézier curves).
   * @default 0
   */
  tension: number;
  /**
   * true to show the line as a stepped line (tension will be ignored).
   * @default false
   */
  stepped: 'before' | 'after' | 'middle' | boolean;
  /**
   * Both line and radar charts support a fill option on the dataset object which can be used to create area between two datasets or a dataset and a boundary, i.e. the scale origin, start or end
   */
  fill: FillTarget | Comple***REMOVED***FillTarget;
  /**
   * If true, lines will be drawn between points with no or null data. If false, points with NaN data will create a break in the line. Can also be a number specifying the ma***REMOVED***imum gap length to span. The unit of the value depends on the scale used.
   */
  spanGaps: boolean | number;

  segment: {
    backgroundColor: Scriptable<Color|undefined, ScriptableLineSegmentConte***REMOVED***t>,
    borderColor: Scriptable<Color|undefined, ScriptableLineSegmentConte***REMOVED***t>,
    borderCapStyle: Scriptable<CanvasLineCap|undefined, ScriptableLineSegmentConte***REMOVED***t>;
    borderDash: Scriptable<number[]|undefined, ScriptableLineSegmentConte***REMOVED***t>;
    borderDashOffset: Scriptable<number|undefined, ScriptableLineSegmentConte***REMOVED***t>;
    borderJoinStyle: Scriptable<CanvasLineJoin|undefined, ScriptableLineSegmentConte***REMOVED***t>;
    borderWidth: Scriptable<number|undefined, ScriptableLineSegmentConte***REMOVED***t>;
  };
}

e***REMOVED***port interface LineHoverOptions e***REMOVED***tends CommonHoverOptions {
  hoverBorderCapStyle: CanvasLineCap;
  hoverBorderDash: number[];
  hoverBorderDashOffset: number;
  hoverBorderJoinStyle: CanvasLineJoin;
}

e***REMOVED***port interface LineElement<T e***REMOVED***tends LineProps = LineProps, O e***REMOVED***tends LineOptions = LineOptions>
  e***REMOVED***tends Element<T, O>,
  VisualElement {
  updateControlPoints(chartArea: ChartArea, inde***REMOVED***A***REMOVED***is?: '***REMOVED***' | 'y'): void;
  points: Point[];
  readonly segments: Segment[];
  first(): Point | false;
  last(): Point | false;
  interpolate(point: Point, property: '***REMOVED***' | 'y'): undefined | Point | Point[];
  pathSegment(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D, segment: Segment, params: AnyObject): undefined | boolean;
  path(ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D): boolean;
}

e***REMOVED***port declare const LineElement: ChartComponent & {
  prototype: LineElement;
  new (cfg: AnyObject): LineElement;
};

e***REMOVED***port type PointStyle =
  | 'circle'
  | 'cross'
  | 'crossRot'
  | 'dash'
  | 'line'
  | 'rect'
  | 'rectRounded'
  | 'rectRot'
  | 'star'
  | 'triangle'
  | false
  | HTMLImageElement
  | HTMLCanvasElement;

e***REMOVED***port interface PointOptions e***REMOVED***tends CommonElementOptions {
  /**
   * Point radius
   * @default 3
   */
  radius: number;
  /**
   * E***REMOVED***tra radius added to point radius for hit detection.
   * @default 1
   */
  hitRadius: number;
  /**
   * Point style
   * @default 'circle;
   */
  pointStyle: PointStyle;
  /**
   * Point rotation (in degrees).
   * @default 0
   */
  rotation: number;
  /**
   * Draw the active elements over the other elements of the dataset,
   * @default true
   */
  drawActiveElementsOnTop: boolean;
}

e***REMOVED***port interface PointHoverOptions e***REMOVED***tends CommonHoverOptions {
  /**
   * Point radius when hovered.
   * @default 4
   */
  hoverRadius: number;
}

e***REMOVED***port interface PointPrefi***REMOVED***edOptions {
  /**
   * The fill color for points.
   */
  pointBackgroundColor: Color;
  /**
   * The border color for points.
   */
  pointBorderColor: Color;
  /**
   * The width of the point border in pi***REMOVED***els.
   */
  pointBorderWidth: number;
  /**
   * The pi***REMOVED***el size of the non-displayed point that reacts to mouse events.
   */
  pointHitRadius: number;
  /**
   * The radius of the point shape. If set to 0, the point is not rendered.
   */
  pointRadius: number;
  /**
   * The rotation of the point in degrees.
   */
  pointRotation: number;
  /**
   * Style of the point.
   */
  pointStyle: PointStyle;
}

e***REMOVED***port interface PointPrefi***REMOVED***edHoverOptions {
  /**
   * Point background color when hovered.
   */
  pointHoverBackgroundColor: Color;
  /**
   * Point border color when hovered.
   */
  pointHoverBorderColor: Color;
  /**
   * Border width of point when hovered.
   */
  pointHoverBorderWidth: number;
  /**
   * The radius of the point when hovered.
   */
  pointHoverRadius: number;
}

e***REMOVED***port interface BarProps e***REMOVED***tends Point {
  base: number;
  horizontal: boolean;
  width: number;
  height: number;
}

e***REMOVED***port interface BarOptions e***REMOVED***tends Omit<CommonElementOptions, 'borderWidth'> {
  /**
   * The base value for the bar in data units along the value a***REMOVED***is.
   */
  base: number;

  /**
   * Skipped (e***REMOVED***cluded) border: 'start', 'end', 'left',  'right', 'bottom', 'top', 'middle', false (none) or true (all).
   * @default 'start'
   */
  borderSkipped: 'start' | 'end' | 'left' | 'right' | 'bottom' | 'top' | 'middle' | boolean;

  /**
   * Border radius
   * @default 0
   */
  borderRadius: number | BorderRadius;

  /**
   * Amount to inflate the rectangle(s). This can be used to hide artifacts between bars.
   * Unit is pi***REMOVED***els. 'auto' translates to 0.33 pi***REMOVED***els when barPercentage * categoryPercentage is 1, else 0.
   * @default 'auto'
   */
  inflateAmount: number | 'auto';

  /**
   * Width of the border, number for all sides, object to specify width for each side specifically
   * @default 0
   */
  borderWidth: number | { top?: number, right?: number, bottom?: number, left?: number };
}

e***REMOVED***port interface BorderRadius {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

e***REMOVED***port interface BarHoverOptions e***REMOVED***tends CommonHoverOptions {
  hoverBorderRadius: number | BorderRadius;
}

e***REMOVED***port interface BarElement<
  T e***REMOVED***tends BarProps = BarProps,
  O e***REMOVED***tends BarOptions = BarOptions
> e***REMOVED***tends Element<T, O>, VisualElement {}

e***REMOVED***port declare const BarElement: ChartComponent & {
  prototype: BarElement;
  new (cfg: AnyObject): BarElement;
};

e***REMOVED***port interface ElementOptionsByType<TType e***REMOVED***tends ChartType> {
  arc: ScriptableAndArrayOptions<ArcOptions & ArcHoverOptions, ScriptableConte***REMOVED***t<TType>>;
  bar: ScriptableAndArrayOptions<BarOptions & BarHoverOptions, ScriptableConte***REMOVED***t<TType>>;
  line: ScriptableAndArrayOptions<LineOptions & LineHoverOptions, ScriptableConte***REMOVED***t<TType>>;
  point: ScriptableAndArrayOptions<PointOptions & PointHoverOptions, ScriptableConte***REMOVED***t<TType>>;
}

e***REMOVED***port type ElementChartOptions<TType e***REMOVED***tends ChartType = ChartType> = {
  elements: ElementOptionsByType<TType>
};

e***REMOVED***port declare class BasePlatform {
  /**
   * Called at chart construction time, returns a conte***REMOVED***t2d instance implementing
   * the [W3C Canvas 2D Conte***REMOVED***t API standard]{@link https://www.w3.org/TR/2dconte***REMOVED***t/}.
   * @param {HTMLCanvasElement} canvas - The canvas from which to acquire conte***REMOVED***t (platform specific)
   * @param options - The chart options
   */
  acquireConte***REMOVED***t(
    canvas: HTMLCanvasElement,
    options?: CanvasRenderingConte***REMOVED***t2DSettings
  ): CanvasRenderingConte***REMOVED***t2D | null;
  /**
   * Called at chart destruction time, releases any resources associated to the conte***REMOVED***t
   * previously returned by the acquireConte***REMOVED***t() method.
   * @param {CanvasRenderingConte***REMOVED***t2D} conte***REMOVED***t - The conte***REMOVED***t2d instance
   * @returns {boolean} true if the method succeeded, else false
   */
  releaseConte***REMOVED***t(conte***REMOVED***t: CanvasRenderingConte***REMOVED***t2D): boolean;
  /**
   * Registers the specified listener on the given chart.
   * @param {Chart} chart - Chart from which to listen for event
   * @param {string} type - The ({@link ChartEvent}) type to listen for
   * @param listener - Receives a notification (an object that implements
   * the {@link ChartEvent} interface) when an event of the specified type occurs.
   */
  addEventListener(chart: Chart, type: string, listener: (e: ChartEvent) => void): void;
  /**
   * Removes the specified listener previously registered with addEventListener.
   * @param {Chart} chart - Chart from which to remove the listener
   * @param {string} type - The ({@link ChartEvent}) type to remove
   * @param listener - The listener function to remove from the event target.
   */
  removeEventListener(chart: Chart, type: string, listener: (e: ChartEvent) => void): void;
  /**
   * @returns {number} the current devicePi***REMOVED***elRatio of the device this platform is connected to.
   */
  getDevicePi***REMOVED***elRatio(): number;
  /**
   * @param {HTMLCanvasElement} canvas - The canvas for which to calculate the ma***REMOVED***imum size
   * @param {number} [width] - Parent element's content width
   * @param {number} [height] - Parent element's content height
   * @param {number} [aspectRatio] - The aspect ratio to maintain
   * @returns { width: number, height: number } the ma***REMOVED***imum size available.
   */
  getMa***REMOVED***imumSize(canvas: HTMLCanvasElement, width?: number, height?: number, aspectRatio?: number): { width: number, height: number };
  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {boolean} true if the canvas is attached to the platform, false if not.
   */
  isAttached(canvas: HTMLCanvasElement): boolean;
  /**
   * Updates config with platform specific requirements
   * @param {ChartConfiguration | ChartConfigurationCustomTypes} config
   */
  updateConfig(config: ChartConfiguration | ChartConfigurationCustomTypesPerDataset): void;
}

e***REMOVED***port declare class BasicPlatform e***REMOVED***tends BasePlatform {}
e***REMOVED***port declare class DomPlatform e***REMOVED***tends BasePlatform {}

e***REMOVED***port declare const Decimation: Plugin;

e***REMOVED***port declare const enum DecimationAlgorithm {
  lttb = 'lttb',
  minma***REMOVED*** = 'min-ma***REMOVED***',
}
interface BaseDecimationOptions {
  enabled: boolean;
  threshold?: number;
}

interface LttbDecimationOptions e***REMOVED***tends BaseDecimationOptions {
  algorithm: DecimationAlgorithm.lttb | 'lttb';
  samples?: number;
}

interface MinMa***REMOVED***DecimationOptions e***REMOVED***tends BaseDecimationOptions {
  algorithm: DecimationAlgorithm.minma***REMOVED*** | 'min-ma***REMOVED***';
}

e***REMOVED***port type DecimationOptions = LttbDecimationOptions | MinMa***REMOVED***DecimationOptions;

e***REMOVED***port declare const Filler: Plugin;
e***REMOVED***port interface FillerOptions {
  drawTime: 'beforeDraw' | 'beforeDatasetDraw' | 'beforeDatasetsDraw';
  propagate: boolean;
}

e***REMOVED***port type FillTarget = number | string | { value: number } | 'start' | 'end' | 'origin' | 'stack' | 'shape' | boolean;

e***REMOVED***port interface Comple***REMOVED***FillTarget {
  /**
   * The accepted values are the same as the filling mode values, so you may use absolute and relative dataset inde***REMOVED***es and/or boundaries.
   */
  target: FillTarget;
  /**
   * If no color is set, the default color will be the background color of the chart.
   */
  above: Color;
  /**
   * Same as the above.
   */
  below: Color;
}

e***REMOVED***port interface FillerControllerDatasetOptions {
  /**
   * Both line and radar charts support a fill option on the dataset object which can be used to create area between two datasets or a dataset and a boundary, i.e. the scale origin, start or end
   */
  fill: FillTarget | Comple***REMOVED***FillTarget;
}

e***REMOVED***port declare const Legend: Plugin;

e***REMOVED***port interface LegendItem {
  /**
   * Label that will be displayed
   */
  te***REMOVED***t: string;

  /**
   * Border radius of the legend bo***REMOVED***
   * @since 3.1.0
   */
  borderRadius?: number | BorderRadius;

  /**
   * Inde***REMOVED*** of the associated dataset
   */
  datasetInde***REMOVED***?: number;

  /**
   * Inde***REMOVED*** the associated label in the labels array
   */
  inde***REMOVED***?: number

  /**
   * Fill style of the legend bo***REMOVED***
   */
  fillStyle?: Color;

  /**
   * Font color for the te***REMOVED***t
   * Defaults to LegendOptions.labels.color
   */
  fontColor?: Color;

  /**
   * If true, this item represents a hidden dataset. Label will be rendered with a strike-through effect
   */
  hidden?: boolean;

  /**
   * For bo***REMOVED*** border.
   * @see https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingConte***REMOVED***t2D/lineCap
   */
  lineCap?: CanvasLineCap;

  /**
   * For bo***REMOVED*** border.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingConte***REMOVED***t2D/setLineDash
   */
  lineDash?: number[];

  /**
   * For bo***REMOVED*** border.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingConte***REMOVED***t2D/lineDashOffset
   */
  lineDashOffset?: number;

  /**
   * For bo***REMOVED*** border.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingConte***REMOVED***t2D/lineJoin
   */
  lineJoin?: CanvasLineJoin;

  /**
   * Width of bo***REMOVED*** border
   */
  lineWidth?: number;

  /**
   * Stroke style of the legend bo***REMOVED***
   */
  strokeStyle?: Color;

  /**
   * Point style of the legend bo***REMOVED*** (only used if usePointStyle is true)
   */
  pointStyle?: PointStyle;

  /**
   * Rotation of the point in degrees (only used if usePointStyle is true)
   */
  rotation?: number;

  /**
   * Te***REMOVED***t alignment
   */
  te***REMOVED***tAlign?: Te***REMOVED***tAlign;
}

e***REMOVED***port interface LegendElement<TType e***REMOVED***tends ChartType> e***REMOVED***tends Element<AnyObject, LegendOptions<TType>>, LayoutItem {
  chart: Chart<TType>;
  ct***REMOVED***: CanvasRenderingConte***REMOVED***t2D;
  legendItems?: LegendItem[];
  options: LegendOptions<TType>;
}

e***REMOVED***port interface LegendOptions<TType e***REMOVED***tends ChartType> {
  /**
   * Is the legend shown?
   * @default true
   */
  display: boolean;
  /**
   * Position of the legend.
   * @default 'top'
   */
  position: LayoutPosition;
  /**
   * Alignment of the legend.
   * @default 'center'
   */
  align: Align;
  /**
   * Ma***REMOVED***imum height of the legend, in pi***REMOVED***els
   */
  ma***REMOVED***Height: number;
  /**
   * Ma***REMOVED***imum width of the legend, in pi***REMOVED***els
   */
  ma***REMOVED***Width: number;
  /**
   * Marks that this bo***REMOVED*** should take the full width/height of the canvas (moving other bo***REMOVED***es). This is unlikely to need to be changed in day-to-day use.
   * @default true
   */
  fullSize: boolean;
  /**
   * Legend will show datasets in reverse order.
   * @default false
   */
  reverse: boolean;
  /**
   * A callback that is called when a click event is registered on a label item.
   */
  onClick(this: LegendElement<TType>, e: ChartEvent, legendItem: LegendItem, legend: LegendElement<TType>): void;
  /**
   * A callback that is called when a 'mousemove' event is registered on top of a label item
   */
  onHover(this: LegendElement<TType>, e: ChartEvent, legendItem: LegendItem, legend: LegendElement<TType>): void;
  /**
   * A callback that is called when a 'mousemove' event is registered outside of a previously hovered label item.
   */
  onLeave(this: LegendElement<TType>, e: ChartEvent, legendItem: LegendItem, legend: LegendElement<TType>): void;

  labels: {
    /**
     * Width of colored bo***REMOVED***.
     * @default 40
     */
    bo***REMOVED***Width: number;
    /**
     * Height of the coloured bo***REMOVED***.
     * @default fontSize
     */
    bo***REMOVED***Height: number;
    /**
     * Padding between the color bo***REMOVED*** and the te***REMOVED***t
     * @default 1
     */
    bo***REMOVED***Padding: number;
    /**
     * Color of label
     * @see Defaults.color
     */
    color: Color;
    /**
     * Font of label
     * @see Defaults.font
     */
    font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableChartConte***REMOVED***t>;
    /**
     * Padding between rows of colored bo***REMOVED***es.
     * @default 10
     */
    padding: number;
    /**
     * If usePointStyle is true, the width of the point style used for the legend.
     */
    pointStyleWidth: number;
    /**
     * Generates legend items for each thing in the legend. Default implementation returns the te***REMOVED***t + styling for the color bo***REMOVED***. See Legend Item for details.
     */
    generateLabels(chart: Chart): LegendItem[];

    /**
     * Filters legend items out of the legend. Receives 2 parameters, a Legend Item and the chart data
     */
    filter(item: LegendItem, data: ChartData): boolean;

    /**
     * Sorts the legend items
     */
    sort(a: LegendItem, b: LegendItem, data: ChartData): number;

    /**
     * Override point style for the legend. Only applies if usePointStyle is true
     */
    pointStyle: PointStyle;

    /**
     * Te***REMOVED***t alignment
     */
    te***REMOVED***tAlign?: Te***REMOVED***tAlign;

    /**
     * Label style will match corresponding point style (size is based on the minimum value between bo***REMOVED***Width and font.size).
     * @default false
     */
    usePointStyle: boolean;

    /**
     * Label borderRadius will match corresponding borderRadius.
     * @default false
     */
    useBorderRadius: boolean;

    /**
     * Override the borderRadius to use.
     * @default undefined
     */
    borderRadius: number;
  };
  /**
   * true for rendering the legends from right to left.
   */
  rtl: boolean;
  /**
   * This will force the te***REMOVED***t direction 'rtl' or 'ltr' on the canvas for rendering the legend, regardless of the css specified on the canvas
   * @default canvas's default
   */
  te***REMOVED***tDirection: string;

  title: {
    /**
     * Is the legend title displayed.
     * @default false
     */
    display: boolean;
    /**
     * Color of title
     * @see Defaults.color
     */
    color: Color;
    /**
     * see Fonts
     */
    font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableChartConte***REMOVED***t>;
    position: 'center' | 'start' | 'end';
    padding?: number | ChartArea;
    /**
     * The string title.
     */
    te***REMOVED***t: string;
  };
}

e***REMOVED***port declare const SubTitle: Plugin;
e***REMOVED***port declare const Title: Plugin;

e***REMOVED***port interface TitleOptions {
  /**
   * Alignment of the title.
   * @default 'center'
   */
  align: Align;
  /**
   * Is the title shown?
   * @default false
   */
  display: boolean;
  /**
   * Position of title
   * @default 'top'
   */
  position: 'top' | 'left' | 'bottom' | 'right';
  /**
   * Color of te***REMOVED***t
   * @see Defaults.color
   */
  color: Color;
  font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableChartConte***REMOVED***t>;

  /**
   * Marks that this bo***REMOVED*** should take the full width/height of the canvas (moving other bo***REMOVED***es). If set to `false`, places the bo***REMOVED*** above/beside the
   * chart area
   * @default true
   */
  fullSize: boolean;
  /**
   *   Adds padding above and below the title te***REMOVED***t if a single number is specified. It is also possible to change top and bottom padding separately.
   */
  padding: number | { top: number; bottom: number };
  /**
   *   Title te***REMOVED***t to display. If specified as an array, te***REMOVED***t is rendered on multiple lines.
   */
  te***REMOVED***t: string | string[];
}

e***REMOVED***port type TooltipXAlignment = 'left' | 'center' | 'right';
e***REMOVED***port type TooltipYAlignment = 'top' | 'center' | 'bottom';
e***REMOVED***port interface TooltipLabelStyle {
  borderColor: Color;
  backgroundColor: Color;

  /**
   * Width of border line
   * @since 3.1.0
   */
  borderWidth?: number;

  /**
   * Border dash
   * @since 3.1.0
   */
  borderDash?: [number, number];

  /**
   * Border dash offset
   * @since 3.1.0
   */
  borderDashOffset?: number;

  /**
   * borderRadius
   * @since 3.1.0
   */
  borderRadius?: number | BorderRadius;
}
e***REMOVED***port interface TooltipModel<TType e***REMOVED***tends ChartType> e***REMOVED***tends Element<AnyObject, TooltipOptions<TType>> {
  readonly chart: Chart<TType>;

  // The items that we are rendering in the tooltip. See Tooltip Item Interface section
  dataPoints: TooltipItem<TType>[];

  // Positioning
  ***REMOVED***Align: TooltipXAlignment;
  yAlign: TooltipYAlignment;

  // X and Y properties are the top left of the tooltip
  ***REMOVED***: number;
  y: number;
  width: number;
  height: number;
  // Where the tooltip points to
  caretX: number;
  caretY: number;

  // Body
  // The body lines that need to be rendered
  // Each object contains 3 parameters
  // before: string[] // lines of te***REMOVED***t before the line with the color square
  // lines: string[]; // lines of te***REMOVED***t to render as the main item with color square
  // after: string[]; // lines of te***REMOVED***t to render after the main lines
  body: { before: string[]; lines: string[]; after: string[] }[];
  // lines of te***REMOVED***t that appear after the title but before the body
  beforeBody: string[];
  // line of te***REMOVED***t that appear after the body and before the footer
  afterBody: string[];

  // Title
  // lines of te***REMOVED***t that form the title
  title: string[];

  // Footer
  // lines of te***REMOVED***t that form the footer
  footer: string[];

  // Styles to render for each item in body[]. This is the styling of the squares in the tooltip
  labelColors: TooltipLabelStyle[];
  labelTe***REMOVED***tColors: Color[];
  labelPointStyles: { pointStyle: PointStyle; rotation: number }[];

  // 0 opacity is a hidden tooltip
  opacity: number;

  // tooltip options
  options: TooltipOptions<TType>;

  getActiveElements(): ActiveElement[];
  setActiveElements(active: ActiveDataPoint[], eventPosition: Point): void;
}

e***REMOVED***port interface TooltipPosition e***REMOVED***tends Point {
  ***REMOVED***Align?: TooltipXAlignment;
  yAlign?: TooltipYAlignment;
}

e***REMOVED***port type TooltipPositionerFunction<TType e***REMOVED***tends ChartType> = (
  this: TooltipModel<TType>,
  items: readonly ActiveElement[],
  eventPosition: Point
) => TooltipPosition | false;

e***REMOVED***port interface TooltipPositionerMap {
  average: TooltipPositionerFunction<ChartType>;
  nearest: TooltipPositionerFunction<ChartType>;
}

e***REMOVED***port type TooltipPositioner = keyof TooltipPositionerMap;

e***REMOVED***port interface Tooltip e***REMOVED***tends Plugin {
  readonly positioners: TooltipPositionerMap;
}

e***REMOVED***port declare const Tooltip: Tooltip;

e***REMOVED***port interface TooltipCallbacks<
  TType e***REMOVED***tends ChartType,
  Model = TooltipModel<TType>,
  Item = TooltipItem<TType>> {

  beforeTitle(this: Model, tooltipItems: Item[]): string | string[] | void;
  title(this: Model, tooltipItems: Item[]): string | string[] | void;
  afterTitle(this: Model, tooltipItems: Item[]): string | string[] | void;

  beforeBody(this: Model, tooltipItems: Item[]): string | string[] | void;
  afterBody(this: Model, tooltipItems: Item[]): string | string[] | void;

  beforeLabel(this: Model, tooltipItem: Item): string | string[] | void;
  label(this: Model, tooltipItem: Item): string | string[] | void;
  afterLabel(this: Model, tooltipItem: Item): string | string[] | void;

  labelColor(this: Model, tooltipItem: Item): TooltipLabelStyle | void;
  labelTe***REMOVED***tColor(this: Model, tooltipItem: Item): Color | void;
  labelPointStyle(this: Model, tooltipItem: Item): { pointStyle: PointStyle; rotation: number } | void;

  beforeFooter(this: Model, tooltipItems: Item[]): string | string[] | void;
  footer(this: Model, tooltipItems: Item[]): string | string[] | void;
  afterFooter(this: Model, tooltipItems: Item[]): string | string[] | void;
}

e***REMOVED***port interface E***REMOVED***tendedPlugin<
  TType e***REMOVED***tends ChartType,
  O = AnyObject,
  Model = TooltipModel<TType>> {
  /**
   * @desc Called before drawing the `tooltip`. If any plugin returns `false`,
   * the tooltip drawing is cancelled until another `render` is triggered.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Tooltip} args.tooltip - The tooltip.
   * @param {object} options - The plugin options.
   * @returns {boolean} `false` to cancel the chart tooltip drawing.
   */
  beforeTooltipDraw?(chart: Chart, args: { tooltip: Model, cancelable: true }, options: O): boolean | void;
  /**
   * @desc Called after drawing the `tooltip`. Note that this hook will not
   * be called if the tooltip drawing has been previously cancelled.
   * @param {Chart} chart - The chart instance.
   * @param {object} args - The call arguments.
   * @param {Tooltip} args.tooltip - The tooltip.
   * @param {object} options - The plugin options.
   */
  afterTooltipDraw?(chart: Chart, args: { tooltip: Model }, options: O): void;
}

e***REMOVED***port interface ScriptableTooltipConte***REMOVED***t<TType e***REMOVED***tends ChartType> {
  chart: UnionToIntersection<Chart<TType>>;
  tooltip: UnionToIntersection<TooltipModel<TType>>;
  tooltipItems: TooltipItem<TType>[];
}

e***REMOVED***port interface TooltipOptions<TType e***REMOVED***tends ChartType = ChartType> e***REMOVED***tends CoreInteractionOptions {
  /**
   * Are on-canvas tooltips enabled?
   * @default true
   */
  enabled: Scriptable<boolean, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   *   See e***REMOVED***ternal tooltip section.
   */
  e***REMOVED***ternal(this: TooltipModel<TType>, args: { chart: Chart; tooltip: TooltipModel<TType> }): void;
  /**
   * The mode for positioning the tooltip
   */
  position: Scriptable<TooltipPositioner, ScriptableTooltipConte***REMOVED***t<TType>>

  /**
   * Override the tooltip alignment calculations
   */
  ***REMOVED***Align: Scriptable<TooltipXAlignment, ScriptableTooltipConte***REMOVED***t<TType>>;
  yAlign: Scriptable<TooltipYAlignment, ScriptableTooltipConte***REMOVED***t<TType>>;

  /**
   * Sort tooltip items.
   */
  itemSort: (a: TooltipItem<TType>, b: TooltipItem<TType>, data: ChartData) => number;

  filter: (e: TooltipItem<TType>, inde***REMOVED***: number, array: TooltipItem<TType>[], data: ChartData) => boolean;

  /**
   * Background color of the tooltip.
   * @default 'rgba(0, 0, 0, 0.8)'
   */
  backgroundColor: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Padding between the color bo***REMOVED*** and the te***REMOVED***t.
   * @default 1
   */
  bo***REMOVED***Padding: number;
  /**
   * Color of title
   * @default '#fff'
   */
  titleColor: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * See Fonts
   * @default {weight: 'bold'}
   */
  titleFont: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Spacing to add to top and bottom of each title line.
   * @default 2
   */
  titleSpacing: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Margin to add on bottom of title section.
   * @default 6
   */
  titleMarginBottom: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Horizontal alignment of the title te***REMOVED***t lines.
   * @default 'left'
   */
  titleAlign: Scriptable<Te***REMOVED***tAlign, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Spacing to add to top and bottom of each tooltip item.
   * @default 2
   */
  bodySpacing: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Color of body
   * @default '#fff'
   */
  bodyColor: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * See Fonts.
   * @default {}
   */
  bodyFont: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Horizontal alignment of the body te***REMOVED***t lines.
   * @default 'left'
   */
  bodyAlign: Scriptable<Te***REMOVED***tAlign, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Spacing to add to top and bottom of each footer line.
   * @default 2
   */
  footerSpacing: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Margin to add before drawing the footer.
   * @default 6
   */
  footerMarginTop: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Color of footer
   * @default '#fff'
   */
  footerColor: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * See Fonts
   * @default {weight: 'bold'}
   */
  footerFont: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Horizontal alignment of the footer te***REMOVED***t lines.
   * @default 'left'
   */
  footerAlign: Scriptable<Te***REMOVED***tAlign, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Padding to add to the tooltip
   * @default 6
   */
  padding: Scriptable<Padding, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * E***REMOVED***tra distance to move the end of the tooltip arrow away from the tooltip point.
   * @default 2
   */
  caretPadding: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Size, in p***REMOVED***, of the tooltip arrow.
   * @default 5
   */
  caretSize: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Radius of tooltip corner curves.
   * @default 6
   */
  cornerRadius: Scriptable<number | BorderRadius, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Color to draw behind the colored bo***REMOVED***es when multiple items are in the tooltip.
   * @default '#fff'
   */
  multiKeyBackground: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * If true, color bo***REMOVED***es are shown in the tooltip.
   * @default true
   */
  displayColors: Scriptable<boolean, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Width of the color bo***REMOVED*** if displayColors is true.
   * @default bodyFont.size
   */
  bo***REMOVED***Width: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Height of the color bo***REMOVED*** if displayColors is true.
   * @default bodyFont.size
   */
  bo***REMOVED***Height: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Use the corresponding point style (from dataset options) instead of color bo***REMOVED***es, e***REMOVED***: star, triangle etc. (size is based on the minimum value between bo***REMOVED***Width and bo***REMOVED***Height)
   * @default false
   */
  usePointStyle: Scriptable<boolean, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Color of the border.
   * @default 'rgba(0, 0, 0, 0)'
   */
  borderColor: Scriptable<Color, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * Size of the border.
   * @default 0
   */
  borderWidth: Scriptable<number, ScriptableTooltipConte***REMOVED***t<TType>>;
  /**
   * true for rendering the legends from right to left.
   */
  rtl: Scriptable<boolean, ScriptableTooltipConte***REMOVED***t<TType>>;

  /**
   * This will force the te***REMOVED***t direction 'rtl' or 'ltr on the canvas for rendering the tooltips, regardless of the css specified on the canvas
   * @default canvas's default
   */
  te***REMOVED***tDirection: Scriptable<string, ScriptableTooltipConte***REMOVED***t<TType>>;

  animation: AnimationSpec<TType> | false;
  animations: AnimationsSpec<TType> | false;
  callbacks: TooltipCallbacks<TType>;
}

e***REMOVED***port interface TooltipItem<TType e***REMOVED***tends ChartType> {
  /**
   * The chart the tooltip is being shown on
   */
  chart: Chart;

  /**
   * Label for the tooltip
   */
  label: string;

  /**
   * Parsed data values for the given `dataInde***REMOVED***` and `datasetInde***REMOVED***`
   */
  parsed: UnionToIntersection<ParsedDataType<TType>>;

  /**
   * Raw data values for the given `dataInde***REMOVED***` and `datasetInde***REMOVED***`
   */
  raw: unknown;

  /**
   * Formatted value for the tooltip
   */
  formattedValue: string;

  /**
   * The dataset the item comes from
   */
  dataset: UnionToIntersection<ChartDataset<TType>>;

  /**
   * Inde***REMOVED*** of the dataset the item comes from
   */
  datasetInde***REMOVED***: number;

  /**
   * Inde***REMOVED*** of this data item in the dataset
   */
  dataInde***REMOVED***: number;

  /**
   * The chart element (point, arc, bar, etc.) for this tooltip item
   */
  element: Element;
}

e***REMOVED***port interface PluginOptionsByType<TType e***REMOVED***tends ChartType> {
  colors: ColorsPluginOptions;
  decimation: DecimationOptions;
  filler: FillerOptions;
  legend: LegendOptions<TType>;
  subtitle: TitleOptions;
  title: TitleOptions;
  tooltip: TooltipOptions<TType>;
}
e***REMOVED***port interface PluginChartOptions<TType e***REMOVED***tends ChartType> {
  plugins: PluginOptionsByType<TType>;
}

e***REMOVED***port interface BorderOptions {
  /**
   * @default true
   */
  display: boolean
  /**
   * @default []
   */
  dash: Scriptable<number[], ScriptableScaleConte***REMOVED***t>;
  /**
   * @default 0
   */
  dashOffset: Scriptable<number, ScriptableScaleConte***REMOVED***t>;
  color: Color;
  width: number;
  z: number;
}

e***REMOVED***port interface GridLineOptions {
  /**
   * @default true
   */
  display: boolean;
  /**
   * @default false
   */
  circular: boolean;
  /**
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  color: ScriptableAndArray<Color, ScriptableScaleConte***REMOVED***t>;
  /**
   * @default 1
   */
  lineWidth: ScriptableAndArray<number, ScriptableScaleConte***REMOVED***t>;
  /**
   * @default true
   */
  drawOnChartArea: boolean;
  /**
   * @default true
   */
  drawTicks: boolean;
  /**
   * @default []
   */
  tickBorderDash: Scriptable<number[], ScriptableScaleConte***REMOVED***t>;
  /**
   * @default 0
   */
  tickBorderDashOffset: Scriptable<number, ScriptableScaleConte***REMOVED***t>;
  /**
   * @default 'rgba(0, 0, 0, 0.1)'
   */
  tickColor: ScriptableAndArray<Color, ScriptableScaleConte***REMOVED***t>;
  /**
   * @default 10
   */
  tickLength: number;
  /**
   * @default 1
   */
  tickWidth: number;
  /**
   * @default false
   */
  offset: boolean;
  /**
   * @default 0
   */
  z: number;
}

e***REMOVED***port interface TickOptions {
  /**
   * Color of label backdrops.
   * @default 'rgba(255, 255, 255, 0.75)'
   */
  backdropColor: Scriptable<Color, ScriptableScaleConte***REMOVED***t>;
  /**
   * Padding of tick backdrop.
   * @default 2
   */
  backdropPadding: number | ChartArea;

  /**
   * Returns the string representation of the tick value as it should be displayed on the chart. See callback.
   */
  callback: (this: Scale, tickValue: number | string, inde***REMOVED***: number, ticks: Tick[]) => string | string[] | number | number[] | null | undefined;
  /**
   * If true, show tick labels.
   * @default true
   */
  display: boolean;
  /**
   * Color of tick
   * @see Defaults.color
   */
  color: ScriptableAndArray<Color, ScriptableScaleConte***REMOVED***t>;
  /**
   * see Fonts
   */
  font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableScaleConte***REMOVED***t>;
  /**
   * Sets the offset of the tick labels from the a***REMOVED***is
   */
  padding: number;
  /**
   * If true, draw a background behind the tick labels.
   * @default false
   */
  showLabelBackdrop: Scriptable<boolean, ScriptableScaleConte***REMOVED***t>;
  /**
   * The color of the stroke around the te***REMOVED***t.
   * @default undefined
   */
  te***REMOVED***tStrokeColor: Scriptable<Color, ScriptableScaleConte***REMOVED***t>;
  /**
   * Stroke width around the te***REMOVED***t.
   * @default 0
   */
  te***REMOVED***tStrokeWidth: Scriptable<number, ScriptableScaleConte***REMOVED***t>;
  /**
   * z-inde***REMOVED*** of tick layer. Useful when ticks are drawn on chart area. Values <= 0 are drawn under datasets, > 0 on top.
   * @default 0
   */
  z: number;

  major: {
    /**
     * If true, major ticks are generated. A major tick will affect autoskipping and major will be defined on ticks in the scriptable options conte***REMOVED***t.
     * @default false
     */
    enabled: boolean;
  };
}

e***REMOVED***port type CartesianTickOptions = TickOptions & {
  /**
   * The number of ticks to e***REMOVED***amine when deciding how many labels will fit. Setting a smaller value will be faster, but may be less accurate when there is large variability in label length.
   * @default ticks.length
   */
  sampleSize: number;
  /**
   * The label alignment
   * @default 'center'
   */
  align: Align | 'inner';
  /**
   *   If true, automatically calculates how many labels can be shown and hides labels accordingly. Labels will be rotated up to ma***REMOVED***Rotation before skipping any. Turn autoSkip off to show all labels no matter what.
   * @default true
   */
  autoSkip: boolean;
  /**
   * Padding between the ticks on the horizontal a***REMOVED***is when autoSkip is enabled.
   * @default 0
   */
  autoSkipPadding: number;

  /**
   * How is the label positioned perpendicular to the a***REMOVED***is direction.
   * This only applies when the rotation is 0 and the a***REMOVED***is position is one of "top", "left", "right", or "bottom"
   * @default 'near'
   */
  crossAlign: 'near' | 'center' | 'far';

  /**
   * Should the defined `min` and `ma***REMOVED***` values be presented as ticks even if they are not "nice".
   * @default: true
   */
  includeBounds: boolean;

  /**
   * Distance in pi***REMOVED***els to offset the label from the centre point of the tick (in the ***REMOVED*** direction for the ***REMOVED*** a***REMOVED***is, and the y direction for the y a***REMOVED***is). Note: this can cause labels at the edges to be cropped by the edge of the canvas
   * @default 0
   */
  labelOffset: number;

  /**
   * Minimum rotation for tick labels. Note: Only applicable to horizontal scales.
   * @default 0
   */
  minRotation: number;
  /**
   * Ma***REMOVED***imum rotation for tick labels when rotating to condense labels. Note: Rotation doesn't occur until necessary. Note: Only applicable to horizontal scales.
   * @default 50
   */
  ma***REMOVED***Rotation: number;
  /**
   * Flips tick labels around a***REMOVED***is, displaying the labels inside the chart instead of outside. Note: Only applicable to vertical scales.
   * @default false
   */
  mirror: boolean;
  /**
   *   Padding between the tick label and the a***REMOVED***is. When set on a vertical a***REMOVED***is, this applies in the horizontal (X) direction. When set on a horizontal a***REMOVED***is, this applies in the vertical (Y) direction.
   * @default 0
   */
  padding: number;
  /**
   * Ma***REMOVED***imum number of ticks and gridlines to show.
   * @default 11
   */
  ma***REMOVED***TicksLimit: number;
}

e***REMOVED***port interface ScriptableCartesianScaleConte***REMOVED***t {
  scale: keyof CartesianScaleTypeRegistry;
  type: string;
}

e***REMOVED***port interface ScriptableChartConte***REMOVED***t {
  chart: Chart;
  type: string;
}

e***REMOVED***port interface CartesianScaleOptions e***REMOVED***tends CoreScaleOptions {
  /**
   * Scale boundary strategy (bypassed by min/ma***REMOVED*** time options)
   * - `data`: make sure data are fully visible, ticks outside are removed
   * - `ticks`: make sure ticks are fully visible, data outside are truncated
   * @since 2.7.0
   * @default 'ticks'
   */
  bounds: 'ticks' | 'data';

  /**
   * Position of the a***REMOVED***is.
   */
  position: 'left' | 'top' | 'right' | 'bottom' | 'center' | { [scale: string]: number };

  /**
   * Stack group. A***REMOVED***es at the same `position` with same `stack` are stacked.
   */
  stack?: string;

  /**
   * Weight of the scale in stack group. Used to determine the amount of allocated space for the scale within the group.
   * @default 1
   */
  stackWeight?: number;

  /**
   *   Which type of a***REMOVED***is this is. Possible values are: '***REMOVED***', 'y', 'r'. If not set, this is inferred from the first character of the ID which should be '***REMOVED***', 'y' or 'r'.
   */
  a***REMOVED***is: '***REMOVED***' | 'y' | 'r';

  /**
   * User defined minimum value for the scale, overrides minimum value from data.
   */
  min: number;

  /**
   * User defined ma***REMOVED***imum value for the scale, overrides ma***REMOVED***imum value from data.
   */
  ma***REMOVED***: number;

  /**
   *   If true, e***REMOVED***tra space is added to the both edges and the a***REMOVED***is is scaled to fit into the chart area. This is set to true for a bar chart by default.
   * @default false
   */
  offset: boolean;

  grid: Partial<GridLineOptions>;

  border: BorderOptions;

  /** Options for the scale title. */
  title: {
    /** If true, displays the a***REMOVED***is title. */
    display: boolean;
    /** Alignment of the a***REMOVED***is title. */
    align: Align;
    /** The te***REMOVED***t for the title, e.g. "# of People" or "Response Choices". */
    te***REMOVED***t: string | string[];
    /** Color of the a***REMOVED***is label. */
    color: Color;
    /** Information about the a***REMOVED***is title font. */
    font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableCartesianScaleConte***REMOVED***t>;
    /** Padding to apply around scale labels. */
    padding: number | {
      /** Padding on the (relative) top side of this a***REMOVED***is label. */
      top: number;
      /** Padding on the (relative) bottom side of this a***REMOVED***is label. */
      bottom: number;
      /** This is a shorthand for defining top/bottom to the same values. */
      y: number;
    };
  };

  /**
   *   If true, data will be comprised between datasets of data
   * @default false
   */
  stacked?: boolean | 'single';

  ticks: CartesianTickOptions;
}

e***REMOVED***port type CategoryScaleOptions = Omit<CartesianScaleOptions, 'min' | 'ma***REMOVED***'> & {
  min: string | number;
  ma***REMOVED***: string | number;
  labels: string[] | string[][];
};

e***REMOVED***port type CategoryScale<O e***REMOVED***tends CategoryScaleOptions = CategoryScaleOptions> = Scale<O>
e***REMOVED***port declare const CategoryScale: ChartComponent & {
  prototype: CategoryScale;
  new <O e***REMOVED***tends CategoryScaleOptions = CategoryScaleOptions>(cfg: AnyObject): CategoryScale<O>;
};

e***REMOVED***port type LinearScaleOptions = CartesianScaleOptions & {

  /**
   *  if true, scale will include 0 if it is not already included.
   * @default true
   */
  beginAtZero: boolean;
  /**
   * Adjustment used when calculating the minimum data value.
   */
  suggestedMin?: number;
  /**
   * Adjustment used when calculating the ma***REMOVED***imum data value.
   */
  suggestedMa***REMOVED***?: number;
  /**
  * Percentage (string ending with %) or amount (number) for added room in the scale range above and below data.
  */
  grace?: string | number;

  ticks: {
    /**
     * The Intl.NumberFormat options used by the default label formatter
     */
    format: Intl.NumberFormatOptions;

    /**
     * if defined and stepSize is not specified, the step size will be rounded to this many decimal places.
     */
    precision: number;

    /**
     * User defined fi***REMOVED***ed step size for the scale
     */
    stepSize: number;

    /**
     * User defined count of ticks
     */
    count: number;
  };
};

e***REMOVED***port type LinearScale<O e***REMOVED***tends LinearScaleOptions = LinearScaleOptions> = Scale<O>
e***REMOVED***port declare const LinearScale: ChartComponent & {
  prototype: LinearScale;
  new <O e***REMOVED***tends LinearScaleOptions = LinearScaleOptions>(cfg: AnyObject): LinearScale<O>;
};

e***REMOVED***port type LogarithmicScaleOptions = CartesianScaleOptions & {
  /**
   * Adjustment used when calculating the ma***REMOVED***imum data value.
   */
  suggestedMin?: number;
  /**
   * Adjustment used when calculating the minimum data value.
   */
  suggestedMa***REMOVED***?: number;

  ticks: {
    /**
     * The Intl.NumberFormat options used by the default label formatter
     */
    format: Intl.NumberFormatOptions;
  };
};

e***REMOVED***port type LogarithmicScale<O e***REMOVED***tends LogarithmicScaleOptions = LogarithmicScaleOptions> = Scale<O>
e***REMOVED***port declare const LogarithmicScale: ChartComponent & {
  prototype: LogarithmicScale;
  new <O e***REMOVED***tends LogarithmicScaleOptions = LogarithmicScaleOptions>(cfg: AnyObject): LogarithmicScale<O>;
};

e***REMOVED***port type TimeScaleTimeOptions = {
  /**
   * Custom parser for dates.
   */
  parser: string | ((v: unknown) => number);
  /**
   * If defined, dates will be rounded to the start of this unit. See Time Units below for the allowed units.
   */
  round: false | TimeUnit;
  /**
   * If boolean and true and the unit is set to 'week', then the first day of the week will be Monday. Otherwise, it will be Sunday.
   * If `number`, the inde***REMOVED*** of the first day of the week (0 - Sunday, 6 - Saturday).
   * @default false
   */
  isoWeekday: boolean | number;
  /**
   * Sets how different time units are displayed.
   */
  displayFormats: {
    [key: string]: string;
  };
  /**
   * The format string to use for the tooltip.
   */
  tooltipFormat: string;
  /**
   * If defined, will force the unit to be a certain type. See Time Units section below for details.
   * @default false
   */
  unit: false | TimeUnit;
  /**
   * The minimum display format to be used for a time unit.
   * @default 'millisecond'
   */
  minUnit: TimeUnit;
};

e***REMOVED***port type TimeScaleTickOptions = {
  /**
   * Ticks generation input values:
   * - 'auto': generates "optimal" ticks based on scale size and time options.
   * - 'data': generates ticks from data (including labels from data `{t|***REMOVED***|y}` objects).
   * - 'labels': generates ticks from user given `data.labels` values ONLY.
   * @see https://github.com/chartjs/Chart.js/pull/4507
   * @since 2.7.0
   * @default 'auto'
   */
  source: 'labels' | 'auto' | 'data';
  /**
   * The number of units between grid lines.
   * @default 1
   */
  stepSize: number;
};

e***REMOVED***port type TimeScaleOptions = Omit<CartesianScaleOptions, 'min' | 'ma***REMOVED***'> & {
  min: string | number;
  ma***REMOVED***: string | number;
  suggestedMin: string | number;
  suggestedMa***REMOVED***: string | number;
  /**
   * Scale boundary strategy (bypassed by min/ma***REMOVED*** time options)
   * - `data`: make sure data are fully visible, ticks outside are removed
   * - `ticks`: make sure ticks are fully visible, data outside are truncated
   * @since 2.7.0
   * @default 'data'
   */
  bounds: 'ticks' | 'data';

  /**
   * If true, bar chart offsets are computed with skipped tick sizes
   * @since 3.8.0
   * @default false
   */
  offsetAfterAutoskip: boolean;

  /**
   * options for creating a new adapter instance
   */
  adapters: {
    date: unknown;
  };

  time: TimeScaleTimeOptions;

  ticks: TimeScaleTickOptions;
};

e***REMOVED***port interface TimeScale<O e***REMOVED***tends TimeScaleOptions = TimeScaleOptions> e***REMOVED***tends Scale<O> {
  format(value: number, format?: string): string;
  getDataTimestamps(): number[];
  getLabelTimestamps(): string[];
  normalize(values: number[]): number[];
}

e***REMOVED***port declare const TimeScale: ChartComponent & {
  prototype: TimeScale;
  new <O e***REMOVED***tends TimeScaleOptions = TimeScaleOptions>(cfg: AnyObject): TimeScale<O>;
};

e***REMOVED***port type TimeSeriesScale<O e***REMOVED***tends TimeScaleOptions = TimeScaleOptions> = TimeScale<O>
e***REMOVED***port declare const TimeSeriesScale: ChartComponent & {
  prototype: TimeSeriesScale;
  new <O e***REMOVED***tends TimeScaleOptions = TimeScaleOptions>(cfg: AnyObject): TimeSeriesScale<O>;
};

e***REMOVED***port type RadialTickOptions = TickOptions & {
  /**
   * The Intl.NumberFormat options used by the default label formatter
   */
  format: Intl.NumberFormatOptions;

  /**
   * Ma***REMOVED***imum number of ticks and gridlines to show.
   * @default 11
   */
  ma***REMOVED***TicksLimit: number;

  /**
   * if defined and stepSize is not specified, the step size will be rounded to this many decimal places.
   */
  precision: number;

  /**
   * User defined fi***REMOVED***ed step size for the scale.
   */
  stepSize: number;

  /**
   * User defined number of ticks
   */
  count: number;
}

e***REMOVED***port type RadialLinearScaleOptions = CoreScaleOptions & {
  animate: boolean;

  startAngle: number;

  angleLines: {
    /**
     * if true, angle lines are shown.
     * @default true
     */
    display: boolean;
    /**
     * Color of angled lines.
     * @default 'rgba(0, 0, 0, 0.1)'
     */
    color: Scriptable<Color, ScriptableScaleConte***REMOVED***t>;
    /**
     * Width of angled lines.
     * @default 1
     */
    lineWidth: Scriptable<number, ScriptableScaleConte***REMOVED***t>;
    /**
     * Length and spacing of dashes on angled lines. See MDN.
     * @default []
     */
    borderDash: Scriptable<number[], ScriptableScaleConte***REMOVED***t>;
    /**
     * Offset for line dashes. See MDN.
     * @default 0
     */
    borderDashOffset: Scriptable<number, ScriptableScaleConte***REMOVED***t>;
  };

  /**
   * if true, scale will include 0 if it is not already included.
   * @default false
   */
  beginAtZero: boolean;

  grid: Partial<GridLineOptions>;

  /**
   * User defined minimum number for the scale, overrides minimum value from data.
   */
  min: number;
  /**
   * User defined ma***REMOVED***imum number for the scale, overrides ma***REMOVED***imum value from data.
   */
  ma***REMOVED***: number;

  pointLabels: {
    /**
     * Background color of the point label.
     * @default undefined
     */
    backdropColor: Scriptable<Color, ScriptableScalePointLabelConte***REMOVED***t>;
    /**
     * Padding of label backdrop.
     * @default 2
     */
    backdropPadding: Scriptable<number | ChartArea, ScriptableScalePointLabelConte***REMOVED***t>;

    /**
     * Border radius
     * @default 0
     * @since 3.8.0
     */
    borderRadius: Scriptable<number | BorderRadius, ScriptableScalePointLabelConte***REMOVED***t>;

    /**
     * if true, point labels are shown. When `display: 'auto'`, the label is hidden if it overlaps with another label.
     * @default true
     */
    display: boolean | 'auto';
    /**
     * Color of label
     * @see Defaults.color
     */
    color: Scriptable<Color, ScriptableScalePointLabelConte***REMOVED***t>;
    /**
     */
    font: ScriptableAndScriptableOptions<Partial<FontSpec>, ScriptableScalePointLabelConte***REMOVED***t>;

    /**
     * Callback function to transform data labels to point labels. The default implementation simply returns the current string.
     */
    callback: (label: string, inde***REMOVED***: number) => string | string[] | number | number[];

    /**
     * Padding around the pointLabels
     * @default 5
     */
    padding: Scriptable<number, ScriptableScalePointLabelConte***REMOVED***t>;

    /**
     * if true, point labels are centered.
     * @default false
     */
    centerPointLabels: boolean;
  };

  /**
   * Adjustment used when calculating the ma***REMOVED***imum data value.
   */
  suggestedMa***REMOVED***: number;
  /**
   * Adjustment used when calculating the minimum data value.
   */
  suggestedMin: number;

  ticks: RadialTickOptions;
};

e***REMOVED***port interface RadialLinearScale<O e***REMOVED***tends RadialLinearScaleOptions = RadialLinearScaleOptions> e***REMOVED***tends Scale<O> {
  setCenterPoint(leftMovement: number, rightMovement: number, topMovement: number, bottomMovement: number): void;
  getInde***REMOVED***Angle(inde***REMOVED***: number): number;
  getDistanceFromCenterForValue(value: number): number;
  getValueForDistanceFromCenter(distance: number): number;
  getPointPosition(inde***REMOVED***: number, distanceFromCenter: number): { ***REMOVED***: number; y: number; angle: number };
  getPointPositionForValue(inde***REMOVED***: number, value: number): { ***REMOVED***: number; y: number; angle: number };
  getPointLabelPosition(inde***REMOVED***: number): ChartArea;
  getBasePosition(inde***REMOVED***: number): { ***REMOVED***: number; y: number; angle: number };
}
e***REMOVED***port declare const RadialLinearScale: ChartComponent & {
  prototype: RadialLinearScale;
  new <O e***REMOVED***tends RadialLinearScaleOptions = RadialLinearScaleOptions>(cfg: AnyObject): RadialLinearScale<O>;
};

e***REMOVED***port interface CartesianScaleTypeRegistry {
  linear: {
    options: LinearScaleOptions;
  };
  logarithmic: {
    options: LogarithmicScaleOptions;
  };
  category: {
    options: CategoryScaleOptions;
  };
  time: {
    options: TimeScaleOptions;
  };
  timeseries: {
    options: TimeScaleOptions;
  };
}

e***REMOVED***port interface RadialScaleTypeRegistry {
  radialLinear: {
    options: RadialLinearScaleOptions;
  };
}

e***REMOVED***port interface ScaleTypeRegistry e***REMOVED***tends CartesianScaleTypeRegistry, RadialScaleTypeRegistry {
}

e***REMOVED***port type ScaleType = keyof ScaleTypeRegistry;

e***REMOVED***port interface CartesianParsedData e***REMOVED***tends Point {
  // Only specified when stacked bars are enabled
  _stacks?: {
    // Key is the stack ID which is generally the a***REMOVED***is ID
    [key: string]: {
      // Inner key is the datasetInde***REMOVED***
      [key: number]: number;
    }
  }
}

interface BarParsedData e***REMOVED***tends CartesianParsedData {
  // Only specified if floating bars are show
  _custom?: {
    barStart: number;
    barEnd: number;
    start: number;
    end: number;
    min: number;
    ma***REMOVED***: number;
  }
}

interface BubbleParsedData e***REMOVED***tends CartesianParsedData {
  // The bubble radius value
  _custom: number;
}

interface RadialParsedData {
  r: number;
}

e***REMOVED***port interface ChartTypeRegistry {
  bar: {
    chartOptions: BarControllerChartOptions;
    datasetOptions: BarControllerDatasetOptions;
    defaultDataPoint: number | [number, number] | null;
    metaE***REMOVED***tensions: {};
    parsedDataType: BarParsedData,
    scales: keyof CartesianScaleTypeRegistry;
  };
  line: {
    chartOptions: LineControllerChartOptions;
    datasetOptions: LineControllerDatasetOptions & FillerControllerDatasetOptions;
    defaultDataPoint: ScatterDataPoint | number | null;
    metaE***REMOVED***tensions: {};
    parsedDataType: CartesianParsedData;
    scales: keyof CartesianScaleTypeRegistry;
  };
  scatter: {
    chartOptions: ScatterControllerChartOptions;
    datasetOptions: ScatterControllerDatasetOptions;
    defaultDataPoint: ScatterDataPoint | number | null;
    metaE***REMOVED***tensions: {};
    parsedDataType: CartesianParsedData;
    scales: keyof CartesianScaleTypeRegistry;
  };
  bubble: {
    chartOptions: unknown;
    datasetOptions: BubbleControllerDatasetOptions;
    defaultDataPoint: BubbleDataPoint;
    metaE***REMOVED***tensions: {};
    parsedDataType: BubbleParsedData;
    scales: keyof CartesianScaleTypeRegistry;
  };
  pie: {
    chartOptions: PieControllerChartOptions;
    datasetOptions: PieControllerDatasetOptions;
    defaultDataPoint: PieDataPoint;
    metaE***REMOVED***tensions: PieMetaE***REMOVED***tensions;
    parsedDataType: number;
    scales: keyof CartesianScaleTypeRegistry;
  };
  doughnut: {
    chartOptions: DoughnutControllerChartOptions;
    datasetOptions: DoughnutControllerDatasetOptions;
    defaultDataPoint: DoughnutDataPoint;
    metaE***REMOVED***tensions: DoughnutMetaE***REMOVED***tensions;
    parsedDataType: number;
    scales: keyof CartesianScaleTypeRegistry;
  };
  polarArea: {
    chartOptions: PolarAreaControllerChartOptions;
    datasetOptions: PolarAreaControllerDatasetOptions;
    defaultDataPoint: number;
    metaE***REMOVED***tensions: {};
    parsedDataType: RadialParsedData;
    scales: keyof RadialScaleTypeRegistry;
  };
  radar: {
    chartOptions: RadarControllerChartOptions;
    datasetOptions: RadarControllerDatasetOptions & FillerControllerDatasetOptions;
    defaultDataPoint: number | null;
    metaE***REMOVED***tensions: {};
    parsedDataType: RadialParsedData;
    scales: keyof RadialScaleTypeRegistry;
  };
}

e***REMOVED***port type ChartType = keyof ChartTypeRegistry;

e***REMOVED***port type ScaleOptionsByType<TScale e***REMOVED***tends ScaleType = ScaleType> =
  { [key in ScaleType]: { type: key } & ScaleTypeRegistry[key]['options'] }[TScale]
;

// Convenience alias for creating and manipulating scale options in user code
e***REMOVED***port type ScaleOptions<TScale e***REMOVED***tends ScaleType = ScaleType> = DeepPartial<ScaleOptionsByType<TScale>>;

e***REMOVED***port type DatasetChartOptions<TType e***REMOVED***tends ChartType = ChartType> = {
  [key in TType]: {
    datasets: ChartTypeRegistry[key]['datasetOptions'];
  };
};

e***REMOVED***port type ScaleChartOptions<TType e***REMOVED***tends ChartType = ChartType> = {
  scales: {
    [key: string]: ScaleOptionsByType<ChartTypeRegistry[TType]['scales']>;
  };
};

e***REMOVED***port type ChartOptions<TType e***REMOVED***tends ChartType = ChartType> = DeepPartial<
CoreChartOptions<TType> &
ElementChartOptions<TType> &
PluginChartOptions<TType> &
DatasetChartOptions<TType> &
ScaleChartOptions<TType> &
ChartTypeRegistry[TType]['chartOptions']
>;

e***REMOVED***port type DefaultDataPoint<TType e***REMOVED***tends ChartType> = DistributiveArray<ChartTypeRegistry[TType]['defaultDataPoint']>;

e***REMOVED***port type ParsedDataType<TType e***REMOVED***tends ChartType = ChartType> = ChartTypeRegistry[TType]['parsedDataType'];

e***REMOVED***port interface ChartDatasetProperties<TType e***REMOVED***tends ChartType, TData> {
  type?: TType;
  data: TData;
}

e***REMOVED***port interface ChartDatasetPropertiesCustomTypesPerDataset<TType e***REMOVED***tends ChartType, TData> {
  type: TType;
  data: TData;
}

e***REMOVED***port type ChartDataset<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>
> = DeepPartial<
{ [key in ChartType]: { type: key } & ChartTypeRegistry[key]['datasetOptions'] }[TType]
> & ChartDatasetProperties<TType, TData>;

e***REMOVED***port type ChartDatasetCustomTypesPerDataset<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>
> = DeepPartial<
{ [key in ChartType]: { type: key } & ChartTypeRegistry[key]['datasetOptions'] }[TType]
> & ChartDatasetPropertiesCustomTypesPerDataset<TType, TData>;

/**
 * TData represents the data point type. If unspecified, a default is provided
 *   based on the chart type.
 * TLabel represents the label type
 */
e***REMOVED***port interface ChartData<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  labels?: TLabel[];
  ***REMOVED***Labels?: TLabel[];
  yLabels?: TLabel[];
  datasets: ChartDataset<TType, TData>[];
}

e***REMOVED***port interface ChartDataCustomTypesPerDataset<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  labels?: TLabel[];
  ***REMOVED***Labels?: TLabel[];
  yLabels?: TLabel[];
  datasets: ChartDatasetCustomTypesPerDataset<TType, TData>[];
}

e***REMOVED***port interface ChartConfiguration<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  type: TType;
  data: ChartData<TType, TData, TLabel>;
  options?: ChartOptions<TType>;
  plugins?: Plugin<TType>[];
  platform?: typeof BasePlatform;
}

e***REMOVED***port interface ChartConfigurationCustomTypesPerDataset<
  TType e***REMOVED***tends ChartType = ChartType,
  TData = DefaultDataPoint<TType>,
  TLabel = unknown
> {
  data: ChartDataCustomTypesPerDataset<TType, TData, TLabel>;
  options?: ChartOptions<TType>;
  plugins?: Plugin<TType>[];
}
