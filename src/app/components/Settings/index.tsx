import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import Fab from "@material-ui/core/Fab";

import { IMonitor } from "../../Store";
import * as api from "../../api";

import "./index.css";

interface IProps {
  monitor: IMonitor;
  onClose: () => void;
}

const Settings: React.FC<IProps> = (props) => {
  const { monitor, onClose } = props;
  const [env, setEnv] = React.useState(monitor?.data.originalEnv);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isAdding, setIsAdding] = React.useState(false);
  const [addLabel, setAddLabel] = React.useState("");
  const [addValue, setAddValue] = React.useState("");

  const onValueChange = (name: string, value: any) => {
    const newEnv = { ...env };
    newEnv[name] = value;
    setEnv(newEnv);
  };

  const add = async () => {
    const newEnv = { 
      ...env,
      [addLabel]: addValue
    }
    setEnv(newEnv);
    toggleAdd();
  };

  const toggleAdd = () => {
    if (isAdding) {
      setIsAdding(false);
      setAddLabel("");
      setAddValue("");
    } else {
      setIsAdding(true);
    }
  };

  const remove = (key: string) => {
    if(env[key]){
      const { [key]: oldKey, ...newEnv } = env;
      setEnv(newEnv);
    }
  }

  const save = async () => {
    setIsSaving(true);
    await api.updateMonitor(monitor.id, { env });
    onClose();
    setIsSaving(false);
  };

  return (
    <div className="settings-config">
      <div className="setting-config-header">
        <div className="settings-config-header-label">
        <h1>Settings</h1>
    </div>
        <div className="settings-config-header-actions">
          {!isAdding && (
            <Fab
              color="primary"
              aria-label="add-setting"
              onClick={() => toggleAdd()}
            >
              <AddIcon />
            </Fab>
          )}
          {isAdding && (
            <div className="settings-config-header-actions-add">
              <TextField
                id="settings-config-header-actions-add-label"
                label="Setting Label"
                value={addLabel}
                variant="outlined"
                onChange={(e) => setAddLabel(e.target.value)}
                fullWidth
              />
              <TextField
                id="settings-config-header-actions-add-value"
                label="Setting Value"
                value={addValue}
                variant="outlined"
                onChange={(e) => setAddValue(e.target.value)}
                fullWidth
              />
              <Button color='primary' variant="contained" onClick={() => add()}>
                Save Setting
              </Button>
              <Button variant="contained" onClick={() => toggleAdd()}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="settings-config-items">
        {Object.keys(env).map((name) => (
          <div className="settings-config-item">
            <TextField
              id={`settings-${name}`}
              label={name}
              value={env[name]}
              variant="outlined"
              onChange={(e) => onValueChange(name, e.target.value)}
              fullWidth
            />
          <IconButton aria-label="delete" onClick={() => remove(name)}>
            <DeleteIcon />
          </IconButton>
          </div>
        ))}
      </div>
      <div className="settings-config-footer">
        <div className="settings-config-footer-btn">
          <Button
            variant="contained"
            color="primary"
            disabled={isSaving}
            onClick={() => save()}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
        <div className="settings-config-footer-btn">
          <Button variant="contained" onClick={() => props.onClose()}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
