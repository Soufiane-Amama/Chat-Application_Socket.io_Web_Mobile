import React from "react";
import Avatar from "components/Avatar";
import moment from 'moment';
import { Badge } from 'reactstrap';


// Contact Item.
const Contact = (props) => (
   <div className="contact">
       <div>
           <Avatar src={props.contact.avatar} />
           {props.contact.status === true ? <i className='fa fa-circle online' /> : ''} {/* اظهار نقطة اذا كان المستخدم نشط */} 
       </div>
       <div className="w-50 mx-2">
           <div className="name">{props.contact.name}</div>
           <div className="small last-message">
               {props.message ? props.message.content : 'انقر هنا لبدء المحادثة' } {/* نظهر اخر رسلة تم ارسالها اذا لم تكن موجودة نظهر انقر هنا لبدء محادثة */} 
           </div>
       </div>
       <div className="flex-grow-1 text-left">
           <div className="small text-muted">
               {props.message ? moment(props.message.date).format("hh:mm a") : ''} {/* اظهار توقيت الرسالة */} 
           </div>
           { props.unseen > 0 ? <Badge color="success">{props.unseen}</Badge> : ''}
       </div>
   </div>
);

export default Contact;