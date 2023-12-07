import TasksPage from "../TasksPage/TasksPage";
import { useNavigate } from "react-router-dom";
import { IoBookmark } from "react-icons/io5";
import { IoBookmarkOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { logout } from "../Utils/Routing/store";
import { useEffect, useState } from "react";
import { login } from "../Utils/Routing/store";
import { jwtDecode } from "jwt-decode";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import Modal from "react-modal";

import "./ProjectPage.scss";

const noProjects = process.env.PUBLIC_URL + "/images/NoProject.svg";

const ProjectPage = () => {
  const hasProjects = false;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalIsOpen, setIsOpen] = useState(false);

  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    const response = await fetch("http://localhost:3333/users/get_users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "" }),
    });

    if (response.ok) {
      const data = response.json();
      const transformedUsers = data.map((user) => ({
        username: user.user_name,
        role: user.user_role,
        photo: URL.createObjectURL(user.user_picture),
      }));
      setUsers(transformedUsers);
    }
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getUserProjects = ({ userId }) => {
    return fetch(`projects/user_projects/${userId}`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    Modal.setAppElement("#root");
    const token = localStorage.getItem("token");
    if (token && checkTokenValidity()) {
      const userDetails = jwtDecode(token);
      dispatch(login(userDetails));
    }
  }, [dispatch]);

  // useEffect(() => {
  //   getUserProjects();
  // },[]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    window.location.reload();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="pp-main_window">
      <div className="pp-main_project_bar">
        <div className="pp-logo">
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
        <div className="pp-title">Projects</div>
        <button onClick={handleLogout}>Log out</button>
        <div className="pp-profile"></div>
      </div>
      <div className="pp-second_bar">
        <div className="pp-dropdown">
          <select name="visibility_filter" id="visibility_filter">
            <option value="ppll">All</option>
          </select>
        </div>

        <div className="pp-search_input">
          <input
            type="text"
            className="pp-input_content"
            placeholder="Search or filter..."
          />
        </div>

        <div className="pp-new_project_button">
          <button className="pp-button" onClick={openModal}>
            New Project
          </button>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Create a Project" // I don't know why we do need this
            className={"pp-modal"}
            overlayClassName={"pp-modal_overlay"}
          >
            <form className="pp-add_project_form">
              <input
                type="text"
                placeholder="ProjectName"
                className="pp-project_name"
                id="project_title"
                spellCheck="false"
              />
              <hr className="pp-line_form" />
              <div className="pp-content_form">
                <label for="project_description" className="pp-label_desc">
                  Description
                </label>
                <textarea
                  type="text"
                  placeholder="Enter your description..."
                  className="pp-project_description"
                  id="project_description"
                  spellCheck="false"
                />
                <fieldset>
                  <legend>
                    <button type="button">Add members</button>
                  </legend>
                </fieldset>
              </div>
            </form>
            <button onClick={closeModal}>close</button>
          </Modal>
        </div>
      </div>
      <div className="pp-main_content">
        {hasProjects ? (
          <div className="pp-project_list">
            {/* {projects.map((project) => (
              <div key={project.id}>
                <div className="pp-project_child">
                  <div className="pp-placeholder_projectIcon">
                    <p className="pp-placeholder_text_icon">
                      {project.name.at(0)}
                    </p>
                  </div>
                  <div className="pp-project_info">
                    <div className="pp-project_title_and_favs">
                      <p className="pp-project_title">{project.name}</p>
                      <button
                        onClick={() => {
                          project.isFav = !project.isFav;
                        }}
                      >
                        {project.isFav ? <IoBookmark /> : <IoBookmarkOutline />}
                      </button>
                    </div>
                    <p className="pp-project_description">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            ))} */}
          </div>
        ) : (
          <div className="pp-empty_projects">
            <div className="pp-svg">
              <img src={noProjects} alt="Empty Projects" />
            </div>
            <div className="pp-empty_text">
              There are no projects created yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
