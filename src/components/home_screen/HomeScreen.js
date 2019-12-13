import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireFrameLinks from './WireFrameLinks'
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import {Modal} from 'react-materialize';


class HomeScreen extends Component {
    handleNewList = () => {
        var newbind = this;
        var date = new Date();
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').add({
            name: "New Wire Frame",
            owner: this.props.auth.uid,
            width: 4700,
            height: 4700,
            timestamp: date.getTime(),
            objects: []
        })
        .then(function(wireFramer) {
            newbind.props.history.push("/wireFramer/" + wireFramer.id);
        })
    }

    handleCancel = () => {

    }
    handleDeletion = () => {

    }

    render() {
        const wireFrames = this.props.todoLists;
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }
        return (
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m4">
                        <WireFrameLinks />
                    </div>
                    <div className="col s8">
                        <div className="banner">
                            The<br />
                            Wire Framer 
                        </div>
                    <div className="home_new_list_container">
                        <button className="home_new_list_button" onClick={this.handleNewList}>
                            Create a New Wire Framer
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
      { collection: 'wireFrames', orderBy: 'timestamp'},
    ]),
)(HomeScreen);