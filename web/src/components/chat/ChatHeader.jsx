import React from "react";
import { withRouter } from "react-router-dom";
import Avatar from "components/Avatar";
import {
  Row,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  UncontrolledDropdown,
} from "reactstrap";
import moment from "moment";

// Chat Header. - مساحة المحادثة
const ChatHeader = (props) => {
  // Render user status
  const status = () => {
    if (props.typing) return "يكتب الآن";
    if (props.contact.status === true) return "متصل الآن";
    if (props.contact.status) return moment(props.contact.status).fromNow();
  };

  return (
    <Row className="heading m-0 align-items-center justify-content-between">
      <div
        className="d-flex align-items-center col-auto"
        onClick={props.toggle}
      >
        <Avatar src={props.contact.avatar} />
        <div className="text-right mx-2">
          <div>{props.contact ? props.contact.name : ""}</div>
          <small>{status()}</small>
        </div>
      </div>
      <Nav className="ml-auto col-auto mx-2" navbar>
        <UncontrolledDropdown>

          <DropdownToggle tag="a" className="nav-link ml-auto">
            <i className="fa fa-ellipsis-v" />
          </DropdownToggle>

          <DropdownMenu>
            <DropdownItem onClick={(e) => props.history.push("/password")}>
              تغيير كلمة المرور
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={props.logout}>تسجيل الخروج</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
    </Row>
  );
};

export default withRouter(ChatHeader);
