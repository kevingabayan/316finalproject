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
        selectedDivBoolean: false,
        selectedDiv: "",

        width: this.props.wireFrame.width,
        height: this.props.wireFrame.height,
        objects: [{width: 200, height: 50, x: 200, y: 200, key: "0", childClass: "active-pointer", value: "ok", type: "text", fontSize: "15px", borderColor: "black", 
        backgroundColor: "", color: "black", borderRadius: "", borderWidth: "thick"}, 
        {width: 200, height: 50, x: 0, y: 0, key: "1", childClass: "active-pointer", value: "ok", type: "button", fontSize: "15px", borderColor: "black", 
        backgroundColor: "", color: "black", borderRadius: "", borderWidth: "thick"}]
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


    onDragStop = (e, d) => {
        e.stopPropagation();
        let objectindex = e.target.className.charAt(0);
        if(objectindex == "b") {
            objectindex = e.target.className.charAt((e.target.className.length)-1);
        }
        let tempobject = this.state.objects;
        tempobject[objectindex].x = d.x;
        tempobject[objectindex].y = d.y;
        this.setState({objects: tempobject});
    }
    onResizeStop = (e,direction,ref,delta,position) => {
        console.log(ref);
        let objectindex = ref.className.charAt(0);
        if(objectindex == "b") {
            objectindex = ref.className.charAt((ref.target.className.length)-1);
        }
        let tempobject = this.state.objects;
        tempobject[objectindex].width = ref.width;
        tempobject[objectindex].height = ref.height;
        this.setState({objects: tempobject})
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
        const containerItems = [];
        for(let i = 0; i < this.state.objects.length; i++) {
            if(this.state.objects[i].type === "text") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " l")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <input className = {this.state.objects[i].key} type="text" style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth}} 
                        value = {this.state.objects[i].value}/>
                </Rnd>)
            }
            else if (this.state.objects[i].type === "LC") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " l")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <div className = {this.state.objects[i].key} style = {this.state.objects[i].style}>{this.state.objects[i].value}</div>
                </Rnd>) 
            }
            else if (this.state.objects[i].type == "button") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " l"),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " l")
                    }}
                    enableResizing = {{
                        bottom: false,
                        top: false,
                        left: false,
                        right: false,
                        bottomLeft: true,
                        bottomRight: true,
                        topLeft: true,
                        topRight: true
                    }}
                    bounds = {"parent"}
                    >
                        <Button className = {this.state.objects[i].key} type="text" style = {this.state.objects[i].style}>{this.state.objects[i].value}</Button>
                </Rnd>) 
            }
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
                            {containerItems}
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