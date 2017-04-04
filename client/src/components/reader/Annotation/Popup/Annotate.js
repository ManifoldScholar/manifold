import React, { PureComponent, PropTypes } from 'react';
import HigherOrder from 'containers/global/HigherOrder';
import classNames from 'classnames';

class AnnotationPopupAnnotate extends PureComponent {

  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    attachResource: PropTypes.func,
    currentUser: PropTypes.object,
    highlight: PropTypes.func,
    annotate: PropTypes.func,
    bookmark: PropTypes.func,
    showShare: PropTypes.func,
    secondary: PropTypes.string,
    direction: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      tailHighlight: false
    };

    this.handleTailHighlight = this.handleTailHighlight.bind(this);
    this.handleTailBlur = this.handleTailBlur.bind(this);
  }

  handleTailHighlight(condition) {
    if (condition) {
      this.setState({
        tailHighlight: true
      });
    }
  }

  handleTailBlur(condition) {
    if (condition) {
      this.setState({
        tailHighlight: false
      });
    }
  }

  render() {

    const pageClass = classNames({
      'popup-page': true,
      hidden: this.props.secondary,
      bottom: this.props.direction === 'up',
      top: this.props.direction === 'down'
    });

    const tailClass = classNames({
      tail: true,
      'tail-down': this.props.direction === 'up',
      'tail-up': this.props.direction === 'down',
      highlight: this.state.tailHighlight
    });

    // The first button to render needs to have the enter and leave events. If the
    // resource button is visible, it always has these props. Otherwise the highlight
    // button gets them.
    const firstButtonProps = {
      onMouseEnter: () => { this.handleTailHighlight(this.props.direction === 'down'); },
      onMouseLeave: () => { this.handleTailBlur(true); }
    };
    const resourceButtonProps = firstButtonProps;
    let highlightButtonProps = firstButtonProps;
    if (this.props.currentUser && this.props.currentUser.attributes.role === "admin") {
      highlightButtonProps = {};
    }

    return (
      <section className={pageClass}
        ref={(p) => { this.p = p; }}
        style={{
          marginLeft: this.props.secondary ? -this.p.offsetWidth + 'px' : null
        }}
      >
        <HigherOrder.RequireRole requiredRole="admin">
          <button
            onClick={this.props.attachResource}
            {...resourceButtonProps}
          >
            <i className="manicon manicon-cube-outline"></i>
            Resource
          </button>
        </HigherOrder.RequireRole>

        <HigherOrder.RequireRole requiredRole="any">
          <div className="button-group">
            <button
              onClick={this.props.highlight}
              {...highlightButtonProps}
            >
              <i className="manicon manicon-pencil-simple"></i>
              Highlight
            </button>
            <button onClick={this.props.annotate}>
              <i className="manicon manicon-word-bubble"></i>
              Annotate
            </button>
            {/*
             <button onClick={this.props.bookmark}>
             <i className="manicon manicon-bookmark-outline"></i>
             Bookmark
             </button>
            */}
          </div>
        </HigherOrder.RequireRole>

        <HigherOrder.RequireRole requiredRole="none">
          <button onClick={this.props.showLogin}>
            <i className="manicon manicon-person-pencil"></i>
            Login to Annotate
          </button>
        </HigherOrder.RequireRole>

        <button onClick={this.props.showShare}>
          <i className="manicon manicon-nodes"></i>
          Share
        </button>

        <div
          className={tailClass}
        >
        </div>
      </section>
    );
  }
}

export default HigherOrder.withCurrentUser(AnnotationPopupAnnotate);
