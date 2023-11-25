import React from "react";
import Card from "../Components/Card/Card";
import PrimaryMenuBar from "../Components/PrimaryMenuBar/PrimaryMenuBar";

const ProjectPage = ({ projectId }) => {
  return (
    <>
      {/* <Card
        p_Name="Sample title"
        p_Description=""
        p_TaskId="1"
        p_Tags={[["tag1", "#FF8080"], ["tag2", "#FFCF96"]]}
        p_Weight="2"
        p_DueDate={new Date(2023, 6, 28, 14, 39, 7).toDateString()}
        p_User={{ user_name: "Darleanow", user_picture: "IDKYET" }}
      /> */}
      <PrimaryMenuBar
        p_ProjectName={"Sample Project 1"}
        p_UserName={"Darleanow"}
      />

      <div className="pp-menu_bar_secondary"></div>
      <div className="pp-main_content"></div>
    </>
  );
};

export default ProjectPage;
