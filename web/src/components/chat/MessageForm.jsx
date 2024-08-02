import React, { useState } from "react";
import { Input } from "reactstrap";
import moment from "moment";


// MessageForm Component.
const MessageForm = (props) => {
    const [message, setMessage] = useState('');
    const [lastType, setLastType] = useState(false);

    // Handle message change event.
    const onChange = (e) => setMessage(e.target.value);

    // Send message.
    const onSend = () => {
        if (!message) return;
        const newMessage = {
            content: message,
            date: new Date().getTime()
        };
        props.sender(newMessage);
        setMessage('');
    };

    // Handle OnKeyDown event.
    const onKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            setLastType(false);
            onSend();
            e.preventDefault();
        } else if (!lastType || moment() - lastType > 2000) {
            setLastType(moment());
            props.sendType();
        }
    };


    return (
        <div id="send-message">
            <Input
                type="textarea"
                rows="1"
                onChange={onChange}
                onKeyDown={onKeyDown}
                value={message}
                placeholder="اكتب رسالتك هنا"
            />
            <i className="fa fa-send text-muted px-3 send" onClick={onSend} />
        </div>
    );
};

export default MessageForm;
