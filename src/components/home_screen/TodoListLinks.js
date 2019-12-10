import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import TodoListCard from './TodoListCard';
import { getFirestore } from 'redux-firestore';
class TodoListLinks extends React.Component {

    handleTop(id) {
        var date = new Date();
        const fireStore = getFirestore();
        console.log(id);
        fireStore.collection('wireFrames').doc(id).update({timestamp: date.getTime()});
    }

    render() {
        const auth = this.props.auth;
        console.log(auth.uid);
        const wireFrames = this.props.wireFrames
        var wireFramer = wireFrames;
        console.log(wireFramer);
        return (
            <div className="todo-lists section">
                {wireFrames && wireFrames.slice(0).filter(wireFrame => wireFrame.owner == auth.uid).reverse().map(wireFrames => (
                    <Link to={'/todoList/' + wireFrames.id} onClick = {this.handleTop.bind(this, wireFrames.id)} key={wireFrames.id}>
                        <TodoListCard wireFrames={wireFrames} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireFrames: state.firestore.ordered.wireFrames,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);