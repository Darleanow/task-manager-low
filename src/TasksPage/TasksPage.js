import React from "react";
import PrimaryMenuBar from "../Components/PrimaryMenuBar/PrimaryMenuBar";
import SecondaryMenuBar from "../Components/SecondaryMenuBar/SecondaryMenuBar";
import BoardList from "../Components/BoardList/BoardList";
import "./TasksPage.scss";

const TasksPage = ({ projectId }) => {
  return (
    <>
      <div className="pp-menu_holder">
        <PrimaryMenuBar
          p_ProjectName={"Sample Project 1"}
          p_UserName={"Darleanow"}
        />
        <SecondaryMenuBar />
      </div>
      <div className="pp-main_content">
        <BoardList p_BoolSetCards={true} />
        <BoardList p_BoolSetCards={false} />
        {/* <BoardList p_BoolSetCards={false} /> */}
      </div>
    </>
  );
};

export default TasksPage;
