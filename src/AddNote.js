import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";

async function PostNote(userID, username, subjectID, noteName, noteDocID) {
  let url = "https://localhost:7214/api/Notes/add-new-note";
  let item = { userID, username, subjectID, noteName, noteDocID };
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  }).then(data => data.json());
}

async function uploadDoc(pdfFile) {
  let url = "https://localhost:7214/api/Documents/upload";
  const data = new FormData();

  data.append("pdfFile", pdfFile);

  const result = await axios.post(url, data);

  return result.data.documentID;
}

function AddNote() {
  const [pdfFile, setPdfFile] = useState();
  const [noteName, setNoteName] = useState();
  const [subject, setSubject] = useState();
  const [major, setMajor] = useState();
  const [subjectList, setSubjectList] = useState([]);
  const [majorList, setMajorList] = useState([]);

  const getMajorList = async () => {
    let url = "https://localhost:7214/api/Majors/getmajors";
    fetch(url)
      .then(response => response.json())
      .then(output => {
        setMajorList([...majorList, ...output]);
      });
  };

  const getSubjectList = async majorId => {
    let url =
      "https://localhost:7214/api/Subjects/get-subjects-of-major?majorId=" +
      majorId;
    fetch(url)
      .then(response => response.json())
      .then(output => {
        setSubjectList([...subjectList, ...output]);
      });
  };

  const fillSubjectDropdown = () => {
    if (major !== undefined) {
      let id = major.majorID;
      getSubjectList(id);
    } else getSubjectList(0);
  };

  const emptySubjectList = () => {
    setSubjectList([]);
  };

  const navigate = useNavigate();
  useEffect(() => {
    getMajorList();

    if (!localStorage.getItem("user-info")) {
      navigate("/login");
    }
    /*return () => {
      if (localStorage.getItem("user-info"))
        localStorage.removeItem("user-info");
    };*/
  }, []);

  const Add = async e => {
    e.preventDefault();
    let user = JSON.parse(localStorage.getItem("user-info"));
    const userID = user.userID;
    const username = user.username;
    const subjectID = subject.subjectID;
    const noteDocID = await uploadDoc(pdfFile);
    console.log(noteDocID);
    if (
      noteDocID !== 0 ||
      subjectID !== undefined ||
      userID !== undefined ||
      noteName !== undefined ||
      username !== undefined
    ) {
      const response = await PostNote(
        userID,
        username,
        subjectID,
        noteName,
        noteDocID
      );
      if (response.code === 200) {
        console.log("sikeres feltöltés");
        alert("sikeres feltöltés");
      } else console.log("sikertelen feltöltés");
    } else console.log("undefined hiba");
  };

  return (
    <div>
      <Header />
      <div className="bodydiv-with-nav">
        <h2>Add a new note</h2>
        <div className="col-sm-6 offset-sm-3">
          <label>Major</label>
          <Select
            name="majors"
            options={majorList}
            value={major}
            onChange={setMajor}
            getOptionLabel={option => option.majorName}
            getOptionValue={option => option.majorID}
          />
          <br />
          <label>Subject</label>
          <Select
            name="subjects"
            options={subjectList}
            value={subject}
            onChange={setSubject}
            onMenuOpen={fillSubjectDropdown}
            onMenuClose={emptySubjectList}
            getOptionLabel={option => option.subjectName}
            getOptionValue={option => option.subjectID}
          />
          <br />
          <label>Note Name</label>
          <input
            type="text"
            placeholder="note name"
            onChange={e => setNoteName(e.target.value)}
            className="form-control"
          />
          <br />
          <label>File</label>
          <input
            type="file"
            onChange={e => setPdfFile(e.target.files[0])}
            className="form-control"
          />
          <br />
          <button onClick={Add} className="btn btn-primary">
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNote;
