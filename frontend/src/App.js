import React, { useState, useEffect } from "react";
import {
  register,
  login,
  fetchUsers,
  fetchCourses,
  requestSession,
  respondSession,
} from "./services/api";

function App() {
  const [token, setToken] = useState("");
  const [view, setView] = useState("login");
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Handlers...

  if (!token) {
    // Show registration/login forms
    // ...
  }

  return (
    <div>
      {/* Sidebar: Users list */}
      {/* Main: Courses, session request, instructor controls */}
    </div>
  );
}

export default App;