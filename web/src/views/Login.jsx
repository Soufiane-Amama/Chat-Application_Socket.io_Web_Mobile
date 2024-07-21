import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button } from 'reactstrap'; // مكتبة مكونات واجهة مستخدم تعتمد على React و Bootstrap
import Error from 'components/Error';
import Logo from 'assets/logo.png';
import Auth from 'Auth';
import axios from 'axios';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();


 // Change form handler
 const onChange = (e) => {
  const { name, value } = e.target;
  if (name === 'username') setUsername(value);
  if (name === 'password') setPassword(value);
  setError(null);
};


   // Form submit handler.
  const onSubmit = (e) => {
    e.preventDefault();
    let data = {
      username,
      password
    };
    axios.post('/api/auth', data)
      .then((res) => {
        Auth.login(res.data);
        navigate('/');
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
        <h5 className="mb-4">تسجيل الدخول</h5>
        <Error error={error} />
        <Input value={username} name="username" onChange={onChange} placeholder="اسم المستخدم" required className="mb-2"/>
        <Input type="password" value={password} name="password" onChange={onChange} placeholder="كلمة المرور" required className="mb-2"/>
        <Button color="primary" block className="mb-3">تسجيل الدخول</Button>
        <small><Link to="/register">إنشاء حساب جديد</Link></small>
        <p className="m-3 text-muted">&copy; {new Date().getFullYear()}</p>
      </Form>
    </Card>
  );
};

export default Login;

