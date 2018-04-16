import React, { Component } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Category } from "components/backend";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { textCategoriesAPI, requests } from "api";

const { request } = entityStoreActions;

export class ProjectCategoryEditContainer extends Component {
  static displayName = "Project.Category.Edit";

  static mapStateToProps = state => {
    return {
      category: select(requests.beTextCategory, state.entityStore)
    };
  };

  static propTypes = {
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    category: PropTypes.object,
    triggerClose: PropTypes.func
  };

  componentDidMount() {
    this.fetchCategory();
  }

  onSuccess = () => {
    this.props.refresh();
    if (this.props.triggerClose) this.props.triggerClose();
  };

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
        <Category.Form model={this.props.category} onSuccess={this.onSuccess} />
      </div>
    );
  }
}

export default connectAndFetch(ProjectCategoryEditContainer);
