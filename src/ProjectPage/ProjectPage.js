import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../Utils/Routing/store";

import { jwtDecode } from "jwt-decode";
import { checkTokenValidity, MinidenticonImg } from "../Utils/BulkUtilsImport";

import { FaCheck } from "react-icons/fa6";
import { IoIosAdd, IoMdClose } from "react-icons/io";

import Modal from "react-modal";
import TagsInput from "react-tagsinput";

import Notifications from "./Components/Notifications/Notifications";
import ProjectList from "./Components/ProjectList/ProjectList";
import Navbar from "./../Components/SlidingMenuBar/Navbar";

import "./ProjectPage.scss";

const ProjectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);

  const [fetchedUsers, setFetchedUsers] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);

  const userId = useSelector((state) => state.auth.user.user_id);

  const [tags, setTags] = useState([]);

  // This function will be called when a new tag is added
  const handleAddition = (newTags) => {
    setTags(newTags);
  };

  function setSelected(userId) {
    const newUsers = fetchedUsers.map((oldUser) => {
      if (oldUser.id === userId) {
        return { ...oldUser, isAdded: !oldUser.isAdded };
      }
      return oldUser;
    });
    setFetchedUsers(newUsers);
  }

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/get_all_users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const transformedUsers = data.map((user) => ({
          id: user.user_id,
          username: user.full_name,
          role: user.user_role || "User",
          photo:
            user.user_picture !== null ? (
              URL.createObjectURL(user.user_picture)
            ) : (
              <MinidenticonImg
                username={user.full_name}
                saturation="90"
                width="60"
                height="60"
              />
            ),
          isAdded: false,
        }));
        setFetchedUsers(transformedUsers);
      } else {
        // Handle response errors
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }

  function createProject() {
    setIsOpenCreateProject(true);
  }

  function closeProject() {
    setIsOpenCreateProject(false);
  }

  function addUsers() {
    setIsOpenAddUsers(true);
  }

  function closeAddUsers() {
    setIsOpenAddUsers(false);
  }

  async function createNewProject(name, description, users) {
    const userIds = users.map((user) => user.id);
    userIds.push(userId);

    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:3333/projects/add_project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_name: name,
          project_description: description,
          user_ids: userIds,
        }),
      });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    Modal.setAppElement("#root");

    fetchUsers();

    const token = localStorage.getItem("token");
    if (token && checkTokenValidity()) {
      const userDetails = jwtDecode(token);
      dispatch(login(userDetails));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

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
        <div className="pp-right_section">
         
          <div className="pp-profile_picture">
            <Notifications />
            <Navbar
              handleLogout={handleLogout}
              username={localStorage.getItem("fullName")}
            />
          </div>
        </div>
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
          <button className="pp-button" onClick={createProject}>
            New Project
          </button>
          <Modal
            isOpen={isOpenCreateProject}
            onRequestClose={closeProject}
            contentLabel="Create a Project"
            className={"pp-modal"}
            overlayClassName={"pp-modal_overlay"}
          >
            <div className="pp-project_content">
              <form className="pp-add_project_form">
                <input
                  type="text"
                  placeholder="Project Name"
                  className="pp-project_name"
                  id="project_title"
                  spellCheck="false"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
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
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                  />
                  <fieldset className="pp-fieldset_border">
                    <legend>
                      <button
                        type="button"
                        className="pp-add_members_button"
                        onClick={addUsers}
                      >
                        Add members
                      </button>
                      <Modal
                        isOpen={isOpenAddUsers}
                        onRequestClose={closeAddUsers}
                        contentLabel="Add users"
                        className={"pp-modal_add_users"}
                        overlayClassName={"pp-modal_overlay_add_users"}
                      >
                        <div className="pp-modal_users_layout">
                          <div className="pp-modal_users_title">
                            <div className="pp-modal_title_text">
                              Add project members
                            </div>
                            <div
                              className="pp-modal_users_icon"
                              onClick={closeAddUsers}
                            >
                              <IoMdClose className="pp-modal_users_icon" />
                            </div>
                          </div>
                          <hr className="pp-user_layout_line" />
                          <div className="pp-modal_users_add_email_container">
                            <div className="pp-modal_users_add_email">
                              Member email
                            </div>
                            <div className="pp-add_user_email">
                              <TagsInput
                                value={tags}
                                onChange={handleAddition}
                                onlyUnique
                                inputProps={{ placeholder: "Add emails" }}
                              />
                              <button className="pp-send_email_invites">
                                Send invites
                              </button>
                            </div>
                          </div>
                          <div className="pp-modal_users_add_email">
                            Existing members
                          </div>
                          <div>
                            <div className="pp-fetched_users_container">
                              {fetchedUsers ? (
                                fetchedUsers.map((user) => (
                                  <div
                                    className="pp-user_fetched"
                                    onClick={() => {
                                      setSelected(user.id);
                                    }}
                                  >
                                    <div className="pp-user_icon">
                                      {user.photo}
                                    </div>
                                    <div className="pp-user_info">
                                      <div className="pp-user_name_modal">
                                        {user.username}
                                      </div>
                                      <div className="pp-user_role_modal">
                                        {user.role}
                                      </div>
                                    </div>
                                    {user.isAdded ? (
                                      <FaCheck className="pp-added_icon" />
                                    ) : (
                                      <IoIosAdd className="pp-add_icon" />
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="pp-only_user">
                                  You're the only user in the system right now !
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="pp-container_validate_users">
                            <button
                              type="button"
                              onClick={closeAddUsers}
                              className="pp-cancel_button"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              className="pp-add_users_validate"
                              onClick={() => {
                                closeAddUsers();
                                setProjectUsers(
                                  fetchedUsers.filter((user) => user.isAdded)
                                );
                              }}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </Modal>
                    </legend>
                    {projectUsers.length > 0 ? (
                      <div className="pp-users_added_project">
                        {projectUsers.slice(0, 3).map((user, index) => (
                          <div className="pp-user_container" key={index}>
                            <div className="pp-user_picture">{user.photo}</div>
                            <div className="pp-user_name">{user.username}</div>
                          </div>
                        ))}
                        {projectUsers.length > 3 && (
                          <div className="pp-more_users">
                            et {projectUsers.length - 3} de plus...
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pp-no_added_users">Add a user!</div>
                    )}
                  </fieldset>
                </div>
              </form>
              <div className="pp-save_project_create">
                <button
                  onClick={closeProject}
                  className="pp-project_create_close"
                >
                  close
                </button>
                <button
                  onClick={() => {
                    closeProject();
                    createNewProject(
                      projectName,
                      projectDescription,
                      projectUsers
                    );
                  }}
                  className="pp-project_create_save"
                >
                  Create project
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
      <ProjectList />
    </div>
  );
};

export default ProjectPage;
