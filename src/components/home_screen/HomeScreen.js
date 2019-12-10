import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireFrameLinks from './WireFrameLinks'
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';

class HomeScreen extends Component {
    handleNewList = () => {
        var newbind = this;
        var date = new Date();
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').add({
            name: "",
            owner: this.props.auth.uid,
            width: 2500,
            height: 2500,
            timestamp: date.getTime(),
            containers: []
        })
        .then(function(wireFramer) {
            newbind.props.history.push("/wireFramer/" + wireFramer.id);
        })
    }

    render() {
        const wireFrames = this.props.todoLists;
        console.log(wireFrames);
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