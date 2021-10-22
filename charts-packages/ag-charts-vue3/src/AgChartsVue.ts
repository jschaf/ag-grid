import {h} from 'vue';
import {Options, Vue} from 'vue-class-component';
import {AgChart, AgChartOptions, Chart} from 'ag-charts-community';

@Options({
    props: {
        options: {},
    },
})
export class AgChartsVue extends Vue {
    private isCreated = false;
    private isDestroyed = false;

    private chart!: Chart;

    private options!: AgChartOptions;

    // noinspection JSUnusedGlobalSymbols, JSMethodCanBeStatic
    public render() {
        return h('div', {style: {height: '100%'}});
    }

    public mounted() {
        const options = this.applyContainerIfNotSet(this.options);

        this.chart = AgChart.create(options);

        this.$watch('options', (newValue: any, oldValue: any) => {
            this.processChanges(newValue, oldValue);
        });

        this.isCreated = true;
    }

    public destroyed() {
        if (this.isCreated) {
            if (this.chart) {
                this.chart.destroy();
            }

            this.isDestroyed = true;
        }
    }

    public unmounted() {
        this.destroyed();
    }

    public processChanges(currentValue: any, previousValue: any) {
        if (this.isCreated) {
            AgChart.update(this.chart, this.applyContainerIfNotSet(this.options));
        }
    }

    private applyContainerIfNotSet(propsOptions: AgChartOptions): AgChartOptions {
        if (propsOptions.container) {
            return propsOptions;
        }

        return {...propsOptions, container: this.$el as HTMLElement};
    }
}