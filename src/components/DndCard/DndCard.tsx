import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { XYCoord } from 'dnd-core';

enum ItemTypes {
  CARD = 'CARD',
}

const style: React.CSSProperties = {
  position: 'relative',
  transform: 'translate3d(0px, 0px, 0px)',
};

export interface DndCardProps {
  id: any;
  index: number;
  type: string;
  originalIndex?: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  beginDragging?: (item) => void;
  onDrop: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  originalIndex?: number;
  id: string;
  type: string;
}

const DndCard: React.FC<DndCardProps> = ({
  id,
  children,
  index,
  originalIndex,
  type = ItemTypes.CARD,
  moveCard = () => null,
  beginDragging = () => null,
  onDrop = () => null,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [, drop] = useDrop({
    accept: type,
    drop: (item: DragItem) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      onDrop(dragIndex, hoverIndex);
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    item: { type: type, id, index, originalIndex },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
    begin: (item) => {
      beginDragging(item);
    },
    end: (dropResult, monitor) => {
      const { index, originalIndex } = monitor.getItem();
      const didDrop = monitor.didDrop()
      if (!didDrop && originalIndex !== undefined) {
        moveCard(index, originalIndex)
      }
    },
  });

  const opacity = isDragging ? 0.2 : 1;
  drag(drop(ref));

  return (
    <div ref={ref} style={{ ...style, opacity }}>
      {/* <MenuOutlined style={handleStyle} /> */}
      <span style={{ width: '30px', height: '30px', backgroundColor: '#f00' }} />
      {children}
    </div>
  );
};

export default DndCard;
