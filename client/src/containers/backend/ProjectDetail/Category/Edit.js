import React, { Component, PropTypes } from 'react';
import { Category } from 'components/backend';
import { connect } from 'react-redux';
import { Dialog } from 'components/backend';
import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { textCategoriesAPI, requests } from 'api';
import { withRouter } from 'react-router';
import { linkHelpers as lh } from 'routes';

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class ProjectDetailCategoryEdit extends Component {

  static displayName = "ProjectDetail.Category.Edit";
  static activeNavItem = "texts";

  static mapStateToProps(state, ownProps) {
    return {
      category: select(requests.beTextCategory, state.entityStore)
    };
  }

  static propTypes = {
    params: PropTypes.shape({
      id: React.PropTypes.string,
      catId: React.PropTypes.string
    }).isRequired,
    dispatch: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    category: PropTypes.object
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
    this.props.router.push(this.closeUrl());
  }

  closeUrl() {
    return lh.backendProjectTexts(this.props.params.id);
  }

  fetchCategory() {
    const call = textCategoriesAPI.show(this.props.params.catId);
    const categoryRequest = request(call, requests.beTextCategory);
    this.props.dispatch(categoryRequest);
  }

  render() {
    if (!this.props.category) return null;

    return (
      <Dialog.Wrapper
        closeUrl={this.closeUrl()}
      >
        <header className="dialog-header-large">
          <h2 className="heading-quaternary">Edit Category</h2>
        </header>
        <Category.Form
          model={this.props.category}
          onSuccess={this.onSuccess}
        />
      </Dialog.Wrapper>
    );
  }
}

const component = connect(
  ProjectDetailCategoryEdit.mapStateToProps
)(ProjectDetailCategoryEdit);
export default withRouter(component);
