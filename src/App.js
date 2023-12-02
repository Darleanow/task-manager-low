import React, { useEffect, useState } from "react";

const App = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!checkTokenValidity()) {
      setIsLogged(false);
    }
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
      setIsLogged(true);
    } else {
      // Handle errors
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setIsLogged(false);
    window.location.reload();
  };
  

  const checkTokenValidity = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    return tokenExpiry && Date.now() <= parseInt(tokenExpiry);
  };

  // Render logic
  if (isLogged || checkTokenValidity()) {
    return (
      <div className="a-main_content">
        Hello
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  } else if (alreadyRegistered) {
    return (
      <div>
        Please Log In
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        Welcome
        <form onSubmit={handleRegister}>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }
};

export default App;
