import { observer } from "mobx-react";
import * as React from "react";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ClearAllIcon from "@material-ui/icons/ClearAll";
import SettingsIcon from "@material-ui/icons/Settings";
import Collapse from "@material-ui/core/Collapse";
import Link from "../Link";
import Settings from "../Settings";

import Store, { RUNNING } from "../../Store";
import "./index.css";

export interface IProps {
  store: Store;
}

interface IState {
  settingsOpen: boolean;
}

@observer
class Content extends React.Component<IProps, IState> {
  private el: HTMLDivElement | null = null;
  private atBottom: boolean = true;
  private keydownListener: ((event: KeyboardEvent) => void) | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = { settingsOpen: false };
  }

  public getKeydownListener(store: Store) {
    if (this.keydownListener == null) {
      this.keydownListener = (event: KeyboardEvent) => {
        const selectedMonitor = store.monitors.get(store.selectedMonitorId);
        const isSelectedMonitorRunning = selectedMonitor?.status === RUNNING;
        // shift + alt to avoid system shortcuts
        if (event.shiftKey && event.altKey) {
          switch (event.code) {
            case "KeyK":
              store.clearOutput(store.selectedMonitorId);
              break;
            case "KeyS":
              this.scrollToBottom();
              break;
            case "Comma":
              if (!isSelectedMonitorRunning) {
                this.scrollToBottom();
              }
              store.toggleMonitor(store.selectedMonitorId);
              break;
            case "Period":
              if (!isSelectedMonitorRunning) {
                store.clearOutput(store.selectedMonitorId);
              }
              store.toggleMonitor(store.selectedMonitorId);
              break;
          }
        }
      };
    }
    return this.keydownListener;
  }

  public componentDidMount() {
    document.addEventListener(
      "keydown",
      this.getKeydownListener(this.props.store)
    );
  }

  public componentWillUnmount() {
    document.removeEventListener(
      "keydown",
      this.getKeydownListener(this.props.store)
    );
    this.state;
  }

  public componentWillUpdate() {
    if (this.el) {
      this.atBottom = this.isAtBottom();
      if (this.state.settingsOpen) {
        this.setState({
          settingsOpen: false,
        });
      }
    }
  }

  public componentDidUpdate() {
    if (this.atBottom) {
      this.scrollToBottom();
    }
  }

  public isAtBottom() {
    if (this.el) {
      const { scrollHeight, scrollTop, clientHeight } = this.el;
      return scrollHeight - scrollTop === clientHeight;
    } else {
      return true;
    }
  }

  public scrollToBottom() {
    if (this.el) {
      this.el.scrollTop = this.el.scrollHeight;
    }
  }

  public onScroll() {
    this.atBottom = this.isAtBottom();
  }

  public toggleSettings() {
    const isOpen = this.state.settingsOpen;
    this.setState({
      settingsOpen: !isOpen,
    });
  }

  public render() {
    const { store } = this.props;
    const monitor = store.monitors.get(store.selectedMonitorId);

    return (
      <div
        className="content"
        onScroll={() => this.onScroll()}
        ref={(el) => {
          this.el = el;
        }}
      >
        <div className="content-bar">
          <span>
            <Link id={store.selectedMonitorId} />
          </span>
          <span>
            <button title="Edit Config" onClick={() => this.toggleSettings()}>
              <SettingsIcon />
            </button>
            <button
              title="Clear output (shift + alt + K)"
              onClick={() => store.clearOutput(store.selectedMonitorId)}
            >
              <ClearAllIcon />
            </button>
            <button
              title="Scroll to bottom (shift + alt + S)"
              onClick={() => this.scrollToBottom()}
            >
              <ArrowDownwardIcon />
            </button>
          </span>
        </div>
        <Collapse in={this.state.settingsOpen} mountOnEnter unmountOnExit>
          {monitor && (
            <Settings monitor={monitor} onClose={() => this.toggleSettings()} />
          )}
        </Collapse>
        <pre>
          {monitor &&
            monitor.output.map((line) => (
              <div
                key={line.id}
                dangerouslySetInnerHTML={{ __html: line.html }}
              />
            ))}
        </pre>
      </div>
    );
  }
}

export default Content;
