import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import GroupPickerOptions from "global/components/Annotation/GroupPickerOptions";
import IconComposer from "global/components/utility/IconComposer";
import { ReaderContext } from "helpers/contexts";
import withReadingGroups from "hoc/with-reading-groups";
import withCurrentUser from "hoc/with-current-user";

class GroupFilter extends PureComponent {
  static displayName = "Notes.Partial.GroupFilter";

  static propTypes = {
    setReadingGroup: PropTypes.func.isRequired,
    currentReadingGroup: PropTypes.string,
    readingGroups: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
    onReadingGroupChange: PropTypes.func
  };

  static contextType = ReaderContext;

  constructor(props) {
    super(props);
    this.state = {
      pickerOpen: false
    };
  }

  get readingGroups() {
    return this.props.readingGroups;
  }

  get currentGroupName() {
    if (this.props.currentReadingGroup === "public") return this.publicLabel;
    if (this.props.currentReadingGroup === "private") return this.privateLabel;

    const currentGroup = this.readingGroups.find(
      group => group.id === this.props.currentReadingGroup
    );

    if (!currentGroup) return this.setReadingGroup("private");
    return currentGroup.attributes.name;
  }

  get publicLabel() {
    return "My Public Annotations";
  }

  get privateLabel() {
    return "My Private Annotations";
  }

  get canEngagePublicly() {
    return this.context.attributes.abilities.engagePublicly;
  }

  get hasReadingGroups() {
    return this.readingGroups && this.readingGroups.length > 0;
  }

  setReadingGroup = rgId => {
    const {
      currentReadingGroup,
      setReadingGroup,
      onReadingGroupChange
    } = this.props;
    if (rgId !== currentReadingGroup && setReadingGroup) {
      setReadingGroup(rgId);
      if (onReadingGroupChange) onReadingGroupChange(rgId);
    }

    this.setState({ pickerOpen: false });
  };

  renderSRSelect(id) {
    return (
      <select
        aria-labelledby={`${id}-label`}
        className="screen-reader-text"
        onChange={event => this.setReadingGroup(event.target.value)}
        value={this.props.currentReadingGroup}
      >
        {this.canEngagePublicly && (
          <option value="public">{this.publicLabel}</option>
        )}
        <option value="private">{this.privateLabel}</option>
        {this.hasReadingGroups &&
          this.readingGroups.map(option => (
            <option key={option.id} value={option.id}>
              {option.attributes.name}
            </option>
          ))}
      </select>
    );
  }

  render() {
    return (
      <>
        <div className="group-filter" aria-hidden>
          <button
            ref={pickerToggle => (this.pickerToggle = pickerToggle)}
            tabIndex={-1}
            type="button"
            onClick={() =>
              this.setState({ pickerOpen: !this.state.pickerOpen })
            }
            className="group-filter__select"
          >
            <span className="group-filter__text">{this.currentGroupName}</span>
            <IconComposer
              icon="disclosureDown16"
              size={22}
              iconClass="group-filter__icon"
            />
          </button>
          <GroupPickerOptions
            pickerOpen={this.state.pickerOpen}
            readingGroups={this.props.readingGroups}
            setReadingGroup={this.setReadingGroup}
            currentReadingGroup={this.props.currentReadingGroup}
            currentUser={this.props.currentUser}
          />
        </div>
        {this.renderSRSelect(this.props.currentReadingGroup)}
      </>
    );
  }
}

export default withReadingGroups(withCurrentUser(GroupFilter));
