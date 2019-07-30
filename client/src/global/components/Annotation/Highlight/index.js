import React, { PureComponent } from "react";
import Utility from "frontend/components/utility";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { annotationsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import classNames from "classnames";

import Authorize from "hoc/authorize";

const { request } = entityStoreActions;

class HighlightDetail extends PureComponent {

  static displayName = "Annotation.Highlight";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    visitHandler: PropTypes.func
  };

  deleteAnnotation = () => {
    const { annotation } = this.props;
    const call = annotationsAPI.destroy(annotation.id);
    const options = { removes: { type: "annotations", id: annotation.id } };
    const res = this.props.dispatch(
      request(call, requests.rAnnotationDestroy, options)
    );
    return res.promise;
  };

  handleVisitHighlight = event => {
    event.preventDefault();
    this.props.visitHandler(this.props.annotation);
  };

  get displayFormat() {
    return this.props.displayFormat;
  }

  get containerClassNames() {
    return classNames({
      "annotation-highlight-detail": true,
      "annotation-highlight-detail--rounded-corners": this.displayFormat === "fullPage"
    });
  }

  render() {
    const annotation = this.props.annotation;
    return (
        <div className={this.containerClassNames}>
          <span className="annotation-highlight-detail__selection">
            {annotation.attributes.subject}
          </span>
          <nav className="annotation-highlight-detail__utility">
            <ul className="annotation-highlight-detail__list">
              {this.props.visitHandler ? (
                <li>
                  <button
                    className="annotation-highlight-detail__button-simple"
                    onClick={this.handleVisitHighlight}
                  >
                    {"View In Text"}
                  </button>
                </li>
              ) : null}
              <Authorize entity={annotation} ability={"delete"}>
                <li>
                  <Utility.ConfirmableButton
                    label="Delete"
                    confirmHandler={this.deleteAnnotation}
                  />
                </li>
              </Authorize>
            </ul>
          </nav>
        </div>
    );
  }
}

export default connect()(HighlightDetail);
