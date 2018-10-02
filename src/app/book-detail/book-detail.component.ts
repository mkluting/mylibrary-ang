import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../../models/book';
import { BookService } from '../book.service';
import { CoverService } from '../cover.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;
  origBtnText = '';
  coverUrl = '';

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private coverService: CoverService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getBook();
  }


  getBook(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.bookService.getBook(id)
      .subscribe(book =>
        {
          this.book = book[0];
          this.coverService.getCover(this.book.isbn_13)
            .subscribe(res =>
            {
              console.log(res);
              let items = res['items'];
              if(typeof items !== 'undefined' && items.length > 0){
                this.coverUrl = res['items'][0].volumeInfo.imageLinks.thumbnail;
              }
              else {
                this.coverUrl = '';
              }
            });
        }
      );

  }

  saveChanges(id: number): void {
     this.bookService.editBook(id, this.book).subscribe(data => {
     }, data => {
       console.log('error');
     }, () => {
       console.log('edited');
     });
  }

  removeBook(id: number): void {
      this.bookService.removeBook(id).subscribe(data => {

      }, data => {
        console.log('error');
      }, () => {
        console.log('deleted');
        this.goBack();
      });
  }

  goBack(): void {
    this.location.back();
  }

}
