// DraggableCard.js
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { useSpring, animated } from 'react-spring';

const DraggableCard = ({ id, text, index }) => {
  const props = useSpring({
    opacity: 1,
    transform: 'translate3d(0,0,0)',
    from: { opacity: 0, transform: 'translate3d(0,-50px,0)' },
  });

  return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) => (
        <animated.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{ ...styles.draggableCard, ...props }}
        >
          {text}
        </animated.div>
      )}
    </Draggable>
  );
};

const styles = {
  draggableCard: {
    border: '1px solid #ccc',
    padding: '16px',
    marginBottom: '8px',
    backgroundColor: 'white',
  },
};

export default DraggableCard;
