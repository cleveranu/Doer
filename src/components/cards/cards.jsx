import React, { useState, useEffect } from "react";
import "./cards.css";
import Update from "./update.jsx";
import "./update.css";
import axios from "axios";
import white from "../img/white.png";
import black from "../img/black.png";
import { MdDeleteForever } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

import { useDarkMode } from "../navbar/DarkModeContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let id = sessionStorage.getItem("id");
const Card = () => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [isAnimatedVisible, setAnimatedVisible] = useState(true);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  // Add editingIndex state
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const showPopup = (index) => {
    setPopupOpen(true);
    setAnimatedVisible(false);

    // Check if the task at the given index exists before accessing its properties
    if (index !== null && tasks[index]) {
      setTaskName(tasks[index].taskName);
      setDescription(tasks[index].description);
    } else {
      // If the index is null or the task doesn't exist, reset the form fields
      setTaskName("");
      setDescription("");
    }
  };
  const handleOpenUpdateModal = (taskId, taskName, description) => {
    setSelectedTaskId(taskId);
    setTaskName(taskName);
    setDescription(description);
    setIsUpdateModalOpen(true);

    console.log("State after opening modal:", taskId, taskName, description);
  };

  const handleCloseUpdateModal = () => {
    setSelectedTaskId(null);
    setTaskName("");
    setDescription("");
    setIsUpdateModalOpen(false);

    console.log(
      "State after closing modal:",
      selectedTaskId,
      taskName,
      description
    );
  };

  const hidePopup = () => {
    setPopupOpen(false);
  };
  const closePopup = () => {
    setPopupOpen(false);
  };

  //add task
  const handleAddTask = async () => {
    if (taskName.trim() !== "") {
      try {
        await axios.post("https://doer-back.vercel.app/addTask", {
          title: taskName,
          description: description,
          id: id,
        });

        const newTask = { id: tasks.length + 1, taskName, description };
        setTasks([...tasks, newTask]);
        setTaskName("");
        setDescription("");

        // Display a notification
        toast("Task added successfully");
      } catch (error) {
        console.error("Error adding task:", error);
        // Handle error and display an error notification
        toast.error("Error adding task. Please try again.");
      }
      hidePopup();
    }
  };

  //update task
  const handleUpdate = async (taskId, updatedTaskName, updatedDescription) => {
    try {
      const response = await axios.put(
        `https://doer-back.vercel.app/updateTask/${taskId}`,
        {
          title: updatedTaskName,
          description: updatedDescription,
        }
      );

      if (response.data.updatedList) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                taskName: response.data.updatedList.title,
                description: response.data.updatedList.description,
              }
            : task
        );
        setTasks(updatedTasks);
        handleCloseUpdateModal(); // Close the modal after updating
        // Display a notification
        toast.success("Task updated successfully");
      } else {
        // Handle case where the server did not return an updated list
        console.error("Error updating task. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during the update request
      console.error("Error updating task:", error);
      toast.error("Error updating task. Please try again.");
    }
  };

  //delete task
  const handleDeleteTask = async (taskid) => {
    const confirmDelete = window.confirm(
      "Well done, this task will now be deleted"
    );
    if (confirmDelete) {
      try {
        const response = await axios
          .delete(`https://doer-back.vercel.app/getTasks/${taskid}`, {
            data: { id: id },
          })
          .then((response) => {
            console.log(response.data);
            // Optionally, you can display a success message
            toast.success("Task deleted successfully");
          });

        // console.log(response.data);
        // // Optionally, you can display a success message
        // alert("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
        toast.error("Error in task deletion");
      }
    }
  };

  useEffect(() => {
    console.log("ID:", id); // Log the id
    const fetch = async () => {
      await axios
        .get(`https://doer-back.vercel.app/getTasks/${id}`)
        .then((response) => {
          setTasks(
            response.data.lists.map((item) => ({
              id: item._id,
              taskName: item.title,
              description: item.description,
              done: item.done,
            }))
          );
        });
    };
    fetch();
  }, [handleAddTask, id]);

  useEffect(() => {
    // Check if tasks array is empty
    if (tasks.length === 0) {
      setAnimatedVisible(true); // Show the image if there are no tasks
    } else {
      setAnimatedVisible(false); // Hide the image if there are tasks
    }
  }, [tasks]);

  // When the application loads
  useEffect(() => {
    const storedTasks = Object.keys(localStorage).map((key) => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (error) {
        console.error(`Error parsing JSON for key ${key}:`, error);
        return null;
      }
    });

    const validTasks = storedTasks.filter((task) => task !== null);
  }, []);

  return (
    <div
      className={`container ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        backgroundColor: isDarkMode ? "#000000" : "initial",
        height: "100vh",
      }}
    >
      {" "}
      <ToastContainer theme={isDarkMode ? "dark" : "light"} />
      <div className="addtask" onClick={() => showPopup(null)}>
        <button className="custom-btn btn-9 ">+ Create Task</button>
      </div>
      {isAnimatedVisible && (
        <div className="animated">
          <img src={isDarkMode ? black : white} alt="Logo" />
        </div>
      )}
      {isPopupOpen && (
        <div className={`popup-overlay ${isDarkMode ? "dark-mode" : ""}`}>
          <div className={`popup-content ${isDarkMode ? "dark-mode" : ""}`}>
            <h3 className={`addtext ${isDarkMode ? "dark-mode" : ""}`}>
              Add Your Task
            </h3>

            <input
              type="text"
              placeholder="Enter Task"
              className="inputs"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
            <textarea
              id="textarea"
              type="text"
              placeholder="Description"
              className="input-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="btns2">
              <button className="btn" onClick={handleAddTask}>
                Add Task
              </button>
              <button className="btns" onClick={closePopup}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={`task-cards-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div className={`task-cards ${isDarkMode ? "dark-mode" : ""}`}>
          {tasks.map((task, index) => (
            <div className="task-card " key={index}>
              <h3>{task.taskName}</h3>
              <p>{task.description}</p>
              <div className="button-container">
                {!task.done && (
                  <button
                    title="Update"
                    onClick={() =>
                      handleOpenUpdateModal(
                        task.id,
                        task.taskName,
                        task.description
                      )
                    }
                  >
                    <FaRegEdit />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  title="Delete"
                >
                  <MdDeleteForever />
                </button>
              </div>
            </div>
          ))}

          {isUpdateModalOpen && (
            <Update
              taskId={selectedTaskId}
              onClose={handleCloseUpdateModal}
              onUpdate={handleUpdate}
              taskName={taskName}
              description={description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
