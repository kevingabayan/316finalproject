import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireFrameCard from './WireFrameCard';
class WireFrameLinks extends React.Component {

    render() {
        const auth = this.props.auth;
        const wireFrames = this.props.wireFrames
        var wireFramer = wireFrames;
        return (
            <div className="todo-lists section">
                {wireFrames && wireFrames.slice(0).filter(wireFrame => wireFrame.owner == auth.uid).reverse().map(wireFrames => (
                    <WireFrameCard wireFrames={wireFrames} />
                ))}    
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireFrames: state.firestore.ordered.wireFrames,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireFrameLinks);