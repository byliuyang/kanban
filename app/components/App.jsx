import React from 'react';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';
import AltContainer from 'alt-container';

export default class App extends React.Component {

    render() {
        return <div>
            <button className="add-note"
                    onClick={this.addNote}>+
            </button>
            <AltContainer
                stores={[NoteStore]}
                inject={{
                    notes: () => NoteStore.getState().notes
                }}>
                <Notes
                    onEdit={this.editNote}
                    onDelete={this.deleteNote}></Notes>
            </AltContainer>
        </div>;
    }

    addNote = () => {
        NoteActions.create({task: 'New task'});
    };

    editNote = (id, task) => {
        // Don't modify if trying to set empty value
        if (!task.trim())
            return;

        NoteActions.update({id, task});
    };

    deleteNote = (id, e) => {
        // Avoid bubbling to edit
        e.stopPropagation();

        NoteActions.delete(id);
    };
}