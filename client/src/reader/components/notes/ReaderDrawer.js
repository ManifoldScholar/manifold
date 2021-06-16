import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FilteredList from "./FilteredList";
import ReaderNotes from "reader/containers/ReaderNotes";
import GlobalDrawer from "global/containers/drawer";

export default class ReaderDrawer extends PureComponent {
  static displayName = "Notes.ReaderDrawer";

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    visible: PropTypes.bool
  };

  renderNotesDrawerContents() {
    if (!this.props.visible) return null;
    return (
      <ReaderNotes match={this.props.match} history={this.props.history}>
        <FilteredList />
      </ReaderNotes>
    );
  }

  render() {
    const drawerProps = {
      open: this.props.visible,
      context: "reader",
      size: "wide",
      padding: "none",
      identifier: "notes-drawer",
      lockScroll: "always",
      includeDrawerFrontMatter: true,
      focusTrap: false,
      title: "Notes",
      closeCallback: this.props.closeCallback
    };

    return (
      <GlobalDrawer.Wrapper {...drawerProps}>
        {this.renderNotesDrawerContents()}
      </GlobalDrawer.Wrapper>
    );
  }
}
