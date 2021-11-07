import * as React from "react";
import {observer} from 'mobx-react';
import {useEffect, useState} from 'react';
import "./index.css";
import classNames = require('classnames');
import {KeyboardArrowUp} from '@material-ui/icons';

export interface IProps {
  children: React.ReactNode;
  title: string;
  open?: boolean;
}

function NavExpansionPanel({title, open: openProp, children}: IProps) {
  const [open, setOpen] = useState(openProp ?? false);
  useEffect(() => setOpen(openProp ?? false), [openProp]);
  return (
    <div className={'expansion-panel'}>
      <div className={classNames('expansion-header', {
        open,
      })} onClick={() => setOpen(!open)}>
        <div className={'expansion-header__title'}>{title}</div>
        <div className={'expansion-header__arrow'}>
          <KeyboardArrowUp />
        </div>
      </div>
      {open && children}
    </div>
  );
}

export default observer(NavExpansionPanel);
