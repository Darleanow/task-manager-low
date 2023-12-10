import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";

const ProjectList = () => {
  const userId = useSelector((state) => state.auth.user.user_id);

  const noProjectsIcon = process.env.PUBLIC_URL + "/images/NoProject.svg";

  const [hasProjects, setHasProjects] = useState(false);
  const [projects, setProjects] = useState([]);

  const getUserProjects = async (userId) => {
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
      console.log(err);
    }
  };

  useEffect(() => {
    getUserProjects(userId);

    const interval = setInterval(() => {
      getUserProjects(userId);
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="pp-main_content">
      {hasProjects ? (
        <div className="pp-project_list">
          {projects.map((project) => (
            <div key={project.id}>
              <div className="pp-project_child">
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
                        project.isFav = !project.isFav;
                      }}
                    >
                      {project.status === "Favori" ? (
                        <IoBookmark />
                      ) : (
                        <IoBookmarkOutline />
                      )}
                    </button>
                  </div>
                  <p className="pp-project_description">
                    {project.project_description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pp-empty_projects">
          <div className="pp-svg">
            <img src={noProjectsIcon} alt="Empty Projects" draggable="false" />
          </div>
          <div className="pp-empty_text">There are no projects created yet</div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
