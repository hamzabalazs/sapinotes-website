import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function loginUser(email, password) {
  let url =
    "https://localhost:7214/api/Users/login?email=" +
    email +
    "&password=" +
    password;
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(data => data.json());
}

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  });

  const GoToRegister = async e => {
    e.preventDefault();
    navigate("/register");
  };

  const Submit = async e => {
    e.preventDefault();
    const response = await loginUser(email, password);
    if (response.username != null) {
      localStorage.setItem("user-info", JSON.stringify(response));
      navigate("/");
    } else alert("Wrong credentials!");
  };

  return (
    <div className="bodydiv">
      <h1>SapiNotes</h1>
      <div className="col-sm-6 offset-sm-3">
        <label>Email Address</label>
        <input
          type="text"
          placeholder="email"
          onChange={e => setEmail(e.target.value)}
          className="form-control"
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          onChange={e => setPassword(e.target.value)}
          className="form-control"
        />
        <br />
        <p onClick={GoToRegister}>Don't have an account? Register now!</p>
        <button onClick={Submit} className="btn btn-primary">
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
