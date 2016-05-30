import React from 'react';
import AltContainer from 'alt-container';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import LaneActions from '../actions/LaneActions';

export default class Line extends React.Component {
    render() {
        const {lane, ...props} = this.props;

        return (
            <div {...props}>
                <div className="lane-header">
                    <div className="lane-add-note">
                        <button onClick={this.addNote}>+</button>
                    </div>
                    <div className="lane-name">{lane.name}</div>
                </div>
                <AltContainer
                    stores={[NoteStore]}
                    inject={{
                        notes:() => NoteStore.getNotesByIds(lane.notes)
                    }}>
                    <Notes
                        onEdit={this.editNote}
                        onDelete={this.deleteNote}/>
                </AltContainer>
            </div>
        );
    }

    editNote = (id, task) => {
        // Don't modify if trying to set an empty value
        if (!task.trim())
            return;

        NoteActions.update({
            id: id,
            task: task
        });
    };

    addNote = () => {
        const laneId = this.props.lane.id;
        const note = NoteActions.create({task: "New note"});

        LaneActions.attachToLane({
            noteId: note.id,
            laneId
        })
    };

    deleteNote = (noteId, e) => {
        // Avoid bubbling to edit
        e.stopPropagation();

        const laneId = this.props.lane.id;

        LaneActions.detachFromLane({noteId, laneId});
        NoteActions.delete(noteId);
    };
}
