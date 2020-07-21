import React from 'react';
import cx from 'classnames';
import { RightOutlined, DownOutlined } from '@ant-design/icons';

import sty from './TreeViewItem.module.scss';

export interface TreeViewItemProps {
  title: string,
  actions?: React.ReactNode[],
  data?: any;
  isActive?: boolean;
  isExpanded?: boolean;
  onClick?: (data?: any) => void,

  children?: React.ReactNode
}

const TreeViewItem: React.FC<TreeViewItemProps> = ({
  title,
  actions = [],
  data,
  isActive = false,
  isExpanded,
  onClick = () => null,

  children,
}) => {

  const handleItemClick = React.useCallback(() => {
    onClick(data);
  }, [onClick, data]);

  const handleActionClick = React.useCallback((ev: React.MouseEvent) => {
    ev.stopPropagation();
  }, []);

  const Caret = React.useCallback(() => isExpanded
    ? <DownOutlined />
    : <RightOutlined />
  , [isExpanded]);

  return (
    <>
      <div
        className={cx(sty.treeViewItem, 'ripple', isActive && sty.active)}
        onClick={handleItemClick}
      >
        <span>
          {isExpanded !== undefined && <Caret />}{' '}
          {title}
        </span>
        <div className={sty.actions} onClick={handleActionClick}>
          {actions.map((action, index) => (
            <React.Fragment key={index}>{action}</React.Fragment>
          ))}
        </div>
      </div>
      {(children && isExpanded) && (
        <div className={sty.children}>{children}</div>
      )}
    </>
  );
};

export default React.memo(TreeViewItem);
