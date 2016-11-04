import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class UtilityPagination extends Component {

  static displayName = "Utility.Pagination";

  static propTypes = {
  };

  constructor() {
    super();
  }

  render() {
    return (
      <nav className="list-pagination-secondary">
        <div className="pagination-previous">
          <Link to="#">
            <i className="manicon manicon-arrow-long-left"></i>
            Prev
          </Link>
        </div>
        <div className="pagination-ordinals">
          {'Page 1 / 4'}
        </div>
        <div className="pagination-next">
          <Link to="#">
            Next
            <i className="manicon manicon-arrow-long-right"></i>
          </Link>
        </div>
      </nav>
    );
  }

}
