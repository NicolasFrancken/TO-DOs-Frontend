import axios from "axios";

const createTask = async (description, id) => {
  try {
    const res = await axios.post(
      "https://to-dos-backend.onrender.com/api/tasks",
      {
        description,
        creator: id,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
  } catch (e) {
    throw e;
  }
};

export default createTask;
