import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import TodoListLinks from './TodoListLinks'
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';

class HomeScreen extends Component {
    handleNewList = () => {
        var newbind = this;
        var date = new Date();
        const fireStore = getFirestore();
        fireStore.collection('todoLists').add({
            name: "Unknown",
            owner: "Unknown",
            items: [],
            timestamp: date.getTime()
        })
        .then(function(todoList) {
            newbind.props.history.push("/todoList/" + todoList.id);
        })
    }

    render() {
        const todoLists = this.props.todoLists;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <TodoListLinks />
                    </div>

                    <div className="col s8">
                        <div className="banner">
                            @todo<br />
                            List Maker
                        </div>
                        
                    <div className="home_new_list_container">
                        <button className="home_new_list_button" onClick={this.handleNewList}>
                            Create a New To Do List
                         </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
      { collection: 'todoLists', orderBy: 'timestamp'},
    ]),
)(HomeScreen);