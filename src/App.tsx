import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home/Home";
import Editor from "./pages/Editor/Editor";
import { ImageEditorProvider } from "./context/ImageEditorContext";

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
      <ImageEditorProvider>
        <Router>
          <DevelopmentBanner visible={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editor" element={<Editor />} />
          </Routes>
        </Router>
      </ImageEditorProvider>
    </div>
  );
};

export default App;
