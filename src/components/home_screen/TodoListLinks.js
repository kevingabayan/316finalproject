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
        fireStore.collection('todoLists').doc(id).update({timestamp: date.getTime()});
    }

    render() {
        const todoLists = this.props.todoLists
        console.log(todoLists);
        return (
            <div className="todo-lists section">
                {todoLists && todoLists.slice(0).reverse().map(todoList => (
                    <Link to={'/todoList/' + todoList.id} onClick = {this.handleTop.bind(this, todoList.id)} key={todoList.id}>
                        <TodoListCard todoList={todoList} />
                    </Link>
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        todoLists: state.firestore.ordered.todoLists,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(TodoListLinks);