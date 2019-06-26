import React from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import TableHeaders from "./Headers";
import Row from "./Row";

export default class TableBody extends React.PureComponent {

  static propTypes = {
    rows: PropTypes.array
  }

  constructor(props) {
    super(props);

    this.resizeId = null;
    this.breakpoint = 880;

    this.state = {
      isMobile: window.innerWidth < this.breakpoint
    };
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    if (this.resizeId) {
      window.cancelAnimationFrame(this.resizeId);
    }

    this.resizeId = window.requestAnimationFrame(() => {
      window.innerWidth < this.breakpoint
        ? this.setState({
            isMobile: true
          })
        : this.setState({
            isMobile: false
          });
    });
  }

  get rowComponentHeaders() {
    return this.props.rowComponent.headers();
  }

  get tableClassNames() {
    return "group-table__table";
  }

  renderLabel(name, icon) {
    return (
      <span className={this.headingClassNames}>
        {icon && (
          <Utility.IconComposer
            icon={icon}
            size={24}
            iconClass={this.labelIconClass}
          />
        )}
        {name && name + ":"}
      </span>
    );
  }

  renderTableInner() {

    return (
      <React.Fragment>
      {
        this.props.models.map((model, i)=>  {
          return(
            <Row
              key={i}
              model={model}
              headers={this.rowComponentHeaders}
              rowComponent={this.props.rowComponent}
            />
          )
        })
      }
      </React.Fragment>
    )
  }

  render() {
    const { isMobile } = this.state;

    return (
       <React.Fragment>
       {!isMobile &&
         <table className={this.tableClassNames}>
           <TableHeaders
             headers={this.rowComponentHeaders}
             renderLabel={this.renderLabel}
           />
           <tbody>
            {this.renderTableInner()}
           </tbody>
         </table>}
         {isMobile &&
           <div>
            {this.renderTableInner()}
           </div>
         }
      </React.Fragment>
    );
  }
}
