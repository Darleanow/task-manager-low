import "./App.scss";
import ProjectPage from "./ProjectPage/ProjectPage";
const App = () => {
  const hasProjects = false;

  return (
    <div className="App">
      <div className="flex-container header"></div>
      <div className="flex-container body">
        <div className="body-header">
          <div className="all-projects-title">All Projects</div>
          <div className="new-project-button">New Project</div>
        </div>
        <div className="body-content">
          {hasProjects ? (
            // Display this if there are projects
            <p>Test</p>
          ) : (
            <>
              <div className="content-left">
                <img src="/images/3d-boy.png" alt="3D Boy" />
              </div>
              <div className="content-right">
                <p className="a-text_centered">No projects yet.</p>
                <br />
                <p className="a-text_centered">Create one!</p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex-container footer">
        All rights reserved to Damien & Enzo. 2023.
      </div>
    </div>
  );
};

export default App;
