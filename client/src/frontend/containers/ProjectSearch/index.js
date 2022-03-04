import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import SearchQuery from "global/components/search/query";
import SearchResults from "global/components/search/results";
import withSearch from "hoc/withSearch";
import CheckFrontendMode from "global/containers/CheckFrontendMode";

class ProjectSearch extends Component {
  static propTypes = {
    route: PropTypes.object,
    t: PropTypes.func
  };

  get project() {
    return this.props.project;
  }

  constructor(props) {
    super(props);
    this.state = props.searchQueryState;
  }

  get facets() {
    const t = this.props.t;
    return [
      { label: t("glossary.resource_other"), value: "Resource" },
      { label: t("glossary.text_other"), value: "Text" },
      { label: t("glossary.annotation_other"), value: "Annotation" },
      { label: t("glossary.full_text_one"), value: "TextSection" }
    ];
  }

  render() {
    if (!this.project) return null;

    const t = this.props.t;

    return (
      <div>
        <CheckFrontendMode debugLabel="ProjectSearch" isProjectSubpage />

        <RegisterBreadcrumbs
          breadcrumbs={[
            {
              to: lh.link(
                "frontendProjectDetail",
                this.project.attributes.slug
              ),
              label: this.project.attributes.titlePlaintext
            }
          ]}
        />
        <h1 className="screen-reader-text">{t("search.title")}</h1>
        <div className="search-form-frontend">
          <div className="container">
            <h2 className="screen-reader-text">{t("search.form")}</h2>
            <SearchQuery.Form
              initialState={{
                keyword: "",
                scope: "project"
              }}
              projectId={this.project.id}
              searchQueryState={this.props.searchQueryState}
              setQueryState={this.props.setQueryState}
              facets={this.facets}
            />
          </div>
        </div>
        {this.props.results ? (
          <div className="search-results-frontend">
            <div className="container">
              <h2 className="screen-reader-text">{t("search.results")}</h2>
              <SearchResults.List
                pagination={this.props.resultsMeta.pagination}
                paginationClickHandler={this.props.setPage}
                results={this.props.results}
                hideParent
                context="frontend"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withTranslation()(withSearch(ProjectSearch));
