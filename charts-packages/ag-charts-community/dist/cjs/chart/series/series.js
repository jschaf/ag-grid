"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var group_1 = require("../../scene/group");
var observable_1 = require("../../util/observable");
var chartAxis_1 = require("../chartAxis");
var id_1 = require("../../util/id");
var label_1 = require("../label");
var value_1 = require("../../util/value");
var SeriesItemHighlightStyle = /** @class */ (function () {
    function SeriesItemHighlightStyle() {
        this.fill = 'yellow';
    }
    return SeriesItemHighlightStyle;
}());
exports.SeriesItemHighlightStyle = SeriesItemHighlightStyle;
var SeriesHighlightStyle = /** @class */ (function () {
    function SeriesHighlightStyle() {
    }
    return SeriesHighlightStyle;
}());
exports.SeriesHighlightStyle = SeriesHighlightStyle;
var HighlightStyle = /** @class */ (function () {
    function HighlightStyle() {
        this.item = new SeriesItemHighlightStyle();
        this.series = new SeriesHighlightStyle();
    }
    return HighlightStyle;
}());
exports.HighlightStyle = HighlightStyle;
var SeriesTooltip = /** @class */ (function (_super) {
    __extends(SeriesTooltip, _super);
    function SeriesTooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        return _this;
    }
    __decorate([
        observable_1.reactive('change')
    ], SeriesTooltip.prototype, "enabled", void 0);
    return SeriesTooltip;
}(observable_1.Observable));
exports.SeriesTooltip = SeriesTooltip;
var Series = /** @class */ (function (_super) {
    __extends(Series, _super);
    function Series() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = id_1.createId(_this);
        // The group node that contains all the nodes used to render this series.
        _this.group = new group_1.Group();
        // The group node that contains all the nodes that can be "picked" (react to hover, tap, click).
        _this.pickGroup = _this.group.appendChild(new group_1.Group());
        _this.directions = [chartAxis_1.ChartAxisDirection.X, chartAxis_1.ChartAxisDirection.Y];
        _this.directionKeys = {};
        _this.label = new label_1.Label();
        _this.data = undefined;
        _this.visible = true;
        _this.showInLegend = true;
        _this.cursor = 'default';
        _this._nodeDataPending = true;
        _this._updatePending = false;
        _this.highlightStyle = new HighlightStyle();
        _this.scheduleLayout = function () {
            _this.fireEvent({ type: 'layoutChange' });
        };
        _this.scheduleData = function () {
            _this.fireEvent({ type: 'dataChange' });
        };
        return _this;
    }
    Object.defineProperty(Series.prototype, "type", {
        get: function () {
            return this.constructor.type || '';
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.setColors = function (fills, strokes) { };
    // Returns the actual keys used (to fetch the values from `data` items) for the given direction.
    Series.prototype.getKeys = function (direction) {
        var _this = this;
        var directionKeys = this.directionKeys;
        var keys = directionKeys && directionKeys[direction];
        var values = [];
        if (keys) {
            keys.forEach(function (key) {
                var value = _this[key];
                if (value) {
                    if (Array.isArray(value)) {
                        values.push.apply(values, value);
                    }
                    else {
                        values.push(value);
                    }
                }
            });
        }
        return values;
    };
    // Using processed data, create data that backs visible nodes.
    Series.prototype.createNodeData = function () { return []; };
    // Returns persisted node data associated with the rendered portion of the series' data.
    Series.prototype.getNodeData = function () { return []; };
    Series.prototype.getLabelData = function () { return []; };
    Object.defineProperty(Series.prototype, "nodeDataPending", {
        get: function () {
            return this._nodeDataPending;
        },
        set: function (value) {
            if (this._nodeDataPending !== value) {
                this._nodeDataPending = value;
                this.updatePending = true;
                if (value && this.chart) {
                    this.chart.updatePending = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.scheduleNodeDate = function () {
        this.nodeDataPending = true;
    };
    Object.defineProperty(Series.prototype, "updatePending", {
        get: function () {
            return this._updatePending;
        },
        set: function (value) {
            if (this._updatePending !== value) {
                this._updatePending = value;
                if (value && this.chart) {
                    this.chart.updatePending = value;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Series.prototype.scheduleUpdate = function () {
        this.updatePending = true;
    };
    Series.prototype.getOpacity = function (datum) {
        var _a = this, chart = _a.chart, _b = _a.highlightStyle.series.dimOpacity, dimOpacity = _b === void 0 ? 1 : _b;
        return !chart || !chart.highlightedDatum ||
            chart.highlightedDatum.series === this &&
                (!datum || chart.highlightedDatum.itemId === datum.itemId) ? 1 : dimOpacity;
    };
    Series.prototype.getStrokeWidth = function (defaultStrokeWidth, datum) {
        var _a = this, chart = _a.chart, strokeWidth = _a.highlightStyle.series.strokeWidth;
        return chart && chart.highlightedDatum &&
            chart.highlightedDatum.series === this &&
            (!datum || chart.highlightedDatum.itemId === datum.itemId) &&
            strokeWidth !== undefined ? strokeWidth : defaultStrokeWidth;
    };
    Series.prototype.fireNodeClickEvent = function (event, datum) { };
    Series.prototype.toggleSeriesItem = function (itemId, enabled) {
        this.visible = enabled;
    };
    // Each series is expected to have its own logic to efficiently update its nodes
    // on hightlight changes.
    Series.prototype.onHighlightChange = function () { };
    Series.prototype.fixNumericExtent = function (extent, type) {
        if (!extent) {
            // if (type) {
            //     console.warn(`The ${type}-domain could not be found (no valid values), using the default of [0, 1].`);
            // }
            return [0, 1];
        }
        var min = extent[0], max = extent[1];
        min = +min;
        max = +max;
        if (min === max) {
            var padding = Math.abs(min * 0.01);
            min -= padding;
            max += padding;
            // if (type) {
            //     console.warn(`The ${type}-domain has zero length and has been automatically expanded`
            //         + ` by 1 in each direction (from the single valid ${type}-value: ${min}).`);
            // }
        }
        if (!(value_1.isNumber(min) && value_1.isNumber(max))) {
            min = 0;
            max = 1;
            // if (type) {
            //     console.warn(`The ${type}-domain has infinite length, using the default of [0, 1].`);
            // }
        }
        return [min, max];
    };
    Series.highlightedZIndex = 1000000000000;
    __decorate([
        observable_1.reactive('dataChange')
    ], Series.prototype, "data", void 0);
    __decorate([
        observable_1.reactive('dataChange')
    ], Series.prototype, "visible", void 0);
    __decorate([
        observable_1.reactive('layoutChange')
    ], Series.prototype, "showInLegend", void 0);
    return Series;
}(observable_1.Observable));
exports.Series = Series;
//# sourceMappingURL=series.js.map