import axios from "axios";

async function getTasks(id) {
  try {
    const res = await axios.get(
      `https://to-dos-backend.onrender.com/api/tasks/user/${id}`,
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    return { tasks: res.data.tasks };
  } catch (e) {
    console.log(e);
    if (e.response.status === 401) {
      return { status: 401 };
    } else {
      return { message: e.response.data.message };
    }
  }
}

export default getTasks;
