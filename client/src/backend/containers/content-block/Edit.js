import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { contentBlocksAPI, requests } from "api";
import { select } from "utils/entityUtils";
import Form from "backend/containers/project/content/Form";
import { entityStoreActions } from "actions";

const { request, flush } = entityStoreActions;

export class ContentBlockEditContainer extends Component {
  static displayName = "ContentBlock.Edit";

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      contentBlock: select(requests.beContentBlock, state.entityStore)
    };
  };

  static propTypes = {
    match: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
    project: PropTypes.object,
    contentBlock: PropTypes.object
  };

  componentDidMount() {
    this.fetchContentBlock(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchContentBlock(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.beContentBlock));
  }

  get contentBlock() {
    return this.props.contentBlock;
  }

  get project() {
    return this.props.project;
  }

  fetchContentBlock(id) {
    const call = contentBlocksAPI.show(id);
    const contentBlockRequest = request(call, requests.beContentBlock);
    this.props.dispatch(contentBlockRequest);
  }

  render() {
    if (!this.contentBlock) return null;

    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">Edit Content Block</h2>
        </header>
        <Form contentBlock={this.contentBlock} project={this.project} />
      </section>
    );
  }
}

export default connectAndFetch(ContentBlockEditContainer);
