import axios from "axios";

async function getTasks(id) {
  try {
    const res = await axios.get(`http://localhost:5000/api/tasks/user/${id}`, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return { tasks: res.data.tasks };
  } catch (e) {
    console.log(e);
    return { message: e.response.data.message };
  }
}

export default getTasks;
