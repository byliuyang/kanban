import React from 'react';
import uuid from 'node-uuid';
import Notes from './Notes'

export default class App extends React.Component {
    constructor(prop) {
        super(prop);
        this.state = {
            notes: [
                {
                    id: uuid.v4(),
                    task: 'Learn webpack'
                },
                {
                    id: uuid.v4(),
                    task: 'Learn React'
                },
                {
                    id: uuid.v4(),
                    task: 'Launch'
                }
            ]
        };
    }

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
        this.setState({
            notes: this.state.notes.concat({
                id: uuid.v4(),
                task: 'New Note'
            })
        })
    };

    editNote = (id, task) => {
        // Don't modify if trying to set empty value
        if (!task.trim())
            return;

        const notes = this.state.notes.map((note) => {
            if (note.id === id && task)
                note.task = task;
            return note;
        });

        this.setState({notes});
    };

    deleteNote = (id, e) => {
        // Avoid bubbling to edit
        e.stopPropagation();

        console.log("Delete");

        this.setState({
            notes: this.state.notes.filter((note)=>
                note.id !== id
            )
        });
    };
}
