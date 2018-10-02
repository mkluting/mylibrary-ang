import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location} from '@angular/common';

import { Book } from '../../models/book';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {

  newBook: Book;
  title = new FormControl();
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location
  ) { }

  ngOnInit() {
    this.newBook = new Book;
  }

  addBook(): void {
    this.bookService.addBook(this.newBook).
      subscribe(
        data => {

        },
        data => {
          console.log('error');
        },
      () => {
          console.log('added');
          this.goBack();
      }
    );
  }

  goBack(): void {
    this.location.back();
  }

}
