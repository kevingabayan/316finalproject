import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import Draggable from 'react-draggable';
import ScrollArea from 'react-scrollbar';

class ListScreen extends Component {
    state = {
    }
    render() {
        const auth = this.props.auth;
        const wireFrames = this.props.wireFrames;
        const containerStyle = {
            width: '5000px',
            height: '5000px',
        }
        if (!auth.uid) {
            return <Redirect to="/" />;
        }
        return (
            <div class = "row">
                <div class = "col s2">
                    <div class="edit-card card-panel teal">
                    </div>
                </div>
                <div class = "col s8">
                    <div class = "edit-card-main card-panel white">
                        <div className = "BORED" style = {containerStyle}>
                            ah yes
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