import React, { Component } from "react";
import { Utility } from "components/global";
import { Notes } from "components/reader";
import PropTypes from "prop-types";
import classNames from "classnames";
import debounce from "lodash/debounce";

export default class Group extends Component {
  static displayName = "Notes.List.Group";

  static propTypes = {
    readerSection: PropTypes.object,
    annotations: PropTypes.array,
    sectionName: PropTypes.string,
    visitHandler: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      targetHeight: "5em"
    };
  }
  componentDidMount() {
    import(/* webpackChunkName: "velocity-react" */ "velocity-react").then(
      Velocity => {
        this.setState({ Velocity, expanded: false }, () => {
          this.preOpenItem();
        });
      }
    );
  }

  getFullGroupHeight() {
    if (!this._group) return;
    this._group.style.height = "auto";
    const measuredHeight = this._group.offsetHeight;
    this._group.style.height = "1em";
    return measuredHeight + "px";
  }

  preOpenItem = debounce(() => {
    const expanded =
      this.props.readerSection.attributes.name === this.props.sectionName;

    return this.setState({
      expanded,
      targetHeight: expanded
        ? this.getFullGroupHeight()
        : this.state.targetHeight
    });
  }, 200);

  handleClick = event => {
    event.stopPropagation();
    if (!this.state.expanded) {
      this.setState({
        targetHeight: this.getFullGroupHeight()
      });
    }
    return this.setState({ expanded: !this.state.expanded });
  };

  getFullGroupHeight() {
    if (!this._group) return;
    this._group.style.height = "auto";
    const measuredHeight = this._group.offsetHeight;
    this._group.style.height = "1em";
    return measuredHeight + "px";
  }

  renderGroupItems(annotations) {
    const animation = {
      animation: {
        height: this.state.expanded ? this.state.targetHeight : ''
      },
      duration: 250,
      complete: () => {
        if (this.state.expanded) {
          this._group.style.height = "auto";
        }
      }
    };

    const classes = classNames({
      "open": this.state.expanded
    });

    if (!this.state.Velocity) return null;
    return (
      <this.state.Velocity.VelocityComponent {...animation}>
        <ul
          className={classes}
          ref={e => {
            this._group = e;
          }}
        >
          {annotations.map(annotation => {
            return (
              <Notes.Partial.GroupItem
                key={annotation.id}
                annotation={annotation}
                visitHandler={this.props.visitHandler}
              />
            );
          })}
        </ul>
      </this.state.Velocity.VelocityComponent>
    );
  }

  render() {
    const classes = classNames({
      "item": true,
      "open": this.state.expanded
    });
    return (
      <li>
        <div className={classes} onClick={this.handleClick}>
          <i className={`manicon manicon-caret-down`} />
          <label>{this.props.sectionName}</label>
        </div>
        {this.renderGroupItems(this.props.annotations)}
      </li>
    );
  }
}
