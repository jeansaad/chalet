import * as React from "react";
import "./index.css";

function makeShortcutText(key: string): string {
  return `alt + shift + ${key}:`;
}

type Props = {
  visible: boolean;
  hide: () => void;
};

export default function KeyboardShortcutsModal({ visible, hide }: Props) {
  return visible ? (
    <div className="modal-bg" onClick={hide}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h3>Keyboard Shortcuts</h3>
          <button onClick={hide}>Done</button>
        </div>
        <ul>
          <li>
            <b>{makeShortcutText("up")}</b> Select previous monitor
          </li>
          <li>
            <b>{makeShortcutText("down")}</b> Select next monitor
          </li>
          <li>
            <b>{makeShortcutText("comma")}</b> Toggle current monitor, scroll to
            bottom
          </li>
          <li>
            <b>{makeShortcutText("period")}</b> Toggle current monitor, clear
            output
          </li>
          <li>
            <b>{makeShortcutText("k")}</b> Clear current output
          </li>
          <li>
            <b>{makeShortcutText("s")}</b> Scroll to bottom of current output
          </li>
          <li>
            <b>{makeShortcutText("?")}</b> Show keyboard shortcuts
          </li>
        </ul>
      </div>
    </div>
  ) : null;
}
