import React from 'react'
import { connect } from 'react-redux';
import wireFramerJson from './WireFramerData.json'
import { getFirestore } from 'redux-firestore';
import { database } from 'firebase';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireFrames').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireFrames').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        var usersRef = fireStore.collection("users");
        usersRef.get().then(snapshot => {
            snapshot.forEach(doc => {
                wireFramerJson.wireFrames.forEach(wireFramerJson => {
                    fireStore.collection('wireFrames').add({
                        name: wireFramerJson.name,
                        owner: doc.id,
                        width: wireFramerJson.width,
                        height: wireFramerJson.height,
                        timestamp: wireFramerJson.timestamp,
                        objects: wireFramerJson.objects
                        }).then(() => {
                            console.log("DATABASE RESET");
                        }).catch((err) => {
                            console.log(err);
                        });
                });
            })
        });
    }

    render() {
        return (
            <div>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        firebase: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);