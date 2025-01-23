import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import TurbineDesigner from './components/TurbineDesigner';
import FreeCADGenerator from './pages/freecad/FreeCADGenerator';
import './App.css';

function App() {
  return (
    <Router basename="/turbines">
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg mb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
                  Turbine Designer
                </Link>
                <Link to="/freecad" className="flex items-center px-3 py-2 text-gray-700 hover:text-gray-900">
                  FreeCAD Generator
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<TurbineDesigner />} />
            <Route path="/freecad" element={<FreeCADGenerator />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
