import React, { useEffect, useState, useReducer } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import OwnNoteList from "./OwnNoteList";

function Notes() {
  const [noteList, setNoteList] = useState([]);
  const [reducerValue, forceUpdate] = useReducer(x => x + 1, 0);
  const getNoteList = async userId => {
    let url =
      "https://localhost:7214/api/Notes/get-notes-of-user?userId=" + userId;
    fetch(url)
      .then(response => response.json())
      .then(output => {
        setNoteList(output);
        forceUpdate();
      });
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user-info"));
      getNoteList(user.userID);
    }
  }, [reducerValue]);

  return (
    <div>
      <Header />
      <div className="bodydiv-with-nav">
        <h2>Your Notes</h2>
        <OwnNoteList noteList={noteList} />
      </div>
    </div>
  );
}

export default Notes;
