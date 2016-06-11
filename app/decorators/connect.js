import React from 'react';

const connect = (Component, store) => {
  return class Connect extends React.Component {
    constructor (props) {
      super(props);

      this.stateChange = this.storeChanged.bind(this);
      this.state = store.getState();

      store.listen(this.stateChange);
    }

    componentWillUnmount () {
      store.unlisten(this.stateChange);
    }

    storeChanged() {
      this.setState(store.getState());
    }

    render() {
      return <Component {...this.props} {...this.state} />;
    }
  };
};

export default (store) => {
  return (target) => connect(target, store);
}
