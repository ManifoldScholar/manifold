import React, { PureComponent } from "react";
import { BackLinkContext } from "helpers/contexts";
import lh from "helpers/linkHandler";
import Utility from "frontend/components/utility";
export default class BackLinkRender extends PureComponent {

  static contextType = BackLinkContext;

  get hasBackLink() {
    return this.context.backLink !== null;
  }

  render() {
    if (!this.hasBackLink) return null;

    return (
      <section className="bg-neutral05">
        <Utility.BackLinkPrimary
          {...this.context.backLink}
        />
      </section>
    )
  }

}
