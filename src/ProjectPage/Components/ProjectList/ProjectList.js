import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

import "./ProjectList.scss";

/**
 * ProjectList component fetches and displays a list of projects for a user.
 * It also periodically updates the list every 10 seconds.
 */
const ProjectList = () => {
  // Get user id from the Redux store
  const userId = useSelector((state) => state.auth.user.user_id);

  // Image to display when there are no projects
  const noProjectsIcon = process.env.PUBLIC_URL + "/images/NoProject.svg";

  // State to track if the user has projects and to store the projects
  const [hasProjects, setHasProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  // Function to fetch projects for the user
  const getUserProjects = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3333/projects/user_projects/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const projs = await response.json();
        setProjects(projs);
        setHasProjects(projs.length > 0);
      }
    } catch (err) {
      console.log("Error fetching projects: ", err);
    }
  }, [userId]);

  // useEffect to fetch projects on mount and at regular intervals
  useEffect(() => {
    getUserProjects();
    const interval = setInterval(getUserProjects, 10000);
    return () => clearInterval(interval);
  }, [getUserProjects, userId]);

  // Render the project list or a message if there are no projects
  return (
    <div className="pp-main_content">
      {hasProjects ? (
        // Mapping over projects to render each project
        <div className="pp-project_list">
          {projects.map((project) => (
            <div key={project.id} className="pp-project_child">
              {/* Project information */}
              <div className="pp-placeholder_projectIcon">
                <p className="pp-placeholder_text_icon">
                  {project.project_name.at(0)}
                </p>
              </div>
              <div className="pp-project_info">
                <div className="pp-project_title_and_favs">
                  <p className="pp-project_title">{project.project_name}</p>
                  <button
                    onClick={() => {
                      // Toggle favorite status
                      project.isFav = !project.isFav;
                    }}
                    className="pp-project_button_favorite"
                  >
                    {project.status === "Favori" ? (
                      <IoBookmark className="pp-project_favorite" />
                    ) : (
                      <IoBookmarkOutline className="pp-project_favorite" />
                    )}
                  </button>
                </div>
                <p className="pp-created_project_description">
                  {project.project_description}
                </p>
                <div className="pp-bottom_layout">
                  <hr className="pp-line_issues" />
                  <p className="pp-project_issues_total">
                    {project.tasks.length}{" "}
                    {project.tasks.length === 1 ? "issue" : "issues"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Display if there are no projects
        <div className="pp-empty_projects">
          <div className="pp-svg">
            <img src={noProjectsIcon} alt="Empty Projects" />
          </div>
          <div className="pp-empty_text">There are no projects created yet</div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
