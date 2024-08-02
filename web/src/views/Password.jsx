import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Card, Form, Input, Button } from "reactstrap";
import { Error } from "components";
import axios from "axios";
import logo from 'assets/logo.png';


// Change Password Component.
const Password = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();


  // Change form handler
  const onChange = e => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    }
    setError(null);
  };


  // Form submit handler.
  const onSubmit = e => {
    e.preventDefault();
    const data = { password, newPassword };
    axios.post('/api/account/password', data)
      .then(res => {
        history.push('/');
      })
      .catch(err => {
        setError(err.response.data.message);
      });
  };


  // Render Component.
  return (
    <Card className="auth col-lg-3 col-sm-6">
      <Form onSubmit={onSubmit}>
        <img src={logo} alt="" width="200" />
        <h5 className="mb-4">تغيير كلمة المرور</h5>
        <Error error={error} />
        <Input type="password" value={password} name="password" onChange={onChange} placeholder="كلمة المرور الحالية" required />
        <Input type="password" value={newPassword} name="newPassword" onChange={onChange} placeholder="كلمة المرور الجديدة" required />
        <Button block className="mb-3">تغيير</Button>
        <small><Link to="/">عودة</Link></small>
        <p className="m-3 mb-3 text-muted">&copy; {new Date().getFullYear()}</p>
      </Form>
    </Card>
  );
};

export default Password;
