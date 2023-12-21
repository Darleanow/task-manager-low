import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import { useParams } from "react-router";
import Modal from "react-modal";
import RichText from "../RichText";
import { IoMdClose } from "react-icons/io";
import "./TaskCreation.scss";
import { MinidenticonImg } from "../../../Utils/BulkUtilsImport";

import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();

const getTextColor = (backgroundColor) => {
  // Un calcul simple pour déterminer si le texte doit être clair ou foncé
  // Basé sur la luminosité de la couleur de fond
  // Cette fonction peut être ajustée ou étendue selon vos besoins
  const color = backgroundColor.slice(1); // Retirer le '#'
  const rgb = parseInt(color, 16); // Convertir en valeur numérique
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const luma = (r + g + b) / 3;
  return luma < 128 ? "white" : "black";
};

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    borderColor: state.isFocused ? "#FFFFFF" : "gray",
    boxShadow: state.isFocused ? "0 0 0 0px #FFFFFF" : null,
    "&:hover": {
      borderColor: state.isFocused ? "#FFFFFF" : "gray",
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#363636" : "#363636",
    color: "white",
    ":hover": {
      cursor: "pointer",
      backgroundColor: "#343434",
      color: "white",
    },
  }),
  noOptionsMessage: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    color: "white",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    color: "white",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "white",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    borderRadius: "0",
    marginTop: 0,
    marginBottom: 0,
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    border: "1px solid white",
    borderRadius: "0 0 8px 8px",
    maxHeight: "150px",
  }),
};

const otherCustomStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    borderColor: state.isFocused ? "#FFFFFF" : "gray",
    boxShadow: state.isFocused ? "0 0 0 0px #FFFFFF" : null,
    "&:hover": {
      borderColor: state.isFocused ? "#FFFFFF" : "gray",
    },
  }),
  noOptionsMessage: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    color: "white",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    color: "white",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "white",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#363636",
    borderRadius: "0",
    marginTop: 0,
    marginBottom: 0,
  }),
  menuList: (provided, state) => ({
    ...provided,
    padding: 0,
    border: "1px solid white",
    borderRadius: "0 0 8px 8px",
    maxHeight: "150px",
    overflowY: "auto",
  }),
  option: (provided, state) => {
    const baseColor = state.data.color || "#363636";
    const backgroundColor = state.isFocused ? "#363636" : "#363636";
    const textColor = getTextColor(backgroundColor);

    return {
      ...provided,
      backgroundColor: backgroundColor,
      color: textColor,
      display: "flex",
      alignItems: "center",
      ":before": {
        content: '""',
        display: "block",
        marginRight: 8,
        width: 15,
        height: 6,
        borderRadius: "6px",
        backgroundColor: baseColor,
      },
      ":hover": {
        backgroundColor: "#343434",
        color: "white",
      },
    };
  },
};

const CustomOption = (props) => {
  return (
    <components.Option {...props}>
      <div style={{ display: "flex", alignItems: "center" }}>
        {
          <MinidenticonImg
            username={props.data.photo.username}
            saturation={props.data.photo.saturation}
            width={props.data.photo.width}
            height={props.data.photo.height}
          />
        }
        {props.data.label}
      </div>
    </components.Option>
  );
};

