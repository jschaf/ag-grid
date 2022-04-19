"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@ag-grid-community/core");
let FilterAggregatesStage = class FilterAggregatesStage extends core_1.BeanStub {
    execute(params) {
        const isPivotMode = this.columnModel.isPivotMode();
        const isAggFilterActive = this.filterManager.isAggregateFilterPresent();
        // This is the default filter for applying only to leaf nodes, realistically this should not apply as primary agg columns,
        // should not be applied by the filterManager if getGroupAggFiltering is missing. Predicate will apply filters to leaf level.
        const defaultPrimaryColumnPredicate = (params) => !params.node.group;
        // Default secondary column predicate, selecting only leaf level groups.
        const defaultSecondaryColumnPredicate = ((params) => params.node.leafGroup);
        // The predicate to determine whether filters should apply to this row. Either defined by the user in groupAggFiltering or a default depending
        // on current pivot mode status.
        const applyFilterToNode = this.gridOptionsWrapper.getGroupAggFiltering()
            || (isPivotMode ? defaultSecondaryColumnPredicate : defaultPrimaryColumnPredicate);
        const { changedPath } = params;
        const preserveFilterStageConfig = (node) => {
            node.childrenAfterAggFilter = node.childrenAfterFilter;
            const childCount = node.childrenAfterAggFilter.reduce((acc, child) => (acc + (child.allChildrenCount || 1)), 0);
            node.setAllChildrenCount(childCount);
            if (node.sibling) {
                node.sibling.childrenAfterAggFilter = node.childrenAfterAggFilter;
            }
        };
        const preserveChildren = (node) => {
            if (node.childrenAfterFilter) {
                node.childrenAfterAggFilter = node.childrenAfterFilter;
                const childCount = node.childrenAfterAggFilter.reduce((acc, child) => {
                    preserveChildren(child);
                    return acc + (child.allChildrenCount || 1);
                }, 0);
                node.setAllChildrenCount(childCount);
            }
            if (node.sibling) {
                node.sibling.childrenAfterAggFilter = node.childrenAfterAggFilter;
            }
        };
        const filterChildren = (node) => {
            var _a;
            let childCount = 0;
            node.childrenAfterAggFilter = ((_a = node.childrenAfterFilter) === null || _a === void 0 ? void 0 : _a.filter((child) => {
                var _a;
                const shouldFilterRow = applyFilterToNode({ node: child });
                if (shouldFilterRow) {
                    const doesNodePassFilter = this.filterManager.doesRowPassAggregateFilters({ rowNode: child });
                    if (doesNodePassFilter) {
                        // Node has passed, so preserve children
                        preserveChildren(child);
                        childCount += child.allChildrenCount || 1;
                        return true;
                    }
                }
                const hasChildPassed = (_a = child.childrenAfterAggFilter) === null || _a === void 0 ? void 0 : _a.length;
                if (hasChildPassed) {
                    childCount += child.allChildrenCount || 1;
                    return true;
                }
                return false;
            })) || null;
            node.setAllChildrenCount(childCount);
            if (node.sibling) {
                node.sibling.childrenAfterAggFilter = node.childrenAfterAggFilter;
            }
        };
        changedPath.forEachChangedNodeDepthFirst(isAggFilterActive ? filterChildren : preserveFilterStageConfig, false);
    }
};
__decorate([
    core_1.Autowired('filterManager')
], FilterAggregatesStage.prototype, "filterManager", void 0);
__decorate([
    core_1.Autowired('columnModel')
], FilterAggregatesStage.prototype, "columnModel", void 0);
FilterAggregatesStage = __decorate([
    core_1.Bean('filterAggregatesStage')
], FilterAggregatesStage);
exports.FilterAggregatesStage = FilterAggregatesStage;
//# sourceMappingURL=filterAggregatesStage.js.map