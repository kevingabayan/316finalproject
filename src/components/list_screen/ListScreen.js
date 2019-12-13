import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import {Button} from 'react-materialize';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';
import {Rnd} from 'react-rnd';
import {SketchPicker} from 'react-color'
import reactCSS from 'reactcss'

class ListScreen extends Component {
    
    state = {
        zoom: 1,
        widthtext: this.props.wireFrame.width,
        heighttext: this.props.wireFrame.height,
        changeSave: "disabled",
        changeDimensions: "disabled",
        selectedDiv: "",
        resizePrevention: false,
        tempo: false,

        name: this.props.wireFrame.name,
        width: this.props.wireFrame.width,
        height: this.props.wireFrame.height,
        objects: this.props.wireFrame.objects
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.zoom != this.state.zoom) {
            this.unselectDivs()
        }
        if(this.state.tempo) {
            this.okiedokie()
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.handleKey = this.handleKey.bind(this), false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKey, false);
    }
    handleKey = (event) => {
        event.stopPropagation();
        if(event.ctrlKey) {
            if((event.which === 68))  {
                event.preventDefault();
                if(this.state.selectedDiv != "") {
                    let tempobjects = this.state.objects;
                    let tempkey = this.state.selectedDiv;
                    this.unselectDivs();
                    let newobjects = [];
                    for(let i = 0; i < tempobjects.length; i++) {
                        newobjects.push(tempobjects[i]);
                    }
                    var container = 
                    {borderColor: tempobjects[tempkey].borderColor,
                    borderRadius: tempobjects[tempkey].borderRadius,
                    borderWidth: tempobjects[tempkey].borderWidth,
                    borderStyle: tempobjects[tempkey].borderStyle,
                    backgroundColor: tempobjects[tempkey].backgroundColor,
                    childClass: "active-pointer",
                    color: tempobjects[tempkey].color,
                    fontSize: tempobjects[tempkey].fontSize,
                    height: tempobjects[tempkey].height,
                    key: tempobjects.length,
                    type: tempobjects[tempkey].type,
                    value: tempobjects[tempkey].value,
                    width: tempobjects[tempkey].width,
                    position: tempobjects[tempkey].position,
                    x: tempobjects[tempkey].x + 100,
                    y: tempobjects[tempkey].y + 100
                    }
                    newobjects.push(container);
                    for(let i = 0; i < newobjects.length; i++) {
                        newobjects[i].key = (i.toString());
                    }
                    this.setState({selectedDiv: tempobjects.length, objects: newobjects});
                }
            }
        }
        else if ((event.which === 46)){
            if(this.state.selectedDiv != "") {
                let tempobjects = this.state.objects;
                let tempkey = this.state.selectedDiv;
                let newobjects = [];
                for(let i = 0; i < tempobjects.length; i++) {
                    if(i != tempkey) {
                        newobjects.push(tempobjects[i]);
                    }
                }
                for(let i = 0; i < newobjects.length; i++) {
                    newobjects[i].key = (i.toString());
                }
                this.setState({objects: newobjects}, this.unselectDivs());
            }
        }
    }
    okiedokie = () => {
        this.setState({objects: this.state.objects, tempo: false})
    }
    handleChange = (e) => {
        const { target } = e;
    
        this.setState(state => ({
          ...state,
          changeSave: "",
          [target.id]: target.value,
        }));
      }
    handleSelectedChange = (e) => {
        const {target} = e;
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].value = target.value;
        this.setState({objects: tempobjects});
    }
    handleFontChange = (e) => {
        const {target} = e;
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].fontSize = target.value;
        this.setState({objects: tempobjects});
    }
    handleRadiusChange = (e) => {
        const {target} = e;
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].borderRadius = target.value;
        this.setState({objects: tempobjects});
    }
    handleBackgroundColorChange(color, event) {
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].backgroundColor = color.hex;
        this.setState({objects: tempobjects});
    }
    handleBorderColorChange(color, event) {
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].borderColor = color.hex;
        this.setState({objects: tempobjects});
    }
    handleTextColorChange(color, event) {
        let tempobjects = this.state.objects;
        tempobjects[this.state.selectedDiv].color = color.hex;
        this.setState({objects: tempobjects});
    }
    handleBorderThicknessChange = (e) => {
        const {target} = e;
        let tempobjects = this.state.objects;
        if(!isNaN(target.value)) {
            if(target.value >= 0 && target.value <= 3) {
                if(target.value == 0) {
                    tempobjects[this.state.selectedDiv].borderStyle = ""
                    tempobjects[this.state.selectedDiv].borderWidth = "";
                }
                if(target.value == 1) {
                    tempobjects[this.state.selectedDiv].borderStyle = "solid";
                    tempobjects[this.state.selectedDiv].borderWidth = "thin";
                }
                if(target.value == 2) {
                    tempobjects[this.state.selectedDiv].borderStyle = "solid";
                    tempobjects[this.state.selectedDiv].borderWidth = "medium";
                }
                if(target.value == 3) {
                    tempobjects[this.state.selectedDiv].borderStyle = "solid";
                    tempobjects[this.state.selectedDiv].borderWidth = "thick";
                }
            }
        }
        this.setState({objects: tempobjects});
    }
    handleDimensionChange = (e) => {
        const { target } = e;
        if(!isNaN(target.value)) {   
            this.setState(state => ({
            ...state,
            changeDimensions: "",
            [target.id]: target.value,
            }));
        }
    }
    handleTranslationThickness() {
        if (this.state.objects[this.state.selectedDiv].borderStyle != "solid"){
            return 0;
        } 
        else if(this.state.objects[this.state.selectedDiv].borderWidth == "thin") {
            return 1;
        }
        else if(this.state.objects[this.state.selectedDiv].borderWidth == "medium") {
            return 2;
        }
        else if(this.state.objects[this.state.selectedDiv].borderWidth == "thick") {
            return 3;
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
    okzoomerin = (e) => {
        let ok = this.state.zoom * 2;
        this.setState(state => ({
            ...state,
            zoom: ok,
            }));
    }
    okzoomerout = (e) => {
        let ok = this.state.zoom * 1/2;
        this.setState({zoom: ok});
    }
    goHome = () => {
        this.props.history.push("/");
    }
    goSave = () => {
        this.unselectDivs();
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').doc(this.props.wireFrame.id).update({
            width: this.state.width,
            height: this.state.height,
            objects: this.state.objects,
            name: this.state.name
        });
        console.log(JSON.stringify(this.state.objects))
        this.props.history.push("/");
    }
    onDragStop = (e, d) => {
        e.stopPropagation();
        let tempobject = this.state.objects;
        if(this.state.selectedDiv != "") { 
        tempobject[this.state.selectedDiv].x = d.x;
        tempobject[this.state.selectedDiv].y = d.y;
        }
        this.setState({objects: tempobject, changeSave: ""});
    }
    onResizeStop = (e,direction,ref,delta,position) => {
        e.stopPropagation();
        let tempobject = this.state.objects;
        if(this.state.selectedDiv != "") { 
        tempobject[this.state.selectedDiv].width = ref.style.width;
        tempobject[this.state.selectedDiv].height = ref.style.height;
        tempobject[this.state.selectedDiv].x = position.x;
        tempobject[this.state.selectedDiv].y = position.y;
        this.setState({objects: tempobject, resizePrevention: true, tempo: true, changeSave: ""})
        }
        
    }
    selectDiv = (e) => {
        e.stopPropagation();
        this.unselectDivs();
        let objectindex = e.target.className.charAt(0);
        if(e.target.className.charAt(1) >= '0' && e.target.className.charAt(1) <= '9') {
            var loopi = 1;
            while(e.target.className.charAt(loopi+1) >= '0' && e.target.className.charAt(loopi+1) <= '9') {
                loopi++;
            }
            objectindex = e.target.className.substring(0,(loopi+1));
        }
        if(objectindex == "b") {
            objectindex = e.target.className.charAt((e.target.className.length)-1);
            if(e.target.className.charAt((e.target.className.length)-2) >= '0' && e.target.className.charAt((e.target.className.length)-2) <= '9') {
                var loopj = 2;
                while(e.target.className.charAt((e.target.className.length)-(loopj+1)) >= '0' && e.target.className.charAt((e.target.className.length)-(loopj+1)) <= '9') {
                    loopj++;
                }
                objectindex = e.target.className.substring(((e.target.className.length)-loopj),((e.target.className.length)))
            }
        }
        let tempobject = this.state.objects;
        tempobject[objectindex].childClass = "active-pointer";
        this.setState({selectedDiv: objectindex, objects: tempobject});
    }
    unselectDivs = () => {
        if(this.state.resizePrevention) {
            this.setState({resizePrevention: false});
        }
        else {
        let tempobject = this.state.objects;
        for (let i = 0; i < tempobject.length; i++) {
            tempobject[i].childClass = "pointer";
        }
        this.setState({selectedDiv: "", objects: tempobject});
        }
    }
    addContainer = () => {
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "#000000",
        borderRadius: "30px",
        backgroundColor: "#ffffff",
        borderWidth: "medium",
        borderStyle: "solid",
        childClass: "pointer",
        color: "#000000",
        fontSize: "15px",
        height: "200px",
        key: tempobjects.length,
        type: "LC",
        value: "",
        width: "400px",
        x: 0,
        y: 0,
        position: 'absolute'
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects}, this.unselectDivs)
    }
    addLabel = () => {
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "#000000",
        borderRadius: "0px",
        backgroundColor: "#ffffff",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer",
        color: "#000000",
        fontSize: "15px",
        height: "200px",
        key: tempobjects.length,
        type: "LC",
        width: "400px",
        value: "DEFAULT",
        position: "absolute",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects}, this.unselectDivs)
    }
    addButton = () => {
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "#000000",
        backgroundColor: "#2bbbad",
        borderRadius: "0px",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer",
        color: "#000000",
        fontSize: "15px",
        height: "50px",
        key: tempobjects.length,
        type: "button",
        width: "200px",
        value: "DEFAULT",
        position: "absolute",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects}, this.unselectDivs)
    }
    addTextfield = () => {
        var tempobjects = this.state.objects;
        let templength = tempobjects.length;
        var container = 
        {borderColor: "black",
        borderRadius: "0px",
        borderWidth: "medium",
        borderStyle: "",
        childClass: "pointer",
        color: "black",
        fontSize: "15px",
        height: "50px",
        backgroundColor: "#ffffff",
        key: tempobjects.length,
        type: "text",
        width: "300px",
        value: "DEFAULT",
        position: "absolute",
        x: 0,
        y: 0
        }
        tempobjects.push(container);
        this.setState({objects: tempobjects}, this.unselectDivs)
    }
    render() {
        const auth = this.props.auth;
        const wireFrameStyle = {
            width: this.state.width/5,
            height: this.state.height/5,
            transform: "scale(" + this.state.zoom.toString() + ")",
            transformOrigin: "0 0",
            borderStyle: 'solid',
            borderWidth: 'medium',
        }
        const containerItems = [];
        for(let i = 0; i < this.state.objects.length; i++) {
            if(this.state.objects[i].type === "text") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStop= {(e,d) => {this.onDragStop(e,d)}}
                    onResizeStop = {(e,direction,ref,delta,position) => {this.onResizeStop(e,direction,ref,delta,position)}}
                    maxWidth = {this.state.width/5}
                    maxHeight = {this.state.height/5}
                    className = {this.state.objects[i].key}
                    resizeHandleClasses = {{
                        bottomLeft:  this.state.objects[i].childClass,
                        bottomRight: this.state.objects[i].childClass,
                        topRight: this.state.objects[i].childClass,
                        topLeft: this.state.objects[i].childClass,
                    }}
                    resizeHandleComponent = {{
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
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
                        <input onFocus = {(e) => {this.selectDiv(e)}} onClick = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} type="text" style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }} 
                        value = {this.state.objects[i].value}/>
                </Rnd>)
            }
            else if (this.state.objects[i].type === "LC") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
                    position={{ x: this.state.objects[i].x, y: this.state.objects[i].y }}
                    onDragStart = {(e) => {this.selectDiv(e)}}
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
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
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
                        <div onClick = {(e) => {this.selectDiv(e)}} onFocus = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        lineHeight: this.state.objects[i].height, textAlign: "center", borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }}>{this.state.objects[i].value}</div>
                </Rnd>) 
            }
            else if (this.state.objects[i].type == "button") {
                containerItems.push(<Rnd
                    size = {{width: this.state.objects[i].width, height: this.state.objects[i].height}}
                    scale = {this.state.zoom}
                    style = {{transform:"scale(" + this.state.zoom.toString() + ")"}}
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
                        bottomLeft: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        bottomRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topRight: React.createElement('div', {id: this.state.objects[i].key}, " "),
                        topLeft: React.createElement('div', {id: this.state.objects[i].key}, " ")
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
                        <Button onClick = {(e) => {this.selectDiv(e)}} onFocus = {(e) => {this.selectDiv(e)}} className = {this.state.objects[i].key} type="text" style = {{width: this.state.objects[i].width, height: this.state.objects[i].height, 
                        fontSize: this.state.objects[i].fontSize, borderColor: this.state.objects[i].borderColor, 
                        backgroundColor: this.state.objects[i].backgroundColor, color: this.state.objects[i].color, 
                        borderStyle: this.state.objects[i].borderStyle, borderRadius: this.state.objects[i].borderRadius, borderWidth: this.state.objects[i].borderWidth,
                        position: "absolute"
                        }}>{this.state.objects[i].value}</Button>
                </Rnd>) 
            }
        }
        const styles = reactCSS({
            'default': {
              card: {
                  width: "150px"
              },
            },
          })
        const selectedItems = [];
        if(this.state.selectedDiv != "") {
            selectedItems.push(
                <div class = "row">
                    <div className="input-field">
                        <label htmlFor="width" className="active black-text">Selected Text</label>
                        <input type="text" name="selected" id = "selected" onChange = {e => {this.handleSelectedChange(e)}} value = {this.state.objects[this.state.selectedDiv].value} />
                    </div>
                </div>
            );
            selectedItems.push(
                <div class = "row">
                <div className="input-field">
                    <label htmlFor="width" className="active black-text">Text Font [px]</label>
                    <input type="text" name="selected" id = "selected" onChange = {e => {this.handleFontChange(e)}} value = {this.state.objects[this.state.selectedDiv].fontSize} />
                </div>
                </div>
            )
            selectedItems.push( 
                <div class = "row">
                <div class = "section center-align">Background Color</div>
                </div>
            )
            selectedItems.push(
                <div class = "row">
                <SketchPicker color = {this.state.objects[this.state.selectedDiv].backgroundColor} onChangeComplete = {e => this.handleBackgroundColorChange(e)} width = ""></SketchPicker>
                </div>
            )
            selectedItems.push( 
                <div class = "row">
                <div class = "section center-align">Border Color</div>
                </div>
            )
            selectedItems.push(
                <div class = "row">
                <SketchPicker color = {this.state.objects[this.state.selectedDiv].borderColor} onChangeComplete = {e => this.handleBorderColorChange(e)} width = ""></SketchPicker>
                </div>
            )
            selectedItems.push( 
                <div class = "row">
                <div class = "section center-align">Text Color</div>
                </div>
            )
            selectedItems.push(
                <div class = "row">
                <SketchPicker color = {this.state.objects[this.state.selectedDiv].color} onChangeComplete = {e => this.handleTextColorChange(e)} width = ""></SketchPicker>
                </div>
            )
            selectedItems.push(
                <div class = "row">
                <div className="input-field">
                    <label htmlFor="width" className="active black-text">Border Th. [0-3]</label>
                    <input type="text" name="selected" id = "selected" onChange = {e => this.handleBorderThicknessChange(e)} value = {this.handleTranslationThickness()}/>
                </div>
                </div>
            )
            selectedItems.push(
                <div class = "row">
                <div className="input-field">
                    <label htmlFor="width" className="active black-text">Border Rad. [px]</label>
                    <input type="text" name="selected" id = "selected" onChange = {e => {this.handleRadiusChange(e)}} value = {this.state.objects[this.state.selectedDiv].borderRadius} />
                </div>
                </div>
            )
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
                                <a class="btn waves-effect waves-light red" onClick = {e => {this.okzoomerin(e)}}><i class="material-icons">zoom_in</i></a>
                            </div>
                            <div class = "col s6">
                                <a class=" btn waves-effect waves-light red"onClick = {e => {this.okzoomerout(e)}}><i class="material-icons">zoom_out</i></a>
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
                                <label htmlFor="width" className="active black-text">Name</label>
                                <input type="text" name="name" id = "name" onChange = {e => {this.handleChange(e)}} value = {this.state.name} />
                            </div>
                        </div>
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
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addContainer}>Add Container</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addLabel}>Add Label</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addButton}>Add Button</a>
                            </div>
                        </div>
                        <div class = "row">
                            <div class = "col s12">
                                <a class={"addrow waves-effect waves-light red btn "} onClick = {this.addTextfield}>Add Textfield</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class = "col s8">
                    <div class = "edit-card-main card-panel white" onClick = {() => {this.unselectDivs()}}>
                        <div className = "wireFrameContainer" style = {wireFrameStyle}>
                            {containerItems}
                        </div>
                    </div>
                </div>
                <div class = "col s2">
                    <div class="optionsMenu edit-card card-panel teal">
                        {selectedItems}
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