import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Card from "../Card/Card";
import "./BoardList.scss";

const BoardList = ({ p_ProjectId, p_BoardId, p_BoolSetCards }) => {
  const [areThereTasks] = useState(p_BoolSetCards);
  const initialTasks = [
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
  ];

  const [tasks, setTasks] = useState(initialTasks);

  // query backend, map cards here and use setAreThereTasks
  // Depending on output

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [reorderedTask] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, reorderedTask);

    setTasks(newTasks);
  };

  return (
    <div className="bl-board_container">
      <div className="bl-title_bar">
        <p>To do</p>
        <p className="bl-task_count">{areThereTasks ? initialTasks.length : "-"} </p>
      </div>
      {areThereTasks ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasksDroppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {tasks.map((task, index) => {
                    return (
                      <Draggable
                        index={index}
                        key={task.id}
                        draggableId={task.id.toString()}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bl-card_spacing"
                          >
                            <Card
                              p_Name={task.name}
                              p_Description={task.description}
                              p_TaskId={task.id}
                              p_Tags={task.tags}
                              p_Weight={task.weight}
                              p_DueDate={task.dueDate}
                              p_User={task.user}
                            />
                            {provided.placeholder}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </>
      ) : (
        <div className="bl-no_content_container">
          <div className="bl-icon_add">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="63"
              height="63"
              viewBox="0 0 63 63"
              fill="none"
              className="bl-add_cross"
            >
              <line
                x1="32.5"
                y1="63"
                x2="32.5"
                stroke="#A7A7A7"
                stroke-width="3"
                className="bl-add_cross"
              />
              <line
                y1="32.5"
                x2="63"
                y2="32.5"
                stroke="#A7A7A7"
                stroke-width="3"
                className="bl-add_cross"
              />
            </svg>
          </div>
          <p className="bl-empty_tasks_text">All Done for now</p>
        </div>
      )}
    </div>
  );
};

export default BoardList;
