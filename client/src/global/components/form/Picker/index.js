import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { UIDConsumer } from "react-uid";
import Errorable from "../Errorable";
import setter from "../setter";
import Instructions from "../Instructions";
import Developer from "global/components/developer";
import IconComposer from "global/components/utility/IconComposer";
import withFormOptions from "hoc/withFormOptions";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import isString from "lodash/isString";
import { FormContext } from "helpers/contexts";
import BaseLabel from "../BaseLabel";
import * as Styled from "./styles";

const KEYS = {
  TAB: 9,
  DOWN: 40,
  UP: 38,
  ENTER: 13,
  ESCAPE: 27
};

export class PickerComponent extends PureComponent {
  static displayName = "Form.Picker";

  static propTypes = {
    debug: PropTypes.bool,
    /* The label is displayed above the input                                   */
    label: PropTypes.string,
    /* When the picker is passed an array value, it acts as a select multiple.  */
    /* The current selection renders below the input using the EntitesList      */
    /* component. The listStyle dictates how that list will display. We've      */
    /* tested display with rows and well lists. Other list types may require    */
    /* modest styles to work properly                                           */
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
    /* The listRowComponent will be passed to the EntitiesList component as its */
    /* "rowComponent" prop. Defaults to StringRow for simple options. It should */
    /* be a React component or a function that takes props as an argument. It   */
    /* should not be an _instance_ of a component. It can also be a string that */
    /* references a component exported by the EntitiesList index.js file.       */
    listRowComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    /* props to be passed to each row in the list                               */
    listRowProps: PropTypes.object,
    /* This function will be passed the entity for a given row and should       */
    /* a URL string. If present, entities in the list will render with an edit  */
    /* link.                                                                    */
    listRowEditUrlGenerator: PropTypes.func,
    /* The path to the attribute on the model that's being updated in bracket   */
    /* notation. For example: "attributes[tagList]"                             */
    name: PropTypes.string.isRequired,
    /* The options that should appear in the picker. These will be passed on to */
    /* the withFormOptions HOC, which is responsible for managing options and */
    /* the current value. You may pass a function to this component. The        */
    /* function must return { endpoint, method, options }, which is typically   */
    /* what is returned from a Manifold API resource method. For example,       */
    /* one could pass "subjectsAPI.index" as options, and the HOC will fetch    */
    /* the subjects from the API and turn them into picker options.             */
    // options: PropTypes.oneOfType([
    //   PropTypes.arrayOf(
    //     PropTypes.oneOfType([
    //       PropTypes.shape({
    //         label: PropTypes.string.isRequired,
    //         instructions: PropTypes.string,
    //         value: PropTypes.any.isRequired
    //       }),
    //       PropTypes.shape({
    //         id: PropTypes.string.isRequired,
    //         attributes: PropTypes.object
    //       })
    //     ])
    //   ),
    //   PropTypes.func
    // ]),
    /* The update options function will be called when a user searches in the   */
    /* search input and is used to refresh the options. It's passed the search  */
    /* word from the input. The assumption is that this function will update    */
    /* state or props in the outer component, which will trigger new options    */
    /* to be passed into the component. Nothing is currently done with the      */
    /* output from this callback, although that could change in the future      */
    updateOptions: PropTypes.func,
    /* This function is used to transform an option, or the results of an       */
    /* options function into a label. By default, simply option values are cast */
    /* to strings. Labels for resourceish options will generate the label from  */
    /* the type and ID attribute.                                               */
    optionToLabel: PropTypes.func,
    /* By default, whatever is passed in as an option is the value that's set   */
    /* when the user makes a selection. However, in some cases, we want to      */
    /* transform the options before they're set. When the withFormOptions HOC */
    /* analyzes the options, this function will be called to transform the      */
    /* option. For example, in a tag picker, we might want to generate options  */
    /* from existing tag resources, but treat them as strings within the        */
    /* picker and set them as strings in the form session state. To do this, we */
    /* can include an optionToValue transformer: tag => tag.attributes.name.    */
    optionToValue: PropTypes.func,
    /* Because HTML select inputs deal in strings rather than complex objects,  */
    /* the withFormOptions HOC needs to convert every option into a string    */
    /* value. In most cases, it can do this without intervention, assuming all  */
    /* options have an id attribute or have a value that can be cast to a       */
    /* string. If you have an edge case, use this function to determine how the */
    /* options are mapped to strings.                                           */
    optionToString: PropTypes.func,
    /* The placeholder will display in the search input when the text input is  */
    /* empty.                                                                   */
    placeholder: PropTypes.string,
    /* If true, a wide class will be applied to the input to render it at 100%  */
    /* width.                                                                   */
    wide: PropTypes.bool.isRequired,
    /* AllowNew can be a boolean value or a shape that can be passed to the     */
    /* widely used authorizeAbility function. If the former is true or if the   */
    /* latter returns true, when the user presses return in the text input      */
    /* after typing in an option that was not available, the value will still   */
    /* be accepted. For example, in a tag list, we have the user choose from    */
    /* existing tags, but we also want her to be able to enter a new tag.       */
    /* This can be used in conjunction with the newToValue prop to transform a  */
    /* user-provided string into a settable value (eg, string into a model)     */
    allowNew: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        entity: PropTypes.string.isRequired,
        ability: PropTypes.string.isRequired
      })
    ]),
    /* NewToValue takes a string input and returns the value that should be set */
    /* the picker. For example, if the picker allows users to create subject    */
    /* resources, use this prop to transform the string into a resource. The    */
    /* function implementation should return a value or a promise that will     */
    /* resolve to a value.                                                      */
    newToValue: PropTypes.func,
    /* This function will be passed the value from the picker before it is set  */
    /* in the form session state. This could be useful, for example, to turn an */
    /* array into a comma-separated list before posting to the API. By default  */
    /* this function is a noop.                                                 */
    beforeSetValue: PropTypes.func,
    /* This function will be passed the value from the session state before it  */
    /* is passed down to the picker. Use this in conjunection with the          */
    /* beforeSetValue prop to transform a value back into an array for the      */
    /* picker and option to work with. By default, this function is a noop.     */
    beforeGetValue: PropTypes.func,
    /* Set to true to show the add and remove all buttons                       */
    showAddRemoveAll: PropTypes.bool,
    /* Instructions display underneath the picker                               */
    instructions: PropTypes.string,
    /* When true, the picker will set the empty value to { _remove: true }      */
    /* rather than null. This allows the API to see that a belongs_to           */
    /* association is being removed.                                            */
    belongsTo: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    debug: false,
    wide: false,
    labelStyle: "label",
    reorderable: false,
    value: "",
    listRowComponent: "FormOptionRow",
    listRowProps: { namePath: "attributes.name" },
    belongsTo: false,
    renderLiveRegion: () => {
      /* noop */
    }
  };

  static contextType = FormContext;

  constructor(props) {
    super(props);
    this.inputWrapperRef = React.createRef();
    this.searchInputRef = React.createRef();
    this.optionsRef = React.createRef();

    this.state = {
      listBoxVisible: false,
      searchInputValue: null,
      activeOption: null
    };
  }

  componentDidMount() {
    this.setupGlobalEvents();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.listboxBecameVisible(prevState)) this.scrollListboxToTop();
    if (this.announcementChanged(prevProps)) {
      this.props.setScreenReaderStatus(this.props.optionsMeta.announcement);
    }
  }

  componentWillUnmount() {
    this.cleanupGlobalEvents();
  }

  get isMultiple() {
    return this.props.isMultiple;
  }

  get isNotMultiple() {
    return !this.isMultiple;
  }

  get isListBoxVisible() {
    const { listBoxVisible } = this.state;
    return listBoxVisible;
  }

  get isResetButtonVisible() {
    return this.isNotMultiple && this.hasSelection;
  }

  get isSearchInputValueNull() {
    return this.state.searchInputValue === null;
  }

  get isSearchInputValuePresent() {
    return !this.isSearchInputValueNull;
  }

  get isSearchInputValueEmptyString() {
    const { searchInputValue } = this.state;
    if (!isString(searchInputValue)) return false;
    return searchInputValue.trim() === "";
  }

  get hasSelection() {
    const { optionsMeta } = this.props;
    return optionsMeta.selectedOptions.length > 0;
  }

  get hasOptions() {
    return this.props.options && this.props.options.length > 0;
  }

  get searchInputValue() {
    const { optionsMeta, value } = this.props;
    const { searchInputValue } = this.state;
    if (searchInputValue !== null) return searchInputValue;
    if (this.isMultiple) return "";
    if (optionsMeta.selectedOptions[0])
      return optionsMeta.selectedOptions[0].label;
    if (this.props.allowNew && value) return value;
    return "";
  }

  get somethingInPickerHasFocus() {
    return document.activeElement && this.isInPicker(document.activeElement);
  }

  get singleSelectedOption() {
    if (this.isMultiple) return null;
    if (!this.hasSelection) return null;
    const { optionsMeta } = this.props;
    return optionsMeta.selectedOptions[0];
  }

  get activeOption() {
    const { options } = this.props;
    const activeOption = this.state.activeOption || this.singleSelectedOption;
    if (options.includes(activeOption)) return activeOption;
    return null;
  }

  get activeOptionFromState() {
    const { options } = this.props;
    const activeOption = this.state.activeOption;
    if (options.includes(activeOption)) return activeOption;
    return null;
  }

  get activeOptionIndex() {
    if (!this.activeOption) return -1;
    const { options } = this.props;
    return options.findIndex(option => option === this.activeOption);
  }

  get callbacks() {
    return {
      selectOrToggleOption: this.selectOrToggleOption,
      toggleListBoxVisibility: this.toggleListBoxVisibility,
      makeListBoxVisible: this.makeListBoxVisible,
      makeListBoxHidden: this.makeListBoxHidden,
      removeSelection: this.removeSelection,
      reorderSelection: this.reorderSelection,
      selectAll: this.selectAll,
      unselectAll: this.unselectAll
    };
  }

  announcementChanged(prevProps) {
    return (
      prevProps.optionsMeta.announcement !== this.props.optionsMeta.announcement
    );
  }

  isInPicker(element) {
    this.inputWrapperRef.current.contains(element);
  }

  scrollListboxToTop() {
    if (!this.optionsRef.current) return;
    this.optionsRef.current.scrollTop = 0;
  }

  listboxBecameVisible(prevState) {
    return !prevState.listBoxVisible && this.state.listBoxVisible;
  }

  searchInputValueChanged(prevState) {
    return prevState.searchInputValue !== this.state.searchInputValue;
  }

  setupGlobalEvents() {
    window.addEventListener("click", this.maybeCloseListBox);
  }

  cleanupGlobalEvents() {
    window.removeEventListener("click", this.maybeCloseListBox);
  }

  selectOrToggleOption = value => {
    if (this.isMultiple) return this.toggleOption(value);
    return this.selectOption(value);
  };

  toggleOption = value => {
    this.props.optionsHandlers.toggleOption(value);
    this.makeListBoxHidden();
  };

  selectOption = value => {
    this.updateSearchInputValue(null);
    this.props.select(value);
    this.makeListBoxHidden();
  };

  makeListBoxVisible = () => {
    this.setState({ listBoxVisible: true });
  };

  makeListBoxHidden = () => {
    this.setActiveOption(null);
    this.setState({ listBoxVisible: false });
  };

  toggleListBoxVisibility = () => {
    const { listBoxVisible } = this.state;
    this.setState({ listBoxVisible: !listBoxVisible });
  };

  preventDefault(callback, event) {
    event.preventDefault();
    callback.bind(this)();
  }

  stopPropagation(callback, event) {
    event.preventDefault();
    event.stopPropagation();
    callback.bind(this)();
  }

  listenForListBoxNavigation = event => {
    if (event.keyCode === KEYS.DOWN)
      this.preventDefault(this.activateNextOption, event);
    if (event.keyCode === KEYS.UP)
      this.preventDefault(this.activatePreviousOption, event);
    if (event.keyCode === KEYS.TAB) this.makeListBoxHidden();
    if (event.keyCode === KEYS.ENTER)
      this.preventDefault(this.selectActiveOption, event);
    // It could be in a drawer, so we need to stop escape key from bubbling.
    if (event.keyCode === KEYS.ESCAPE)
      this.stopPropagation(this.makeListBoxHidden, event);
  };

  stopEscapePropagation = event => {
    if (event.keyCode === KEYS.ESCAPE) event.stopPropagation();
  };

  focusOnSearchInput() {
    this.searchInputRef.current.focus();
  }

  // Called when user presses enter in the picker.
  selectActiveOption() {
    const activeOption = this.activeOptionFromState;
    // If the input is empty and the picker is a single select, then we actually clear
    // the selection when there is no active option.
    if (
      !activeOption &&
      this.isSearchInputValueEmptyString &&
      this.isNotMultiple
    ) {
      this.callbacks.unselectAll();
      // If there's an active option, we can select it.
    } else if (activeOption) {
      this.callbacks.selectOrToggleOption(activeOption.value);
      if (this.isMultiple) {
        this.updateSearchInputValue(null);
        this.makeListBoxHidden();
      }
      // If there's no active option, we can still add this value if the picker
      // allowsNew options.
    } else if (!activeOption && this.props.allowNew) {
      this.selectOption(this.searchInputValue);
    }
  }

  scrollToActiveOption = () => {
    const activeOptionIndex = this.activeOptionIndex;
    if (activeOptionIndex < 0) return;
    const parent = this.optionsRef.current;
    const node = parent.children[this.activeOptionIndex];
    if (!node) return;
    const visible =
      node.offsetTop > parent.scrollTop &&
      node.offsetTop < parent.scrollTop + parent.offsetHeight;
    if (!visible) node.scrollIntoView();
  };

  setActiveOption(activeOption) {
    this.setState({ activeOption }, this.scrollToActiveOption);
  }

  activateNextOption() {
    const activeOptionIndex = this.activeOptionIndex;
    const nextIndex =
      !this.isListBoxVisible && activeOptionIndex !== -1
        ? activeOptionIndex
        : activeOptionIndex + 1;
    this.makeListBoxVisible();
    const { options } = this.props;
    const index = Math.min(nextIndex, options.length - 1);
    this.setActiveOption(options[index]);
  }

  activatePreviousOption() {
    this.makeListBoxVisible();
    const { options } = this.props;
    const index = Math.max(this.activeOptionIndex - 1, 0);
    this.setActiveOption(options[index]);
  }

  maybeCloseListBox = event => {
    if (!this.inputWrapperRef.current) return;
    if (!this.inputWrapperRef.current.contains(event.target))
      this.makeListBoxHidden();
  };

  removeSelection = selection => {
    this.props.optionsHandlers.deselect(selection);
  };

  reorderSelection = (selection, newPosition) => {
    this.props.optionsHandlers.reorderSelection(selection, newPosition);
  };

  ids(id) {
    return {
      wrapper: `${id}-picker`,
      label: `${id}-picker-label`,
      instructions: `${id}-picker-instructions`,
      error: `${id}-picker-error`,
      textBox: `${id}-picker-textbox`,
      listBox: `${id}-picker-listbox`,
      option: `${id}-picker-option`
    };
  }

  activeOptionId(formId) {
    if (!this.activeOptionFromState) return null;
    return `${this.ids(formId).option}-${this.activeOptionFromState.key}`;
  }

  updateSearchInputValue(searchInputValue) {
    this.makeListBoxVisible();
    this.setState({ searchInputValue }, () => {
      this.setOptionFilter(searchInputValue);
    });
  }

  selectSearchInputText() {
    this.searchInputRef.current.select();
  }

  selectAll = () => {
    this.props.optionsHandlers.selectAll();
  };

  unselectAll = () => {
    this.props.optionsHandlers.unselectAll();
  };

  onSearchInputChange = event => {
    const { value } = event.target;
    this.updateSearchInputValue(value);
  };

  onSearchInputClick = () => {
    if (this.isMultiple || (this.isNotMultiple && this.isSearchInputValueNull))
      this.toggleListBoxVisibility();
  };

  onSearchInputFocus = () => {
    this.selectSearchInputText();
  };

  onSearchInputBlur = event => {
    if (
      !this.somethingInPickerHasFocus ||
      !this.isInPicker(event.relatedTarget)
    )
      return;

    if (this.isNotMultiple && this.isSearchInputValueEmptyString)
      this.unselectAll();
    if (this.isSearchInputValuePresent) {
      if (this.props.allowNew) {
        this.selectActiveOption();
      } else {
        this.updateSearchInputValue(null);
      }
    }
    this.makeListBoxHidden();
  };

  setOptionFilter(searchWord) {
    this.props.optionsHandlers.filterOptions(searchWord);
  }

  render() {
    const {
      wide,
      errors,
      name,
      label,
      options,
      showAddRemoveAll,
      optionsMeta,
      placeholder,
      listStyle,
      reorderable,
      listRowComponent,
      listRowProps,
      debug,
      value,
      renderLiveRegion,
      t
    } = this.props;

    const TextInput =
      this.context?.styleType === "secondary"
        ? Styled.TextInputSecondary
        : Styled.TextInput;

    return (
      <UIDConsumer>
        {id => {
          const ids = this.ids(id);
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
                    value,
                    state: this.state
                  }}
                />
              )}
              {renderLiveRegion()}
              <Styled.Wrapper>
                <BaseLabel
                  id={ids.textBox}
                  label={label}
                  styleType={this.context?.styleType}
                />
                <Instructions instructions={this.props.instructions} />
                <Styled.InputWrapper>
                  <Styled.ComboBox
                    ref={this.inputWrapperRef}
                    // eslint-disable-next-line jsx-a11y/role-has-required-aria-props
                    role="combobox"
                    aria-expanded={this.isListBoxVisible}
                    aria-owns={ids.listBox}
                    aria-haspopup="listbox"
                  >
                    <TextInput
                      ref={this.searchInputRef}
                      id={ids.textBox}
                      type="text"
                      onClick={this.onSearchInputClick}
                      onFocus={this.onSearchInputFocus}
                      onBlur={this.onSearchInputBlur}
                      onChange={this.onSearchInputChange}
                      value={this.searchInputValue}
                      placeholder={placeholder}
                      onKeyDown={this.listenForListBoxNavigation}
                      onKeyUp={this.stopEscapePropagation}
                      aria-labelledby={ids.label}
                      aria-autocomplete="list"
                      aria-controls={ids.listBox}
                      aria-activedescendant={this.activeOptionId(id)}
                      $paddingFactor={1}
                    />
                  </Styled.ComboBox>
                  <Styled.ButtonGroup>
                    {this.isResetButtonVisible && (
                      <Styled.Button
                        aria-label={t("forms.picker.reset")}
                        tabIndex="-1"
                        type="button"
                        onClick={this.callbacks.unselectAll}
                      >
                        <Styled.IconReset icon="close16" size={20} />
                        <span className="screen-reader-text">
                          {t("forms.picker.clear_selection")}
                        </span>
                      </Styled.Button>
                    )}
                    <Styled.Button as="div" aria-hidden>
                      <Styled.IconDisclosure
                        icon="disclosureDown16"
                        size={20}
                      />
                    </Styled.Button>
                  </Styled.ButtonGroup>
                </Styled.InputWrapper>
                <Styled.ResultsList
                  aria-labelledby={ids.label}
                  ref={this.optionsRef}
                  role="listbox"
                  id={ids.listBox}
                  onKeyDown={this.listenForListBoxNavigation}
                  $open={this.isListBoxVisible}
                >
                  {options.length === 0 && (
                    <Styled.EmptyResult id="no-options">
                      {t("forms.picker.no_options")}
                    </Styled.EmptyResult>
                  )}

                  {options.map(option => {
                    const active = option === this.state.activeOption;
                    const selected = optionsMeta.selectedOptions.includes(
                      option
                    );
                    return (
                      <Styled.Result
                        key={option.key}
                        role="option"
                        id={`${ids.option}-${option.key}`}
                        aria-selected={active}
                        onClick={() => {
                          this.callbacks.selectOrToggleOption(option.value);
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
              {this.isMultiple && (
                <>
                  {showAddRemoveAll && (
                    <Styled.Utility className="utility-button-group utility-button-group--inline">
                      <button
                        className="utility-button"
                        type="button"
                        onClick={this.callbacks.selectAll}
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
                        onClick={this.callbacks.unselectAll}
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
                    rowEditRoute={this.props.listRowEditRoute}
                    callbacks={this.callbacks}
                    entities={value}
                  />
                </>
              )}
            </Errorable>
          );
        }}
      </UIDConsumer>
    );
  }
}

export default withTranslation()(
  setter(withScreenReaderStatus(withFormOptions(PickerComponent), false))
);
