"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ag_charts_community_1 = require("ag-charts-community");
const cartesianChartProxy_1 = require("../cartesian/cartesianChartProxy");
const object_1 = require("../../utils/object");
const seriesTypeMapper_1 = require("../../utils/seriesTypeMapper");
class ComboChartProxy extends cartesianChartProxy_1.CartesianChartProxy {
    constructor(params) {
        super(params);
        this.xAxisType = params.grouping ? 'groupedCategory' : 'category';
        this.yAxisType = 'number';
        this.recreateChart();
    }
    getData(params) {
        return this.getDataTransformedData(params);
    }
    getAxes(params) {
        this.xAxisType = params.grouping ? 'groupedCategory' : 'category';
        const fields = params ? params.fields : [];
        const fieldsMap = new Map(fields.map(f => [f.colId, f]));
        const { primaryYKeys, secondaryYKeys } = this.getYKeys(fields, params.seriesChartTypes);
        const { bottomOptions, leftOptions, rightOptions } = this.getAxisOptions();
        const axes = [
            Object.assign(Object.assign({}, bottomOptions), { type: this.xAxisType, position: ag_charts_community_1.ChartAxisPosition.Bottom, gridStyle: [
                    { strokeWidth: 0 },
                ] }),
        ];
        if (primaryYKeys.length > 0) {
            axes.push(Object.assign(Object.assign({}, leftOptions), { type: this.yAxisType, keys: primaryYKeys, position: ag_charts_community_1.ChartAxisPosition.Left, title: Object.assign({}, object_1.deepMerge(leftOptions.title, {
                    enabled: true,
                    text: primaryYKeys.map(key => {
                        const field = fieldsMap.get(key);
                        return field ? field.displayName : key;
                    }).join(' / '),
                })) }));
        }
        if (secondaryYKeys.length > 0) {
            secondaryYKeys.forEach((secondaryYKey, i) => {
                const field = fieldsMap.get(secondaryYKey);
                const secondaryAxisIsVisible = field && field.colId === secondaryYKey;
                if (!secondaryAxisIsVisible) {
                    return;
                }
                const secondaryAxisOptions = Object.assign(Object.assign({}, rightOptions), { type: this.yAxisType, keys: [secondaryYKey], position: ag_charts_community_1.ChartAxisPosition.Right, title: Object.assign({}, object_1.deepMerge(rightOptions.title, {
                        enabled: true,
                        text: field ? field.displayName : secondaryYKey,
                    })) });
                const primaryYAxis = primaryYKeys.some(primaryYKey => !!fieldsMap.get(primaryYKey));
                const lastSecondaryAxis = i === secondaryYKeys.length - 1;
                if (!primaryYAxis && lastSecondaryAxis) {
                    // don't remove grid lines from the secondary axis closest to the chart, i.e. last supplied
                }
                else {
                    secondaryAxisOptions.gridStyle = [
                        { strokeWidth: 0 },
                    ];
                }
                axes.push(secondaryAxisOptions);
            });
        }
        return axes;
    }
    getSeries(params) {
        const { fields, category, seriesChartTypes } = params;
        return fields.map(field => {
            const seriesChartType = seriesChartTypes.find(s => s.colId === field.colId);
            if (seriesChartType) {
                const chartType = seriesChartType.chartType;
                return Object.assign(Object.assign({}, this.extractSeriesOverrides(seriesTypeMapper_1.getSeriesType(seriesChartType.chartType))), { type: seriesTypeMapper_1.getSeriesType(chartType), xKey: category.id, yKey: field.colId, yName: field.displayName, grouped: ['groupedColumn', 'groupedBar', 'groupedArea'].includes(chartType), stacked: ['stackedArea', 'stackedColumn'].includes(chartType) });
            }
        });
    }
    getAxisOptions() {
        const axisOptions = this.getAxesOptions('cartesian');
        return {
            bottomOptions: object_1.deepMerge(axisOptions[this.xAxisType], axisOptions[this.xAxisType].bottom),
            leftOptions: object_1.deepMerge(axisOptions[this.yAxisType], axisOptions[this.yAxisType].left),
            rightOptions: object_1.deepMerge(axisOptions[this.yAxisType], axisOptions[this.yAxisType].right),
        };
    }
    getYKeys(fields, seriesChartTypes) {
        const primaryYKeys = [];
        const secondaryYKeys = [];
        fields.forEach(field => {
            const colId = field.colId;
            const seriesChartType = seriesChartTypes.find(s => s.colId === colId);
            if (seriesChartType) {
                seriesChartType.secondaryAxis ? secondaryYKeys.push(colId) : primaryYKeys.push(colId);
            }
        });
        return { primaryYKeys, secondaryYKeys };
    }
}
exports.ComboChartProxy = ComboChartProxy;
//# sourceMappingURL=comboChartProxy.js.map