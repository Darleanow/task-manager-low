import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { DragDropContext } from "react-beautiful-dnd";

import { jwtDecode } from "jwt-decode";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import { login } from "../Utils/Routing/store";

import PrimaryMenuBar from "../Components/PrimaryMenuBar/PrimaryMenuBar";
import BoardList from "../Components/BoardList/BoardList";
import TaskCreation from "./Components/TaskCreation/TaskCreation";

import { MinidenticonImg } from "../Utils/BulkUtilsImport";

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
  const [boards, setBoards] = useState([]);

  const [isOpenCreateTask, setIsOpenCreateTask] = useState(false);

  // Correct the modal open/close handlers
  const handleOpenCreateTask = () => setIsOpenCreateTask(true);

  // Users
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [formattedUsers, setFormattedUsers] = useState([]);

  // const onDragEnd = (result) => {
  //   const { source, destination } = result;

  //   // dropped outside the list
  //   if (!destination) return;

  //   if (source.droppableId === destination.droppableId) {
  //     const reorderedItems = reorder(
  //       boards[source.droppableId].tasks,
  //       source.index,
  //       destination.index
  //     );
  //     setBoards((prevBoards) => ({
  //       ...prevBoards,
  //       [source.droppableId]: {
  //         ...prevBoards[source.droppableId],
  //         tasks: reorderedItems,
  //       },
  //     }));
  //   } else {
  //     const { sourceClone, destClone } = move(
  //       boards[source.droppableId].tasks,
  //       boards[destination.droppableId].tasks,
  //       source,
  //       destination
  //     );
  //     setBoards((prevBoards) => ({
  //       ...prevBoards,
  //       [source.droppableId]: {
  //         ...prevBoards[source.droppableId],
  //         tasks: sourceClone,
  //       },
  //       [destination.droppableId]: {
  //         ...prevBoards[destination.droppableId],
  //         tasks: destClone,
  //       },
  //     }));
  //   }
  // };

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return;
  
    const sourceIndex = boards.findIndex(board => board.list_id.toString() === source.droppableId);
    const destIndex = boards.findIndex(board => board.list_id.toString() === destination.droppableId);
  
    if (sourceIndex === -1 || destIndex === -1) return;
  
    if (source.droppableId === destination.droppableId) {
      // Déplacement dans la même liste
      const reorderedTasks = reorder(
        boards[sourceIndex].tasks,
        source.index,
        destination.index
      );
      const newBoards = Array.from(boards);
      newBoards[sourceIndex] = {
        ...boards[sourceIndex],
        tasks: reorderedTasks,
      };
      setBoards(newBoards);
    } else {
      // Déplacement entre listes différentes
      const { sourceClone, destClone } = move(
        boards[sourceIndex].tasks,
        boards[destIndex].tasks,
        source,
        destination
      );
      const newBoards = Array.from(boards);
      newBoards[sourceIndex] = {
        ...boards[sourceIndex],
        tasks: sourceClone,
      };
      newBoards[destIndex] = {
        ...boards[destIndex],
        tasks: destClone,
      };
      setBoards(newBoards);
    }
  };
  

  const userId = useSelector((state) => state.auth.user.user_id);
  const { projectId } = useParams();

  const [tags, setTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  //const [newTagColor, setNewTagColor] = useState("#FFFFFF");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function fetchUsers() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/users/get_all_users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        const transformedUsers = data.map((user) => ({
          id: user.user_id,
          username: user.full_name,
          role: user.user_role || "User",
          photo:
            user.user_picture !== null ? (
              URL.createObjectURL(user.user_picture)
            ) : (
              <MinidenticonImg
                username={user.full_name}
                saturation="90"
                width="30"
                height="30"
              />
            ),
          isAdded: false,
        }));
        setFetchedUsers(transformedUsers);
      } else {
        // Handle response errors
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }

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

  async function fetchListsAndTasks(projectId) {
    const token = localStorage.getItem("token");
    try {
      // Fetch lists
      const listsResponse = await fetch(
        `http://localhost:3333/tasks/lists/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!listsResponse.ok) throw new Error("Failed to fetch lists");
      const lists = await listsResponse.json();
      const boardsWithValidTasks = lists.map(board => ({
        ...board,
        tasks: board.tasks && board.tasks.length > 0 && board.tasks[0].task_id != null 
               ? board.tasks 
               : [] // Filtrer les tâches 'null'
      }));
      setBoards(boardsWithValidTasks);
      //setBoards(lists);
    } catch (error) {
      console.error("Error fetching lists and tasks", error);
    }
  }

  const createBoard = async (boardName) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3333/tasks/lists/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listName: boardName,
          projectId: projectId,
          statusName: boardName,
        }),
      });
      if (!response.ok) throw new Error("Failed to create board");

      // Fetch updated lists and tasks
      fetchListsAndTasks(projectId);
    } catch (error) {
      console.error("Error creating board", error);
    }
  };

  const handleAddBoard = () => {
    // Prompt for board name and create it
    const boardName = prompt("Enter the name for the new board:");
    if (boardName) {
      createBoard(boardName);
    }
  };

  async function getTags() {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:3333/tasks/tags/get_tags",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const tagsData = await response.json();
        setTags(tagsData);
      } else {
        console.error("Failed to fetch tags");
      }
    } catch (error) {
      console.error("Error fetching tags", error);
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

    fetchUsers();

    const formatUsers = fetchedUsers.map((user) => ({
      value: user.id,
      label: user.username,
      photo: user.photo.props,
    }));

    setFormattedUsers(formatUsers);

    getTags();

    const transformedTags = tags.map((tag) => ({
      value: tag.tag_id,
      label: tag.tag_name,
      color: tag.tag_color,
    }));
    setTagOptions(transformedTags);

    fetchListsAndTasks(projectId);
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
            <button
              className="smb-small_action_button"
              onClick={handleAddBoard}
            >
              Add list
            </button>
            <button
              className="smb-small_action_button"
              onClick={handleOpenCreateTask}
            >
              New Issue
            </button>
            <TaskCreation
              isOpenCreateTask={isOpenCreateTask}
              setIsOpenCreateTask={setIsOpenCreateTask}
              formattedUsers={formattedUsers}
              tagOptions={tagOptions}
              setTagOptions={setTagOptions}
              fetchTasksByProjectId={fetchTasksByProjectId}
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="pp-main_content">
          {boards.map((board) => (
            <BoardList
              key={board.list_id}
              boardId={board.list_id.toString()}
              boardName={board.list_name}
              tasks={board.tasks}
            />
          ))}
        </div>
      </DragDropContext>
    </>
  );
};

export default TasksPage;
