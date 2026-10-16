import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Estudante from './pages/Estudante';
import Mentor from './pages/Mentor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/estudante" element={<Estudante />} />
        <Route path="/mentor" element={<Mentor />} />
      </Routes>
    </Router>
  );
}

export default App;