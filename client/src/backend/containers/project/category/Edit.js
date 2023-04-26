import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Category from "backend/components/category";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { textCategoriesAPI, requests } from "api";
import Layout from "backend/components/layout";

const { request } = entityStoreActions;

export class ProjectCategoryEditContainer extends Component {
  static mapStateToProps = state => {
    return {
      category: select(requests.beTextCategory, state.entityStore)
    };
  };

  static displayName = "Project.Category.Edit";

  static propTypes = {
    match: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    category: PropTypes.object,
    triggerClose: PropTypes.func,
    t: PropTypes.func
  };

  componentDidMount() {
    this.fetchCategory();
  }

  onSuccess = () => {
    this.props.refresh();
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
        <Layout.DrawerHeader
          title={this.props.t("texts.category_edit_header")}
        />
        <Category.Form model={this.props.category} onSuccess={this.onSuccess} />
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(ProjectCategoryEditContainer));
