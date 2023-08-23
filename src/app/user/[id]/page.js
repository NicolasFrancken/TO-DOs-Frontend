"use client";

import "../../../styles/Tasks.css";

import axios from "axios";

import Header from "@/components/Header";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

import getTasks from "@/libs/getTasks";
import createTask from "@/libs/createTask";
import updateTask from "@/libs/updateTask";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isEditingTaskIndex, setIsEditingTaskIndex] = useState(-1);
  const [createInputValue, setCreateInputValue] = useState("");
  const [editInputValue, setEditInputValue] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  const router = useRouter();

  const createDivRef = useRef(null);
  const editDivRef = useRef(null);

  // FETCH DE TODAS LAS TASKS
  useEffect(() => {
    const fetch = async () => {
      const data = await getTasks(id);

      if (data.status === 401) {
        return router.push("/signin");
      }

      if (data.tasks) {
        setIsLoading(false);
        setErrorMessage("");
        setTasks(data.tasks);
      } else {
        setIsLoading(false);
        setErrorMessage(data.message);
      }
    };

    fetch();
  }, []);

  // CREACION DE TASK
  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    if (createInputValue !== "") {
      await createTask(createInputValue, id);

      setCreateInputValue("");

      const data = await getTasks(id);
      if (data.tasks) {
        setErrorMessage("");
        setTasks(data.tasks);
      } else {
        setErrorMessage(data.message);
      }

      setIsCreatingTask(!isCreatingTask);
    } else {
      setIsCreatingTask(!isCreatingTask);
    }
  };

  // EDICIÓN DE TASK
  const handleEditSubmit = async (event, taskId) => {
    event.preventDefault();

    const res = await updateTask(taskId, editInputValue);

    if (res.message) {
      setErrorMessage(res.message);
    }

    const data = await getTasks(id);
    if (data.tasks) {
      setTasks(data.tasks);
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else {
      setErrorMessage(data.message);
    }

    setIsEditingTaskIndex(-1);
  };

  // ELIMINAR TASK
  const handleCheckboxClick = async (taskId) => {
    setIsDisabled(true);

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (e) {
      throw e;
    }

    const data = await getTasks(id);
    if (data.tasks) {
      setErrorMessage("");
      setTasks(data.tasks);
    } else {
      setErrorMessage(data.message);
      setTasks([]);
    }

    setIsDisabled(false);
  };

  // MANAGE DEL CLICK AFUEA DE CREAR TASK PARA QUE SE CANCELE
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        createDivRef.current &&
        !createDivRef.current.contains(event.target)
      ) {
        setIsCreatingTask(false);
        setCreateInputValue("");
      }
    };

    if (isCreatingTask) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isCreatingTask]);

  // MANAGE DEL CLICK AFUEA DE EDITAR TASK PARA QUE SE CANCELE
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        editDivRef.current &&
        !editDivRef.current.contains(event.target) &&
        event.target.closest(".Tasks-SingleContainer") === null
      ) {
        setIsEditingTaskIndex(-1);
      }
    };

    if (isEditingTaskIndex !== -1) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEditingTaskIndex]);

  let renderedTasks;
  if (tasks) {
    renderedTasks = tasks.map((t, index) => {
      return (
        <div key={t._id} className="Tasks-SingleContainer" ref={editDivRef}>
          <input
            type="checkbox"
            id="check"
            className="Tasks-Checkbox"
            disabled={isDisabled}
            onClick={() => handleCheckboxClick(t._id)}
          />
          {isEditingTaskIndex === index ? (
            <form
              className="Tasks-FormContainer"
              onSubmit={(event) => handleEditSubmit(event, t._id)}
            >
              <input
                className="Tasks-Input"
                value={editInputValue}
                onChange={(event) => {
                  setEditInputValue(event.target.value);
                }}
                autoFocus
              />
              <button className="Tasks-SaveButton" type="submit">
                SAVE
              </button>
            </form>
          ) : (
            <label
              className="Tasks-Label"
              htmlFor="check"
              onClick={() => {
                setIsEditingTaskIndex(index);
                setEditInputValue(t.description);
              }}
            >
              {t.description}
            </label>
          )}
        </div>
      );
    });
  }

  return isLoading ? (
    <div className="Tasks-Loading">
      <div className="loader"></div>
    </div>
  ) : (
    <>
      <Header />
      <div className="Tasks-Container">
        {errorMessage !== "" ? (
          <label className="Tasks-Error">{errorMessage}</label>
        ) : (
          ""
        )}
        <div className="Tasks-SubContainer">{renderedTasks}</div>
        {isCreatingTask ? (
          <div className="Tasks-CreatingContainer" ref={createDivRef}>
            <form onSubmit={handleCreateSubmit} className="Tasks-FormContainer">
              <div className="Tasks-CreatingSubContainer">
                <input type="checkbox" className="Tasks-Checkbox" disabled />
                <input
                  value={createInputValue}
                  onChange={(event) => setCreateInputValue(event.target.value)}
                  className="Tasks-Input"
                  autoFocus
                />
              </div>
              <button type="submit" className="Tasks-SaveButton">
                Save
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsCreatingTask(!isCreatingTask)}
            className="Tasks-CreateButton"
          >
            New Task
          </button>
        )}
      </div>
    </>
  );
}
