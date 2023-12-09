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
import { MinidenticonImg } from "../Utils/BulkUtilsImport";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";
import TagsInput from "react-tagsinput";
import { FaBell, FaRegBell, FaCircle, FaRegCircle } from "react-icons/fa6";
import { IoIosAdd } from "react-icons/io";
import { MdOutlineMarkChatRead } from "react-icons/md";
import "./ProjectPage.scss";

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const noProjects = process.env.PUBLIC_URL + "/images/NoProject.svg";

const ProjectPage = () => {
  const hasProjects = false;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isOpenCreateProject, setIsOpenCreateProject] = useState(false);
  const [isOpenAddUsers, setIsOpenAddUsers] = useState(false);

  const [fetchedUsers, setFetchedUsers] = useState([]);
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

  // This function will be called when a tag is removed
  const handleDelete = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
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
      if (response.ok) {
        const notifications = await response.json();
        const fetchedNotifications = notifications.map((notification) => ({
          notification_id: notification.notification_id,
          notification_text: notification.notification_text,
          is_read: notification.is_read,
          date: notification.creation_date,
        }));
        setNotifications(fetchedNotifications);
        console.log(
          "Notifications" + JSON.stringify(fetchedNotifications, null, 2)
        );
      } else {
        console.error("Failed to fetch notifications");
      }
    } catch (error) {
      console.log("Error fetching notifications: " + error);
    }
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
        }));
        console.log("users" + JSON.stringify(transformedUsers, null, 2));
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

  const getUserProjects = ({ userId }) => {
    return fetch(`projects/user_projects/${userId}`)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    Modal.setAppElement("#root");

    fetchUsers();
    fetchNotification();

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
        <div className="pp-right_section">
          <div className="pp-notifications_container">
            {dropdownOpen ? (
              <FaBell
                onClick={toggleDropdown}
                className="pp-notifications_icon"
              />
            ) : (
              <FaRegBell
                onClick={toggleDropdown}
                className="pp-notifications_icon"
              />
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
                {notifications.map((notification, index) => (
                  <>
                    <div
                      key={index}
                      className="pp-notification_item"
                      onClick={() => {
                        notification.is_read = true;
                        readNotification(notification.notification_id);
                      }}
                    >
                      {notification.is_read ? <FaRegCircle /> : <FaCircle />}
                      {notification.notification_text}
                    </div>
                  </>
                ))}
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
                          {fetchedUsers ? (
                            fetchedUsers.map((user) => (
                              <div className="pp-user_fetched">
                                <div className="pp-user_icon">{user.photo}</div>
                                <div className="pp-user_info">
                                  <div className="pp-user_name_modal">
                                    {user.username}
                                  </div>
                                  <div className="pp-user_role_modal">
                                    {user.role}
                                  </div>
                                </div>
                                <IoIosAdd className="pp-add_icon" />
                              </div>
                            ))
                          ) : (
                            <div className="pp-only_user">
                              You're the only user right now !
                            </div>
                          )}
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
            <button onClick={closeProject}>close</button>
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
              <img src={noProjects} alt="Empty Projects" draggable="false" />
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
