import React from 'react';
import {Button, Icon} from 'react-materialize';
import { getFirestore } from 'redux-firestore';
class ItemCard extends React.Component {

    handleItemUp = (e) => {
        e.stopPropagation();
        if(this.props.item.key != 0) {
            const fireStore = getFirestore();
            var tempArray = this.props.todoList.items;
            var tempValue = tempArray[this.props.item.key]
            tempArray[(this.props.item.key)] = tempArray[this.props.item.key - 1]; 
            tempArray[(this.props.item.key)-1] = tempValue;
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({
                items: tempArray
        })
        }
        this.updateKeys();
    }

    handleItemDown = (e) => {
        e.stopPropagation();
        if(this.props.item.key != (this.props.todoList.items.length-1)) {
            const fireStore = getFirestore();
            var tempArray = this.props.todoList.items;
            var tempValue = tempArray[this.props.item.key]
            tempArray[(this.props.item.key)] = tempArray[this.props.item.key + 1]; 
            tempArray[(this.props.item.key)+1] = tempValue;
            fireStore.collection('todoLists').doc(this.props.todoList.id).update({
                items: tempArray
        })
        }
        this.updateKeys();
    }

    handleItemDelete = (e) => {
        e.stopPropagation();
        const fireStore = getFirestore();
        var tempArray = this.props.todoList.items;
        tempArray.splice(this.props.item.key, 1);
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            items: tempArray
        })
        this.updateKeys();
    }

    updateKeys() {
        const fireStore = getFirestore();
        var tempArray = this.props.todoList.items;
        for(var i = 0; i < tempArray.length; i++) {
            tempArray[i].key = i;
        }
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            items: tempArray
        })
    }
    handleItemScreen = () => {
        this.props.history.push("/todoList/" + this.props.todoList.id + "/" + this.props.item.key);
    }
    render() {
        const { item } = this.props;  
        const {todoList} = this.props;
        if(!item.completed) {
            return (
            <div className="card z-depth-1 todo-list-link pink lighten-3" onClick = {this.handleItemScreen}>
            <div className = "row">
                <div class = "col s3">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">{item.description}</span>
                        <span className = "card-text">Assigned to: {item.assigned_to}</span>
                    </div>
                </div>
                <div class = "col s3">
                    <div className="card-content grey-text text-darken-3">
                        <span className="card-title">Due Date: {item.due_date}</span>
                    </div>
                </div>
                <div class = "col s3">
                    <div className="card-content red-text text-darken-3">
                        <span className="card-title">Pending</span>
                    </div>
                </div>
                <div class = "col s3">
                    <Button 
                     id = "parent"
                     floating
                     fab={{direction: 'left'}}
                        className="red"
                        large
                        icon={<Icon>toc</Icon>}
                     >
                    <Button id = "child" floating icon={<Icon> expand_less </Icon>} onClick = {this.handleItemUp} className="yellow darken-1" />
                    <Button id = "child" floating icon={<Icon> expand_more </Icon>} onClick = {this.handleItemDown} className="green" />
                    <Button id = "child" floating icon={<Icon> clear </Icon>} onClick = {this.handleItemDelete} className="blue" />
                    </Button>
                    </div>
      
            </div>
        </div>
            );
        }
        else {
        return (
            <div className="card z-depth-1 todo-list-link pink lighten-3"  onClick = {this.handleItemScreen} >
                <div className = "row">
                    <div class = "col s3">
                        <div className="card-content grey-text text-darken-3" >
                            <span className="card-title">{item.description}</span>
                            <span className="card-text">Assigned to: {item.assigned_to}</span>
                        </div>
                    </div>
                    <div class = "col s3">
                        <div className="card-content grey-text text-darken-3">
                            <span className="card-title">Due Date: {item.due_date}</span>
                        </div>
                    </div>
                    <div class = "col s3">
                        <div className="card-content green-text text-darken-3">
                            <span className="card-title">Completed</span>
                        </div>
                    </div>
                    <div class = "col s3">
                        <Button id = "parent"
                         floating
                         fab={{direction: 'left'}}
                         className="red"
                         large
                         icon={<Icon>toc</Icon>}
                        >
                        <Button id = "child" floating icon={<Icon> expand_less </Icon>} onClick = {this.handleItemUp} className="yellow darken-1" />
                        <Button id = "child" floating icon={<Icon> expand_more </Icon>} onClick = {this.handleItemDown} className="green" />
                        <Button id = "child" floating icon={<Icon> clear </Icon>} onClick = {this.handleItemDelete} className="blue" />
                        </Button>
                    </div>
                </div>
            </div>
        );
        }
    }
}
export default ItemCard;