import React, { useEffect, useState } from "react";
import Select from "react-select";

async function getDoc(documentId) {
  let urlDoc = "https://localhost:7214/api/Documents/get-doc?id=" + documentId;
  return fetch(urlDoc, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(data => data.json());
}

async function AddRating(userID, noteID, ratingValue) {
  if (ratingValue !== undefined) {
    let url = "https://localhost:7214/api/Ratings/add-new-rating";
    let item = { noteID, userID, ratingValue };
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    }).then(data => data.json());
  }
}

async function checkForRating(userId, noteId) {
  let url =
    "https://localhost:7214/api/Ratings/get-ratings-of-user-for-note?userId=" +
    userId +
    "&noteId=" +
    noteId;
  return fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(data => data.json());
}

async function updateNoteRating(noteId, ratingValue) {
  let url =
    "https://localhost:7214/api/Notes/update-rating-of-note?id=" +
    noteId +
    "&ratingValue=" +
    ratingValue;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function downloadfile(documentId, documentName) {
  let urlDownload =
    "https://localhost:7214/api/Documents/download-by-id?id=" + documentId;

  fetch(urlDownload, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(resp => resp.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      console.log(blob);

      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      // the filename you want
      a.download = documentName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch(() => alert("oh no!"));
}

const NoteList = props => {
  const [ratingValue, setRatingValue] = useState();
  const [userId, setUserId] = useState();

  const options = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
  ];

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      const user = JSON.parse(localStorage.getItem("user-info"));
      setUserId(user.userID);
    }

    /*return () => {
      if (localStorage.getItem("user-info"))
        localStorage.removeItem("user-info");
    };*/
  }, []);

  const Download = async documentId => {
    console.log("hll");
    const response = await getDoc(documentId);
    console.log(response);
    downloadfile(documentId, response.documentName);
  };

  const updateRating = async (userId, noteId, ratingValue) => {
    const wasItRated = await checkForRating(userId, noteId);
    console.log(wasItRated);

    if (wasItRated.length !== 0) {
      alert("you have already rated this note!");
    } else {
      const addRatingResponse = await AddRating(
        userId,
        noteId,
        ratingValue.value
      );

      const updateResponse = await updateNoteRating(noteId, ratingValue.value);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {props.noteList.map((note, index) => (
        <div key={`NoteList-${index}`} className="listElement ">
          <div className="text-lg font-bold">Note name: {note.noteName}</div>
          <div className="text-lg font-bold">Uploaded by: {note.username}</div>
          <div className="text-lg font-bold">
            Rating: {note.noteRatingValue}
          </div>

          <div className="text-lg font-bold">Rate this note</div>
          <Select
            id="ratingDropdown"
            name="ratingvalue"
            options={options}
            value={ratingValue}
            onChange={setRatingValue}
          />

          <button
            id="rate"
            onClick={() => updateRating(userId, note.noteID, ratingValue)}
          >
            Rate
          </button>
          <br />
          <button id="download" onClick={() => Download(note.noteDocID)}>
            Download Note
          </button>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
