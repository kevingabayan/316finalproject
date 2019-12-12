import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {Button} from 'react-materialize';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import {Rnd} from 'react-rnd';


class ListScreen extends Component {
    
    state = {
        widthtext: this.props.wireFrame.width,
        heighttext: this.props.wireFrame.height,
        zoom: 1,
        changeSave: "disabled",
        changeDimensions: "disabled",
        selectedDiv: "none",

        width: this.props.wireFrame.width,
        height: this.props.wireFrame.height,
        objects: [
            <Rnd
                onDragStop= {e => {this.onDragStop(e)}}
                className = "0"
                resizeHandleClasses = {{
                    bottomLeft: "pointer",
                    bottomRight: "pointer",
                    topRight: "pointer",
                    topLeft: "pointer",
                }}
                resizeHandleComponent = {{
                    bottomLeft: React.createElement('div', {id: 'pointer'}, " l"),
                    bottomRight: React.createElement('div', {id: 'pointer'}, " l"),
                    topRight: React.createElement('div', {id: 'pointer'}, " l"),
                    topLeft: React.createElement('div', {id: 'pointer'}, " l")
                }
                }
                bounds = {"parent"}
                >
                    <div className = "input-field">
                        <input type="text" name="widthtext" id = "widthtext" value = "ok"/>
                    </div>
            </Rnd>,
            <Rnd
            onDragStop= {e => {this.onDragStop(e)}}
            className = "0"
            resizeHandleClasses = {{
                bottomLeft: "pointer",
                bottomRight: "pointer",
                topRight: "pointer",
                topLeft: "pointer",
            }}
            resizeHandleComponent = {{
                bottomLeft: React.createElement('div', {id: 'pointer'}, " l"),
                bottomRight: React.createElement('div', {id: 'pointer'}, " l"),
                topRight: React.createElement('div', {id: 'pointer'}, " l"),
                topLeft: React.createElement('div', {id: 'pointer'}, " l")
            }
            }
            bounds = {"parent"}
            >
                coolbeans
            </Rnd>
        ]
    }

    selectDiv = (e) => {
        console.log("AHHHHHHHHHHHH");
    }

    onDragStop = (e) => {
        console.log(this.state.objects);
        console.log(e.target);
    }

    handleDimensionChange = (e) => {
        const { target } = e;
        console.log(target.value);
        if(!isNaN(target.value)) {   
            this.setState(state => ({
            ...state,
            changeDimensions: "",
            [target.id]: target.value,
            }));
        }
    }

    updateDimensions = () => {
        let normalwidth = true;
        let normalheight = true;
        if(this.state.widthtext > 5000) {
            normalwidth = false;
            this.setState({width: 5000, widthtext: 5000});
        }
        if(this.state.widthtext < 1) {
            normalwidth = false;
            this.setState({width: 1, widthtext: 1});
        }
        if(this.state.heighttext > 5000) {
            normalheight = false;
            this.setState({height: 5000, heighttext: 5000});
        }
        if(this.state.heighttext < 1) {
            normalheight = false;
            this.setState({height: 1, heighttext: 1});
        }
        if(normalheight) {
            this.setState({height: this.state.heighttext});
        }
        if(normalwidth) {
            this.setState({width: this.state.widthtext});
        }
        this.setState({changeSave: "", changeDimensions: "disabled"});
    }

    okzoomerin = () => {
        this.setState({zoom: this.state.zoom * 2});
    }
    okzoomerout = () => {
        this.setState({zoom: this.state.zoom * 1/2});
    }

    goHome = () => {
        this.props.history.push("/");
    }

    goSave = () => {
        let id = this.props.auth.uid;
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').doc(this.props.wireFrame.id).update({
            width: this.state.width,
            height: this.state.height
        });
        this.props.history.push("/");
    }

    render() {
        const auth = this.props.auth;
        const wireFrameStyle = {
            width: this.state.width/5,
            height: this.state.height/5,
            transform: "scale(" + this.state.zoom.toString() + ")",
            transformOrigin: "0 0",
            borderStyle: 'solid',
            borderWidth: 'thick',
            
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
                                <a class={"waves-effect waves-light red btn " + this.state.changeSave} onClick = {this.goSave}>Save</a>
                            </div>
                            <div class = "col s6">
                                <a class="waves-effect waves-light red btn" onClick = {this.goHome}>Close</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s6">
                                <a class="btn waves-effect waves-light red" onClick = {this.okzoomerin}><i class="material-icons">zoom_in</i></a>
                            </div>
                            <div class = "col s6">
                                <a class=" btn waves-effect waves-light red"onClick = {this.okzoomerout}><i class="material-icons">zoom_out</i></a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"waves-effect waves-light red btn " + this.state.changeDimensions} onClick = {this.updateDimensions}><i class="material-icons right">crop_square</i>Update Dim.</a>
                            </div>
                        </div>
                        <br></br>
                        <div class = "row">
                            <div className="input-field">
                                <label htmlFor="width" className="active black-text">Width [1-5000] [.2x] </label>
                                <input type="text" name="widthtext" id = "widthtext" onChange = {e => {this.handleDimensionChange(e)}} value = {this.state.widthtext} />
                            </div>
                        </div>
                        <div class = "row">
                            <div className="input-field">
                                <label htmlFor="height" className="active black-text">Height [1-5000] [.2x] </label>
                                <input type="text" name="heighttext" id = "heighttext" onChange = {e => {this.handleDimensionChange(e)}} value = {this.state.heighttext} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "col s8">
                    <div class = "edit-card-main card-panel white">
                        <div className = "wireFrameContainer" style = {wireFrameStyle}>
                            {this.state.objects}
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