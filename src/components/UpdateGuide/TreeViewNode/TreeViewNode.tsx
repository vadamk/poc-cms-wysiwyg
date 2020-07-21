import React from 'react';
import cx from 'classnames';
import { Button } from 'antd';

import ChevronDown from 'assets/ChevronDown';

import sty from './TreeViewNode.module.scss';

export interface TreeViewNodeProps {
  title: string;
  actions?: React.ReactNode[];
  data?: any;
  isActive?: boolean;
  defaultExpanded?: boolean;
  onClick?: (data?: any) => void;

  children?: React.ReactNode;
}

const TreeViewNode: React.FC<TreeViewNodeProps> = ({
  title,
  actions = [],
  data,
  isActive = false,
  defaultExpanded = false,
  onClick = () => null,

  children,
}) => {
  const [isExpanded, setExpanded] = React.useState(defaultExpanded);

  const handleItemClick = React.useCallback(() => {
    onClick(data);
    setExpanded(true);
  }, [onClick, data]);

  const handleActionClick = React.useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
  }, []);

  const toggleExpanded = React.useCallback(
    (ev: React.MouseEvent) => {
      ev.stopPropagation();
      setExpanded(!isExpanded);
    },
    [isExpanded],
  );

  return (
    <>
      <div
        className={cx(sty.treeViewItem, 'ripple', isActive && sty.active)}
        onClick={handleItemClick}
      >
        <span>
          {children && (
            <Button
              shape="circle"
              type="text"
              icon={
                <ChevronDown
                  style={{ transform: `rotate(${isExpanded ? 0 : '-90'}deg)` }}
                />
              }
              className={sty.expandButton}
              onClick={toggleExpanded}
            />
          )}{' '}
          {title}
        </span>
        <div className={sty.actions} onClick={handleActionClick}>
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      </div>
      {children && isExpanded && <div className={sty.children}>{children}</div>}
    </>
  );
};

export default React.memo(TreeViewNode);
