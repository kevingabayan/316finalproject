import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {Button, Icon} from 'react-materialize';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import Draggable from 'react-draggable';

class ListScreen extends Component {
    
    state = {
        width: this.props.wireFrame.width,
        height: this.props.wireFrame.height,
        zoom: 100,
        changepresent: "disabled"
    }
    okzoomerin = () => {
        this.setState({zoom: this.state.zoom * 2});
    }
    okzoomerout = () => {
        this.setState({zoom: this.state.zoom * 1/2});
    }
    render() {
        const auth = this.props.auth;
        const wireFrameStyle = {
            width: this.state.width,
            height: this.state.height,
            zoom: this.state.zoom.toString() + "%",
            borderStyle: 'solid'
        }
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div class = "row">
                <div class = "col s2">
                    <div class="edit-card card-panel teal">

                        <div class = "row">
                            <div class = "col s6">
                                <a class={"waves-effect waves-light red btn " + this.state.changepresent}>Save</a>
                            </div>
                            <div class = "col s6">
                                <a class="waves-effect waves-light red btn">Close</a>
                            </div>
                        </div>

                        <div class = "row">
                            <div class = "col s6">
                                <a class="btn btn waves-effect waves-light red" onClick = {this.okzoomerin}><i class="material-icons">zoom_in</i></a>
                            </div>
                            <div class = "col s6">
                                <a class="btn btn waves-effect waves-light red"onClick = {this.okzoomerout}><i class="material-icons">zoom_out</i></a>
                            </div>
                        </div>

                    </div>
                </div>
                <div class = "col s8">
                    <div class = "edit-card-main card-panel white">
                        <div className = "BORED" style = {wireFrameStyle}>
                            
                        </div>
                    </div>
                </div>
                <div class = "col s2">
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