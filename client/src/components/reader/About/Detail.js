import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { About } from "components/reader";
import { Project as GlobalProject, FormattedDate } from "components/global";
import lh from "helpers/linkHandler";

export default class AboutOverlayDetail extends PureComponent {
  static propTypes = {
    text: PropTypes.object,
    handleClose: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.handleEscape = this.handleEscape.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keyup", this.handleEscape);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.handleEscape);
  }

  handleEscape(event) {
    if (event.keyCode === 27) {
      this.props.handleClose(event);
    }
  }

  renderProjectThumb(project) {
    let cover;
    let classes;
    if (project.attributes.avatarStyles.small) {
      classes = "figure-wrapper resource-title";
      cover = (
        <img
          src={project.attributes.avatarStyles.small}
          alt={`Click to view ${project.attributes.title}`}
          style={{ maxWidth: "100px", paddingRight: "15px" }}
        />
      );
    } else {
      classes = "figure-wrapper figure-wrapper-placeholder resource-title";
      cover = (
        <div style={{ paddingRight: "15px" }}>
          <GlobalProject.Placeholder width="100.34735px" height="100.68436px" />
        </div>
      );
    }
    return { classes, cover };
  }

  render() {
    const text = this.props.text;
    const project = this.props.text.relationships.project;
    const { cover, classes } = this.renderProjectThumb(project);
    const attr = text.attributes;

    return (
      <div className="resource-detail">
        <div className="container">
          <div className={classes}>
            <figure>
              {cover}
            </figure>
            <div>
              <h1>
                {attr.title}
              </h1>
              <span className="resource-date">
                {"Text added "}
                <FormattedDate format="MMMM, YYYY" date={attr.createdAt} />
              </span>
            </div>
          </div>
          <div className="resource-content">
            <p>
              {attr.description}
            </p>
          </div>
        </div>
        <section className="resource-hero-container" />
        <div className="container">
          <About.Meta text={text} layout="secondary columnar" />
          <nav className="button-nav">
            <Link
              to={lh.link("frontendProject", project.id)}
              className="button-secondary outlined"
            >
              Visit Project Page<i className="manicon manicon-arrow-right" />
            </Link>
            <br />
            <button
              onClick={this.props.handleClose}
              className="button-secondary outlined dull"
            >
              <i className="manicon manicon-arrow-left" />Return to Reader
            </button>
          </nav>
        </div>
      </div>
    );
  }
}
