import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FilteredList from "./FilteredList";
import ReaderNotes from "reader/containers/ReaderNotes";
import BackendDrawer from "global/containers/drawer";

export default class ReaderDrawer extends PureComponent {
  static displayName = "Notes.ReaderDrawer";

  static propTypes = {
    visible: PropTypes.bool
  };

  renderNotesDrawerContents(props) {
    if (!props.visible) return null;
    return (
      <ReaderNotes filterable>
        <FilteredList />
      </ReaderNotes>
    );
  }

  render() {
    const drawerProps = {
      open: this.props.visible,
      style: "reader",
      identifier: "notes-drawer",
      lockScroll: "always",
      includeDrawerFrontMatter: false,
      focusTrap: false
    };

    return (
      <BackendDrawer.Wrapper {...drawerProps}>
        {this.renderNotesDrawerContents(this.props)}
      </BackendDrawer.Wrapper>
    );
  }
}
