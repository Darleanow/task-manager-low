import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./Utils/Routing/ProtectedRoute";
import ProjectPage from "./ProjectPage/ProjectPage";
import TasksPage from "./TasksPage/TasksPage";
import AuthentPage from "./AuthentPage/AuthentPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthentPage />} />
        <Route path="/projects" element={<ProtectedRoute />}>
          <Route index element={<ProjectPage />} />
          <Route path=":projectId/tasks" element={<TasksPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
