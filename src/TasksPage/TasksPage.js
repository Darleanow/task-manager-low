import React, { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { DragDropContext } from "react-beautiful-dnd";
import Modal from "react-modal";

import { jwtDecode } from "jwt-decode";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import { login } from "../Utils/Routing/store";

import PrimaryMenuBar from "../Components/PrimaryMenuBar/PrimaryMenuBar";
import BoardList from "../Components/BoardList/BoardList";

import { IoMdClose } from "react-icons/io";
import "./TasksPage.scss";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);
  return { sourceClone, destClone };
};

const TasksPage = () => {
  const initialBoards = {
    "board-1": {
      id: "board-1",
      tasks: [
        {
          id: "1",
          name: "Hello i'm a very long dumb text",
          description: "Description of Task 1",
          tags: [
            ["urgent", "#4BB2C8"],
            ["bug", "#FF8686"],
          ],
          weight: "3",
          dueDate: new Date(2023, 6, 30).toDateString(),
          user: { user_name: "User1", user_picture: "" },
        },
        {
          id: "2",
          name: "Task 2",
          description: "Description of Task 2",
          tags: [
            ["feature", "#B486FF"],
            ["enhancement", "#ffa500"],
          ],
          weight: "5",
          dueDate: new Date(2023, 7, 15).toDateString(),
          user: { user_name: "User2", user_picture: "" },
        },
      ],
    },
    "board-2": {
      id: "board-2",
      tasks: [
        {
          id: "3",
          name: "Task 2",
          description: "Description of Task 2",
          tags: [
            ["feature", "#B486FF"],
            ["enhancement", "#ffa500"],
          ],
          weight: "5",
          dueDate: new Date(2023, 7, 15).toDateString(),
          user: { user_name: "User2", user_picture: "" },
        },
        {
          id: "4",
          name: "Task 2",
          description: "Description of Task 2",
          tags: [
            ["feature", "#B486FF"],
            ["enhancement", "#ffa500"],
          ],
          weight: "5",
          dueDate: new Date(2023, 7, 15).toDateString(),
          user: { user_name: "User2", user_picture: "" },
        },
        {
          id: "5",
          name: "Task 2",
          description: "Description of Task 2",
          tags: [
            ["feature", "#B486FF"],
            ["enhancement", "#ffa500"],
            ["enhancement", "#ffa500"],
            ["enhancement", "#ffa500"],
          ],
          weight: "5",
          dueDate: new Date(2023, 7, 15).toDateString(),
          user: { user_name: "User2", user_picture: "" },
        },
      ],
    },
  };

  const [boards, setBoards] = useState(initialBoards);

  const [isOpenCreateTask, setIsOpenCreateTask] = useState(false);

  // Correct the modal open/close handlers
  const handleOpenCreateTask = () => setIsOpenCreateTask(true);
  const handleCloseCreateTask = () => setIsOpenCreateTask(false);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const reorderedItems = reorder(
        boards[source.droppableId].tasks,
        source.index,
        destination.index
      );
      setBoards((prevBoards) => ({
        ...prevBoards,
        [source.droppableId]: {
          ...prevBoards[source.droppableId],
          tasks: reorderedItems,
        },
      }));
    } else {
      const { sourceClone, destClone } = move(
        boards[source.droppableId].tasks,
        boards[destination.droppableId].tasks,
        source,
        destination
      );
      setBoards((prevBoards) => ({
        ...prevBoards,
        [source.droppableId]: {
          ...prevBoards[source.droppableId],
          tasks: sourceClone,
        },
        [destination.droppableId]: {
          ...prevBoards[destination.droppableId],
          tasks: destClone,
        },
      }));
    }
  };

  const userId = useSelector((state) => state.auth.user.user_id);
  const { projectId } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function fetchTasksByProjectId(projectId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3333/tasks/${projectId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const tasks = await response.json();
        console.log("Tasks fetched successfully", tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks", error);
    }
  }

  async function createTask(
    projectId,
    taskName,
    description,
    statusId,
    complexity,
    dueDate,
    tags
  ) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3333/tasks/create_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          taskName,
          description,
          statusId,
          complexity,
          dueDate,
          tags,
        }),
      });
      if (response.ok) {
        console.log("Task created successfully");
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  async function updateTaskStatus(taskId, newStatusId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/tasks/update_task_status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, newStatusId }),
        }
      );
      if (response.ok) {
        console.log("Task status updated successfully");
      } else {
        console.error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status", error);
    }
  }

  async function deleteTask(taskId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3333/tasks/delete_task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        console.log("Task deleted successfully");
      } else {
        console.error("Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task", error);
    }
  }

  // TODO: Custom Boards, filter by tags / logical operators, add boards

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && checkTokenValidity()) {
      const userDetails = jwtDecode(token);
      dispatch(login(userDetails));
    }

    fetchTasksByProjectId(projectId);
  }, [projectId, dispatch]);

  return (
    <>
      <div className="pp-menu_holder">
        <PrimaryMenuBar
          p_ProjectName={"Sample Project 1"}
          p_UserName={"Darleanow"}
        />
        <div className="smb-menu_bar_secondary">
          <div className="smb-board_layouts">
            <select
              name="BoardLayouts"
              className="smb-board_dropdown"
              id="BoardLayouts"
            >
              <option className="smb-dropdown_option" value="Workflow">
                Workflow
              </option>
              <option className="smb-dropdown_option" value="Bug_Tracker">
                Bug Tracker
              </option>
            </select>
          </div>
          <div className="smb-search_filters_container">
            <input
              type="text"
              className="smb-search_filters"
              placeholder="Search or filter..."
            />
          </div>
          <div className="smb-small_buttons">
            <button className="smb-small_action_button">Edit board</button>
            <button className="smb-small_action_button">Add list</button>
            <button
              className="smb-small_action_button"
              onClick={handleOpenCreateTask}
            >
              New Issue
            </button>
            <Modal
              isOpen={isOpenCreateTask}
              onRequestClose={handleCloseCreateTask}
              contentLabel="Create Task"
              className={"tp-modal"}
              overlayClassName={"tp-modal_overlay"}
            >
              <div className="tp-flex_content">
                <div className="tp-flex_first_bar">
                  <p className="tp-title">Title (required)</p>
                  <IoMdClose className="tp-close" onClick={handleCloseCreateTask}/>
                </div>
                <input type="text" placeholder="Enter title..."></input>
                <div className="tp-flex_second_bar">
                  <p className="tp-description">Description</p>
                  {/* Rich text description support */}
                </div>

              </div>
            </Modal>
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pp-main_content">
          {Object.entries(boards).map(([boardId, board]) => (
            <BoardList key={boardId} boardId={boardId} tasks={board.tasks} />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default TasksPage;
