/* @flow */
import React from 'react';
import {DragSource, DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteSource = {
    beginDrag(props) {
        return {id: props.id}
    }
};

const noteTarget = {
    hover(targetProps, monitor) {
        const targetId = targetProps.id;
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if (targetId !== sourceId) {
            targetProps.onMove({sourceId, targetId});
        }
    }
};

class Note extends React.Component {
    static props:{
        id: string,
        editing?: boolean,
        connectDragSource?: Function,
        connectDropTarget?: Function,
        isDragging?: boolean,
        onMove?: Function
    };

    static defaultProps = {
        onMove: () => {
        }
    };

    render():Object {
        const {connectDragSource, connectDropTarget, isDragging, editing, ...props} = this.props;

        // Pass through if we are editing
        const dragSource = editing ? a => a : connectDragSource;

        return dragSource(
            connectDropTarget(
                <li style={{
                    opacity: isDragging ? 0 : 1
                }} {...props}>{props.children}</li>
            )
        );
    }
}

export default DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    // Map isDragging state to isDragging property
    isDragging: monitor.isDragging()
}))(DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))(Note));
