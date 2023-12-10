import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Utils/Routing/store";
import { useEffect, useState } from "react";
import { login } from "../Utils/Routing/store";
import { jwtDecode } from "jwt-decode";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import Modal from "react-modal";
import { MinidenticonImg } from "../Utils/BulkUtilsImport";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import TagsInput from "react-tagsinput";
import {
  FaBell,
  FaRegBell,
  FaCircle,
  FaRegCircle,
  FaCheck,
} from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineMarkChatRead } from "react-icons/md";
import "./ProjectPage.scss";
import ProjectList from "./Components/ProjectList/ProjectList";

const ProjectPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);

  const [fetchedUsers, setFetchedUsers] = useState([]);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);

  const [notifications, setNotifications] = useState([]);

  const userId = useSelector((state) => state.auth.user.user_id);

  const [tags, setTags] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // This function will be called when a new tag is added
  const handleAddition = (newTags) => {
    setTags(newTags);
  };

  async function fetchNotification() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/get_notifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (response.ok && response.status !== 201) {
        const notifications = await response.json();
        const fetchedNotifications = notifications.map((notification) => ({
          notification_id: notification.notification_id,
          notification_text: notification.notification_text,
          is_read: notification.is_read,
          date: notification.creation_date,
        }));
        setNotifications(fetchedNotifications);
      } else if (response.status === 201) {
        setNotifications([]);
      } else {
        console.error("Erreur lors de la récupération des notifications");
      }
    } catch (error) {
      console.error("Erreur de réseau ou autre erreur", error);
    }
  }

  function setSelected(userId) {
    const newUsers = fetchedUsers.map((oldUser) => {
      if (oldUser.id === userId) {
        return { ...oldUser, isAdded: !oldUser.isAdded };
      }
      return oldUser;
    });
    setFetchedUsers(newUsers);
  }

  async function readNotification(notification_id) {
    const updatedNotifications = notifications.map((notification) => {
      if (notification.notification_id === notification_id) {
        return { ...notification, is_read: true };
      }
      return notification;
    });

    setNotifications(updatedNotifications);

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/read_notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            notification_id: notification_id,
          }),
        }
      );
      if (response.ok) {
        console.log("GJ");
      } else {
        // Handle response errors
        console.error("Failed to read (u gotta be kidding)");
      }
    } catch (error) {
      console.log("Wtf have u done ?");
    }
  }

  async function readAllNotifications() {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/read_all_notifications",
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
        console.log("GJ");
      } else {
        // Handle response errors
        console.error("Failed to read all (u gotta be kiddingx2)");
      }
    } catch (error) {
      console.log("Wtf have u done ?");
    }
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

  //Polling for notifications
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotification();
    }, 10000); // Asks every 10 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    Modal.setAppElement("#root");

    fetchNotification();

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
          <div className="pp-notifications_container">
            {dropdownOpen ? (
              <>
                <FaBell
                  onClick={toggleDropdown}
                  className="pp-notifications_icon"
                />
                {notifications.some((notification) => !notification.is_read) ? (
                  <FaCircle className="pp-notification_circle" />
                ) : null}
              </>
            ) : (
              <>
                <FaRegBell
                  onClick={toggleDropdown}
                  className="pp-notifications_icon"
                />
                {notifications.some((notification) => !notification.is_read) ? (
                  <FaCircle className="pp-notification_circle" />
                ) : null}
              </>
            )}

            {dropdownOpen && (
              <div className="pp-notification-dropdown">
                <div className="pp-notifications_title">
                  Notifications
                  <MdOutlineMarkChatRead
                    className="pp-mark_read"
                    onClick={() => {
                      readAllNotifications();
                    }}
                  />
                </div>
                <hr className="pp-separator_notifications" />
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <>
                      <div
                        key={index}
                        className="pp-notification_item"
                        onClick={() => {
                          notification.is_read = true;
                          readNotification(notification.notification_id);
                        }}
                      >
                        {notification.is_read ? (
                          <FaRegCircle className="pp-notification_status" />
                        ) : (
                          <FaCircle className="pp-notification_status_active" />
                        )}
                        {notification.notification_text}
                      </div>
                    </>
                  ))
                ) : (
                  <div className="pp-align_clear">
                    <p>All clear !</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <button onClick={handleLogout}>Log out</button>
          <div className="pp-profile"></div>
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
                      <>
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
                      </>
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
      <ProjectList user_id_prop={userId} />
    </div>
  );
};

export default ProjectPage;
