import React, { Component, PropTypes } from 'react';

export default class SectionPagination extends Component {

  static propTypes = {};

  render() {
    return (
      <nav className="section-pagination">
        <div className="container">
          <a href="#" className="pagination-previous">
            <i className="manicon manicon-arrow-round-left"></i>
              {'Previous'}
          </a>
          <a href="#" className="pagination-next">
            {'Next'}
            <i className="manicon manicon-arrow-round-right"></i>
          </a>
        </div>
      </nav>
    );
  }
}
