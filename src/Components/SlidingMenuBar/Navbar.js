import React, { useState } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as Io5Icons from "react-icons/io5";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { IconContext } from "react-icons";
import { MinidenticonImg } from "../../Utils/BulkUtilsImport";

function Navbar({ handleLogout, username }) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        <div className="navbar">
          <Link to="#" className="menu-bars">
            <div className="project-page-icon" onClick={showSidebar}>
              <MinidenticonImg
                username={username}
                saturation="90"
                width="40"
                height="40"
                className={"n-minidenticon spacing"}
              />
            </div>
          </Link>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <div className="nav-menu-items" onClick={showSidebar}>
            <div className="navbar-top-row">
              <div className="navbar-profile-icon">
                <MinidenticonImg
                  username={username}
                  saturation="90"
                  width="40"
                  height="40"
                  className={"n-minidenticon spacing2"}
                />
              </div>
              <div className="navbar-username">{username}</div>
              <div className="navbar-toggle">
                <AiIcons.AiOutlineClose className="close-icon" />
              </div>
            </div>
            <div className="navbar-body">
              <div className="sectionDivider"></div>
              <div className="nav-text">
                <Link to="/projects">
                  <p className="nav-text-text">Edit profile picture</p>
                </Link>
              </div>
              <div className="nav-text">
                <Link to="/projects">
                  <p className="nav-text-text">Change username</p>
                </Link>
              </div>
              <div className="nav-text">
                <Link to="/projects">
                  <p className="nav-text-text">Reset password</p>
                </Link>
              </div>

              <div className="navbar-bottom-row">
                <div className="sectionDivider"></div>

                <div className="nav-text" onClick={handleLogout}>
                  <Link to="/">
                    <p className="nav-text-text">Sign Out</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
