import * as classNames from "classnames";
import { observer } from "mobx-react";
import KeyboardIcon from "@material-ui/icons/Keyboard";
import * as React from "react";
import Store, { RUNNING } from "../../Store";
import Link from "../Link";
import Switch from "../Switch";
import "./index.css";
import KeyboardShortcutsModal from "../KeyboardShortcutsModal";

const examples = `~/app$ chalet add 'cmd'
~/app$ chalet add 'cmd -p $PORT'
~/app$ chalet add http://192.16.1.2:3000`;

export interface IProps {
  store: Store;
}

function Nav({ store }: IProps) {
  const { isLoading, selectedMonitorId, monitors, proxies } = store;

  const [
    showKeyboardShortcutsModal,
    setShowKeyboardShortcutsModal,
  ] = React.useState(false);

  React.useEffect(() => {
    function getCurrentMonitorState() {
      const monitorsArray = Array.from(store.monitors);
      const currentIndex = monitorsArray.findIndex(([id, monitor]) => {
        return store.selectedMonitorId === id;
      });

      if (currentIndex === -1) {
        return {
          current: null,
          next: monitorsArray[0],
          prev: monitorsArray[monitorsArray.length - 1],
        };
      }

      return {
        current: monitorsArray[currentIndex],
        next:
          currentIndex < monitorsArray.length - 1
            ? monitorsArray[currentIndex + 1]
            : null,
        prev: currentIndex > 0 ? monitorsArray[currentIndex - 1] : null,
      };
    }

    function selectPrevMonitor() {
      const { prev } = getCurrentMonitorState();
      if (prev != null) {
        store.selectMonitor(prev[0]);
      }
    }

    function selectNextMonitor() {
      const { next } = getCurrentMonitorState();
      if (next != null) {
        store.selectMonitor(next[0]);
      }
    }

    const listener = (event: KeyboardEvent) => {
      // shift + alt to avoid system shortcuts
      if (event.shiftKey && event.altKey) {
        switch (event.code) {
          case "BracketLeft":
          case "ArrowUp":
            selectPrevMonitor();
            break;
          case "BracketRight":
          case "ArrowDown":
            selectNextMonitor();
            break;
          case "Slash":
            setShowKeyboardShortcutsModal((old) => !old);
            break;
        }
      }

      if (event.code === "Escape" && showKeyboardShortcutsModal) {
        setShowKeyboardShortcutsModal(false);
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.addEventListener("keydown", listener);
    };
  }, [store]);

  return (
    <div className="nav">
      <header>
        <span>chalet</span>
        <button
          title="View keyboard shortcuts (shift + alt + ?)"
          onClick={() => setShowKeyboardShortcutsModal(true)}
          className={classNames("keyboard-shortcuts-button", {
            active: showKeyboardShortcutsModal,
          })}
        >
          <KeyboardIcon />
        </button>
      </header>
      <div className={classNames("menu", { hidden: isLoading })}>
        {monitors.size === 0 && proxies.size === 0 && (
          <div>
            <p>To add a server, use chalet add</p>
            <pre>
              <code>{examples}</code>
            </pre>
          </div>
        )}

        {monitors.size > 0 && (
          <div>
            <h2>monitors</h2>
            <ul>
              {Array.from(monitors).map(([id, monitor]) => {
                return (
                  <li
                    key={id}
                    className={classNames("monitor", {
                      running: monitor.status === RUNNING,
                      selected: id === selectedMonitorId,
                    })}
                    onClick={() => store.selectMonitor(id)}
                  >
                    <span>
                      <Link id={id} />
                    </span>
                    <span>
                      <Switch
                        onClick={() => store.toggleMonitor(id)}
                        checked={monitor.status === RUNNING}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {proxies.size > 0 && (
          <div>
            <h2>proxies</h2>
            <ul>
              {Array.from(proxies).map(([id, proxy]) => {
                return (
                  <li key={id}>
                    <span>
                      <Link id={id} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <footer>
        <a href="https://github.com/jeansaad/chalet" target="_blank">
          README
        </a>
      </footer>
      <KeyboardShortcutsModal
        visible={showKeyboardShortcutsModal}
        hide={() => setShowKeyboardShortcutsModal(false)}
      />
    </div>
  );
}

export default observer(Nav);
