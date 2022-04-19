var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Observable, reactive } from "./observable";
export class Padding extends Observable {
    constructor(top = 0, right = top, bottom = top, left = right) {
        super();
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.left = left;
    }
    clear() {
        this.top = this.right = this.bottom = this.left = 0;
    }
}
__decorate([
    reactive('layoutChange')
], Padding.prototype, "top", void 0);
__decorate([
    reactive('layoutChange')
], Padding.prototype, "right", void 0);
__decorate([
    reactive('layoutChange')
], Padding.prototype, "bottom", void 0);
__decorate([
    reactive('layoutChange')
], Padding.prototype, "left", void 0);
//# sourceMappingURL=padding.js.map