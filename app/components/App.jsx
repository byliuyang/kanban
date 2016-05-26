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
            <button onClick={this.addNote}>+</button>
            <Notes notes={notes}></Notes>
        </div>;
    }

    addNote = () => {
        this.setState({
            notes: this.state.notes.concat({
                id: uuid.v4(),
                task: 'New Note'
            })
        })
    }
}
