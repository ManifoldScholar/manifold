import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";

export default class Table extends PureComponent {

  static propTypes = {
    groups: PropTypes.array,
    pagination: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.resizeId = null;
    this.breakpoint = 880;

    this.state = {
      isMobile: window.innerWidth < this.breakpoint
    };
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.resizeId) {
      window.cancelAnimationFrame(this.resizeId);
    }

    this.resizeId = window.requestAnimationFrame(() => {
      window.innerWidth < this.breakpoint
        ? this.setState({
            isMobile: true
          })
        : this.setState({
            isMobile: false
          });
    });
  }

  get containerClassNames() {
    return classNames({
      "group-name": true
    });
  }

  get tableClassNames() {
    return "group-table__table";
  }

  get headingClassNames() {
    return classNames({
      "group-table__table-heading": true,
      "group-table__heading-small": true
    });
  }

  get rowClassNames() {
    return "group-table__row";
  }

  get bodyRowClassNames() {
    return classNames({
      "group-table__row": true,
      "group-table__row--body": true
    });
  }

  get rowNameClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-name": true,
    });
  }

  get rowInfoTextClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-info": true,
    });
  }

  get rowInfoNumberClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-info": true,
      "group-table__number": true
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

  get hoverArrowClassNames() {
    return "group-table__hover-arrow";
  }

  get memberArrowClassNames() {
    return "group-table__member-arrow";
  }

  get memberLinkClassNames() {
    return "group-table__member-link";
  }

  get rowLinkClassNames() {
    return "group-table__row-link";
  }

  get memberCountClassNames() {
    return "group-table__member-count";
  }

  get paginationClassNames() {
    return "group-table__pagination";
  }

  get tableCountContainerClassNames() {
    return "group-table__count-container";
  }

  get tableCountHeading() {
    return classNames({
      "group-table__table-count-heading": true,
      "group-table__heading-small": true
    });
  }

  get tableCountFigure() {
    return "group-table__count-figure";
  }

  renderLabel(name, icon) {
    return (
      <span className={this.headingClassNames}>
        {icon && (
          <Utility.IconComposer
            icon={icon}
            size={24}
            iconClass={this.labelIconClass}
          />
        )}
        {name}:
      </span>
    );
  }

  get nameLabel() {
    return this.renderLabel("Name");
  }

  get typeLabel() {
    return this.renderLabel("Type");
  }

  get roleLabel() {
    return this.renderLabel("Role");
  }

  get membersLabel() {
    return this.renderLabel("Members", "avatar24");
  }

  get annotationsLabel() {
    return this.renderLabel("Annotations", "comment24");
  }

  get highlightsLabel() {
    return this.renderLabel("Highlights", "annotate24")
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

  get currentPageCount() {
    const { pagination } = this.props;
    const pageRemainder = pagination.totalCount % pagination.perPage;

    if (pagination.currentPage > pagination.totalPages
      ||  pageRemainder === 0) {
      return pagination.perPage;
    } else {
      return pageRemainder;
    }
  }

  onPageClick() {
    console.log("page clicked");
  }

  renderTableCount() {
    const { pagination } = this.props;

    return (
      <div className={this.tableCountContainerClassNames}>
        <h4 className={this.tableCountHeading}>
          {"Showing "}
          <span className={this.tableCountFigure}>
            {this.currentPageCount}
          </span>
          {" of "}
          <span className={this.tableCountFigure}>
            {pagination.totalCount}
          </span>
          {" Groups:"}
        </h4>
      </div>
    );
  }

  renderTableHead() {
    return (
      <thead>
        <tr className={this.rowClassNames}>
          <td>{this.nameLabel}</td>
          <td>{this.typeLabel}</td>
          <td>{this.roleLabel}</td>
          <td>{this.membersLabel}</td>
          <td>{this.annotationsLabel}</td>
          <td>{this.highlightsLabel}</td>
        </tr>
      </thead>
    );
  }

  renderMemberLink(memberCount) {
    return (
      <a className={this.memberLinkClassNames} href={this.memberLink}>
        <span className={this.memberCountClassNames}>{memberCount}</span>
        <Utility.IconComposer
          icon="arrowRight16"
          size={14}
          iconClass={this.memberArrowClassNames}
        />
      </a>
    );
  }


  renderTableBody() {
    const { groups } = this.props;
    return (
      <tbody>
        {groups.map(groupData => {
          const group = groupData.attributes;
          return(
            <tr key={groupData.id} className={this.bodyRowClassNames}>
              <td className={this.rowNameClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {group.name}
                <Utility.IconComposer
                  icon="arrowRight16"
                  size={18}
                  iconClass={this.hoverArrowClassNames}
                />
              </td>
              <td className={this.rowInfoTextClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {group.type}
              </td>
              <td className={this.rowInfoTextClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {group.role}
              </td>
              <td className={this.rowInfoNumberClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {this.renderMemberLink(group.memberCount)}
              </td>
              <td className={this.rowInfoNumberClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {group.annotationCount}
              </td>
              <td className={this.rowInfoNumberClassNames}>
                <a href={this.groupLink} className={this.rowLinkClassNames}/>
                {group.highlightCount}
              </td>
            </tr>
          )
        })}
      </tbody>
    );
  }

  renderDesktopTable() {
    return (
      <table className={this.tableClassNames}>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </table>
    );
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

  renderPagination() {
    const { pagination } = this.props;

    return(
      <div className={this.paginationClassNames}>
        <Utility.Pagination
          pagination={pagination}
          paginationTarget={this.paginationTarget}
          paginationClickHandler={this.onPageClick}
        />
      </div>
    );
  }

  render() {
    const { isMobile } = this.state;
    console.log(this.props.members);

    return (
      <div className={this.containerClassNames}>
        {this.renderTableCount()}
        {!isMobile && this.renderDesktopTable()}
        {isMobile && this.renderMobileList()}
        {this.renderPagination()}
      </div>
    );
  }
}
