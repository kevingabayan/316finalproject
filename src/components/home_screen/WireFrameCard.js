import React from 'react';
import Button from 'react-materialize/lib/Button';
import { Link } from 'react-router-dom';
import { getFirestore } from 'redux-firestore';
import {Modal} from 'react-materialize';
class WireFrameCard extends React.Component {

    handleTop(id) {
        var date = new Date();
        const fireStore = getFirestore();
        console.log(id);
        fireStore.collection('wireFrames').doc(id).update({timestamp: date.getTime()});
    }

    handleDeletion(id)  {
        const fireStore = getFirestore();
        console.log(id);
        fireStore.collection('wireFrames').doc(id).delete();
    }

    render() {
        const { wireFrames } = this.props;
        return (
            <div className="card z-depth-0 todo-list-link" >
                <div className="card-content blue lighten-3 grey-text text-darken-3">
                    <div className = "row">
                    <Link to={'/wireFramer/' + wireFrames.id} onClick = {this.handleTop.bind(this, wireFrames.id)} key={wireFrames.id}>
                    <span className="col s10 card-title">{wireFrames.name}</span>
                    </Link>
                    <Button data-target={wireFrames.id} className = "modal-trigger col s2 black lighten-3">X</Button>
                    </div>
                    <Modal id = {wireFrames.id} class="modal">
                        <div className = "modal-content">
                            <header class="dialog_header">
                                Delete Wire Frame?
                            </header>
                            <br></br>
                            <button className = "modal-close waves-effect waves-light btn" onClick = {this.handleDeletion.bind(this, wireFrames.id)}>DELETE</button>
                            &emsp;
                            <button className = "modal-close waves-effect waves-light btn" >CANCEL</button>
                            <br></br>
                        </div>
                    </Modal>
                </div>
            </div>
        );
    }
}
export default WireFrameCard;