import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemsList from './ItemsList.js'
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import {Modal} from 'react-materialize';

class ListScreen extends Component {
    state = {
        name: this.props.todoList.name,
        owner: this.props.todoList.owner
    }

    handleDeletion = () => {
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).delete();
        this.props.history.push("/");
    }

    handleChange = (e) => {
        const { target } = e;
        if(target.id == 'name') {
            const fireStore = getFirestore();
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({name: target.value});
        }
        else {
            const fireStore = getFirestore();
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({owner: target.value});
        }
        this.setState(state => ({
            ...state,
            [target.id]: target.value,
        }));
    }

    render() {
        const auth = this.props.auth;
        const todoList = this.props.todoList;
        if (!auth.uid) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container white">
                <div className = "row">
                    <h5 className="todoprompt col s11 grey-text text-darken-3">Todo List</h5>
                    <h5 href="#modal_trash_can" class= "trashcan col s1 right-align grey-text text-darken-3 waves-effect waves-light modal-trigger">&#128465;</h5>
                </div>
                <div className="input-field">
                    <label className = "active" htmlFor="email">Name</label>         
                    <input className="active" type="text" name="name" id="name" onChange={this.handleChange} value={this.state.name} /> 
                </div>
                <div className="input-field">
                    <label className = "active" htmlFor="password">Owner</label>
                    <input className="active" type="text" name="owner" id="owner" onChange={this.handleChange} value={this.state.owner} />
                </div>
                <ItemsList todoList={todoList}/>

                <Modal id = "modal_trash_can" class="modal">
                    <div className = "modal-content">
                        <header class="dialog_header">
                            Delete list?
                        </header>
                        <section class="dialog_content">
                            <p><b>Are you sure you want to delete this list?</b></p>
                        </section>
                        <button className = "waves-effect waves-light btn" onClick = {this.handleDeletion}>SUBMIT</button>
                        <br></br>
                        <footer class="dialog_footer">
                            <br></br>
                            The list will not be retreivable.
                            <br></br>
                            Hit "SUBMIT" to delete the list, or hit "CLOSE" to cancel.
                        </footer>
                    </div>
                </Modal>
    
            </div>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ListScreen);