import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";
import TableCount from "./Count";
import TablePagination from "./Pagination";
import TableBody from "./Body";
import { TableHeaderContext } from "helpers/contexts";

export default class Table extends PureComponent {

  static propTypes = {
    rowComponent: PropTypes.func.isRequired,
    groups: PropTypes.array,
    pagination: PropTypes.object
  };

  get containerClassNames() {
    return classNames({
      "group-name": true
    });
  }

  get headingClassNames() {
    return classNames({
      "group-table__table-heading": true,
      "group-table__heading-small": true
    });
  }

  get mobileColumnsClassName() {
    return "group-table__mobile-columns";
  }

  get labelIconClass() {
    return "group-table__label-icon";
  }

  get mobileColLeftClassNames() {
    return "group-table__column-left";
  }

  get mobileColRightClassNames() {
    return "group-table__column-right";
  }

  get groupLink() {
    return "/";
  }

  get memberLink() {
    return "/test";
  }

  get paginationTarget() {
    return "#sample-target";
  }

  onPageClick() {
    console.log("page clicked");
  }

  renderMobileList() {
    const { groups } = this.props;
    return(
      <div>
        {groups.map(groupData => {
          const group = groupData.attributes;
          return(
            <div
              key={groupData.id}
              className={this.bodyRowClassNames}
            >
              <a href={this.groupLink} className={this.rowLinkClassNames}/>
              <h3 className={this.rowNameClassNames}>{group.name}</h3>
              <div className={this.mobileColumnsClassName}>
                <div className={this.mobileColLeftClassNames}>
                  <div>
                    {this.typeLabel}
                    <div className={this.rowInfoTextClassNames}>
                      {group.type}
                    </div>
                  </div>
                  <div>
                    {this.roleLabel}
                    <div className={this.rowInfoTextClassNames}>
                      {group.role}
                    </div>
                  </div>
                </div>
                <div className={this.mobileColRightClassNames}>
                  <div>
                    {this.membersLabel}
                    <div className={this.rowInfoNumberClassNames}>
                      {this.renderMemberLink(group.memberCount)}
                    </div>
                  </div>
                  <div>
                    {this.annotationsLabel}
                    <div className={this.rowInfoNumberClassNames}>
                      {group.annotationCount}
                    </div>
                  </div>
                  <div>
                    {this.highlightsLabel}
                    <div className={this.rowInfoNumberClassNames}>
                      {group.highlightCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    );
  }

  render() {

    const { pagination} = this.props;

    return (
        <div className={this.containerClassNames}>
          <TableCount
            pagination={pagination}
          />
          <TableBody {...this.props} markup="table" />

          {/* Remove this at some point */}
          <div style={{margin: 50}} />

          <TableBody {...this.props} markup="dl" />

          <TablePagination
            pagination={pagination}
            paginationTarget={this.paginationTarget}
            onPageClick={this.onPageClick}
          />
        </div>
    );
  }
}
