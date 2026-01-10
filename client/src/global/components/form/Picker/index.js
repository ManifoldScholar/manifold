import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
  useMemo,
  useId
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormField, useAuthentication } from "hooks";
import Errorable from "../Errorable";
import Instructions from "../Instructions";
import Developer from "global/components/developer";
import IconComposer from "global/components/utility/IconComposer";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isFunction from "lodash/isFunction";
import isNil from "lodash/isNil";
import has from "lodash/has";
import keyBy from "lodash/keyBy";
import startsWith from "lodash/startsWith";
import { FormContext } from "helpers/contexts";
import { ApiClient } from "api";
import { isPromise } from "utils/promise";
import Authorization from "helpers/authorization";
import BaseLabel from "../BaseLabel";
import * as Styled from "./styles";

const KEYS = {
  TAB: 9,
  DOWN: 40,
  UP: 38,
  ENTER: 13,
  ESCAPE: 27
};

// Helper functions for option processing
const isSimpleValue = value =>
  isString(value) || isNumber(value) || isBoolean(value);

const hasOptionShape = option => has(option, "label") && has(option, "value");

const hasResourceShape = option => has(option, "id");

const valueToString = value => {
  if (isSimpleValue(value)) return value.toString();
  if (hasResourceShape(value)) return value.id;
  return String(value);
};

const defaultOptionToLabel = value => {
  if (isSimpleValue(value)) return value.toString();
  if (hasResourceShape(value)) return `${value.type} - ${value.id}`;
  return String(value);
};

const defaultOptionFilter = (searchWord, option) => {
  return startsWith(option.label.toLowerCase(), searchWord.toLowerCase());
};

const rawOptionToOption = rawOption => {
  if (hasOptionShape(rawOption))
    return {
      label: rawOption.label,
      instructions: rawOption.instructions,
      originalValue: rawOption.value
    };
  return {
    label: null,
    instructions: null,
    originalValue: rawOption
  };
};

const enhanceOption = (option, props) => {
  const optionToValue = props.optionToValue || (v => v);
  const optionToString = props.optionToString || valueToString;
  const optionToLabel = props.optionToLabel || defaultOptionToLabel;
  const optionToInstructions = props.optionToInstructions || (() => null);

  const originalValue = optionToValue(option.originalValue);
  const value = optionToString(originalValue);
  const enhancements = { originalValue, value };

  if (isNil(option.label)) {
    enhancements.label = optionToLabel(option.originalValue);
  }
  if (isNil(option.instructions)) {
    enhancements.instructions = optionToInstructions(option.originalValue);
  }
  if (isNil(option.key)) enhancements.key = enhancements.value;
  return Object.assign(option, enhancements);
};

const deriveStateFromOptions = (optionsIn, props) => {
  const options = Array.isArray(optionsIn)
    ? optionsIn.map(rawOption => {
        return enhanceOption(rawOptionToOption(rawOption), props);
      })
    : [];
  const valueMap = keyBy(options, "value");
  const labelMap = keyBy(options, "label");
  return { options, valueMap, labelMap };
};

