import React from 'react';

class WireFrameCard extends React.Component {

    render() {
        const { wireFrames } = this.props;
        return (
            <div className="card z-depth-0 todo-list-link" >
                <div className="card-content blue lighten-3 grey-text text-darken-3">
                    <span className="card-title">{wireFrames.name}</span>
                </div>
            </div>
        );
    }
}
export default WireFrameCard;