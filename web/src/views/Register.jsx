import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Card, Form, Input, Button } from 'reactstrap'; // مكتبة مكونات واجهة مستخدم تعتمد على React و Bootstrap
import Error from 'components/Error';
import Logo from 'assets/logo.png';
import Auth from 'Auth';
import axios from 'axios';


const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const history = useHistory();


 // Change form handler
 const onChange = (e) => {
  const { name, value } = e.target;
  if (name === 'name') setName(value);
  if (name === 'username') setUsername(value);
  if (name === 'password') setPassword(value);
  setError(null);
};


   // Form submit handler.
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      name,
      username,
      password
    };
    axios.post('/api/auth/register', data)
      .then((res) => {
        Auth.login(res.data);
        history.push('/');
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  };


   // Render Component.
  return (
    <Card className="auth col-lg-3 col-sm-6 p-3">
      <Form onSubmit={onSubmit}>
        <img src={Logo} alt="logo" width="200" />
        <h5 className="mb-4">إنشاء حساب جديد</h5>
        <Error error={error} />
        <Input value={name} name="name" onChange={onChange} placeholder="الاسم" required autoFocus className="mb-2"/>
        <Input value={username} name="username" onChange={onChange} placeholder="اسم المستخدم" required className="mb-2"/>
        <Input type="password" value={password} name="password" onChange={onChange} placeholder="كلمة المرور" required className="mb-2"/>
        <Button color="primary" block className="mb-3">إنشاء</Button>
        <small><Link to="/login">تسجيل الدخول</Link></small>
        <p className="m-3 text-muted">&copy; {new Date().getFullYear()}</p>
      </Form>
    </Card>
  );
};

export default Register;
