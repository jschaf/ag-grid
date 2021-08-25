import { AreaSparkline } from "./areaSparkline";
import { SparklineAxis } from "./sparkline";
import { ColumnSparkline } from "./columnSparkline";
import { LineSparkline } from "./lineSparkline";

import {
    AgSparklineOptions,
    AgLineSparklineOptions,
    AgAreaSparklineOptions,
    AgColumnSparklineOptions,
    HighlightStyle
} from "@ag-grid-community/core";

export type AgSparklineType<T> =
    T extends AgLineSparklineOptions ? LineSparkline :
    T extends AgAreaSparklineOptions ? AreaSparkline :
    T extends AgColumnSparklineOptions ? ColumnSparkline :
    never;

export abstract class AgSparkline {
    static create<T extends AgSparklineOptions>(options: T): AgSparklineType<T> {

        const sparkline = getSparklineInstance(options.type);

        initSparkline(sparkline, options);

        switch (options.type) {
            case 'column': 
                initColumnSparkline(sparkline, options);
                break;
            case 'area':
                // initAreaSparkline(sparkline, options);
                break;
            case 'line':
            default:
                // initLineSparkline(sparkline, options);
                break;
        }

        //TODO: don't want to test this feature yet
        sparkline.tooltip.enabled = false;

        return sparkline;
    }
}

function getSparklineInstance(type: string = 'line'): any {
    switch (type) {
        case 'line':
            return new LineSparkline();
        case 'column':
            return new ColumnSparkline();
        case 'area':
            return new AreaSparkline();
        default:
            return new LineSparkline();
    }
}


const initSparkline = (sparkline: ColumnSparkline, options: any) => {

    setValueIfPropertyExists(sparkline, 'data', options.data, options);
    setValueIfPropertyExists(sparkline, 'width', options.width, options);
    setValueIfPropertyExists(sparkline, 'height', options.height, options);
    setValueIfPropertyExists(sparkline, 'title', options.title, options);
    setValueIfPropertyExists(sparkline, 'padding', options.padding, options);

    if (options.axis) {
        initAxisOptions(sparkline.axis, options.axis);
    }

    if (options.highlightStyle) {
        initHighlightStyleOptions(sparkline.highlightStyle, options.highlightStyle);
    }
}

const initColumnSparkline = (sparkline: ColumnSparkline, options: any) => {
    setValueIfPropertyExists(sparkline, 'fill', options.fill, options);
    setValueIfPropertyExists(sparkline, 'stroke', options.stroke, options);
    setValueIfPropertyExists(sparkline, 'strokeWidth', options.strokeWidth, options);
    setValueIfPropertyExists(sparkline, 'paddingInner', options.paddingInner, options);
    setValueIfPropertyExists(sparkline, 'paddingOuter', options.paddingOuter, options);
    setValueIfPropertyExists(sparkline, 'yScaleDomain', options.yScaleDomain, options);
    setValueIfPropertyExists(sparkline, 'formatter', options.formatter, options);
}

function setValueIfPropertyExists(target: any, property: string, value: any, options: any): void {
    if (property in options) {
        if (property in target) {
            target[property] = value;
        } else {
            console.warn(`Property ${property} does not exist on the target object.`);
        }
    }
}

function initAxisOptions(target: SparklineAxis , options: any) {
    setValueIfPropertyExists(target, 'stroke', options.stroke, options);
    setValueIfPropertyExists(target, 'strokeWidth', options.strokeWidth, options);
}

function initHighlightStyleOptions(target: HighlightStyle , options: any) {
    setValueIfPropertyExists(target, 'fill', options.fill, options);
    setValueIfPropertyExists(target, 'size', options.size, options);
    setValueIfPropertyExists(target, 'stroke', options.stroke, options);
    setValueIfPropertyExists(target, 'strokeWidth', options.strokeWidth, options);
}

