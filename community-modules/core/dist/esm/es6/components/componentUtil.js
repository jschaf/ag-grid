/**
 * @ag-grid-community/core - Advanced Data Grid / Data Table supporting Javascript / Typescript / React / Angular / Vue
 * @version v27.2.0
 * @link http://www.ag-grid.com/
 * @license MIT
 */
import { Events } from '../events';
import { PropertyKeys } from '../propertyKeys';
import { iterateObject } from '../utils/object';
import { includes } from '../utils/array';
import { values } from '../utils/generic';
export class ComponentUtil {
    static getEventCallbacks() {
        if (!ComponentUtil.EVENT_CALLBACKS) {
            ComponentUtil.EVENT_CALLBACKS = ComponentUtil.EVENTS.map(event => ComponentUtil.getCallbackForEvent(event));
        }
        return ComponentUtil.EVENT_CALLBACKS;
    }
    static copyAttributesToGridOptions(gridOptions, component, skipEventDeprecationCheck = false) {
        // create empty grid options if none were passed
        if (typeof gridOptions !== 'object') {
            gridOptions = {};
        }
        // to allow array style lookup in TypeScript, take type away from 'this' and 'gridOptions'
        const pGridOptions = gridOptions;
        const keyExists = (key) => typeof component[key] !== 'undefined';
        // if groupAggFiltering exists and isn't a function, handle as a boolean.
        if (keyExists('groupAggFiltering') && typeof component.groupAggFiltering !== 'function') {
            pGridOptions.groupAggFiltering = ComponentUtil.toBoolean(component.groupAggFiltering);
            delete component.groupAggFiltering;
        }
        // add in all the simple properties
        [
            ...ComponentUtil.ARRAY_PROPERTIES,
            ...ComponentUtil.STRING_PROPERTIES,
            ...ComponentUtil.OBJECT_PROPERTIES,
            ...ComponentUtil.FUNCTION_PROPERTIES,
            ...ComponentUtil.getEventCallbacks(),
        ]
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = component[key]);
        ComponentUtil.BOOLEAN_PROPERTIES
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = ComponentUtil.toBoolean(component[key]));
        ComponentUtil.NUMBER_PROPERTIES
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = ComponentUtil.toNumber(component[key]));
        return gridOptions;
    }
    static getCallbackForEvent(eventName) {
        if (!eventName || eventName.length < 2) {
            return eventName;
        }
        return 'on' + eventName[0].toUpperCase() + eventName.substr(1);
    }
    static processOnChange(changes, gridOptions, api, columnApi) {
        if (!changes) {
            return;
        }
        const changesToApply = Object.assign({}, changes);
        // to allow array style lookup in TypeScript, take type away from 'this' and 'gridOptions'
        const pGridOptions = gridOptions;
        const keyExists = (key) => changesToApply[key];
        // if groupAggFiltering exists and isn't a function, handle as a boolean.
        if (keyExists('groupAggFiltering')) {
            if (typeof changesToApply.groupAggFiltering === 'function') {
                pGridOptions.groupAggFiltering = changesToApply.groupAggFiltering;
            }
            else {
                pGridOptions.groupAggFiltering = ComponentUtil.toBoolean(changesToApply.groupAggFiltering);
            }
            delete changesToApply.groupAggFiltering;
        }
        // check if any change for the simple types, and if so, then just copy in the new value
        [
            ...ComponentUtil.ARRAY_PROPERTIES,
            ...ComponentUtil.OBJECT_PROPERTIES,
            ...ComponentUtil.STRING_PROPERTIES,
            ...ComponentUtil.getEventCallbacks(),
        ]
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = changesToApply[key].currentValue);
        ComponentUtil.BOOLEAN_PROPERTIES
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = ComponentUtil.toBoolean(changesToApply[key].currentValue));
        ComponentUtil.NUMBER_PROPERTIES
            .filter(keyExists)
            .forEach(key => pGridOptions[key] = ComponentUtil.toNumber(changesToApply[key].currentValue));
        if (changesToApply.enableCellTextSelection) {
            api.setEnableCellTextSelection(ComponentUtil.toBoolean(changesToApply.enableCellTextSelection.currentValue));
            delete changesToApply.enableCellTextSelection;
        }
        if (changesToApply.quickFilterText) {
            api.setQuickFilter(changesToApply.quickFilterText.currentValue);
            delete changesToApply.quickFilterText;
        }
        if (changesToApply.autoGroupColumnDef) {
            api.setAutoGroupColumnDef(changesToApply.autoGroupColumnDef.currentValue, "gridOptionsChanged");
            delete changesToApply.autoGroupColumnDef;
        }
        if (changesToApply.columnDefs) {
            api.setColumnDefs(changesToApply.columnDefs.currentValue, "gridOptionsChanged");
            delete changesToApply.columnDefs;
        }
        if (changesToApply.defaultColDef) {
            api.setDefaultColDef(changesToApply.defaultColDef.currentValue, "gridOptionsChanged");
            delete changesToApply.defaultColDef;
        }
        if (changesToApply.paginationPageSize) {
            api.paginationSetPageSize(ComponentUtil.toNumber(changesToApply.paginationPageSize.currentValue));
            delete changesToApply.paginationPageSize;
        }
        if (changesToApply.pivotMode) {
            columnApi.setPivotMode(ComponentUtil.toBoolean(changesToApply.pivotMode.currentValue));
            delete changesToApply.pivotMode;
        }
        if (changesToApply.groupRemoveSingleChildren) {
            api.setGroupRemoveSingleChildren(ComponentUtil.toBoolean(changesToApply.groupRemoveSingleChildren.currentValue));
            delete changesToApply.groupRemoveSingleChildren;
        }
        if (changesToApply.suppressRowDrag) {
            api.setSuppressRowDrag(ComponentUtil.toBoolean(changesToApply.suppressRowDrag.currentValue));
            delete changesToApply.suppressRowDrag;
        }
        if (changesToApply.suppressMoveWhenRowDragging) {
            api.setSuppressMoveWhenRowDragging(ComponentUtil.toBoolean(changesToApply.suppressMoveWhenRowDragging.currentValue));
            delete changesToApply.suppressMoveWhenRowDragging;
        }
        if (changesToApply.suppressRowClickSelection) {
            api.setSuppressRowClickSelection(ComponentUtil.toBoolean(changesToApply.suppressRowClickSelection.currentValue));
            delete changesToApply.suppressRowClickSelection;
        }
        if (changesToApply.suppressClipboardPaste) {
            api.setSuppressClipboardPaste(ComponentUtil.toBoolean(changesToApply.suppressClipboardPaste.currentValue));
            delete changesToApply.suppressClipboardPaste;
        }
        if (changesToApply.headerHeight) {
            api.setHeaderHeight(ComponentUtil.toNumber(changesToApply.headerHeight.currentValue));
            delete changesToApply.headerHeight;
        }
        // any remaining properties can be set in a generic way
        // ie the setter takes the form of setXXX and the argument requires no formatting/translation first
        const dynamicApi = api;
        Object.keys(changesToApply)
            .forEach(property => {
            const setterName = `set${property.charAt(0).toUpperCase()}${property.substring(1)}`;
            if (dynamicApi[setterName]) {
                dynamicApi[setterName](changes[property].currentValue);
            }
        });
        // copy changes into an event for dispatch
        const event = {
            type: Events.EVENT_COMPONENT_STATE_CHANGED,
            api: gridOptions.api,
            columnApi: gridOptions.columnApi
        };
        iterateObject(changes, (key, value) => {
            event[key] = value;
        });
        api.dispatchEvent(event);
    }
    static toBoolean(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            // for boolean, compare to empty String to allow attributes appearing with
            // no value to be treated as 'true'
            return value.toUpperCase() === 'TRUE' || value == '';
        }
        return false;
    }
    static toNumber(value) {
        if (typeof value === 'number') {
            return value;
        }
        if (typeof value === 'string') {
            return Number(value);
        }
    }
}
// all the events are populated in here AFTER this class (at the bottom of the file).
ComponentUtil.EVENTS = [];
// events that are available for use by users of AG Grid and so should be documented
ComponentUtil.PUBLIC_EVENTS = [];
// events that are internal to AG Grid and should not be exposed to users via documentation or generated framework components
ComponentUtil.EXCLUDED_INTERNAL_EVENTS = [];
ComponentUtil.STRING_PROPERTIES = PropertyKeys.STRING_PROPERTIES;
ComponentUtil.OBJECT_PROPERTIES = PropertyKeys.OBJECT_PROPERTIES;
ComponentUtil.ARRAY_PROPERTIES = PropertyKeys.ARRAY_PROPERTIES;
ComponentUtil.NUMBER_PROPERTIES = PropertyKeys.NUMBER_PROPERTIES;
ComponentUtil.BOOLEAN_PROPERTIES = PropertyKeys.BOOLEAN_PROPERTIES;
ComponentUtil.FUNCTION_PROPERTIES = PropertyKeys.FUNCTION_PROPERTIES;
ComponentUtil.ALL_PROPERTIES = PropertyKeys.ALL_PROPERTIES;
ComponentUtil.EVENTS = values(Events);
/** Exclude the following internal events from code generation to prevent exposing these events via framework components */
ComponentUtil.EXCLUDED_INTERNAL_EVENTS = [
    Events.EVENT_SCROLLBAR_WIDTH_CHANGED,
    Events.EVENT_CHECKBOX_CHANGED,
    Events.EVENT_HEIGHT_SCALE_CHANGED,
    Events.EVENT_BODY_HEIGHT_CHANGED,
    Events.EVENT_DISPLAYED_COLUMNS_WIDTH_CHANGED,
    Events.EVENT_SCROLL_VISIBILITY_CHANGED,
    Events.EVENT_COLUMN_HOVER_CHANGED,
    Events.EVENT_FLASH_CELLS,
    Events.EVENT_PAGINATION_PIXEL_OFFSET_CHANGED,
    Events.EVENT_DISPLAYED_ROWS_CHANGED,
    Events.EVENT_LEFT_PINNED_WIDTH_CHANGED,
    Events.EVENT_RIGHT_PINNED_WIDTH_CHANGED,
    Events.EVENT_ROW_CONTAINER_HEIGHT_CHANGED,
    Events.EVENT_POPUP_TO_FRONT,
    Events.EVENT_KEYBOARD_FOCUS,
    Events.EVENT_MOUSE_FOCUS,
    Events.EVENT_STORE_UPDATED,
    Events.EVENT_COLUMN_PANEL_ITEM_DRAG_START,
    Events.EVENT_COLUMN_PANEL_ITEM_DRAG_END,
    Events.EVENT_FILL_START,
    Events.EVENT_FILL_END,
];
/** EVENTS that should be exposed via code generation for the framework components.  */
ComponentUtil.PUBLIC_EVENTS = ComponentUtil.EVENTS.filter(e => !includes(ComponentUtil.EXCLUDED_INTERNAL_EVENTS, e));