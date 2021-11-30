import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import classNames from "classnames";
import Single from "./Single";
import Notation from "./Notation";
import Link from "./Link";

export default class NotationViewerGroup extends PureComponent {
  static mapStateToProps = (state, ownProps) => {
    const activeNotation = state.ui.transitory.reader.activeNotation;
    return { activeNotation, ...ownProps };
  };

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

  constructor(props) {
    super(props);
    this.state = { defaultActive: null };
  }

  componentDidUpdate(prevProps) {
    this.maybeUpdateActiveAnnotation(prevProps);
  }

  maybeUpdateActiveAnnotation(prevProps) {
    if (prevProps.activeAnnotation === this.props.activeAnnotation) return;
    const { group, activeAnnotation } = this.props;
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

    /* eslint-disable jsx-a11y/anchor-is-valid                                          */
    /* jsx-a11y sees the link in this component as missing a href attribute, but it's a */
    /* false positive, as the child Link component does in fact render an a tag with a  */
    /* href.                                                                            */
    return (
      <div
        ref={r => {
          this.wrapperDomEl = r;
        }}
        className="notation-preview-group"
      >
        <div className="group-highlighted-notation-wrapper">
          <CSSTransition
            classNames="highlight"
            timeout={{ enter: 200, exit: 200 }}
          >
            <Single
              entry={activeEntry}
              params={params}
              actions={actions}
              showTitle={false}
              active={activeAnnotation === activeEntry.annotation.id}
            />
          </CSSTransition>
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
                        showTitle={false}
                        neverCrop
                        isPreview
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
    /* eslint-enable jsx-a11y/anchor-is-valid */
  }
}
