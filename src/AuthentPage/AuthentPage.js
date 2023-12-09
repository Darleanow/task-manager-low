import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { login } from "../Utils/Routing/store";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import { jwtDecode } from "jwt-decode";
import { HashLoader } from "react-spinners";

import "./AuthenPage.scss";

const AuthentPage = () => {
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [canBeRedirected, setCanBeRedirected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [setUserData] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const delay = 2000;

    const savedEmail = localStorage.getItem("email");
    const savedFullName = localStorage.getItem("fullName");
    if (savedEmail) setEmail(savedEmail);
    if (savedFullName) setFullName(savedFullName);

    if (savedEmail && savedFullName) {
      setCanBeRedirected(!canBeRedirected);
    }

    const token = localStorage.getItem("token");
    if (token) {
      if (checkTokenValidity()) {
        const userDetails = jwtDecode(token);
        dispatch(login(userDetails));
        setTimeout(() => {
          setIsLoading(false);
          navigate("/projects");
        }, delay);
      } else {
        // Token is invalid
        setIsLoading(false);
      }
    } else {
      // No token found
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3333/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName,
        email: email,
        password: password,
      }),
    });
    if (response.ok) {
      dispatch(login());
      handleLogin(e);
      setAlreadyRegistered(true);
    } else {
      const error = await response.text();
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3333/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      const userDetails = jwtDecode(data.token); // Decode JWT to get user details
      dispatch(login(userDetails));
      navigate("/projects");
    } else {
      // Handle errors
    }
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3333/users/get_user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        console.error("Error fetching user data");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="ap-loading">
        <HashLoader color="#7071E8" size={120} />
      </div>
    );
  }

  // Render logic
  if ((alreadyRegistered || (fullName && email)) && canBeRedirected) {
    return (
      <div>
        <div className="ap-main_content">
          <div className="ap-welcome">
            <div className="ap-icon_container">
              <div class="ap-icon"></div>
            </div>
            <div className="ap-text_container">
              {fullName ? (
                <>
                  <div className="ap-welcome_title ap-bigger_margin">
                    Welcome back,
                  </div>
                  <div className="ap-info_text">{fullName}</div>
                </>
              ) : (
                <p className="ap-welcome_title ap-bigger_margin">
                  Welcome back !
                </p>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="ap-form">
          <div className="ap-labels">
            {email ? null : (
              <label for="mail" className="ap-label">
                Email
              </label>
            )}
            <label for="password" className="ap-label">
              Password
            </label>
          </div>
          <div className="ap-input_container">
            {email ? null : (
              <input
                type="email"
                id="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="ap-input_form"
              />
            )}
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="ap-input_form"
            />
          </div>
          <button type="submit" className="ap-submit_form">
            Login <FaArrowRightLong className="ap-arrow_icon" />
          </button>
        </form>
        <div className="ap-already_registered">
          <button
            onClick={() => {
              setAlreadyRegistered(false);
              setCanBeRedirected(!canBeRedirected);
            }}
            className="ap-button_log_in"
          >
            Click here to register
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="ap-main_content">
          <div className="ap-welcome">
            <div className="ap-icon_container">
              <div class="ap-icon"></div>
            </div>
            <div className="ap-text_container">
              <div className="ap-welcome_title">Welcome</div>
              <div className="ap-info_text">
                Get started by creating an account
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleRegister} className="ap-form">
          <div className="ap-labels">
            <label for="full_name" className="ap-label">
              Full Name
            </label>
            <label for="mail" className="ap-label">
              Email
            </label>
            <label for="password" className="ap-label">
              Password
            </label>
            <label for="confirmPass" className="ap-label">
              Confirm Password
            </label>
          </div>
          <div className="ap-input_container">
            <input
              type="text"
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="ap-input_form"
            />
            <input
              type="email"
              id="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="ap-input_form"
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="ap-input_form"
            />
            <input
              type="password"
              id="confirmPass"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              placeholder="Confirm Password"
              className="ap-input_form"
            />
          </div>
          <button type="submit" className="ap-submit_form">
            Register <FaArrowRightLong className="ap-arrow_icon" />
          </button>
        </form>

        <div className="ap-already_registered">
          <button
            onClick={() => {
              setAlreadyRegistered(true);
              setCanBeRedirected(!canBeRedirected);
            }}
            className="ap-button_log_in"
          >
            Click here to log in
          </button>
        </div>
      </>
    );
  }
};

export default AuthentPage;
