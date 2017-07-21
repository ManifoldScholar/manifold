import React, { Component } from "react";
import PropTypes from "prop-types";
import { MyAnnotations } from "components/reader";
import rcc from "helpers/readerControlClasses";

export default class MyAnnotationsListComponent extends Component {
  static propTypes = {
    annotations: PropTypes.array,
    dispatch: PropTypes.func,
    appearance: PropTypes.object
  };

  render() {
    const textClasses = rcc.textClasses(this.props.appearance.typography);

    if (!this.props.annotations) return null;
    return (
      <div className={textClasses}>
        <ul className="selection-list">
          {this.props.annotations.map(annotation => {
            return (
              <li key={annotation.id} className="annotation-detail">
                <MyAnnotations.Detail
                  annotation={annotation}
                  dispatch={this.props.dispatch}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
