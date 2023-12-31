import axios from "axios";

async function updateTask(taskId, editInputValue) {
  if (editInputValue === "") {
    return { message: "Cannot update with empty value" };
  }
  try {
    await axios.patch(
      `https://to-dos-backend.onrender.com/api/tasks/${taskId}`,
      {
        description: editInputValue,
      },
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );

    return {};
  } catch (e) {
    return { message: e.response.data.message };
  }
}

export default updateTask;
