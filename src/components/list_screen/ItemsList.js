import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import ItemCard from './ItemCard';
import { firestoreConnect } from 'react-redux-firebase';
import { getFirestore } from 'redux-firestore';
import { withRouter} from 'react-router-dom';

const ItemSortCriteria = {
    SORT_BY_TASK_INCREASING: "sort_by_task_increasing",
    SORT_BY_TASK_DECREASING: "sort_by_task_decreasing",
    SORT_BY_DUE_DATE_INCREASING: "sort_by_due_date_increasing",
    SORT_BY_DUE_DATE_DECREASING: "sort_by_due_date_decreasing",
    SORT_BY_STATUS_INCREASING: "sort_by_status_increasing",
    SORT_BY_STATUS_DECREASING: "sort_by_status_decreasing",
  };

class ItemsList extends React.Component {
    state = {
        currentItemSortCriteria: null
    }

    isCurrentItemSortCriteria(testCriteria) {
        return this.state.currentItemSortCriteria === testCriteria;
      }

    processSortItemsByTask() {
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)) {
          this.sortTasks(ItemSortCriteria.SORT_BY_TASK_DECREASING); 
        }
        else {
          this.sortTasks(ItemSortCriteria.SORT_BY_TASK_INCREASING); 
        }
      }
    
      processSortItemsByDueDate() {
        // IF WE ARE CURRENTLY INCREASING BY DUE DATE SWITCH TO DECREASING
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)) {
            this.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            this.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING);
        }
      }
    
      processSortItemsByStatus() {
        // IF WE ARE CURRENTLY INCREASING BY STATUS SWITCH TO DECREASING
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)) {
          this.sortTasks(ItemSortCriteria.SORT_BY_STATUS_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCRASING
        else {
          this.sortTasks(ItemSortCriteria.SORT_BY_STATUS_INCREASING);
        }
      }

      
      sortTasks(sortingCriteria) {
        this.setState({currentItemSortCriteria: sortingCriteria}, this.finalSort.bind(this));
      }

      finalSort() {
        var newlist = this.props.todoList.items.sort(this.compare.bind(this));
        const fireStore = getFirestore();
        fireStore.collection('todoLists').doc(this.props.todoList.id).update({
            items: newlist
        })
        this.updateKeys();
      }
    

     compare(item1, item2) {
        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // SORT BY ITEM DESCRIPTION
        if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)) {
            if (item1.description < item2.description)
                return -1;
            else if (item1.description> item2.description)
                return 1;
            else
                return 0;
        }
        // SORT BY DUE DATE
        else if (this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)
            || this.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)) {
            let dueDate1 = item1.due_date;
            let dueDate2 = item2.due_date;
            let date1 = new Date(dueDate1);
            let date2 = new Date(dueDate2);
            if (date1 < date2)
                return -1;
            else if (date1 > date2)
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        else {
            if (item1.completed < item2.completed)
                return -1;
            else if (item1.completed > item2.completed)
                return 1;
            else
                return 0;
        }
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

    handleNewItem = () => {
        this.props.history.push("/todoList/" + this.props.todoList.id + "/" + this.props.todoList.items.length);
    }

    render() {
        const todoList = this.props.todoList;
        const items = todoList.items;
        const history = this.props.history;
        console.log("ItemsList: todoList.id " + todoList.id);
        return (
            <div className="todo-lists section">
                <div className="card light-green z-depth 0">
                    <div className = "row">
                        <div class = "col s3">
                            <div className="taskbar card-content grey-text text-darken-3" onClick = {this.processSortItemsByTask.bind(this)}>
                            <h4>Task</h4>
                            </div>
                        </div>
                        <div class = "col s3">
                            <div className="taskbar card-content grey-text text-darken-3" onClick = {this.processSortItemsByDueDate.bind(this)}>
                            <h4>Due Date </h4>
                            </div>
                        </div>
                        <div class = "col s6">
                            <div className="taskbar card-content grey-text text-darken-3" onClick = {this.processSortItemsByStatus.bind(this)}>
                            <h4>Status</h4>
                            </div>
                        </div>
                    </div>
                </div>
                {items && items.map(function(item) {
                    item.id = item.key;
                    return (
                        <ItemCard todoList={todoList} item={item} history={history}/>
                    );})
                }
                <div className="card light-green z-depth 0" onClick={this.handleNewItem}>
                    <h4 className = "plus cursor-pointer black-text center-align">&#43;</h4>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const todoList = ownProps.todoList;
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
)(ItemsList);