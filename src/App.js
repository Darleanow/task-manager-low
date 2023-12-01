import "./App.scss";
import ProjectPage from "./ProjectPage/ProjectPage";

const noProjects = process.env.PUBLIC_URL + "/images/NoProject.svg";

const projects = [
  {
    name: "Project 1",
    description:
      "Here’s a sample description that gets cut if it’s too long, but it needs to be really long",
    issue_count: 40,
    isFav: true,
  },

  {
    name: "Bootstrap",
    description:
      "Bootstrap is a project that brings the css wrapper already huge, to another leve...",
    issue_count: 0,
    isFav: false,
  },

  {
    name: "Bootstrap 2",
    description:
      "Bootstrap is a project that brings the css wrapper already huge, to another leve...",
    issue_count: 0,
    isFav: false,
  }
];

const App = () => {
  const hasProjects = true;

  return (
    <div className="a-main_window">
      <div className="a-main_project_bar">
        <div className="a-logo">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="49"
            height="42"
            viewBox="0 0 49 42"
            fill="none"
          >
            <path d="M24.5 0L48.3157 41.25H0.684301L24.5 0Z" fill="#D9D9D9" />
          </svg>
        </div>
        <div className="a-title">Projects</div>
        <div className="a-profile"></div>
      </div>
      <div className="a-second_bar">
        <div className="a-dropdown">
          <select name="visibility_filter" id="visibility_filter">
            <option value="all">All</option>
          </select>
        </div>

        <div className="a-search_input">
          <input
            type="text"
            className="a-input_content"
            placeholder="Search or filter..."
          />
        </div>

        <div className="a-new_project_button">
          <button className="a-button">New Project</button>
        </div>
      </div>
      <div className="a-main_content">
        {hasProjects ? (
          <div className="a-project_list">
            {projects.map((project) => (
              <div key={project.id}>
                <div className="a-project_child">
                  <p>{project.name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="a-empty_projects">
            <div className="a-svg">
              <img src={noProjects} alt="Empty Projects" />
            </div>
            <div className="a-empty_text">
              There are no projects created yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
