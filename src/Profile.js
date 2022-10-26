import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import validator from "validator";

async function UpdateUser(userID, email, password, username) {
  let url =
    "https://localhost:7214/api/Users/update-user?id=" +
    userID +
    "&email=" +
    email +
    "&password=" +
    password +
    "&username=" +
    username;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function Profile() {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  let userID = 0;
  userID = JSON.parse(localStorage.getItem("user-info")).userID.toString();

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    }
    if (localStorage.getItem("user-info")) {
      const currentUser = JSON.parse(localStorage.getItem("user-info"));

      let currUsername = currentUser.username.toString();
      let currEmail = currentUser.email.toString();
      setUsername(currUsername);
      setEmail(currEmail);
    }
  }, []);

  const Update = async e => {
    e.preventDefault();
    if (validator.isEmail(email)) {
      if (password.length > 7) {
        if (username.length > 3) {
          await UpdateUser(userID, email, password, username);
          let item = { userID, username, email, password };
          localStorage.setItem("user-info", JSON.stringify(item));
          navigate("/");
        } else alert("Username has to be more than 3 characters in length!");
      } else alert("Password has to be more than 7 characters in length!");
    } else alert("Email format is wrong!");
  };

  return (
    <div>
      <Header />
      <div className="bodydiv-with-nav">
        <h2>Update your profile</h2>
        <div className="col-sm-6 offset-sm-3">
          <label>Username</label>
          <input
            type="text"
            placeholder={username}
            onChange={e => setUsername(e.target.value)}
            className="form-control"
          />
          <br />
          <label>Email Address</label>
          <input
            type="text"
            placeholder={email}
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
          <button onClick={Update} className="btn btn-primary">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
