import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";
import { Utility } from "components/global";

export default class ResourceListCards extends PureComponent {
  static displayName = "ResourceList.Cards";

  static propTypes = {
    context: PropTypes.object,
    resources: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  render() {
    if (!this.props.resources) return null;

    return (
      <div>
        <nav className="resource-list">
          <div className="resource-count">
            <span>
              {this.props.resources.length.toLocaleString()}
            </span>
            {" Resources Shown"}
          </div>
          <ul>
            {this.props.resources.map(resourceLike => {
              return (
                <Resource.Card
                  context={this.props.context}
                  key={resourceLike.id}
                  resource={resourceLike}
                />
              );
            })}
          </ul>
          {this.props.pagination
            ? <Utility.Pagination
                paginationClickHandler={this.props.paginationClickHandler}
                pagination={this.props.pagination}
              />
            : null}
        </nav>
      </div>
    );
  }
}
