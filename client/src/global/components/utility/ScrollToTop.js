import { PureComponent } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import locationHelper from "helpers/location";

class ScrollToTop extends PureComponent {
  static propTypes = {
    location: PropTypes.object
  };

  componentDidMount() {
    if (!locationHelper.preventsScroll(this.props.location)) {
      this.doScroll();
    }
  }

  componentDidUpdate(prevProps) {
    if (
      locationHelper.triggersScrollToTop(
        this.props.location,
        prevProps.location
      )
    ) {
      this.doScroll();
    }
  }

  doScroll() {
    if (!__BROWSER__) return;
    window.scrollTo(0, 0);
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
