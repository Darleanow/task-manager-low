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

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    const sourceIndex = boards.findIndex(
      (board) => board.list_id.toString() === source.droppableId
    );
    const destIndex = boards.findIndex(
      (board) => board.list_id.toString() === destination.droppableId
    );

    if (sourceIndex === -1 || destIndex === -1) return;

    if (source.droppableId === destination.droppableId) {
      // Handle reordering in the same list
      const reorderedTasks = reorder(
        boards[sourceIndex].tasks,
        source.index,
        destination.index
      );
      setBoards((prevBoards) => {
        const newBoards = Array.from(prevBoards);
        newBoards[sourceIndex] = {
          ...newBoards[sourceIndex],
          tasks: reorderedTasks,
        };
        return newBoards;
      });
    } else {
      // Handle moving task between different lists
      const task = boards[sourceIndex].tasks.find(
        (t) => t.task_id.toString() === draggableId
      );

      if (!task) return;

      await updateTaskList(task.task_id, parseInt(destination.droppableId));
      // Only update the frontend, don't re-fetch from backend
      handleTaskMove(sourceIndex, destIndex, task, source, destination);
    }
  };

  const handleTaskMove = (
    sourceIndex,
    destIndex,
    task,
    source,
    destination
  ) => {
    const newSourceTasks = Array.from(boards[sourceIndex].tasks);
    newSourceTasks.splice(source.index, 1);
    const newDestTasks = Array.from(boards[destIndex].tasks);
    newDestTasks.splice(destination.index, 0, task);

    setBoards((prevBoards) => {
      const newBoards = Array.from(prevBoards);
      newBoards[sourceIndex] = {
        ...newBoards[sourceIndex],
        tasks: newSourceTasks,
      };
      newBoards[destIndex] = {
        ...newBoards[destIndex],
        tasks: newDestTasks,
      };
      return newBoards;
    });
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
      const boardsWithValidTasks = lists.map((board) => ({
        ...board,
        tasks:
          board.tasks &&
          board.tasks.length > 0 &&
          board.tasks[0].task_id != null
            ? board.tasks
            : [], // Filtrer les tâches 'null'
      }));
      console.log("Fetched Lists: ", lists);
      setBoards(boardsWithValidTasks);
      //setBoards(lists);
    } catch (error) {
      console.error("Error fetching lists and tasks", error);
    }
  }

  const updateTaskList = async (taskId, newListId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3333/tasks/update_task_list`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, newListId, projectId }),
        }
      );
      if (!response.ok) throw new Error("Failed to update task list");
    } catch (error) {
      console.error("Error updating task list", error);
    }
  };

  const updateBoardsWithReorderedTasks = (boardIndex, reorderedTasks) => {
    setBoards((prevBoards) => {
      const newBoards = Array.from(prevBoards);
      newBoards[boardIndex] = {
        ...prevBoards[boardIndex],
        tasks: reorderedTasks,
      };
      return newBoards;
    });
  };

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
        console.log("Tags");
        console.log(tagsData);
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
    fetchTasksByProjectId(projectId)
    const token = localStorage.getItem("token");
    if (token && checkTokenValidity()) {
      const userDetails = jwtDecode(token);
      dispatch(login(userDetails));
    }

    fetchUsers();

    fetchListsAndTasks(projectId);
  }, [projectId, dispatch]);

  useEffect(() => {
    if (fetchedUsers.length > 0) {
      const formatUsers = fetchedUsers.map((user) => ({
        value: user.id,
        label: user.username,
        photo: user.photo.props,
      }));
      setFormattedUsers(formatUsers);
    }
  }, [fetchedUsers]);

  useEffect(() => {
    getTags();
  }, []);

  useEffect(() => {
    const transformedTags = tags.map((tag) => ({
      value: tag.tag_id,
      label: tag.tag_name,
      color: tag.tag_color,
    }));
    console.log(tags);
    console.log(transformedTags);

    setTagOptions(transformedTags);
  }, [tags]);

  const refreshBoardData = async () => {
    // Fetch the latest data for the board and update state
    await fetchListsAndTasks(projectId);
  };

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
              update_tasks={refreshBoardData}
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
