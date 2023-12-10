import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { login } from "../Utils/Routing/store";
import {
  makeErrorToast,
} from "../Utils/Misc/ToastsTools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./AuthenPage.scss";

const AuthentPage = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [canBeRedirected, setCanBeRedirected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isMatchingPassword, setIsMatchingPassword] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidAuth, setIsValidAuth] = useState(false);

  useEffect(() => {
    const validPasswordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,}$/;

    const validEmailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    let passwordIsValid = false;
    let matchingPasswordIsValid = false;
    let emailIsValid = false;

    if (password.length > 0) {
      if (!validPasswordRegex.test(password)) {
        setPasswordErrorMessage(
          "Password should be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
        );

        if (formSubmitted) {
          makeErrorToast(passwordErrorMessage, "passwordToastId");
          setFormSubmitted(false);
        }
      } else if (password !== confirmedPassword) {
        passwordIsValid = true;
        setPasswordErrorMessage("Passwords don't match");

        if (formSubmitted) {
          makeErrorToast(passwordErrorMessage, "matchingPasswordToastId");
          setFormSubmitted(false);
        }
      } else {
        passwordIsValid = true;
        matchingPasswordIsValid = true;
      }
    } else if (
      confirmedPassword.length > 0 ||
      (password.length === 0 && confirmedPassword.length === 0)
    ) {
      setPasswordErrorMessage("Password is required");

      if (formSubmitted) {
        makeErrorToast(passwordErrorMessage, "passwordToastId");
        setFormSubmitted(false);
      }
    }

    if (email.length > 0 && !validEmailRegex.test(email)) {
      if (formSubmitted) {
        setEmailErrorMessage("Please enter a valid email address.");
        makeErrorToast(emailErrorMessage, "emailToastId");
        setFormSubmitted(false);
      }
    } else if (email.length === 0) {
      setEmailErrorMessage("Email is required");

      if (formSubmitted) {
        makeErrorToast(emailErrorMessage, "emailToastId");
        setFormSubmitted(false);
      }
    } else {
      emailIsValid = true;
    }

    setIsValidPassword(passwordIsValid);
    setIsMatchingPassword(matchingPasswordIsValid);
    setIsValidEmail(emailIsValid);
  }, [
    password,
    confirmedPassword,
    email,
    isValidEmail,
    emailErrorMessage,
    formSubmitted,
    passwordErrorMessage,
  ]);

  useEffect(() => {
    setIsValidAuth(isValidEmail && isValidPassword && isMatchingPassword);
  }, [isValidEmail, isValidPassword, isMatchingPassword]);

  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    setFormSubmitted(true);
    console.log("Auth :", isValidAuth);
    console.log("Email : ", isValidEmail);
    console.log("Password :", isValidPassword);
    if (isValidAuth) {
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
        dispatch(login());
        handleLogin(e);
        setAlreadyRegistered(true);
      } else {
        const error = await response.text();
        console.error("Registration error:", error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setPasswordErrorMessage(
      "Password should be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
    setEmailErrorMessage("Please enter a valid email address.");
    setFormSubmitted(true);
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
      dispatch(login());
      navigate("/projects");
    } else {
      // Handle errors
    }
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
              className={`ap-input_form ${
                !isValidEmail && email.length >= 1
                  ? "invalid"
                  : isValidEmail && email.length >= 1
                  ? "valid"
                  : ""
              }`}
            />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`ap-input_form ${
                !isValidPassword &&
                confirmedPassword.length === 0 &&
                password.length > 0
                  ? "invalid"
                  : !isValidPassword &&
                    confirmedPassword.length > 0 &&
                    !isMatchingPassword
                  ? "invalid"
                  : isValidPassword &&
                    confirmedPassword.length === 0 &&
                    password.length > 0
                  ? "valid"
                  : isValidPassword &&
                    confirmedPassword.length > 0 &&
                    !isMatchingPassword
                  ? "not-matching"
                  : isValidPassword &&
                    confirmedPassword.length > 0 &&
                    isMatchingPassword
                  ? "valid"
                  : ""
              }`}
            />
            <input
              type="password"
              id="confirmPass"
              value={confirmedPassword}
              onChange={(e) => setConfirmedPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`ap-input_form ${
                isValidPassword &&
                !isMatchingPassword &&
                confirmedPassword.length > 0
                  ? "not-matching"
                  : isValidPassword &&
                    isMatchingPassword &&
                    confirmedPassword.length > 0
                  ? "valid"
                  : ""
              }`}
            />
          </div>
          <ToastContainer limit={3} />
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
