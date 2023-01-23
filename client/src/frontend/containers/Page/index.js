import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { pagesAPI, requests } from "api";
import { entityStoreActions } from "actions";
import HeadContent from "global/components/HeadContent";
import { select } from "utils/entityUtils";

const { request, flush } = entityStoreActions;

export class PageContainer extends Component {
  static fetchData = (getState, dispatch, location, match) => {
    const page = request(pagesAPI.show(match.params.slug), requests.gPage);
    const { promise: one } = dispatch(page);
    return Promise.all([one]);
  };

  static mapStateToProps = state => {
    return {
      loading: state.ui.transitory.loading.active,
      settings: select(requests.settings, state.entityStore),
      page: select(requests.gPage, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    settings: PropTypes.object,
    page: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gPage));
  }

  render() {
    if (!this.props.page) return null;
    return (
      <section>
        <HeadContent
          title={this.props.page.attributes.title}
          appendDefaultTitle
        />
        <div
          className="container page-content"
          dangerouslySetInnerHTML={{
            __html: this.props.page.attributes.bodyFormatted
          }}
        />
      </section>
    );
  }
}

export default connectAndFetch(PageContainer);
