import { Bean, Autowired } from './context/context';
import { BeanStub } from "./context/beanStub";
import { doOnce } from './utils/function';

export type SASS_PROPERTIES = 'headerHeight' | 'headerCellMinWidth' | 'listItemHeight' | 'rowHeight' | 'chartMenuPanelWidth';

interface HardCodedSize {
    [key: string]: {
        [key in SASS_PROPERTIES]?: number;
    };
}

const MAT_GRID_SIZE = 8;
const BASE_GRID_SIZE = 4;
const BALHAM_GRID_SIZE = 4;
const ALPINE_GRID_SIZE = 6;

const HARD_CODED_SIZES: HardCodedSize = {
    // this item is required for custom themes
    'ag-theme-custom': {
        headerHeight: 25,
        headerCellMinWidth: 24,
        listItemHeight: BASE_GRID_SIZE * 5,
        rowHeight: 25,
        chartMenuPanelWidth: 220
    },
    'ag-theme-material': {
        headerHeight: MAT_GRID_SIZE * 7,
        headerCellMinWidth: 48,
        listItemHeight: MAT_GRID_SIZE * 4,
        rowHeight: MAT_GRID_SIZE * 6,
        chartMenuPanelWidth: 240
    },
    'ag-theme-balham': {
        headerHeight: BALHAM_GRID_SIZE * 8,
        headerCellMinWidth: 24,
        listItemHeight: BALHAM_GRID_SIZE * 6,
        rowHeight: BALHAM_GRID_SIZE * 7,
        chartMenuPanelWidth: 220
    },
    'ag-theme-alpine': {
        headerHeight: ALPINE_GRID_SIZE * 8,
        headerCellMinWidth: 36,
        listItemHeight: ALPINE_GRID_SIZE * 4,
        rowHeight: ALPINE_GRID_SIZE * 7,
        chartMenuPanelWidth: 240
    }
};

/**
 * this object contains a list of Sass variables and an array
 * of CSS styles required to get the correct value.
 * eg. $virtual-item-height requires a structure, so we can get its height.
 * <div class="ag-theme-balham">
 *     <div class="ag-virtual-list-container">
 *         <div class="ag-virtual-list-item"></div>
 *     </div>
 * </div>
 */
const SASS_PROPERTY_BUILDER: { [key in SASS_PROPERTIES]: string[] } = {
    headerHeight: ['ag-header-row'],
    headerCellMinWidth: ['ag-header-cell'],
    listItemHeight: ['ag-virtual-list-item'],
    rowHeight: ['ag-row'],
    chartMenuPanelWidth: ['ag-chart-docked-container']
};

const CALCULATED_SIZES: HardCodedSize = {};

@Bean('environment')
export class Environment extends BeanStub {

    @Autowired('eGridDiv') private eGridDiv: HTMLElement;

    public getSassVariable(theme: string, key: SASS_PROPERTIES): number | undefined {
        const useTheme = 'ag-theme-' + (theme.match('material') ? 'material' : theme.match('balham') ? 'balham' : theme.match('alpine') ? 'alpine' : 'custom');
        const defaultValue = HARD_CODED_SIZES[useTheme][key];
        let calculatedValue = 0;

        if (!CALCULATED_SIZES[theme]) {
            CALCULATED_SIZES[theme] = {};
        }

        const size = CALCULATED_SIZES[theme][key];

        if (size != null) {
            return size;
        }

        if (SASS_PROPERTY_BUILDER[key]) {
            const classList = SASS_PROPERTY_BUILDER[key];
            const div = document.createElement('div');
            div.classList.add(theme);
            div.style.position = 'absolute';

            const el: HTMLDivElement = classList.reduce((prevEl: HTMLDivElement, currentClass: string) => {
                const currentDiv = document.createElement('div');
                currentDiv.style.position = 'static';
                currentDiv.classList.add(currentClass);
                prevEl.appendChild(currentDiv);

                return currentDiv;
            }, div);

            if (document.body) {
                document.body.appendChild(div);
                const sizeName = key.toLowerCase().indexOf('height') !== -1 ? 'height' : 'width';
                calculatedValue = parseInt(window.getComputedStyle(el)[sizeName]!, 10);
                document.body.removeChild(div);
            }
        }

        CALCULATED_SIZES[theme][key] = calculatedValue || defaultValue;

        return CALCULATED_SIZES[theme][key];
    }

    public isThemeDark(): boolean {
        const { theme } = this.getTheme();
        return !!theme && theme.indexOf('dark') >= 0;
    }

    public chartMenuPanelWidth() {
        const theme = this.getTheme().themeFamily;
        return this.getSassVariable(theme!, 'chartMenuPanelWidth');
    }

    public getTheme(): { theme?: string; el?: HTMLElement; themeFamily?: string; allThemes: string[] } {
        const reg = /\bag-(material|(?:theme-([\w\-]*)))\b/g;
        let el: HTMLElement | undefined = this.eGridDiv;
        let themeMatch: RegExpMatchArray | null = null;
        let allThemes: string[] = [];

        while (el) {
            themeMatch = reg.exec(el.className);
            if (!themeMatch) {
                el = el.parentElement || undefined;
            } else {
                const matched = el.className.match(reg);
                if (matched) {
                    allThemes = matched;
                }
                break;
            }
        }

        if (!themeMatch) { return { allThemes }; }

        const theme = themeMatch[0];
        const usingOldTheme = themeMatch[2] === undefined;

        if (usingOldTheme) {
            const newTheme = theme.replace('ag-', 'ag-theme-');
            doOnce(() => console.warn(`AG Grid: As of v19 old theme are no longer provided. Please replace ${theme} with ${newTheme}.`), 'using-old-theme');
        }

        return { theme, el, themeFamily: theme.replace(/-dark$/, ''), allThemes };
    }
}