const TagCreationModal = ({ isOpen, onClose, onCreateTag, existingTags }) => {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#FFFFFF");

  const handleTagCreation = () => {
    if (tagName) {
      // Check if tag name already exists
      if (
        existingTags.some(
          (tag) => tag.label.toLowerCase() === tagName.toLowerCase()
        )
      ) {
        alert("Tag with this name already exists.");
        return;
      }
      onCreateTag(tagName, tagColor);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tag-background">
      <div className="tag-creation">
        <p className="tag-label">Title</p>
        <input
          className="tag-input"
          type="text"
          placeholder="Tag Name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <p className="tag-label">Colour</p>
        <input
          className="tag-input2"
          type="color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
        />
        <div className="tag-buttons">
          <button className="tag-button" onClick={onClose}>
            Cancel
          </button>
          <button className="tag-button" onClick={handleTagCreation}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const TaskCreation = ({
  isOpenCreateTask,
  setIsOpenCreateTask,
  formattedUsers,
  tagOptions,
  setTagOptions,
  fetchTasksByProjectId,
  update_tasks,
}) => {
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  console.log(formattedUsers);
  const { projectId } = useParams();

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [editorContent, setEditorContent] = useState("");

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const handleUserSelection = (selectedOptions) => {
    setSelectedUsers(selectedOptions); // Update state when users are selected
  };

  const handleCloseCreateTask = () => setIsOpenCreateTask(false);

  async function createTask(
    projectId,
    taskName,
    description,
    statusId,
    complexity,
    dueDate,
    users,
    tags
  ) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3333/tasks/create_task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          taskName,
          description,
          statusId,
          complexity,
          dueDate,
          users,
          tags,
        }),
      });
      if (response.ok) {
        console.log("Task created successfully");
        update_tasks();
        fetchTasksByProjectId(projectId);
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task", error);
    }
  }

  async function addTag(tagName, tagHexColor) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:3333/tasks/tags/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tagName, tagHexColor }),
      });

      if (response.ok) {
        console.log("Tag added successfully");
      } else {
        console.error("Failed to add tag");
      }
    } catch (error) {
      console.error("Error adding tag", error);
    }
  }

  async function deleteTag(tagId) {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:3333/tasks/tags/delete/${tagId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("Tag deleted successfully");
      } else {
        console.error("Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag", error);
    }
  }

  const createNewTask = () => {
    createTask(
      projectId,
      taskName,
      taskDescription,
      1, //statusId,
      0, //complexity,
      0, //dueDate,
      selectedUsers.map(user => user.value),
      selectedTags.map((tag) => tag.value)
    );
    console.log(selectedUsers);
    handleCloseCreateTask();
  };

  const handleCreateTag = (tagName, tagColor) => {
    if (
      !tagOptions.find(
        (tag) => tag.label.toLowerCase() === tagName.toLowerCase()
      )
    ) {
      const newTag = { label: tagName, value: tagName, color: tagColor };
      setTagOptions([...tagOptions, newTag]);
      addTag(tagName, tagColor);
    } else {
      alert("A tag with this name already exists.");
    }
  };

  const DropdownIndicator = (props) => (
    <div onClick={(e) => e.stopPropagation()}>
      <button
        className="tp-button_create_tag"
        onClick={() => setIsTagModalOpen(true)}
      >
        Create a new Tag
      </button>
    </div>
  );

  const handleEditorChange = (content) => {
    setTaskDescription(content);
  };

  useEffect(() => {
    Modal.setAppElement("#root");
  });

  return (
    <Modal
      isOpen={isOpenCreateTask}
      onRequestClose={handleCloseCreateTask}
      contentLabel="Create Task"
      className={"tp-modal"}
      overlayClassName={"tp-modal_overlay"}
    >
      <div className="tp-flex_content">
        <div className="tp-flex_first_bar">
          <p className="tp-title">Title (required)</p>
          <IoMdClose className="tp-close" onClick={handleCloseCreateTask} />
        </div>
        <input
          type="text"
          placeholder="Enter title..."
          className="tp-input_title"
          onChange={(e) => setTaskName(e.target.value)}
        ></input>
        <div className="tp-flex_second_bar">
          <p className="tp-description">Description</p>
          <RichText
            className="tp-text_area"
            onEditorChange={handleEditorChange}
          />
        </div>
        <div className="tp-flex_more_options">
          <div className="tp-assignees">
            <p className="tp-label_select">Assignees</p>
            <Select
              styles={customStyles}
              closeMenuOnSelect={false}
              components={{
                Option: CustomOption,
                ...animatedComponents,
              }}
              isMulti
              options={formattedUsers}
              onChange={handleUserSelection} 
            />
          </div>
          <div className="tp-labels">
            <p className="tp-label_select">Labels</p>
            <Select
              styles={otherCustomStyles}
              isMulti
              onChange={setSelectedTags}
              options={tagOptions}
              value={selectedTags}
              components={{
                DropdownIndicator,
              }}
            />
            <TagCreationModal
              isOpen={isTagModalOpen}
              onClose={() => setIsTagModalOpen(false)}
              onCreateTag={handleCreateTag}
              existingTags={tagOptions} // Passer les tags existants ici
            />
          </div>
        </div>
        <div className="tp-submit_form">
          <button className="tag-button_cancel" onClick={handleCloseCreateTask}>
            Cancel
          </button>
          <button className="tag-button_validate_form" onClick={createNewTask}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskCreation;
