import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Notes } from "components/reader";
import { ReaderNotes } from "containers/reader";
import { Utility, Drawer as BackendDrawer } from "components/global";

export default class ReaderDrawer extends PureComponent {
  static displayName = "Notes.ReaderDrawer";

  static propTypes = {
    visible: PropTypes.bool,
  };

  renderNotesDrawerContents(props) {
    if (!props.visible) return null;
    return (
      <ReaderNotes filterable>
        <Notes.FilteredList />
      </ReaderNotes>
    )
  }

  render() {
    return (
      <BackendDrawer.Wrapper
        open={this.props.visible}
        style={'reader'}
        identifier={'notes-drawer'}
        lockScroll={'always'}
      >
        {this.renderNotesDrawerContents(this.props)}
      </BackendDrawer.Wrapper>
    );
  }
}
