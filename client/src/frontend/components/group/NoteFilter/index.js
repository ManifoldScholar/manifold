import React from "react";
import PropTypes from "prop-types";
import { UID } from "react-uid";
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

  get idPrefix() {
    return "notes-filter";
  }

  render() {
    return (
      <div className={"notes-filter"}>
        <Utility.Count pagination={this.pagination} countLabel={"Notes"} />
        <UID name={id => `${this.idPrefix}-${id}`}>
          {id => (
            <div
              role="group"
              aria-labelledby={`${id}-header`}
              className={"notes-filter__dropdown-container"}
            >
              <p id={`${id}-header`} className="screen-reader-text">
                Notes filters
              </p>
              <Filter label={"Text Filter"} options={this.titles} />
              <Filter label={"Author Filter"} options={this.authors} />
            </div>
          )}
        </UID>
      </div>
    );
  }
}
