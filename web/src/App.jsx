import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Chat, NotFound } from './views';

function App() {
  return (
    <div id="main-container" className="container-fluid">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
