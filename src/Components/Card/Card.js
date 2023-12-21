import React from "react";
import { FaBalanceScale } from "react-icons/fa";
import {
  getTextColorFromBackground,
  getTextColorFromDueDate,
  formatDate,
  MinidenticonImg,
} from "../../Utils/BulkUtilsImport";
import "./Card.scss";

const Card = React.memo(
  ({
    p_Name,
    p_Description,
    p_TaskId,
    p_Tags,
    p_Weight,
    p_DueDate,
    p_User = "Darleanow",
  }) => {
    return (
      <div className="cd-container">
        <div className="cd-task_details">
          <div className="cd-title_and_id">
            <font className="cd-task_name">
              {p_Name}

              <font className="cd-task_date"></font>
            </font>
          </div>
          <MinidenticonImg
            username={p_User}
            saturation="90"
            width="19"
            height="19"
            className="p-user_profile_picture_task"
          />
        </div>
        <div className="cd-tags">
          {/* {p_Tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: tag.tag_color,
                color: getTextColorFromBackground(tag.tag_color),
              }}
              className="cd-tag"
            >
              {tag.tag_name}
            </span>
          ))} */}
        </div>
        <font className="cd-task_id"> #{p_TaskId} </font>
      </div>
    );
  }
);

export default Card;
