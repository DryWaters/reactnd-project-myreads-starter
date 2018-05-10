import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import _ from 'underscore';
import BookShelf from '../BookShelf/BookShelf';
import { search } from '../BooksAPI/BooksAPI';

class SearchDashboard extends Component {
  constructor() {
    super();
    this.state = {
      books: [],
    };
    this.onInputChange = _.debounce(this.onInputChange, 500);
    this.moveBook = this.moveBook.bind(this);
  }

  onInputChange(value) {
    if (value !== '') {
      search(value)
        .then((data) => {
          if (data.length !== 0) {
            this.setState({ books: data });
          }
        }).catch((error) => {
          window.console.log(`Unable to contact Books API with error ${error}`);
        });
    }
  }

  moveBook(bookId, toWhere) {
    const newBooks = this.state.books.map((book) => {
      if (book.id === bookId) {
        return {
          ...book,
          shelf: toWhere,
        };
      }
      return book;
    });
    this.setState({ books: newBooks });
  }

  render() {
    return (
      <div>
        <div className="search-books-bar">
          <Link className="close-search" href="/" to="/" aria-label="Back to main" />
          <input onChange={(e) => { e.persist(); this.onInputChange(e.target.value); }} type="text" placeholder="Search by title or author" />
        </div>
        {this.state.books.length !== 0 ? <BookShelf moveBook={this.moveBook} books={this.state.books} /> : ''}
      </div>
    );
  }
}

export default SearchDashboard;