import { TbTriangleMinus2 } from "react-icons/tb";
import { MinidenticonImg } from "../../Utils/BulkUtilsImport";
import "./PrimaryMenuBar.scss";
const PrimaryMenuBar = ({ p_ProjectName, p_UserName }) => {
  return (
    <div className="pmb-menu_bar_primary">
      <div className="left-group">
        <TbTriangleMinus2 className="pmb-triangle_icon" />
        <p className="pmb-project_title">{p_ProjectName}</p>
      </div>

      <div className="right-group">
        <div className="pmb-search_bar">
          <input
            type="text"
            id="search_task"
            name="search_task"
            placeholder="Search Tasks..."
            className="pmb-input_search_bar"
          />
        </div>
        <div className="pmb-user_profile">
          <MinidenticonImg
            username={p_UserName}
            saturation="90"
            width="52"
            height="52"
            className="p-user_profile_picture"
          />
        </div>
      </div>
    </div>
  );
};

export default PrimaryMenuBar;
