import React from 'react';

class Editable extends React.Component {

    render() {

        const {value, onEdit, onValueClick, editing, ...props} = this.props;

        // Render the component differently based on state.
        return (
            <div {...props}>
                {editing ? this.renderEdit() : this.renderValue()}
            </div>
        );
    }

    renderEdit = () => {
        return <input type="text"
                      ref={ element => element ?
                      element.selectionStart =
                      this.props.value.length : null}
                      autoFocus={true}
                      defaultValue={this.props.value}
                      onBlur={this.finishEdit}
                      onKeyPress={this.checkEnter}/>;
    };

    renderValue = () => {
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

    renderDelete = () => {
        return <button
            className="delete"
            onClick={this.props.onDelete}>x</button>;
    };

    checkEnter = (e) => {
        // The user hit *Enter*, let's
        // finish up
        if (e.key === "Enter")
            this.finishEdit(e);
    };

    finishEdit = (e) => {
        // `Note` will trigger an optional `onEdit` callback
        // once it has a new value.
        //
        // We'll use this to communicate the change to `App`
        this.props.onEdit(e.target.value);
    };
}

Editable.propTypes = {
    value: React.PropTypes.string,
    onEdit: React.PropTypes.func,
    onValueClick: React.PropTypes.func,
    onDelete: React.PropTypes.func,
    editing: React.PropTypes.bool
};

Editable.defaultProps = {
    value: '',
    editing: 'false',
    onEdit: () => {
    }
};

export default Editable;