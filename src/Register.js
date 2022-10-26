import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";

async function RegisterUser(username, email, password) {
  let url = "https://localhost:7214/api/Users/add-new-user";
  let item = { username, email, password };
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then(data => data.json());
}

function Register() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/");
    }
  });

  const GoToLogin = async e => {
    e.preventDefault();
    navigate("/login");
  };

  const Submit = async e => {
    e.preventDefault();
    if (validator.isEmail(email)) {
      if (password.length > 7) {
        if (username.length > 3) {
          const response = await RegisterUser(username, email, password);
          if (response.code === 200) {
            navigate("/login");
          } else alert("An error has occured while adding user!");
        } else alert("Username has to be more than 3 characters in length!");
      } else alert("Password has to be more than 7 characters in length!");
    } else alert("Email format is wrong!");
  };

  return (
    <div className="bodydiv">
      <h1>SapiNotes</h1>
      <div className="col-sm-6 offset-sm-3">
        <label>Username</label>
        <input
          type="text"
          placeholder="username"
          onChange={e => setUsername(e.target.value)}
          className="form-control"
        />
        <br />
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
        <p onClick={GoToLogin}>Already have an account? Click here to login</p>
        <br />
        <button onClick={Submit} className="btn btn-primary">
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
