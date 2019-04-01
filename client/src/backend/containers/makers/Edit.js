import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import withConfirmation from "hoc/with-confirmation";
import { entityStoreActions } from "actions";
import { select } from "utils/entityUtils";
import { makersAPI, requests } from "api";
import get from "lodash/get";
import Form from "./Form";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

const { request, flush } = entityStoreActions;

export class MakersEditContainer extends PureComponent {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      maker: select(requests.beMaker, state.entityStore),
      updateMakers: get(state.entityStore.responses, requests.beMakerUpdate)
    };
  };

  static displayName = "Makers.Edit";

  static propTypes = {
    maker: PropTypes.object,
    confirm: PropTypes.func.isRequired,
    match: PropTypes.object,
    history: PropTypes.object,
    afterDestroy: PropTypes.func,
    dispatch: PropTypes.func
  };

  static defaultProps = {
    confirm: (heading, message, callback) => callback()
  };

  componentDidMount() {
    this.fetchMaker(this.props.match.params.id);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.fetchMaker(this.props.match.params.id);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush([requests.beMakerUpdate]));
  }

  fetchMaker(id) {
    const call = makersAPI.show(id);
    const makerRequest = request(call, requests.beMaker);
    this.props.dispatch(makerRequest);
  }

  handleMakerDestroy = () => {
    const heading = "Are you sure you want to delete this maker?";
    const message = "This action cannot be undone.";
    this.props.confirm(heading, message, this.destroyMaker);
  };

  destroyMaker = () => {
    const maker = this.props.maker;
    const call = makersAPI.destroy(maker.id);
    const options = { removes: maker };
    const makerRequest = request(call, requests.beMakerDestroy, options);
    this.props.dispatch(makerRequest).promise.then(() => {
      this.doAfterDestroy(this.props);
    });
  };

  doAfterDestroy(props) {
    if (props.afterDestroy) return props.afterDestroy();
    return props.history.push(lh.link("backendRecordsMakers"));
  }

  render() {
    if (!this.props.maker) return null;
    const attr = this.props.maker.attributes;
    const maker = this.props.maker;

    return (
      <div>
        <Navigation.DrawerHeader
          title={attr.fullName}
          buttons={[
            {
              onClick: this.handleMakerDestroy,
              icon: "delete32",
              label: "Delete",
              entity: maker,
              ability: "delete",
              iconClass: "notice"
            }
          ]}
        />
        <Form maker={maker} />
      </div>
    );
  }
}

export default withConfirmation(connectAndFetch(MakersEditContainer));
