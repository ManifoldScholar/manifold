import React, { Component, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Category } from 'components/backend';
import { Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { select } from 'utils/entityUtils';
import { textCategoriesAPI, requests } from 'api';

const { request } = entityStoreActions;

export class ProjectDetailCategoryEditContainer extends Component {

  static displayName = "ProjectDetail.Category.Edit";

  static mapStateToProps(state, ownProps) {
    return {
      category: select(requests.beTextCategory, state.entityStore)
    };
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    category: PropTypes.object,
    triggerClose: PropTypes.func
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
    if (this.props.triggerClose) this.props.triggerClose();
  }

  fetchCategory() {
    const call = textCategoriesAPI.show(this.props.match.params.catId);
    const categoryRequest = request(call, requests.beTextCategory);
    this.props.dispatch(categoryRequest);
  }

  render() {
    if (!this.props.category) return null;

    return (
      <div>
        <header className="dialog-header-large">
          <h2 className="heading-quaternary">Edit Category</h2>
        </header>
        <Category.Form
          model={this.props.category}
          onSuccess={this.onSuccess}
        />
      </div>
    );
  }
}

export default connectAndFetch(ProjectDetailCategoryEditContainer);
