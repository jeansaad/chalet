import * as React from 'react'
import {observer} from 'mobx-react'
import * as classNames from 'classnames'
import {IMonitor, RUNNING} from '../../Store'
import Link from '../Link'
import Switch from '../Switch'
import NavExpansionPanel from '../NavExpansionPanel';
import "./index.css";

export interface IProps {
  monitors: Map<string, IMonitor>
  selected: string
  onMonitorClick?: (id: string) => void
  onMonitorToggle?: (id: string) => void
  depth?: number
}

function MonitorList({
                       monitors,
                       selected,
                       onMonitorClick,
                       onMonitorToggle,
                     }: IProps) {
  const monitorClickCallback = onMonitorClick ?? (() => undefined)
  const monitorToggleCallback = onMonitorToggle ?? (() => undefined)
  const groups = Array.from(monitors)
    .filter(([id]) => id.includes('/'))
    .reduce((prev, [id, monitor]) => {
      const segments = id.split('/')
      const firstSegment = segments.shift()!

      if (!(firstSegment in prev)) {
        prev[firstSegment] = new Map<string, IMonitor>()
      }

      prev[firstSegment].set(segments.join('/'), monitor)

      return prev
    }, {} as Record<string, Map<string, IMonitor>>)

  return (
    <ul>
      {Array.from(monitors)
        .filter(([id]) => !id.includes('/'))
        .map(([id, monitor]) => {
          return (
            <li
              key={id}
              className={classNames('monitor', {
                running: monitor.status === RUNNING,
                selected: id === selected
              })}
              onClick={() => monitorClickCallback(id)}
            >
              <span>
                <Link id={id} />
              </span>
              <span>
                <Switch
                  onClick={() => monitorToggleCallback(id)}
                  checked={monitor.status === RUNNING}
                />
              </span>
            </li>
          )
        })}
      {Object.entries(groups).map(([key, group]) => {
        return (
          <li key={key}>
            <NavExpansionPanel title={key} open={selected.startsWith(`${key}/`) || undefined}>
              <div className={'monitor-group'}>
                <MonitorList monitors={group}
                             selected={selected.replace(new RegExp(`^${key}\/`), '')}
                             onMonitorClick={id => monitorClickCallback(`${key}/${id}`)}
                             onMonitorToggle={id => monitorToggleCallback(`${key}/${id}`)}
                />
              </div>
            </NavExpansionPanel>
          </li>
        )
      })}
    </ul>
  )
}

export default observer(MonitorList);
