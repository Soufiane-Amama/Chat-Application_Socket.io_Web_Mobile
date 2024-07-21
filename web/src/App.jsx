import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Register, Chat, NotFound, Login } from './views';
import Auth from './Auth';

function App() {

  useEffect(() => {
    Auth.init();
  }, [])

  return (
    <div id="main-container" className="container-fluid">
      <Router>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/" element={<Chat />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
