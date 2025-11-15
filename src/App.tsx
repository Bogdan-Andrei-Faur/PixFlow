import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";

const DevelopmentBanner = ({ visible }: { visible: boolean }) =>
  visible && (
    <div className="development-banner">
      This site is under development. Some features may be missing or
      incomplete.
    </div>
  );

const App = () => {
  return (
    <div>
      <Router>
        <DevelopmentBanner visible={false} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
