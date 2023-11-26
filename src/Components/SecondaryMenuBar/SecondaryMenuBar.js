import "./SecondaryMenuBar.scss";

//TODO: Query BoardLayouts so they available in a map for the dropdown

const SecondaryMenuBar = () => {
  return (
    <div className="smb-menu_bar_secondary">
      <div className="smb-board_layouts">
        <select name="BoardLayouts" className="smb-board_dropdown" id="BoardLayouts">
          <option className="smb-dropdown_option" value="Workflow">Workflow</option>
          <option className="smb-dropdown_option" value="Bug_Tracker">Bug Tracker</option>
        </select>
      </div>
      <div className="smb-search_filters_container">
        <input
          type="text"
          className="smb-search_filters"
          placeholder="Search or filter..."
        ></input>
      </div>
      <div className="smb-small_buttons">
        <button className="smb-small_action_button">Edit Layout</button>
        <button className="smb-small_action_button">Add list</button>
        <button className="smb-small_action_button">New Issue</button>
      </div>
    </div>
  );
};

export default SecondaryMenuBar;
