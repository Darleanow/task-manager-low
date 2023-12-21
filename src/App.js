import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './Utils/Routing/store';
import ProtectedRoute from "./Utils/Routing/ProtectedRoute";
import ProjectPage from "./ProjectPage/ProjectPage";
import TasksPage from "./TasksPage/TasksPage";
import AuthentPage from "./AuthentPage/AuthentPage";

const App = () => {
  return (
    <Router>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<AuthentPage />} />
          <Route path="/projects" element={<ProtectedRoute />}>
            <Route index element={<ProjectPage />} />
            <Route path=":projectId" element={<TasksPage />} />
          </Route>
        </Routes>
      </PersistGate>
    </Router>
  );
};

export default App;
