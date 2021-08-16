// Type definitions for @ag-grid-community/core v26.0.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from "./component";
import { TabGuardCtrl } from "./tabGuardCtrl";
export declare class TabGuardComp extends Component {
    private eTopGuard;
    private eBottomGuard;
    private eFocusableElement;
    protected tabGuardCtrl: TabGuardCtrl;
    protected initialiseTabGuard(params: {
        focusInnerElement?: (fromBottom: boolean) => void;
        shouldStopEventPropagation?: () => boolean;
        onFocusIn?: (e: FocusEvent) => void;
        onFocusOut?: (e: FocusEvent) => void;
        onTabKeyDown?: (e: KeyboardEvent) => void;
        handleKeyDown?: (e: KeyboardEvent) => void;
    }): void;
    private createTabGuard;
    private addTabGuards;
    protected removeAllChildrenExceptTabGuards(): void;
    forceFocusOutOfContainer(): void;
    appendChild(newChild: HTMLElement | Component, container?: HTMLElement): void;
}