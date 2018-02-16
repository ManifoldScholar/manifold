import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Notes } from "components/reader";
import { ReaderNotes } from "containers/reader";
import { Drawer as BackendDrawer } from "containers/global";

export default class ReaderDrawer extends PureComponent {
  static displayName = "Notes.ReaderDrawer";

  static propTypes = {
    visible: PropTypes.bool
  };

  renderNotesDrawerContents(props) {
    if (!props.visible) return null;
    return (
      <ReaderNotes filterable>
        <Notes.FilteredList />
      </ReaderNotes>
    );
  }

  render() {
    const drawerProps = {
      open: this.props.visible,
      style: "reader",
      identifier: "notes-drawer",
      lockScroll: "always"
    };

    return (
      <BackendDrawer.Wrapper {...drawerProps}>
        {this.renderNotesDrawerContents(this.props)}
      </BackendDrawer.Wrapper>
    );
  }
}
