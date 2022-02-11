// @ag-grid-community/react v27.0.1
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const beansContext_1 = require("../beansContext");
const utils_1 = require("../utils");
const jsComp_1 = require("../jsComp");
const HeaderCellComp = (props) => {
    const { context } = react_1.useContext(beansContext_1.BeansContext);
    const [cssClasses, setCssClasses] = react_1.useState(new utils_1.CssClasses());
    const [width, setWidth] = react_1.useState();
    const [title, setTitle] = react_1.useState();
    const [colId, setColId] = react_1.useState();
    const [ariaSort, setAriaSort] = react_1.useState();
    const [ariaDescribedBy, setAriaDescribedBy] = react_1.useState();
    const [userCompDetails, setUserCompDetails] = react_1.useState();
    const eGui = react_1.useRef(null);
    const eResize = react_1.useRef(null);
    const userCompRef = react_1.useRef();
    const { ctrl } = props;
    react_1.useEffect(() => {
        const compProxy = {
            setWidth: width => setWidth(width),
            addOrRemoveCssClass: (name, on) => setCssClasses(prev => prev.setClass(name, on)),
            setAriaSort: sort => setAriaSort(sort),
            setColId: id => setColId(id),
            setTitle: title => setTitle(title),
            setAriaDescribedBy: value => setAriaDescribedBy(value),
            setUserCompDetails: compDetails => setUserCompDetails(compDetails),
            getUserCompInstance: () => userCompRef.current || undefined
        };
        ctrl.setComp(compProxy, eGui.current, eResize.current);
        const selectAllGui = ctrl.getSelectAllGui();
        eResize.current.insertAdjacentElement('afterend', selectAllGui);
    }, []);
    // js comps
    react_1.useEffect(() => {
        return jsComp_1.showJsComp(userCompDetails, context, eGui.current, userCompRef);
    }, [userCompDetails]);
    // add drag handling, must be done after component is added to the dom
    react_1.useEffect(() => {
        let userCompDomElement = undefined;
        eGui.current.childNodes.forEach(node => {
            if (node != null && node !== eResize.current) {
                userCompDomElement = node;
            }
        });
        ctrl.setDragSource(userCompDomElement);
    }, [userCompDetails]);
    const style = react_1.useMemo(() => ({
        width: width
    }), [width]);
    const className = react_1.useMemo(() => 'ag-header-cell ' + cssClasses.toString(), [cssClasses]);
    const userCompStateless = react_1.useMemo(() => {
        const res = userCompDetails
            && userCompDetails.componentFromFramework
            && utils_1.isComponentStateless(userCompDetails.componentClass);
        return !!res;
    }, [userCompDetails]);
    const reactUserComp = userCompDetails && userCompDetails.componentFromFramework;
    const UserCompClass = userCompDetails && userCompDetails.componentClass;
    return (react_1.default.createElement("div", { ref: eGui, className: className, style: style, title: title, "col-id": colId, "aria-sort": ariaSort, role: "columnheader", tabIndex: -1, "aria-describedby": ariaDescribedBy },
        react_1.default.createElement("div", { ref: eResize, className: "ag-header-cell-resize", role: "presentation" }),
        reactUserComp && userCompStateless && react_1.default.createElement(UserCompClass, Object.assign({}, userCompDetails.params)),
        reactUserComp && !userCompStateless && react_1.default.createElement(UserCompClass, Object.assign({}, userCompDetails.params, { ref: userCompRef }))));
};
exports.default = react_1.memo(HeaderCellComp);

//# sourceMappingURL=headerCellComp.js.map