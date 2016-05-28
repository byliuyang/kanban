import React from 'react';
import Notes from './Notes';
import NoteActions from '../actions/NoteActions';
import NoteStore from '../stores/NoteStore';

export default class App extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = NoteStore.getState();
    }

    componentDidMount() {
        NoteStore.listen(this.storeChanged);
    }

    componentWillUnmount() {
        NoteStore.unlisten(this.storeChanged);
    }

    storeChanged = (state) => {
        this.setState(state);
    };

    render() {
        const notes = this.state.notes;
        return <div>
            <button className="add-note"
                    onClick={this.addNote}>+
            </button>
            <Notes notes={notes}
                   onEdit={this.editNote}
                   onDelete={this.deleteNote}></Notes>
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