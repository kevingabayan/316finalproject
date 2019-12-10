import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';

class ItemScreen extends React.Component {
  state = {
    description: this.getDescription(),
    assigned_to: this.getAssignedTo(),
    due_date: this.getDueDate(),
    completed: this.getCompleted()
  }

  getDescription() {
    if(window.location.pathname.charAt(window.location.pathname.length-1) == this.props.todoList.items.length) {
      return "";
    }
    else {
      return this.props.todoList.items[window.location.pathname.charAt(window.location.pathname.length-1)].description
    }
  }

  getAssignedTo() {
    if(window.location.pathname.charAt(window.location.pathname.length-1) == this.props.todoList.items.length) {
      return "";
    }
    else {
      return this.props.todoList.items[window.location.pathname.charAt(window.location.pathname.length-1)].assigned_to
    }
  }

  getDueDate() {
    if(window.location.pathname.charAt(window.location.pathname.length-1) == this.props.todoList.items.length) {
      return "";
    }
    else {
      return this.props.todoList.items[window.location.pathname.charAt(window.location.pathname.length-1)].due_date
    }

  }

  getCompleted() {
    if(window.location.pathname.charAt(window.location.pathname.length-1) == this.props.todoList.items.length) {
      return "";
    }
    else {
      if(this.props.todoList.items[window.location.pathname.charAt(window.location.pathname.length-1)].completed) {
        return "checked"
      }
      else {
        return ""
      }
    }
  }

  handleChange = (e) => {
    const { target } = e;

    this.setState(state => ({
      ...state,
      [target.id]: target.value,
    }));
  }

  handleCheck = () => {
    if(this.state.completed == "checked")
      return this.setState({completed: ""});
    else 
      return this.setState({completed: "checked"});
  }

  handleSubmit = () => {
    if(window.location.pathname.charAt(window.location.pathname.length-1) == this.props.todoList.items.length) {
      var tempArray = this.props.todoList.items;
      if(this.state.completed == "checked") {
        var tempc = true;
      }
      else {
        var tempc = false;
      }
      var toadd = {
        key: this.props.todoList.items.length,
        description: this.state.description,
        due_date: this.state.due_date,
        assigned_to: this.state.assigned_to,
        completed: tempc
        };
      tempArray.push(toadd);
      const fireStore = getFirestore();
      fireStore.collection("todoLists").doc(this.props.todoList.id).update({items: tempArray});
      this.props.history.push("/todoList/" + this.props.todoList.id);
    }
    else {
      var tempArray = this.props.todoList.items;
      if(this.state.completed == "checked") {
        var tempc = true;
      }
      else {
        var tempc = false;
      }
      var toUpdate = {
        key: window.location.pathname.charAt(window.location.pathname.length-1),
        description: this.state.description,
        due_date: this.state.due_date,
        assigned_to: this.state.assigned_to,
        completed: tempc
        };
      tempArray[window.location.pathname.charAt(window.location.pathname.length-1)] = toUpdate;
      const fireStore = getFirestore();
      fireStore.collection("todoLists").doc(this.props.todoList.id).update({items: tempArray});
      this.props.history.push("/todoList/" + this.props.todoList.id);
    }
  }

  handleCancel = () => {
    this.props.history.push("/todoList/" + this.props.todoList.id);
  }

  render() {
    const { auth } = this.props;
    if (!auth.uid) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Item</h5>

          <div className="input-field">
            <label htmlFor="description" className="active">Description</label>
            <input type="text" name="description" id="description" onChange={this.handleChange} value = {this.state.description} />
          </div>

          <div className="input-field">
            <label htmlFor="assigned_to" className="active">Assigned To</label>
            <input type="text" name="assigned_to" id = "assigned_to" onChange = {this.handleChange} value = {this.state.assigned_to} />
          </div>

          <div className="input-field">
            <label htmlFor="due_date" className="active">Due Date</label>
            <input type="date" placeholder = "" name="due_date" id= "due_date" onChange = {this.handleChange} value = {this.state.due_date} />
          </div>

          <label htmlFor="completed">
          <input type="checkbox" id = "completed" name = "completed" checked={this.state.completed} onChange = {this.handleCheck}/>
          <span>Completed?</span>
          </label>

          <div className="input-field">
            <button type="submit" className="btn black lighten-1 z-depth-0">Submit</button>
            &nbsp;&nbsp;&nbsp;
            <button className="btn black lighten-1 z-depth-0" onClick = {this.handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
  
}
const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { todoLists } = state.firestore.data;
  const todoList = todoLists ? todoLists[id] : null;
  todoList.id = id;

  return {
    todoList,
    auth: state.firebase.auth,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
  firestoreConnect([
    { collection: 'todoLists' },
  ]),
)(ItemScreen);