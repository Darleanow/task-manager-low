import React from "react";
import {
  getTextColorFromBackground,
  getTextColorFromDueDate,
  formatDate,
} from "../../Utils/BulkUtilsImport";
import { FaBalanceScale } from "react-icons/fa";

import "./Card.scss";

/**
 * Card component has 5 parameters:
 * - *p_Name*: Used for the name of the task
 * - *p_Description*: Used for the description of the task
 * - *p_Tags*: Is an array of tags containing tag name, and its color
 * - *p_Weight*: Used for the weight of the task
 * - *p_User*: Is some infos about the user, name and picture in base64
 *
 * And returns a modal card that can be clicked to
 * access its description for example
 */
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
    <>
      <div className="cd-container">
        <p className="cd-task_title">
          {p_Name} <p className="cd-task_id"> #{p_TaskId} </p>
          <FaBalanceScale />
          {p_Weight}
        </p>
        <div className="cd-tags">
          {p_Tags.map((tag, index) => (
            <span
              key={index}
              style={{
                backgroundColor: tag[1],
                color: getTextColorFromBackground(tag[1]),
              }}
            >
              {tag[0]}
            </span>
          ))}
        </div>
        <div className="cd-flex_bottom_card">
          <p
            style={{
              color: getTextColorFromDueDate(p_DueDate),
              fontWeight: "bold",
            }}
          >
            {p_DueDate ? formatDate(p_DueDate, false) : null}
          </p>
          <div className="cd-weight"></div>

          <div>
            {/*<img src={p_User[0].user_picture} alt="cd-User created" /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
