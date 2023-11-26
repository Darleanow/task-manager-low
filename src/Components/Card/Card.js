import React from "react";
import { FaBalanceScale } from "react-icons/fa";
import {
  getTextColorFromBackground,
  getTextColorFromDueDate,
  formatDate,
  MinidenticonImg,
} from "../../Utils/BulkUtilsImport";
import "./Card.scss";

const Card = ({
  p_Name,
  p_Description,
  p_TaskId,
  p_Tags,
  p_Weight,
  p_DueDate,
  p_User,
}) => {
  return (
    <div className="cd-container">
      <div className="cd-task_details">
        <div className="cd-title_and_id">
          <font className="cd-task_name">
            {p_Name}
            <font className="cd-task_id"> #{p_TaskId} </font>
            <font
              className="cd-task_date"
              style={{
                color: getTextColorFromDueDate(p_DueDate),
                fontWeight: "bold",
              }}
            >
              {p_DueDate ? formatDate(p_DueDate, false) : null}
            </font>
          </font>
        </div>
        <MinidenticonImg
          username={p_User.user_name}
          saturation="90"
          width="19"
          height="19"
          className="p-user_profile_picture_task"
        />
      </div>
      <div className="cd-tags">
        {p_Tags.map((tag, index) => (
          <span
            key={index}
            style={{
              backgroundColor: tag[1],
              color: getTextColorFromBackground(tag[1]),
            }}
            className="cd-tag"
          >
            {tag[0]}
          </span>
        ))}
      </div>
      <div className="cd-flex_bottom_card"></div>
    </div>
  );
};

export default Card;
