/* @flow */
import React from 'react';

export default class Editable extends React.Component {

    static props:{
        value?: string,
        editing?: boolean,
        onEdit?: Function,
        onDelete?: Function,
        onValueClick?: Function,
    };

    static defaultProps = {
        value: '',
        editing: 'false',
        onEdit: () => {
        }
    };

    render():Object {

        const {value, onEdit, onValueClick, editing, ...props} = this.props;

        // Render the component differently based on state.
        return (
            <div {...props}>
                {editing ? this.renderEdit() : this.renderValue()}
            </div>
        );
    }

    renderEdit:() => Object = () => {
        return <input type="text"
                      ref={ element => element ?
                      element.selectionStart =
                      this.props.value.length : null}
                      autoFocus={true}
                      defaultValue={this.props.value}
                      onBlur={this.finishEdit}
                      onKeyPress={this.checkEnter}/>;
    };

    renderValue:() => Object = () => {
        // If user clicks a normal note,
        // trigger editing logic.
        const onDelete = this.props.onDelete;
        return (
            <div onClick={this.props.onValueClick}>
                <span className="value">{this.props.value}</span>
                {onDelete ? this.renderDelete() : null}
            </div>
        );
    };

    renderDelete:() => Object = () => {
        return <button
            className="delete"
            onClick={this.props.onDelete}>x</button>;
    };

    checkEnter:(e:Object) => void = (e) => {
        // The user hit *Enter*, let's
        // finish up
        if (e.key === "Enter")
            this.finishEdit(e);
    };

    finishEdit:(e:Object) => void = (e) => {
        // `Note` will trigger an optional `onEdit` callback
        // once it has a new value.
        //
        // We'll use this to communicate the change to `App`
        this.props.onEdit(e.target.value);
    };
}