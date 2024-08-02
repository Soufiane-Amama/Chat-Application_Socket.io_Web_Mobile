import React, { useState, useEffect, useRef } from 'react';
import { Row, Spinner } from 'reactstrap';
import { ContactHeader, Contacts, ChatHeader, Messages, MessageForm, UserProfile, EditProfile } from 'components';
import socketIO from 'socket.io-client';
import Auth from 'Auth';


const Chat = ({ history }) => {
    const [contacts, setContacts] = useState([]);
    const [contact, setContact] = useState({});
    const [userProfile, setUserProfile] = useState(false);
    const [profile, setProfile] = useState(false);
    const [connected, setConnected] = useState(false);
    const [user, setUser] = useState({});
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const [timeout, setTimeoutState] = useState(null);
    const socket = useRef(null);

    useEffect(() => { 
        initSocketConnection();
        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []);

    const onChatNavigate = (contact) => {
        setContact(contact);
        socket.current.emit('seen', contact.id);
        setMessages(prevMessages => prevMessages.map(msg => msg.sender === contact.id ? { ...msg, seen: true } : msg));
    };

    const userProfileToggle = () => setUserProfile(!userProfile);

    const profileToggle = () => setProfile(!profile);

    const renderChat = () => {
        if (!contact) return null;
        const filteredMessages = messages.filter(e => e.sender === contact.id || e.receiver === contact.id);
        return <Messages user={user} messages={filteredMessages} />;
    };

    const initSocketConnection = () => {
        const socketConnection = socketIO(process.env.REACT_APP_SOCKET, {
            query: 'token=' + Auth.getToken(),
        });
        socket.current = socketConnection;

        socketConnection.on('connect', () => setConnected(true));
        socketConnection.on('disconnect', () => setConnected(false));

        socketConnection.on('data', onData);
        socketConnection.on('new_user', onNewUser);
        socketConnection.on('update_user', onUpdateUser);
        socketConnection.on('message', onNewMessage);
        socketConnection.on('user_status', updateUsersState);
        socketConnection.on('typing', onTypingMessage);
        socketConnection.on('error', onSocketError);
    };

    const onData = (user, contacts, messages, users) => {
        const initialContact = contacts[0] || {};
        setUser(user);
        setContacts(contacts);
        setMessages(messages);
        setContact(initialContact);
        updateUsersState(users);
    };

    const onNewUser = (user) => {
        setContacts(prevContacts => [...prevContacts, user]);
    };

    const onUpdateUser = (updatedUser) => {
        if (user.id === updatedUser.id) {
            setUser(updatedUser);
            Auth.setUser(updatedUser);
        } else {
            setContacts(prevContacts => prevContacts.map(contact => contact.id === updatedUser.id ? updatedUser : contact));
            if (contact.id === updatedUser.id) {
                setContact(updatedUser);
            }
        }
    };

    const onNewMessage = (message) => {
        if (message.sender === contact.id) {
            setTyping(false);
            socket.current.emit('seen', contact.id);
            message.seen = true;
        }
        setMessages(prevMessages => [...prevMessages, message]);
    };

    const onTypingMessage = (sender) => {
        if (contact.id !== sender) return;
        setTyping(sender);
        clearTimeout(timeout);
        const newTimeout = setTimeout(typingTimeout, 3000);
        setTimeoutState(newTimeout);
    };

    const onSocketError = (err) => {
        if (err === 'auth_error') {
            Auth.logout();
            history.push('/login');
        }
    };

    const typingTimeout = () => setTyping(false);

    const sendMessage = (message) => {
        if (!contact.id) return;
        message.receiver = contact.id;
        setMessages(prevMessages => [...prevMessages, message]);
        socket.current.emit('message', message);
    };

    const sendType = () => socket.current.emit('typing', contact.id);

    const logout = () => {
        socket.current.disconnect();
        Auth.logout();
        history.push('/');
    };

    const updateUsersState = (users) => {
        setContacts(prevContacts => prevContacts.map(contact => users[contact.id] ? { ...contact, status: users[contact.id] } : contact));
        if (users[contact.id]) {
            setContact(prevContact => ({ ...prevContact, status: users[prevContact.id] }));
        }
    };

    if (!connected || !contacts || !messages) {
        return <Spinner id="loader" color="success" />;
    }

    return (
        <Row className="h-100">
            <div id="contacts-section" className="col-6 col-md-4">
                <ContactHeader user={user} toggle={profileToggle} />
                <Contacts contacts={contacts} messages={messages} onChatNavigate={onChatNavigate} />
                <UserProfile contact={contact} toggle={userProfileToggle} open={userProfile} />
                <EditProfile user={user} toggle={profileToggle} open={profile} />
            </div>
            <div id="messages-section" className="col-6 col-md-8">
                <ChatHeader contact={contact} typing={typing} toggle={userProfileToggle} logout={logout} />
                {renderChat()}
                <MessageForm sender={sendMessage} sendType={sendType} />
            </div>
        </Row>
    );
};

export default Chat;
