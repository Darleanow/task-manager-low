import React, { useEffect, useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "../Card/Card";
import "./BoardList.scss";

const BoardList = ({ boardId, tasks }) => {
  const [areThereTasks, setAreThereTasks] = useState(false);

  useEffect(() => {
    setAreThereTasks(tasks.length > 0);
  }, [tasks]);

  return (
    <div className="bl-board_container">
      <div className="bl-title_bar">
        <p>To do</p>
        <p className="bl-task_count">{areThereTasks ? tasks.length : "-"} </p>
      </div>
      <Droppable droppableId={boardId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="bl-droppable_area"
          >
            {areThereTasks ? (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
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
                    </div>
                  )}
                </Draggable>
              ))
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
                <p className="bl-empty_tasks_text">Drag a task here !</p>
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default BoardList;