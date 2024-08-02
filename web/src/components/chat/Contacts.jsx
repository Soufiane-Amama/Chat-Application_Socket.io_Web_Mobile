import React, { useState } from "react";
import Contact from "./Contact";
import { Row, Input } from 'reactstrap';


// Contacts.
const Contacts = ({ contacts, messages, onChatNavigate }) => {
    const [search, setSearch] = useState('');

     // Handle search event.
    const onSearch = e => setSearch(e.target.value);

    // Render single contact.
    const renderContact = (contact, index) => {
        if (!contact.name.includes(search)) return null;
        let filteredMessages = messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        let lastMessage = filteredMessages[filteredMessages.length - 1];
        let unseen = filteredMessages.filter(e => !e.seen && e.sender === contact.id).length;
        return (
            <div className="w-100" key={index} onClick={() => onChatNavigate(contact)}>
                <Contact contact={contact} message={lastMessage} unseen={unseen} />
            </div>
        );
    };

    return (
        <div className="list">
            <Row className="search">
                <Input onChange={onSearch} placeholder="..بحث" />
            </Row>
            <Row id="contacts">
                {contacts.map((contact, index) => renderContact(contact, index))}
            </Row>
        </div>
    );
};

export default Contacts;
