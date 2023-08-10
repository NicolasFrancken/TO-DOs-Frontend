import axios from "axios";

async function getTasks(id) {
  try {
    const res = await axios.get(`http://localhost:5000/api/tasks/user/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return res.data.tasks;
  } catch (e) {
    if (e.response.data.message) {
      return;
    } else {
      throw e;
    }
  }
}

export default getTasks;
