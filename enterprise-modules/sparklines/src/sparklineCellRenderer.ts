import {
    Autowired,
    Component,
    ICellRenderer,
    ISparklineCellRendererParams,
    RefSelector,
    ResizeObserverService,
    TooltipRendererParams,
    TooltipRendererResult
} from "@ag-grid-community/core";
import { AgSparkline } from "./sparkline/agSparkline";

export class SparklineCellRenderer extends Component implements ICellRenderer {

    private static TEMPLATE = /* html */
        `<div class="ag-sparkline-wrapper">
            <span ref="eSparkline"></span>
        </div>`;

    @RefSelector('eSparkline') private eSparkline?: HTMLElement;
    @Autowired('resizeObserverService') private resizeObserverService!: ResizeObserverService;

    private sparkline?: any;

    constructor() {
        super(SparklineCellRenderer.TEMPLATE);
    }

    public init(params: ISparklineCellRendererParams): void {
        let tooltipRenderer: (tooltipRendererParams: TooltipRendererParams) => TooltipRendererResult;

        if (params.sparklineOptions && params.sparklineOptions.tooltip && params.sparklineOptions.tooltip.renderer !== undefined) {

            tooltipRenderer = (tooltipRendererParams: TooltipRendererParams): TooltipRendererResult => {

                console.log('this elem', this.getGui());

                const renderer = params.sparklineOptions!.tooltip!.renderer;
                tooltipRendererParams.context = {
                    data: params.data
                };

                return renderer!(tooltipRendererParams);
            }

        }

        let firstTimeIn = true;
        const updateSparkline = () => {
            const { clientWidth, clientHeight } = this.getGui();
            if (clientWidth === 0 || clientHeight === 0) {
                return;
            }

            if (firstTimeIn) {
                const options = {
                    data: params.value,
                    width: clientWidth,
                    height: clientHeight,
                    context: {
                        data: params.data
                    },
                    ...params.sparklineOptions,
                    // tooltip: {
                    //     ...params.sparklineOptions!.tooltip,
                    //     renderer: tooltipRenderer
                    // }
                }

                // create new instance of sparkline
                this.sparkline = AgSparkline.create(options);

                // append sparkline canvas element to this.eSparkline;
                this.sparkline.container = this.eSparkline;

                firstTimeIn = false;
            } else {
                this.sparkline.width = clientWidth;
                this.sparkline.height = clientHeight;
            }
        }

        const unsubscribeFromResize = this.resizeObserverService.observeResize(this.getGui(), updateSparkline);
        this.addDestroyFunc(() => unsubscribeFromResize());
    }

    public refresh(params: ISparklineCellRendererParams): boolean {
        this.sparkline.data = params.value;
        return true;
    }

    public destroy() {
        if (this.sparkline) {
            this.sparkline.destroy();
        }
        super.destroy();
    }
}