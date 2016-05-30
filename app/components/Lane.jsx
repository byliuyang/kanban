import React from 'react';
import AltContainer from 'alt-container';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

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
                        notes:() => NoteStore.getState().notes || []
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
        if(!task.trim())
            return;

        NoteActions.update({
            id: id,
            task: task
        });
    };

    addNote = () => {
        NoteActions.create({task: "New note"});
    };

    deleteNote = (id, e) => {
        // Avoid bubbling to edit
        e.stopPropagation();

        NoteActions.delete(id);
    };
}
