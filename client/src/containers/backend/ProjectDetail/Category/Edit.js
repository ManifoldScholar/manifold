import React, { Component, PropTypes } from 'react';
import { Category } from 'components/backend';
import { connect } from 'react-redux';
import { Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { textCategoriesAPI } from 'api';
const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;
import { browserHistory } from 'react-router';

class ProjectDetailCategoryEdit extends Component {

  static displayName = "ProjectDetail.Category.Edit";
  static activeNavItem = "texts";

  static mapStateToProps(state, ownProps) {
    return {
      category: select('edit-category', state.entityStore)
    };
  }

  static propTypes = {
    params: PropTypes.shape({
      id: React.PropTypes.string,
      catId: React.PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    category: PropTypes.object.isRequired,
    routes: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.onSuccess = this.onSuccess.bind(this);
  }

  componentDidMount() {
    this.fetchCategory();
  }

  onSuccess() {
    this.props.refresh();
    browserHistory.push(this.closeUrl());
  }

  closeUrl() {
    return `/backend/project/${this.props.params.id}/texts`;
  }

  fetchCategory() {
    const call = textCategoriesAPI.show(this.props.params.catId);
    const categoryRequest = request(call, 'edit-category');
    this.props.dispatch(categoryRequest);
  }

  render() {
    if (!this.props.category) return null;

    return (
      <Dialog.Wrapper
        closeUrl={this.closeUrl()}
      >
        <header>
          <h2 className="heading-quaternary">Edit Category</h2>
        </header>
        <Category.Form
          model={this.props.category}
          route={this.props.routes[this.props.routes.length - 1]}
          onSuccess={this.onSuccess}
        />
      </Dialog.Wrapper>
    );
  }
}

export default connect(
  ProjectDetailCategoryEdit.mapStateToProps
)(ProjectDetailCategoryEdit);

