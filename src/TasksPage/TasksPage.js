import React, { useEffect } from "react";
import { useParams } from "react-router";

import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";


import { jwtDecode } from "jwt-decode";
import { checkTokenValidity } from "../Utils/BulkUtilsImport";
import { login } from "../Utils/Routing/store";

import PrimaryMenuBar from "../Components/PrimaryMenuBar/PrimaryMenuBar";
import SecondaryMenuBar from "../Components/SecondaryMenuBar/SecondaryMenuBar";
import BoardList from "../Components/BoardList/BoardList";
import "./TasksPage.scss";

const TasksPage = () => {
  const userId = useSelector((state) => state.auth.user.user_id);
  const { projectId } = useParams();
  


  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && checkTokenValidity()) {
      const userDetails = jwtDecode(token);
      dispatch(login(userDetails));
    }
  })

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
        <BoardList p_BoolSetCards={false} />
      </div>
    </>
  );
};

export default TasksPage;
