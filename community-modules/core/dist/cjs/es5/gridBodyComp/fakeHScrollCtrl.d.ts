// Type definitions for @ag-grid-community/core v28.0.0
// Project: https://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { BeanStub } from "../context/beanStub";
import { CtrlsService } from "../ctrlsService";
export interface IFakeHScrollComp {
    setHeight(height: number): void;
    setViewportHeight(height: number): void;
    setContainerHeight(height: number): void;
    setRightSpacerFixedWidth(width: number): void;
    setLeftSpacerFixedWidth(width: number): void;
    addOrRemoveCssClass(cssClassName: string, on: boolean): void;
    includeLeftSpacerScrollerCss(cssClass: string, include: boolean): void;
    includeRightSpacerScrollerCss(cssClass: string, include: boolean): void;
}
export declare class FakeHScrollCtrl extends BeanStub {
    private scrollVisibleService;
    private columnModel;
    ctrlsService: CtrlsService;
    private view;
    private enableRtl;
    private invisibleScrollbar;
    private eViewport;
    private eContainer;
    private eGui;
    constructor();
    setComp(view: IFakeHScrollComp, eGui: HTMLElement, eViewport: HTMLElement, eContainer: HTMLElement): void;
    addActiveListenerToggles(): void;
    private postConstruct;
    private onScrollVisibilityChanged;
    private hideAndShowInvisibleScrollAsNeeded;
    private setFakeHScrollSpacerWidths;
    private setScrollVisible;
    getViewport(): HTMLElement;
    getContainer(): HTMLElement;
}