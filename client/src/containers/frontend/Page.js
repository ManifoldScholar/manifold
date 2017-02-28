import React, { Component, PropTypes } from 'react';
import { pagesAPI } from 'api';
import { connect } from 'react-redux';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
const { request, flush, requests } = entityStoreActions;

class PageContainer extends Component {

  static fetchData(getState, dispatch, location, params) {
    const page = request(pagesAPI.show(params.slug), requests.gPage);
    const { promise: one } = dispatch(page);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      loading: state.ui.loading.active,
      page: entityUtils.select(requests.gPage, state.entityStore)
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    page: PropTypes.object
  };

  componentWillUnmount() {
    this.props.dispatch(flush(requests.gPage));
  }

  render() {
    if (!this.props.page) return null;
    return (
      <section>
        <div className="container">
          {this.props.page.attributes.body}
        </div>
      </section>
    );
  }
}

const Page = connect(
  PageContainer.mapStateToProps
)(PageContainer);

export default Page;
