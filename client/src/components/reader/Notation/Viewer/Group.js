import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";
import classNames from "classnames";
import Single from "./Single";
import Notation from "./Notation";
import Link from "./Link";

export default class NotationViewerGroup extends PureComponent {
  static displayName = "NotationViewer.Group";

  static propTypes = {
    group: PropTypes.object,
    activeAnnotation: PropTypes.string,
    singleHeight: PropTypes.number,
    actions: PropTypes.shape({
      startDestroy: PropTypes.func,
      makeActive: PropTypes.func
    }),
    params: PropTypes.shape({
      sectionId: PropTypes.string,
      textId: PropTypes.string
    })
  };

  static mapStateToProps = (state, ownProps) => {
    const activeNotation = state.ui.reader.activeNotation;
    return Object.assign({}, { activeNotation }, ownProps);
  };

  constructor(props) {
    super(props);
    this.state = { defaultActive: null };
  }

  componentWillReceiveProps(nextProps) {
    this.maybeUpdateActiveAnnotation(nextProps);
  }

  maybeUpdateActiveAnnotation(nextProps) {
    if (nextProps.activeAnnotation === this.props.activeAnnotation) return;
    const { group, activeAnnotation } = nextProps;
    const { entries } = group;
    const activeEntry = entries.find(
      e => e.annotation && e.annotation.id === activeAnnotation
    );
    if (activeEntry) this.setState({ activeAnnotation });
  }

  activeEntry() {
    const { entries } = this.props.group;
    const { activeAnnotation } = this.state;
    const entry = entries.find(
      e => e.annotation && e.annotation.id === activeAnnotation
    );
    if (entry) return entry;
    return entries[0];
  }

  render() {
    const { group, activeAnnotation, actions, params } = this.props;

    const { entries } = group;
    const activeEntry = this.activeEntry();

    const thumbClasses = classNames("group-thumbnails", {
      overflow: entries.length > 8
    });
    return (
      <div
        ref={r => {
          this.wrapperDomEl = r;
        }}
        className="notation-preview-group"
      >
        <div className="group-highlighted-notation-wrapper">
          <ReactCSSTransitionGroup
            transitionName="highlight"
            transitionEnterTimeout={200}
            transitionLeaveTimeout={200}
          >
            <Single
              entry={activeEntry}
              params={params}
              actions={actions}
              showTitle={false}
              active={activeAnnotation === activeEntry.annotation.id}
            />
          </ReactCSSTransitionGroup>
        </div>

        <ul className={thumbClasses}>
          {entries.map(entry => {
            const { notation, annotation } = entry;
            const active = annotation.id === activeAnnotation;
            const thumbnailClass = classNames("group-thumbnail", {
              highlighted: active
            });
            return (
              <li key={annotation.id}>
                <div
                  onMouseOver={() => {
                    actions.makeActive({
                      annotationId: annotation.id,
                      passive: false
                    });
                  }}
                  onMouseLeave={() => {
                    actions.makeActive(null);
                  }}
                >
                  <div className={thumbnailClass}>
                    <Link params={params} notation={notation}>
                      <Notation
                        notation={notation}
                        additionalClasses="minimal preview"
                        showTitle={false}
                        neverCrop
                      />
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <h4
          onMouseOver={() => {
            actions.makeActive({
              annotationId: activeEntry.annotation.id,
              passive: false
            });
          }}
          onMouseLeave={() => {
            actions.makeActive(null);
          }}
          className={classNames("group-active-title", {
            highlighted: activeAnnotation === activeEntry.annotation.id
          })}
        >
          <Link params={params} notation={activeEntry.notation}>
            <span
              dangerouslySetInnerHTML={{
                __html: activeEntry.notation.attributes.titleFormatted
              }}
            />
          </Link>
        </h4>
      </div>
    );
  }
}
