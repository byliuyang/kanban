import React from 'react';
import AltContainer from 'alt-container';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';
import Editable from './Editable';
import {DropTarget} from 'react-dnd';
import ItemTypes from '../constants/itemTypes';

const noteTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem();
        const sourceId = sourceProps.id;

        if (!targetProps.lane.notes.length) {
            LaneActions.attachToLane({
                laneId: targetProps.lane.id,
                noteId: sourceId
            })
        }

    }
};

@DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
}))
class Lane extends React.Component {
    render() {
        const {connectDropTarget, lane, ...props} = this.props;

        return connectDropTarget(
            <div {...props}>
                <div className="lane-header" onClick={this.activateLaneEdit}>
                    <div className="lane-add-note">
                        <button onClick={this.addNote}>+</button>
                    </div>
                    <Editable
                        className="lane-name"
                        editing={lane.editing}
                        value={lane.name}
                        onEdit={this.editName}/>
                    <div className="lane-delete">
                        <button onClick={this.deleteLane}>x</button>
                    </div>
                </div>
                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        notes:() => NoteStore.getNotesByIds(lane.notes)
                    }}>
                    <Notes
                        onValueClick={this.activateNoteEdit}
                        onEdit={this.editNote}
                        onDelete={this.deleteNote}/>
                </AltContainer>
            </div>
        );
    }

    editNote = (id, task) => {
        // Don't modify if trying to set an empty value
        if (!task.trim()) {
            NoteActions.update({id, editing: false});
            return;
        }

        NoteActions.update({
            id,
            task,
            editing: false
        });
    };

    addNote = (e) => {
        // If note is added, avoid opening lane name edit by stopping
        // event bubbling in this case
        e.stopPropagation();

        const laneId = this.props.lane.id;
        const note = NoteActions.create({task: 'New note'});

        LaneActions.attachToLane({
            noteId: note.id,
            laneId
        })
    };

    editName = (name) => {
        const laneId = this.props.lane.id;

        // Don't modify if trying to set an empty value
        if (!name.trim()) {
            LaneActions.update({id: laneId, editing: false});
            return;
        }

        LaneActions.update({id: laneId, name, editing: false});
    };

    deleteNote = (noteId, e) => {
        // Avoid bubbling to edit
        e.stopPropagation();

        const laneId = this.props.lane.id;

        LaneActions.detachFromLane({noteId, laneId});
        NoteActions.delete(noteId);
    };

    deleteLane = () => {
        const laneId = this.props.lane.id;

        LaneActions.delete(laneId);

        console.log(`delete lane ${laneId}`);
    };

    activateLaneEdit = () => {
        const laneId = this.props.lane.id;

        LaneActions.update({id: laneId, editing: true});

        console.log(`active lane ${laneId} edit`);
    };

    activateNoteEdit = (id) => {

        NoteActions.update({id, editing: true});

        console.log(`active note ${id} edit`);
    };

}
Lane.propTypes = {
    lane: React.PropTypes.shape({
        id: React.PropTypes.string.isRequired,
        editing: React.PropTypes.bool,
        name: React.PropTypes.string,
        notes: React.PropTypes.array
    }).isRequired,
    connectDropTarget: React.PropTypes.func
};
Lane.defaultProps = {
    name: '',
    notes: []
};

export default Lane;
