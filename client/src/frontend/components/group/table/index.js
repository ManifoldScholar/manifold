import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import classNames from "classnames";

export default class GroupTable extends PureComponent {

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
  };

  get containerClassNames() {
    return "group-table";
  }

  get headingClassNames() {
    return "group-table__table-heading";
  }

  get rowClassNames() {
    return "group-table__row";
  }

  get rowNameClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-name": true,
    })
  }

  get rowInfoTextClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-info": true,
    })
  }

  get rowInfoNumberClassNames() {
    return classNames({
      "group-table__body-text" : true,
      "group-table__row-info": true,
      "group-table__number": true
    })
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
    return "group-table__member-count"
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
    )
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
    )
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
    )
  }


  renderTableBody() {
    const { groups } = this.props;
    return (
      <tbody>
        {groups.map(groupData => {
          const group = groupData.attributes;
          return(
            <tr key={groupData.id} className={this.rowClassNames}>
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
    )
  }

  renderDesktopTable() {
    return (
      <table className={this.containerClassNames}>
        {this.renderTableHead()}
        {this.renderTableBody()}
      </table>
    )
  }

  renderMobileList() {
    const { groups } = this.props;
    return(
      <div className={this.containerClassNames}>
        {groups.map(groupData => {
          const group = groupData.attributes;
          return(
            <div
              key={groupData.id}
              className={this.rowClassNames}
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
    )
  }

  render() {
    const { isMobile } = this.state;
    return (
      <React.Fragment>
        {!isMobile && this.renderDesktopTable()}
        {isMobile && this.renderMobileList()}
      </React.Fragment>
    )
  }
}
