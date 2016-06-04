import React from 'react';
import {
    renderIntoDocument,
    findRenderedDOMComponentWithClass,
    findRenderedDOMComponentWithTag,
    Simulate
} from 'react-addons-test-utils';
import assert from 'assert';
import Editable from '../app/components/Editable';

describe('Editable', () => {
    it('renders value', () => {
        const value = 'value';
        const component = renderIntoDocument(
            <Editable value={value}/>
        );

        const valueComponent = findRenderedDOMComponentWithClass(component, 'value');

        assert.equal(valueComponent.textContent, value);
    });

    it('triggers onValueClick', () => {
        let triggered = false;

        const value = 'value';
        const onValueClick = () => triggered = true;
        const component = renderIntoDocument(
            <Editable value={value} onValueClick={onValueClick}/>
        );

        const valueComponent = findRenderedDOMComponentWithClass(component, 'value');
        Simulate.click(valueComponent);

        assert.equal(triggered, true);
    });

    it('triggers onEdit', () => {
        let triggers = false;
        const newValue = 'newValue';
        const onEdit = (val) => {
            triggers = true;
            assert.equal(val, newValue);
        };

        const component = renderIntoDocument(
            <Editable editing={true} value={'value'} onEdit={onEdit}/>
        );

        const input = findRenderedDOMComponentWithTag(component, 'input');
        input.value = newValue;

        Simulate.blur(input);

        assert.equal(triggers, true);
    });
});