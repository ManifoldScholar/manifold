import React, { Component, PropTypes } from 'react';

export default class SectionPagination extends Component {

  static propTypes = {
    textId: PropTypes.string,
    sectionId: PropTypes.string
  };

  getPreviousLink() {
    const previousSection = Number(this.props.sectionId) - 1;
    return `/read/${this.props.textId}/section/${previousSection}`;
  }

  getNextLink() {
    const nextSection = Number(this.props.sectionId) + 1;
    return `/read/${this.props.textId}/section/${nextSection}`;
  }

  render() {
    return (
      <nav className="section-pagination">
        <div className="container">
          <a href={this.getPreviousLink()} className="pagination-previous">
            <i className="manicon manicon-arrow-round-left"></i>
              {'Previous'}
          </a>
          <a href={this.getNextLink()} className="pagination-next">
            {'Next'}
            <i className="manicon manicon-arrow-round-right"></i>
          </a>
        </div>
      </nav>
    );
  }
}
