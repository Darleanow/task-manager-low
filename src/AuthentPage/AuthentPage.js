import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import "./AuthenPage.scss";

const AuthentPage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [canBeRedirected, setCanBeRedirected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedFullName = localStorage.getItem("fullName");
    if (savedEmail) setEmail(savedEmail);
    if (savedFullName) setFullName(savedFullName);

    if (savedEmail && savedFullName) {
      setCanBeRedirected(!canBeRedirected);
    }

    if (checkTokenValidity()) {
      fetchUserData();
    } else {
      setIsLogged(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3333/register", {
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
      handleLogin(e);
      setAlreadyRegistered(true);
    } else {
      const error = await response.text();
      console.error("Registration error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3333/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("tokenExpiry", Date.now() + 3600000); // 1 hour expiry
      localStorage.setItem("email", email);
      localStorage.setItem("fullName", fullName);
      setIsLogged(true);
      navigate("/projects");
    } else {
      // Handle errors
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setIsLogged(false);
    window.location.reload();
    navigate("/login");
  };

  const checkTokenValidity = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    return tokenExpiry && Date.now() <= parseInt(tokenExpiry);
  };

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3333/user", {
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
