import React from "react";
import moment from 'moment';


// Message item.
const Message = (props) => (
   <div className={props.message.outgoing ? 'message-item' : 'message-item incoming'}> {/* المعامل outgoing يشير الى ان الرسالة صادرة اذا كانت القيمة true وبحال كانت القيمة false فذلك ان الرسالة واردة */}
       <div className="d-flex flex-row">
           <div className="body m-1 mr-2">
               <div>{props.message.content}</div> {/* عرض محتوى الرسالة */}
               <span className="small text-muted">
                   {moment(props.message.date).format("hh:mm a | MMM D") } {/* عرض تاريخ الرسالة */}
               </span>
           </div>
       </div>
   </div>
);

export default Message;