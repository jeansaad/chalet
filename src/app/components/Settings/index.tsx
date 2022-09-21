import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import { JsonEditor as Editor } from "jsoneditor-react";

import { IMonitor } from "../../Store";
import * as api from "../../api";

import "./index.css";
import "./editor.css";

interface IProps {
  monitor: IMonitor;
  onClose: () => void;
}

const Settings: React.FC<IProps> = (props) => {
  const { monitor, onClose } = props;
  const [env, setEnv] = React.useState(monitor?.data.originalEnv);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleChange = (input: Record<any, any>) => {
    setEnv(input);
  };

  const save = async () => {
    setIsSaving(true);
    await api.updateMonitor(monitor.id, { env });
    onClose();
  };

  return (
    <div className="settings-config">
      <Editor
        navigationBar={false}
        statusBar={false}
        search={false}
        mode="form"
        value={env}
        onChange={handleChange}
      />
      <div className="settings-config-footer">
        <div className="settings-config-footer-btn">
          <Button
            size="small"
            variant="contained"
            color="primary"
            disabled={isSaving}
            onClick={save}
            startIcon={<SaveIcon />}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="settings-config-footer-btn">
          <Button size="small" variant="contained" onClick={props.onClose} startIcon={<CancelIcon />}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
