import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectPage from "./ProjectPage/ProjectPage";
import TasksPage from "./TasksPage/TasksPage";
import AuthentPage from "./AuthentPage/AuthentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthentPage />} />
        <Route path="projects" element={<ProjectPage />} />
        <Route path="projects/dashboard" element={<TasksPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
