import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import CollegeDetail from "./pages/CollegeDetail";
import ChatBot from "./components/ChatBot";
import Questions from "./pages/Questions";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/college/:id" element={<CollegeDetail />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </Router>
      <ChatBot />
    </>
  );
}
export default App;