import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import SocialButtons from './SocialButtons';

export default class AnnotationPopupShare extends PureComponent {

  static displayName = "Annotation.Popup.Share";

  static propTypes = {
    selectionText: PropTypes.string,
    shareUrl: PropTypes.string,
    pageClass: PropTypes.string,
    tailClass: PropTypes.string,
    back: PropTypes.func,
    direction: PropTypes.string,
    cite: PropTypes.func,
    text: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      inBrowser: false,
      tailHighlight: false
    };

    this.handleTailHighlight = this.handleTailHighlight.bind(this);
    this.handleTailBlur = this.handleTailBlur.bind(this);
  }

  componentDidMount() {
    // This won't be run by the server, so set an instance variable here
    // that will be hidden otherwise
    if (this.state.inBrowser === false) {
      this.setState({ // eslint-disable-line react/no-did-mount-set-state
        inBrowser: true
      });
    }
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

  renderCiteButton() {
    if (!this.props.text) return null;
    const attr = this.props.text.attributes;
    const metadata = attr.metadata;
    if (!metadata.publisher || !metadata.placeOfPublication || !attr.publicationDate) return null;
    return (
      <button onClick={this.props.cite}>
        <i className="manicon manicon-quotes-left"></i>
        Cite
      </button>
    );
  }

  url() {
    if (!this.state.inBrowser) return null;
    const url = location.hostname + this.props.shareUrl;
    return url;
  }

  render() {
    const pageClass = classNames({
      'popup-page-secondary': true,
      bottom: this.props.direction === 'up',
      top: this.props.direction === 'down'
    });

    const tailClass = classNames({
      tail: true,
      'tail-down': this.props.direction === 'up',
      'tail-up': this.props.direction === 'down',
      highlight: this.state.tailHighlight
    });

    return (
      <section className={pageClass}>
        {this.renderCiteButton()}
        <SocialButtons
          text={this.props.selectionText}
          url={this.url()}
          handleTailHighlight={
            () => {
              this.handleTailHighlight(this.props.direction === 'down');
            }
          }
          handleTailBlur={() => { this.handleTailBlur(true); }}
        />
        <button onClick={this.props.back} className="dark">
          <i className="manicon manicon-arrow-bold-left"></i>
          Back
        </button>
        <div
          className={tailClass}
        >
        </div>
      </section>
    );
  }
}
