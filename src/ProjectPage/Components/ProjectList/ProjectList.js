import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import "./ProjectList.scss";

/**
 * Component to display and manage a list of projects.
 * It fetches the user's projects from an API, allows setting projects as favorites,
 * and updates the list every 10 seconds.
 */
const ProjectList = () => {
  const userId = useSelector((state) => state.auth.user.user_id);
  const noProjectsIcon = process.env.PUBLIC_URL + "/images/NoProject.svg";
  const [hasProjects, setHasProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  /**
   * Fetches the current user's projects from the server.
   * Sorts the projects based on their 'favorite' status and updates component state.
   * @async
   */
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
        const sortedProjects = projs.sort((a, b) =>
          a.status === "Favori" ? -1 : b.status === "Favori" ? 1 : 0
        );
        setProjects(sortedProjects);
        setHasProjects(projs.length > 0);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  }, [userId]);

  /**
   * Updates the 'favorite' status of a project for the user.
   * @param {string} projectId - The ID of the project to update.
   * @param {boolean} isFavourite - New 'favorite' status of the project.
   * @async
   */
  const setProjectAsFavourite = useCallback(
    async (projectId, isFavourite) => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `http://localhost:3333/projects/set_favourite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              user_id: userId,
              project_id: projectId,
              is_favourite: isFavourite,
            }),
          }
        );

        if (response.ok) {
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project.id === projectId
                ? { ...project, isFav: isFavourite }
                : project
            )
          );
          getUserProjects();
        }
      } catch (err) {
        console.error("Error setting project as favorite:", err);
      }
    },
    [getUserProjects, userId]
  );

  useEffect(() => {
    getUserProjects();
    const interval = setInterval(getUserProjects, 10000);
    return () => clearInterval(interval);
  }, [getUserProjects]);

  return (
    <div className="pl-main_content">
      {hasProjects ? (
        <div className="pl-project_list">
          {projects.map((project) => (
            <div key={project.project_id} className="pl-project_child">
              <div className="pl-placeholder_projectIcon">
                <p className="pl-placeholder_text_icon">
                  {project.project_name.at(0).toUpperCase()}
                </p>
              </div>
              <div className="pl-project_info">
                <div className="pl-project_title_and_favs">
                  <p className="pl-project_title">{project.project_name}</p>
                  <button
                    onClick={() =>
                      setProjectAsFavourite(
                        project.project_id,
                        project.status !== "Favori"
                      )
                    }
                    className="pl-project_button_favorite"
                  >
                    {project.status === "Favori" ? (
                      <IoBookmark className="pl-project_favorite" />
                    ) : (
                      <IoBookmarkOutline className="pl-project_favorite" />
                    )}
                  </button>
                </div>
                <p className="pl-created_project_description">
                  {project.project_description}
                </p>
                <div className="pl-bottom_layout">
                  <hr className="pl-line_issues" />
                  <p className="pl-project_issues_total">
                    {project.tasks.length}{" "}
                    {project.tasks.length === 1 ? "issue" : "issues"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pl-empty_projects">
          <img src={noProjectsIcon} alt="Empty Projects" />
          <div className="pl-empty_text">There are no projects created yet</div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
