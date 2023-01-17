import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import { contentBlocksAPI, requests } from "api";
import { select } from "utils/entityUtils";
import Form from "./Form";
import { entityStoreActions } from "actions";
import ContentBlock from "backend/components/content-block";
import lh from "helpers/linkHandler";
import withConfirmation from "hoc/withConfirmation";

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
    contentBlock: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    t: PropTypes.func
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

  onDelete = () => {
    const t = this.props.t;
    const heading = t("modals.delete_content_block");
    const message = t("modals.confirm_body");
    this.props.confirm(heading, message, this.doDelete);
  };

  onVisibilityToggle = () => {
    const call = contentBlocksAPI.update(this.contentBlock.id, {
      attributes: { visible: !this.contentBlock.attributes.visible }
    });
    const options = { notificationScope: "none" };
    const updateRequest = request(call, requests.beContentBlockUpdate, options);
    this.props.dispatch(updateRequest);
  };

  get contentBlock() {
    return this.props.contentBlock;
  }

  get project() {
    return this.props.project;
  }

  doDelete = () => {
    const call = contentBlocksAPI.destroy(this.contentBlock.id);
    const options = {
      removes: { type: "contentBlocks", id: this.contentBlock.id }
    };
    const destroyRequest = request(
      call,
      requests.beContentBlockDestroy,
      options
    );
    this.props.dispatch(destroyRequest).promise.then(() => {
      return this.props.history.push(
        lh.link("backendProjectLayout", this.project.id)
      );
    });
  };

  fetchContentBlock(id) {
    const call = contentBlocksAPI.show(id);
    const contentBlockRequest = request(call, requests.beContentBlock);
    this.props.dispatch(contentBlockRequest);
  }

  render() {
    if (!this.contentBlock) return null;

    return (
      <section>
        <ContentBlock.DrawerHeader
          contentBlock={this.contentBlock}
          onVisibilityToggle={this.onVisibilityToggle}
          onDelete={this.onDelete}
        />
        <Form contentBlock={this.contentBlock} project={this.project} />
      </section>
    );
  }
}

export default withTranslation()(
  withConfirmation(connectAndFetch(ContentBlockEditContainer))
);
