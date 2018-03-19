import React, { PureComponent } from "react";
import Empty from "./Empty";
import PropTypes from "prop-types";
import { Utility } from "components/global";
import Types from "./Types";

export default class SearchResultsList extends PureComponent {
  static displayName = "Search.Results.List";

  static propTypes = {
    results: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func.isRequired,
    context: PropTypes.string
  };

  static defaultProps = {
    context: "frontend"
  };

  componentForType(type) {
    if (type === "project") return Types.Project;
    if (type === "searchableNode") return Types.SearchableNode;
    if (type === "annotation") return Types.Annotation;
    if (type === "resource") return Types.Resource;
    if (type === "text") return Types.Text;
  }

  labelForType(type) {
    if (type === "project") return "Project";
    if (type === "searchableNode") return "Full Text";
    if (type === "annotation") return "Annotation";
    if (type === "resource") return "Resource";
    if (type === "text") return "Text";
  }

  renderResult(result) {
    const { searchableType } = result.attributes;
    const Component = this.componentForType(searchableType);
    const typeLabel = this.labelForType(searchableType);
    if (Component) {
      return (
        <Component
          key={result.id}
          result={result}
          context={this.props.context}
          typeLabel={typeLabel}
        />
      );
    }
    return null;
  }

  render() {
    if (this.props.results && this.props.results.length === 0) return <Empty />;

    return (
      <div className="search-results">
        <label className="label-count">
          <Utility.EntityCount
            pagination={this.props.pagination}
            singularUnit={"result"}
            pluralUnit={"results"}
          />
        </label>
        <ul className="results">
          {this.props.results.map(result => {
            return this.renderResult(result);
          })}
        </ul>
        <Utility.Pagination
          pagination={this.props.pagination}
          padding={3}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