export default function FormPicker({
  name,
  debug = false,
  label,
  listStyle,
  listRowComponent = "FormOptionRow",
  listRowProps = { namePath: "attributes.name" },
  listRowEditRoute,
  placeholder,
  wide = false,
  allowNew = false,
  newToValue = v => v,
  beforeSetValue = v => v,
  beforeGetValue = v => v,
  showAddRemoveAll,
  instructions,
  belongsTo = false,
  reorderable = false,
  options: optionsProp = [],
  updateOptions: updateOptionsProp,
  optionToLabel,
  optionToValue,
  optionToInstructions,
  optionToString,
  optionFilter = defaultOptionFilter,
  predictive = false,
  value: valueProp,
  onChange: onChangeProp,
  errors: errorsProp
}) {
  const id = useId();
  const { t } = useTranslation();
  const context = useContext(FormContext);
  const { authToken } = useAuthentication();
  const authorization = useMemo(() => new Authorization(), []);

  // Form field integration
  const { value: formValue, set, errors } = useFormField(name, {
    controlledValue: valueProp,
    controlledOnChange: onChangeProp,
    controlledErrors: errorsProp
  });

  const rawValue = beforeGetValue(formValue);
  const isMultiple = Array.isArray(rawValue);

  // Refs
  const inputWrapperRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionsRef = useRef(null);
  const unmountingRef = useRef(false);

  // Screen reader status state
  const [srMessage, setSrMessage] = useState(null);
  const srTimeoutRef = useRef(null);

  const setScreenReaderStatus = useCallback(message => {
    setSrMessage(message);
    if (srTimeoutRef.current) clearTimeout(srTimeoutRef.current);
    srTimeoutRef.current = setTimeout(() => {
      setSrMessage(null);
    }, 1000);
  }, []);

  // Options state
  const [optionsState, setOptionsState] = useState(() => {
    if (!isFunction(optionsProp)) {
      return deriveStateFromOptions(optionsProp, {
        optionToLabel,
        optionToValue,
        optionToInstructions,
        optionToString
      });
    }
    return { options: [], valueMap: {}, labelMap: {} };
  });

  const [searchWord, setSearchWord] = useState(null);
  const [announcement, setAnnouncement] = useState(null);

  // UI state
  const [listBoxVisible, setListBoxVisible] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState(null);
  const [activeOptionState, setActiveOptionState] = useState(null);

  // Fetch options when optionsProp is a function
  const canFetchOptions = isFunction(optionsProp);

  const fetchOptions = useCallback(() => {
    if (!canFetchOptions) return;
    const { endpoint, method, options: fetchOpts = {} } = optionsProp();

    fetchOpts.authToken = authToken;
    fetchOpts.params = fetchOpts.params || {};
    fetchOpts.params.noPagination = true;

    const client = new ApiClient();
    client.call(endpoint, method, fetchOpts).then(results => {
      if (unmountingRef.current) return;
      const resources = results.data;
      const newState = deriveStateFromOptions(resources, {
        optionToLabel,
        optionToValue,
        optionToInstructions,
        optionToString
      });
      setOptionsState(newState);
    });
  }, [
    canFetchOptions,
    optionsProp,
    authToken,
    optionToLabel,
    optionToValue,
    optionToInstructions,
    optionToString
  ]);

  // Update options when prop changes
  useEffect(() => {
    if (!isFunction(optionsProp)) {
      setOptionsState(
        deriveStateFromOptions(optionsProp, {
          optionToLabel,
          optionToValue,
          optionToInstructions,
          optionToString
        })
      );
    } else {
      fetchOptions();
    }
  }, [
    optionsProp,
    optionToLabel,
    optionToValue,
    optionToInstructions,
    optionToString,
    fetchOptions
  ]);

  // Handle search word changes for external filtering
  useEffect(() => {
    if (updateOptionsProp && searchWord !== null) {
      updateOptionsProp(searchWord);
    }
  }, [searchWord, updateOptionsProp]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unmountingRef.current = true;
      if (srTimeoutRef.current) clearTimeout(srTimeoutRef.current);
    };
  }, []);

  // Announcement effect
  useEffect(() => {
    if (announcement) {
      setScreenReaderStatus(announcement);
    }
  }, [announcement, setScreenReaderStatus]);

  // Options processing
  const filterOptionsInternally = isNil(updateOptionsProp);
  const unfilteredOptions = optionsState.options;

  const filteredOptions = useMemo(() => {
    if (!searchWord || searchWord === "") return unfilteredOptions;
    if (!filterOptionsInternally) return unfilteredOptions;
    return unfilteredOptions.filter(option => optionFilter(searchWord, option));
  }, [searchWord, unfilteredOptions, filterOptionsInternally, optionFilter]);

  const options = filterOptionsInternally ? filteredOptions : unfilteredOptions;

  // Option helpers
  const findOption = useCallback(
    value => {
      const stringValue = valueToString(value);
      const byValue = has(optionsState.valueMap, stringValue)
        ? optionsState.valueMap[stringValue]
        : null;
      if (byValue || !predictive) return byValue;
      return has(optionsState.labelMap, value)
        ? optionsState.labelMap[value]
        : null;
    },
    [optionsState.valueMap, optionsState.labelMap, predictive]
  );

  const selectToOriginalValue = useCallback(
    select => {
      const option = findOption(select);
      return option ? option.originalValue : null;
    },
    [findOption]
  );

  const valueToLabel = useCallback(
    value => {
      const option = findOption(value);
      if (!option || !option.label) return value;
      return option.label;
    },
    [findOption]
  );

  // Selected options
  const selectedOptions = useMemo(() => {
    const values = isMultiple ? rawValue : [rawValue].filter(i => i);
    const toStringFn = optionToString || valueToString;
    return values.map(v => findOption(toStringFn(v))).filter(i => i);
  }, [rawValue, isMultiple, findOption, optionToString]);

  // Active option logic
  const singleSelectedOption =
    !isMultiple && selectedOptions.length > 0 ? selectedOptions[0] : null;

  const activeOption = useMemo(() => {
    const candidate = activeOptionState || singleSelectedOption;
    if (options.includes(candidate)) return candidate;
    return null;
  }, [activeOptionState, singleSelectedOption, options]);

  const activeOptionFromState = useMemo(() => {
    if (options.includes(activeOptionState)) return activeOptionState;
    return null;
  }, [activeOptionState, options]);

  const activeOptionIndex = useMemo(() => {
    if (!activeOption) return -1;
    return options.findIndex(option => option === activeOption);
  }, [activeOption, options]);

  // Authorization for allowNew
  const allowsNew = useMemo(() => {
    if (typeof allowNew === "boolean") return allowNew;
    return authorization.authorizeAbility({
      authentication: { authToken },
      entity: allowNew.entity,
      ability: allowNew.ability
    });
  }, [allowNew, authorization, authToken]);

  // Selection handlers
  const replaceSelection = useCallback(
    value => {
      set(beforeSetValue(value));
    },
    [set, beforeSetValue]
  );

  const announceDeselection = useCallback(
    value => {
      setAnnouncement(`${valueToLabel(value)} was deselected`);
    },
    [valueToLabel]
  );

  const announceSelection = useCallback(
    value => {
      setAnnouncement(`${valueToLabel(value)} was selected`);
    },
    [valueToLabel]
  );

  const doValuesMatch = useCallback((value, compareValue) => {
    if (value === compareValue) return true;
    return valueToString(value) === valueToString(compareValue);
  }, []);

  const isSelected = useCallback(
    value => {
      if (!isMultiple) return rawValue === value;
      return rawValue.some(compareValue => doValuesMatch(value, compareValue));
    },
    [isMultiple, rawValue, doValuesMatch]
  );

  const appendSelection = useCallback(
    value => {
      if (value === null) return;
      if (rawValue.includes(value)) return;
      const newValue = [...rawValue, value];
      replaceSelection(newValue);
    },
    [rawValue, replaceSelection]
  );

  const addOrReplaceSelection = useCallback(
    value => {
      announceSelection(value);
      if (isMultiple) {
        appendSelection(value);
      } else {
        replaceSelection(value);
      }
    },
    [isMultiple, appendSelection, replaceSelection, announceSelection]
  );

  const newThenSelectValue = useCallback(
    inputValue => {
      const value = newToValue(inputValue);
      if (!isPromise(value)) return addOrReplaceSelection(value);
      value
        .then(addOrReplaceSelection, () => {})
        .then(
          () => {
            if (canFetchOptions) fetchOptions();
          },
          () => {}
        );
    },
    [newToValue, addOrReplaceSelection, canFetchOptions, fetchOptions]
  );

  const select = useCallback(
    value => {
      const originalValue = selectToOriginalValue(value);
      if (originalValue == null && allowsNew && value)
        return newThenSelectValue(value);
      return addOrReplaceSelection(originalValue);
    },
    [
      selectToOriginalValue,
      allowsNew,
      newThenSelectValue,
      addOrReplaceSelection
    ]
  );

  const deselect = useCallback(
    value => {
      if (!isMultiple) {
        if (rawValue === value) return replaceSelection(null);
      }
      const newValue = rawValue.filter(
        compareValue => !doValuesMatch(value, compareValue)
      );
      if (newValue.length !== rawValue.length) {
        announceDeselection(value);
      }
      replaceSelection(newValue);
    },
    [isMultiple, rawValue, replaceSelection, doValuesMatch, announceDeselection]
  );

  const unselectAll = useCallback(() => {
    const nullValue = belongsTo ? { _remove: true } : null;
    replaceSelection(isMultiple ? [] : nullValue);
  }, [belongsTo, isMultiple, replaceSelection]);

  const selectAll = useCallback(() => {
    if (!isMultiple) return;
    const values = filteredOptions.map(option => option.originalValue);
    replaceSelection(values);
  }, [isMultiple, filteredOptions, replaceSelection]);

  const toggleOptionSelection = useCallback(
    value => {
      const originalValue = selectToOriginalValue(value);
      if (isSelected(originalValue)) {
        deselect(originalValue);
      } else {
        select(value);
      }
    },
    [selectToOriginalValue, isSelected, deselect, select]
  );

  const reorderSelection = useCallback(
    ({ id: itemId, position }) => {
      const toStringFn = optionToString || valueToString;
      const thingToMove = rawValue.find(thing => toStringFn(thing) === itemId);
      const newCollection = rawValue.filter(thing => thing !== thingToMove);
      let insertIndex;
      switch (position) {
        case "top":
          insertIndex = 0;
          break;
        case "bottom":
          insertIndex = newCollection.length - 1;
          break;
        default:
          insertIndex = position - 1;
      }
      newCollection.splice(insertIndex, 0, thingToMove);
      replaceSelection(newCollection);
    },
    [rawValue, optionToString, replaceSelection]
  );

  // UI helpers
  const hasSelection = selectedOptions.length > 0;
  const isSearchInputValueNull = searchInputValue === null;
  const isSearchInputValuePresent = !isSearchInputValueNull;
  const isSearchInputValueEmptyString =
    isString(searchInputValue) && searchInputValue.trim() === "";
  const isResetButtonVisible = !isMultiple && hasSelection;

  const searchInputDisplayValue = useMemo(() => {
    if (searchInputValue !== null) return searchInputValue;
    if (isMultiple) return "";
    if (selectedOptions[0]) return selectedOptions[0].label;
    if (allowsNew && rawValue) return rawValue;
    return "";
  }, [searchInputValue, isMultiple, selectedOptions, allowsNew, rawValue]);

  // Listbox visibility
  const makeListBoxVisible = useCallback(() => {
    setListBoxVisible(true);
  }, []);

  const makeListBoxHidden = useCallback(() => {
    setActiveOptionState(null);
    setListBoxVisible(false);
  }, []);

  const toggleListBoxVisibility = useCallback(() => {
    setListBoxVisible(prev => !prev);
  }, []);

  // Scroll to active option
  const scrollToActiveOption = useCallback(() => {
    if (activeOptionIndex < 0) return;
    const parent = optionsRef.current;
    if (!parent) return;
    const node = parent.children[activeOptionIndex];
    if (!node) return;
    const visible =
      node.offsetTop > parent.scrollTop &&
      node.offsetTop < parent.scrollTop + parent.offsetHeight;
    if (!visible) node.scrollIntoView();
  }, [activeOptionIndex]);

  const setActiveOption = useCallback(
    option => {
      setActiveOptionState(option);
      // Defer scroll to next tick
      setTimeout(scrollToActiveOption, 0);
    },
    [scrollToActiveOption]
  );

  const activateNextOption = useCallback(() => {
    const nextIndex =
      !listBoxVisible && activeOptionIndex !== -1
        ? activeOptionIndex
        : activeOptionIndex + 1;
    makeListBoxVisible();
    const index = Math.min(nextIndex, options.length - 1);
    setActiveOption(options[index]);
  }, [
    listBoxVisible,
    activeOptionIndex,
    options,
    makeListBoxVisible,
    setActiveOption
  ]);

  const activatePreviousOption = useCallback(() => {
    makeListBoxVisible();
    const index = Math.max(activeOptionIndex - 1, 0);
    setActiveOption(options[index]);
  }, [activeOptionIndex, options, makeListBoxVisible, setActiveOption]);

  // Select or toggle option
  const selectOrToggleOption = useCallback(
    value => {
      if (isMultiple) {
        toggleOptionSelection(value);
        makeListBoxHidden();
      } else {
        setSearchInputValue(null);
        select(value);
        makeListBoxHidden();
      }
    },
    [isMultiple, toggleOptionSelection, select, makeListBoxHidden]
  );

  // Select active option (on Enter)
  const selectActiveOption = useCallback(() => {
    const active = activeOptionFromState;
    if (!active && isSearchInputValueEmptyString && !isMultiple) {
      unselectAll();
    } else if (active) {
      selectOrToggleOption(active.value);
      if (isMultiple) {
        setSearchInputValue(null);
        makeListBoxHidden();
      }
    } else if (!active && allowsNew) {
      selectOrToggleOption(searchInputDisplayValue);
    }
  }, [
    activeOptionFromState,
    isSearchInputValueEmptyString,
    isMultiple,
    unselectAll,
    selectOrToggleOption,
    allowsNew,
    searchInputDisplayValue,
    makeListBoxHidden
  ]);

  // Global click handler
  useEffect(() => {
    const maybeCloseListBox = event => {
      if (!inputWrapperRef.current) return;
      if (!inputWrapperRef.current.contains(event.target)) {
        makeListBoxHidden();
      }
    };
    window.addEventListener("click", maybeCloseListBox);
    return () => window.removeEventListener("click", maybeCloseListBox);
  }, [makeListBoxHidden]);

  // Key handlers
  const listenForListBoxNavigation = useCallback(
    event => {
      if (event.keyCode === KEYS.DOWN) {
        event.preventDefault();
        activateNextOption();
      }
      if (event.keyCode === KEYS.UP) {
        event.preventDefault();
        activatePreviousOption();
      }
      if (event.keyCode === KEYS.TAB) makeListBoxHidden();
      if (event.keyCode === KEYS.ENTER) {
        event.preventDefault();
        selectActiveOption();
      }
      if (event.keyCode === KEYS.ESCAPE) {
        event.preventDefault();
        event.stopPropagation();
        makeListBoxHidden();
      }
    },
    [
      activateNextOption,
      activatePreviousOption,
      makeListBoxHidden,
      selectActiveOption
    ]
  );

  const stopEscapePropagation = useCallback(event => {
    if (event.keyCode === KEYS.ESCAPE) event.stopPropagation();
  }, []);

  // Search input handlers
  const updateSearchInputValue = useCallback(
    value => {
      makeListBoxVisible();
      setSearchInputValue(value);
      setSearchWord(value ? value.trim() : null);
    },
    [makeListBoxVisible]
  );

  const onSearchInputChange = useCallback(
    event => {
      updateSearchInputValue(event.target.value);
    },
    [updateSearchInputValue]
  );

  const onSearchInputClick = useCallback(() => {
    if (isMultiple || (!isMultiple && isSearchInputValueNull)) {
      toggleListBoxVisibility();
    }
  }, [isMultiple, isSearchInputValueNull, toggleListBoxVisibility]);

  const onSearchInputFocus = useCallback(() => {
    if (searchInputRef.current) {
      searchInputRef.current.select();
    }
  }, []);

  const somethingInPickerHasFocus = () => {
    return (
      document.activeElement &&
      inputWrapperRef.current?.contains(document.activeElement)
    );
  };

  const onSearchInputBlur = useCallback(
    event => {
      if (
        !somethingInPickerHasFocus() ||
        !inputWrapperRef.current?.contains(event.relatedTarget)
      )
        return;

      if (!isMultiple && isSearchInputValueEmptyString) unselectAll();
      if (isSearchInputValuePresent) {
        if (allowsNew) {
          selectActiveOption();
        } else {
          updateSearchInputValue(null);
        }
      }
      makeListBoxHidden();
    },
    [
      isMultiple,
      isSearchInputValueEmptyString,
      isSearchInputValuePresent,
      allowsNew,
      unselectAll,
      selectActiveOption,
      updateSearchInputValue,
      makeListBoxHidden
    ]
  );

  // Remove/reorder callbacks for list
  const removeSelection = useCallback(
    selection => {
      deselect(selection);
    },
    [deselect]
  );

  const handleReorderSelection = useCallback(
    (selection, newPosition) => {
      reorderSelection({ id: selection, position: newPosition });
    },
    [reorderSelection]
  );

  // IDs
  const ids = useMemo(
    () => ({
      wrapper: `${id}-picker`,
      label: `${id}-picker-label`,
      instructions: `${id}-picker-instructions`,
      error: `${id}-picker-error`,
      textBox: `${id}-picker-textbox`,
      listBox: `${id}-picker-listbox`,
      option: `${id}-picker-option`
    }),
    [id]
  );

  const activeOptionId = activeOptionFromState
    ? `${ids.option}-${activeOptionFromState.key}`
    : null;

  // Callbacks for list component
  const callbacks = useMemo(
    () => ({
      selectOrToggleOption,
      toggleListBoxVisibility,
      makeListBoxVisible,
      makeListBoxHidden,
      removeSelection,
      reorderSelection: handleReorderSelection,
      selectAll,
      unselectAll
    }),
    [
      selectOrToggleOption,
      toggleListBoxVisibility,
      makeListBoxVisible,
      makeListBoxHidden,
      removeSelection,
      handleReorderSelection,
      selectAll,
      unselectAll
    ]
  );

  // Options meta for list row props
  const optionsMeta = useMemo(
    () => ({
      activeOption,
      selectedOptions,
      value: rawValue,
      stringValue: (optionToString || valueToString)(rawValue),
      allOptions: unfilteredOptions,
      announcement
    }),
    [
      activeOption,
      selectedOptions,
      rawValue,
      optionToString,
      unfilteredOptions,
      announcement
    ]
  );

  const TextInput =
    context?.styleType === "secondary"
      ? Styled.TextInputSecondary
      : Styled.TextInput;

  // Live region for screen readers
  const renderLiveRegion = () => (
    <div
      role="status"
      aria-live="polite"
      aria-atomic
      className="screen-reader-text"
    >
      {srMessage}
    </div>
  );

  return (
    <Errorable
      className={wide ? "wide" : undefined}
      name={name}
      errors={errors}
      label={label}
      idForError={ids.error}
    >
      {debug && (
        <Developer.Debugger
          shouldExpandNode={(keyName, data, level) => level <= 1}
          object={{
            value: rawValue,
            state: {
              listBoxVisible,
              searchInputValue,
              activeOption: activeOptionState
            }
          }}
        />
      )}
      {renderLiveRegion()}
      <Styled.Wrapper>
        <BaseLabel
          id={ids.textBox}
          label={label}
          styleType={context?.styleType}
        />
        <Instructions instructions={instructions} />
        <Styled.InputWrapper>
          <Styled.ComboBox
            ref={inputWrapperRef}
            // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
            role="combobox"
            aria-expanded={listBoxVisible}
            aria-owns={ids.listBox}
            aria-haspopup="listbox"
          >
            <TextInput
              ref={searchInputRef}
              id={ids.textBox}
              type="text"
              onClick={onSearchInputClick}
              onFocus={onSearchInputFocus}
              onBlur={onSearchInputBlur}
              onChange={onSearchInputChange}
              value={searchInputDisplayValue}
              placeholder={placeholder}
              onKeyDown={listenForListBoxNavigation}
              onKeyUp={stopEscapePropagation}
              aria-labelledby={ids.label}
              aria-autocomplete="list"
              aria-controls={ids.listBox}
              aria-activedescendant={activeOptionId}
              $paddingFactor={1}
            />
          </Styled.ComboBox>
          <Styled.ButtonGroup>
            {isResetButtonVisible && (
              <Styled.Button
                aria-label={t("forms.picker.reset")}
                tabIndex="-1"
                type="button"
                onClick={unselectAll}
              >
                <Styled.IconReset icon="close16" size={20} />
                <span className="screen-reader-text">
                  {t("forms.picker.clear_selection")}
                </span>
              </Styled.Button>
            )}
            <Styled.Button as="div" aria-hidden>
              <Styled.IconDisclosure icon="disclosureDown16" size={20} />
            </Styled.Button>
          </Styled.ButtonGroup>
        </Styled.InputWrapper>
        <Styled.ResultsList
          aria-labelledby={ids.label}
          ref={optionsRef}
          role="listbox"
          id={ids.listBox}
          onKeyDown={listenForListBoxNavigation}
          $open={listBoxVisible}
        >
          {options.length === 0 && (
            <Styled.EmptyResult id="no-options">
              {t("forms.picker.no_options")}
            </Styled.EmptyResult>
          )}

          {options.map(option => {
            const active = option === activeOptionState;
            const selected = selectedOptions.includes(option);
            return (
              <Styled.Result
                key={option.key}
                role="option"
                id={`${ids.option}-${option.key}`}
                aria-selected={active}
                onClick={() => {
                  selectOrToggleOption(option.value);
                }}
                $active={active}
                $selected={selected}
              >
                {option.label}
              </Styled.Result>
            );
          })}
        </Styled.ResultsList>
      </Styled.Wrapper>
      {isMultiple && (
        <>
          {showAddRemoveAll && (
            <Styled.Utility className="utility-button-group utility-button-group--inline">
              <button
                className="utility-button"
                type="button"
                onClick={selectAll}
              >
                <IconComposer
                  icon="circlePlus32"
                  size="default"
                  className="utility-button__icon utility-button__icon--highlight"
                />
                <span className="utility-button__text">
                  {t("forms.picker.add_all")}
                </span>
              </button>
              <button
                className="utility-button"
                type="button"
                onClick={unselectAll}
              >
                <IconComposer
                  icon="circleMinus32"
                  size="default"
                  className="utility-button__icon utility-button__icon--notice"
                />
                <span className="utility-button__text">
                  {t("forms.picker.remove_all")}
                </span>
              </button>
            </Styled.Utility>
          )}

          <Styled.List
            $tight={showAddRemoveAll || listStyle === "rows"}
            listStyle={listStyle}
            reorderable={reorderable}
            rowComponent={listRowComponent}
            rowProps={{
              ...listRowProps,
              options: optionsMeta.allOptions
            }}
            rowEditRoute={listRowEditRoute}
            callbacks={callbacks}
            entities={rawValue}
          />
        </>
      )}
    </Errorable>
  );
}

FormPicker.displayName = "Form.Picker";

FormPicker.propTypes = {
  name: PropTypes.string,
  debug: PropTypes.bool,
  label: PropTypes.string,
  listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
  listRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  listRowProps: PropTypes.object,
  listRowEditRoute: PropTypes.func,
  placeholder: PropTypes.string,
  wide: PropTypes.bool,
  allowNew: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      entity: PropTypes.string.isRequired,
      ability: PropTypes.string.isRequired
    })
  ]),
  newToValue: PropTypes.func,
  beforeSetValue: PropTypes.func,
  beforeGetValue: PropTypes.func,
  showAddRemoveAll: PropTypes.bool,
  instructions: PropTypes.string,
  belongsTo: PropTypes.bool,
  reorderable: PropTypes.bool,
  options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  updateOptions: PropTypes.func,
  optionToLabel: PropTypes.func,
  optionToValue: PropTypes.func,
  optionToInstructions: PropTypes.func,
  optionToString: PropTypes.func,
  optionFilter: PropTypes.func,
  predictive: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  errors: PropTypes.array
};

// Also export as BasePicker for backwards compatibility
export const BasePicker = FormPicker;
