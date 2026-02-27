const getInitialTypography = () => ({
  font: "serif",
  fontSize: { current: 3, max: 6, min: 0 },
  margins: { current: 1, max: 4, min: 0 }
});

const getInitialReadingGroups = () => ({
  currentAnnotatingReadingGroup: "private",
  currentAnnotationOverlayReadingGroup: "me"
});

const initialPanels = {
  tocDrawer: false,
  readerReturn: false,
  notes: false
};

const initialVisibilityFilters = {
  annotation: { yours: true, others: true, highlights: true },
  resource: { all: true },
  readingGroups: { all: true }
};

export const initialReaderState = {
  colors: { colorScheme: "light", highContrast: false },
  typography: getInitialTypography(),
  readingGroups: getInitialReadingGroups(),
  panels: initialPanels,
  visibilityFilters: initialVisibilityFilters,
  activeAnnotation: null,
  activeAnnotationPassive: false
};

function incrementAttribute(typography, attribute) {
  const parameter = typography[attribute];
  if (parameter.current >= parameter.max) return typography;
  return {
    ...typography,
    [attribute]: { ...parameter, current: parameter.current + 1 }
  };
}

function decrementAttribute(typography, attribute) {
  const parameter = typography[attribute];
  if (parameter.current <= parameter.min) return typography;
  return {
    ...typography,
    [attribute]: { ...parameter, current: parameter.current - 1 }
  };
}

export function readerReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        colors: { ...initialReaderState.colors, ...action.payload?.colors },
        typography: {
          ...getInitialTypography(),
          ...action.payload?.typography
        },
        readingGroups: {
          ...getInitialReadingGroups(),
          ...action.payload?.readingGroups
        }
      };

    // Colors
    case "SET_COLOR_SCHEME":
      return {
        ...state,
        colors: { ...state.colors, colorScheme: action.payload }
      };
    case "SET_HIGH_CONTRAST":
      return {
        ...state,
        colors: { ...state.colors, highContrast: action.payload }
      };

    // Typography
    case "SELECT_FONT":
      return {
        ...state,
        typography: { ...state.typography, font: action.payload }
      };
    case "INCREMENT_FONT_SIZE":
      return {
        ...state,
        typography: incrementAttribute(state.typography, "fontSize")
      };
    case "DECREMENT_FONT_SIZE":
      return {
        ...state,
        typography: decrementAttribute(state.typography, "fontSize")
      };
    case "INCREMENT_MARGINS":
      return {
        ...state,
        typography: incrementAttribute(state.typography, "margins")
      };
    case "DECREMENT_MARGINS":
      return {
        ...state,
        typography: decrementAttribute(state.typography, "margins")
      };
    case "RESET_TYPOGRAPHY":
      return { ...state, typography: getInitialTypography() };

    // Reading groups
    case "SET_ANNOTATING_READING_GROUP":
      return {
        ...state,
        readingGroups: {
          ...state.readingGroups,
          currentAnnotatingReadingGroup: action.payload
        }
      };
    case "SET_ANNOTATION_OVERLAY_READING_GROUP":
      return {
        ...state,
        readingGroups: {
          ...state.readingGroups,
          currentAnnotationOverlayReadingGroup: action.payload
        }
      };

    case "LOGOUT":
      return { ...state, readingGroups: getInitialReadingGroups() };

    // Panels (solo: opening one closes the others)
    case "PANEL_TOGGLE": {
      const panel = action.payload;
      const opening = !state.panels[panel];
      const panels = Object.keys(state.panels).reduce((acc, key) => {
        if (key === panel) acc[key] = opening;
        else acc[key] = opening ? false : state.panels[key];
        return acc;
      }, {});
      return { ...state, panels };
    }
    case "PANEL_HIDE":
      return {
        ...state,
        panels: { ...state.panels, [action.payload]: false }
      };
    case "PANELS_HIDE_ALL":
      return { ...state, panels: initialPanels };

    // Visibility filters
    case "VISIBILITY_FILTERS_CHANGE":
      return {
        ...state,
        visibilityFilters: { ...state.visibilityFilters, ...action.payload }
      };

    // Active annotation
    case "SET_ACTIVE_ANNOTATION":
      if (!action.payload) {
        return {
          ...state,
          activeAnnotation: null,
          activeAnnotationPassive: false
        };
      }
      return {
        ...state,
        activeAnnotation: action.payload.annotationId,
        activeAnnotationPassive: action.payload.passive
      };

    default:
      return state;
  }
}
