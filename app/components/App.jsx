import React from 'react';
import AltContainer from 'alt-container';
import Lanes from './Lanes';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LandStore';

export default class App extends React.Component {

    render() {
        return <div>
            <button className="add-line"
                    onClick={this.addLane}>+
            </button>
            <AltContainer
                stores={[LaneStore]}
                inject={{
                    lanes: () => LaneStore.getState().lanes || []
                }}>
                <Lanes />
            </AltContainer>
        </div>;
    }

    addLane = () => {
        LaneActions.create({name: 'New Lane'});
    };
}