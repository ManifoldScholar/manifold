import React, { PureComponent, PropTypes } from 'react';
import HigherOrder from 'containers/global/HigherOrder';
import classNames from 'classnames';

export default class AnnotationPopupAnnotate extends PureComponent {

  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    attachResource: PropTypes.func,
    highlight: PropTypes.func,
    annotate: PropTypes.func,
    bookmark: PropTypes.func,
    showShare: PropTypes.func,
    secondary: PropTypes.string,
    direction: PropTypes.string
  };

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
    });

    return (
      <section className={pageClass}
        ref={(p) => { this.p = p; }}
        style={{
          marginLeft: this.props.secondary ? -this.p.offsetWidth + 'px' : null
        }}
      >
        <HigherOrder.RequireRole requiredRole="admin">
          <button onClick={this.props.attachResource}>
            <i className="manicon manicon-cube-outline"></i>
            Resource
          </button>
        </HigherOrder.RequireRole>
        <button onClick={this.props.highlight}>
          <i className="manicon manicon-pencil-simple"></i>
          Highlight
        </button>
        <button onClick={this.props.annotate}>
          <i className="manicon manicon-word-bubble"></i>
          Annotate
        </button>
        <button onClick={this.props.bookmark}>
          <i className="manicon manicon-bookmark-outline"></i>
          Bookmark
        </button>
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
