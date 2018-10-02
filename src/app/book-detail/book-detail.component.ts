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
  coverUrl = '';
  coverLoading = true;
  defaultCoverUrl = '/assets/no-image.jpg';
  deleteBtnText = 'Delete Book';
  saveBtnText = 'Save Changes';
  bookLoading = true;

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
      .subscribe(book => {
          this.book = book[0];
          this.bookLoading = false;
          if (this.book.isbn_13) {
              this.coverService.getCover(this.book.isbn_13)
                  .subscribe(res => {
                      const items = res['items'];
                      if (typeof items !== 'undefined' && items.length > 0) {
                          this.coverUrl = res['items'][0].volumeInfo.imageLinks.thumbnail;
                      } else {
                          this.coverUrl = this.defaultCoverUrl;
                      }
                      this.coverLoading = false;
                  });
          } else {
              this.coverUrl = this.defaultCoverUrl;
              this.coverLoading = false;
          }
      });

  }

  saveChanges(id: number): void {
      this.saveBtnText = 'Saving Changes...';
     this.bookService.editBook(id, this.book).subscribe(data => {
     }, data => {
         console.log('error');
         this.saveBtnText = 'Error Saving Changes!';
         // 10 seconds delay
         setTimeout( () => {
             this.saveBtnText = 'Save Changes';
         }, 2000 );
     }, () => {
         console.log('edited');
         this.saveBtnText = 'Saved!';
         setTimeout(() => {
             this.saveBtnText = 'Save Changes';
         }, 2000);
     });
  }

  removeBook(id: number): void {
      if (confirm('ALERT: Are you sure to delete this book?')) {
          this.deleteBtnText = 'Deleting..';
          this.bookService.removeBook(id).subscribe(data => {
          }, data => {
              console.log('error');
              this.deleteBtnText = 'Delete Book';
          }, () => {
              console.log('deleted');
              this.deleteBtnText = 'Delete Book';
              this.goBack();
          });
      }
  }

  goBack(): void {
    this.location.back();
  }

}
