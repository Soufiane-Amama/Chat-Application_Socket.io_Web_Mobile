import React, { useState, useRef } from "react";
import { Row, Form, Input, Button } from "reactstrap";
import Error from "components/Error";
import Avatar from 'components/Avatar';
import axios from "axios";


// EditProfile Component.
const EditProfile = ({ user, open, toggle }) => {
    const [name, setName] = useState(user.name);
    const [about, setAbout] = useState(user.about);
    const [image, setImage] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [error, setError] = useState(null);
    const fileUpload = useRef(null);

    const showFileUpload = () => fileUpload.current.click();

    const onImageChange = e => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setAvatar(e.target.files[0]);
        }
    };

    const onChange = e => {
        const { name, value } = e.target;
        if (name === "name") setName(value);
        if (name === "about") setAbout(value);
        setError(null);
    };

    const onSubmit = e => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', name);
        data.append('about', about);
        if (avatar) data.append('avatar', avatar, avatar.name);
        axios.post('/api/account', data)
            .then(toggle)
            .catch(err => setError(err.response.data.message));
    };

    const onClose = () => {
        setImage(null);
        setName(user.name);
        setAbout(user.about);
        toggle();
    };

    return (
        <div className={open ? 'side-profile open' : 'side-profile'}>
            <Row className="heading">
                <div className="mr-2 nav-link" onClick={onClose}>
                    <i className="fa fa-arrow-right" />
                </div>
                <div>الملف الشخصي</div>
            </Row>

            <div className="d-flex flex-column" style={{ overflow: 'auto' }}>
                <Form onSubmit={onSubmit}>
                    <Error error={error} />

                    <div className="text-center" onClick={showFileUpload}>
                        <Avatar src={user.avatar} file={image} />
                    </div>

                    <input type="file" ref={fileUpload} onChange={onImageChange} className="d-none" />

                    <div className="bg-white px-4 py-2">
                        <label className="text-muted">الاسم</label>
                        <Input value={name} name="name" onChange={onChange} required autoComplete="off" />
                    </div>

                    <div className="bg-white px-3 py-2">
                        <label className="text-muted">رسالة الحالة</label>
                        <Input value={about} name="about" onChange={onChange} required autoComplete="off" />
                    </div>

                    <div className="bg-white px-3 py-2">
                        <Button block className="mt-3">حفظ</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default EditProfile;
