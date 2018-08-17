import React, { Component } from 'react';
import axios from 'axios';

import List from './List';
import NewListForm from './NewListForm';
import EditListForm from './EditListForm';


class ListsContainer extends Component {
    state = {
      lists:[]
    }

    componentDidMount() {
      this.getAllLists()
    }

    getAllLists = () => {
      axios.get('http://localhost:3001/api/v1/todo_lists.json')
      .then(response => {
        console.log(response)
        this.setState({
          lists: response.data,
          editingListId: null
        })
      })
      .catch(error => console.log(error))
    }

    addNewList = e => {
      if (e.keyCode===13) {
        axios.post( 'http://localhost:3001/api/v1/todo_lists', { todo_list: {title: e.target.value} })
        .then(response => {
            console.log(response)
            const lists = [ ...this.state.lists, response.data ]
            this.setState({lists})
        })
        .catch(error => {
            console.log(error)
        })
        e.target.value = ''
      }
    }
    removeList = id => {
      axios.delete( 'http://localhost:3001/api/v1/todo_lists/' + id )
      .then(response => {
          const lists = this.state.lists.filter(
              list => list.id !== id
          )
          this.setState({lists})
      })
      .catch(error => console.log(error))
    }

    editingList = id => {
      console.log('editing')
      this.setState({
        editingListId: id
      })
    }

    editList = (id, title) => {
      axios.put( 'http://localhost:3001/api/v1/todo_lists/' + id, {
        todo_list: {title}
      })
      .then(response => {
        this.getAllLists()
      })
      .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
              <div className="Lists-container">
                {this.state.lists.map( list => {
                  if ( this.state.editingListId === list.id ) {
                    return (<EditListForm
                              list={list}
                              key={list.id}
                              editList={this.editList}/>)
                  }else {
                    return (<List
                              list={list}
                              key={list.id}
                              onRemoveList={this.removeList}
                              editingList={this.editingList} />)
                  }
                })}
              </div>
              <NewListForm addNewList={this.addNewList} />
            </div>
        )
    }
}

export default ListsContainer;