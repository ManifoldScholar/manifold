import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import Filter from "./Filter";

export default class SelectFilter extends React.PureComponent {
  static propTypes = {
    makers: PropTypes.array,
    projects: PropTypes.array
  };

  // placeholder methods to build option arrays for the select filters
  get authors() {
    const authors = this.props.makers;
    const authorList = [];
    authors.forEach(author => {
      authorList.push({
        label: author.attributes.fullName,
        value: author.id
      });
    });
    return authorList;
  }

  get titles() {
    const projects = this.props.projects;
    const titles = [];
    projects.forEach(project => {
      titles.push({
        label: project.attributes.textTitle,
        value: project.id
      });
    });
    return titles;
  }

  get pagination() {
    return this.props.pagination;
  }

  render() {
    return (
      <div className={"notes-filter"}>
        <Utility.Count pagination={this.pagination} countLabel={"Notes"} />
        <div className={"notes-filter__dropdown-container"}>
          <Filter label={"Text Filter"} options={this.titles} />
          <Filter label={"Author Filter"} options={this.authors} />
        </div>
      </div>
    );
  }
}
