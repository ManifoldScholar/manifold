import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "components/global/FormattedDate";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import isEmpty from "lodash/isEmpty";
import humps from "humps";

export default class LogListItem extends PureComponent {
  static displayName = "Log.ListItem";

  static propTypes = {
    entity: PropTypes.object
  };

  renderChangeList(version) {
    return (
      <div className="results-desc flush">
        {`These fields were modified: `}
        <span className="specifier">
          {Object.keys(version.attributes.objectChanges)
            .map(change => humps.decamelize(change, { separator: " " }))
            .join(", ")}
        </span>
      </div>
    );
  }

  renderUserLink(version) {
    return (
      <Link to={lh.link("backendRecordsUser", version.attributes.actorId)}>
        {`${version.attributes.actorName}`}
      </Link>
    );
  }

  renderItemLink(version) {
    const urlName = `backend${version.attributes.itemType}`;
    return (
      <Link
        to={lh.link(urlName, version.attributes.itemId)}
        dangerouslySetInnerHTML={{
          __html: version.attributes.itemDisplayName
        }}
      />
    );
  }

  renderProjectLogItem(version) {
    return (
      <div className="results-body">
        <h4 className="results-header">
          <div className="subtitle">
            {this.renderUserLink(version)}
            {` updated this project `}
            <FormattedDate prefix="on" date={version.attributes.createdAt} />
          </div>
        </h4>
        {this.renderChangeList(version)}
      </div>
    );
  }

  renderLogItem(version) {
    const type = version.attributes.itemType.toLowerCase();

    return (
      <div className="results-body">
        <h4 className="results-header">
          <div className="subtitle">
            {this.renderUserLink(version)}
            {` updated the ${type}, \u201C`}
            {this.renderItemLink(version)}
            {`\u201D, `}
            <FormattedDate prefix="on" date={version.attributes.createdAt} />
          </div>
        </h4>
        {this.renderChangeList(version)}
      </div>
    );
  }

  render() {
    const version = this.props.entity;
    if (!version) return null;
    if (isEmpty(version.attributes.objectChanges)) return null;

    return (
      <li key={version.id} className="no-icon">
        {version.attributes.itemType === "Project"
          ? this.renderProjectLogItem(version)
          : this.renderLogItem(version)}
      </li>
    );
  }
}
