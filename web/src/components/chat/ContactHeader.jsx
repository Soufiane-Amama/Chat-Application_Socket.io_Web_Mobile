import React from "react";
import Avatar from "components/Avatar";
import { Row } from "reactstrap";

// Contacts Header.
const ContactHeader = (props) => (
  <Row className="heading d-flex align-items-center justify-content-between">
    <div className="d-flex align-items-center col-auto">
      <Avatar src={props.user?.avatar} />
      <div className="text-right mx-2">جهات الاتصال</div>
    </div>

    <div className="nav-link col-auto" onClick={props.toggle}>
        <i className="fa fa-bars" />
      </div>
  </Row>
);
export default ContactHeader;
