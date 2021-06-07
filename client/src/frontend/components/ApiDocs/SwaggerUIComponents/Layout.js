import React from "react";
import { Translation } from 'react-i18next';

export default class Layout extends React.Component {
  get getComponent() {
    return this.props.getComponent;
  }

  render() {
    const { errSelectors, specSelectors, getComponent } = this.props;

    const SvgAssets = getComponent("SvgAssets");
    const VersionPragmaFilter = getComponent("VersionPragmaFilter");
    const Operations = getComponent("operations", true);
    const Models = getComponent("Models", true);
    const Row = getComponent("Row");
    const Col = getComponent("Col");
    const Errors = getComponent("errors", true);
    const isSwagger2 = specSelectors.isSwagger2();
    const isOAS3 = specSelectors.isOAS3();

    const isSpecEmpty = !specSelectors.specStr();

    const loadingStatus = specSelectors.loadingStatus();

    let loadingMessage = null;

    if (loadingStatus === "loading") {
      loadingMessage = (
        <div className="info">
          <div className="loading-container">
            <div className="loading" />
          </div>
        </div>
      );
    }

    if (loadingStatus === "failed") {
      loadingMessage = (
        <Translation>
          {t => (
            <div className="info">
              <div className="loading-container">
                <h4 className="title">{t(`failed-to-load-api-definition`)}</h4>
                <Errors />
              </div>
            </div>
          )}
        </Translation>
      );
    }

    if (loadingStatus === "failedConfig") {
      const lastErr = errSelectors.lastError();
      const lastErrMsg = lastErr ? lastErr.get("message") : "";
      loadingMessage = (
        <Translation>
          {t => (
            <div
              className="info"
              style={{
                maxWidth: "880px",
                marginLeft: "auto",
                marginRight: "auto",
                textAlign: "center"
              }}
            >
              <div className="loading-container">
                <h4 className="title">{t(`failed-to-load-remote-config`)}</h4>
                <p>{lastErrMsg}</p>
              </div>
            </div>
          )}
        </Translation>
      );
    }

    if (!loadingMessage && isSpecEmpty) {
      loadingMessage = (
        <Translation>
          {t => (
            <h4>{t(`no-api-definition-provided`)}</h4>
          )}
        </Translation>
      );
    }

    if (loadingMessage) {
      return ( 
        <div className="swagger-ui">
          <div className="loading-container">{loadingMessage}</div>
        </div>
      );
    }

    return (
      <div className="swagger-ui">
        <SvgAssets />
        <VersionPragmaFilter
          isSwagger2={isSwagger2}
          isOAS3={isOAS3}
          alsoShow={<Errors />}
        >
          <Errors />

          <Row>
            <Col mobile={12} desktop={12}>
              <Operations />
            </Col>
          </Row>
          <Row>
            <Col mobile={12} desktop={12}>
              <Models />
            </Col>
          </Row>
        </VersionPragmaFilter>
      </div>
    );
  }
}
