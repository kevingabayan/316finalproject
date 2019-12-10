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
            <div class = "row">
                <div class = "col s3">
                    <div class="edit-card card-panel teal">
                        <span class="white-text">
                        </span>
                    </div>
                </div>
                <div class = "col s6">
                    <div class="edit-card card-panel white">
                            <span class="white-text">
                            </span>
                        </div>
                </div>
                <div class = "col s3">
                    <div class="edit-card card-panel teal">
                        <span class="white-text">
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { wireFrames } = state.firestore.data;
  const wireFrame = wireFrames ? wireFrames[id] : null;
  wireFrame.id = id;

  return {
    wireFrame,
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