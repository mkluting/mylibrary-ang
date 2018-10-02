import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Book } from '../../models/book';
import { BookService } from '../book.service';
import { PagerService } from '../pager.service';
import {MatTableDataSource, PageEvent, Sort} from "@angular/material";

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Book[];
  newBook: Book;
  columnsToDisplay = ['title', 'author', 'type', 'series', 'book_num', 'owner', 'isbn_13'];
  isLoading = true;
  pager: any;
  pagedItems : any[];
  currentPage = 1;
  pageSize = 20;
  dataSource: any;


  constructor(private bookService: BookService, private pagerService: PagerService) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks()
      .subscribe(books => { this.books = books; this.setPage(); }, response => { console.log('error getting books') }, () => { console.log('get complete');} );
  }

  handlePageEvent(e: any): void {
    this.currentPage = e.pageIndex+1;
    this.pageSize = e.pageSize;
    this.pagedItems = [];
    this.dataSource = new MatTableDataSource(this.pagedItems);
    this.setPage();
  }

  setPage(){
      // get pager object from service
      this.pager = this.pagerService.getPager(this.books.length, this.currentPage, this.pageSize);
      // get current page of items
      this.pagedItems = this.books.slice(this.pager.startIndex, this.pager.endIndex + 1);
      this.dataSource = new MatTableDataSource(this.pagedItems);
      this.isLoading = false;
  }

  sortData(sort: Sort) {
      const data = this.books.slice();
      const orig = data.slice();
      if(!sort.active || sort.direction == ''){
        this.setPage();
        return;
      }

      this.books = data.sort((a,b) => {
          const isAsc = sort.direction === 'asc';
          switch (sort.active) {
            case 'title' : return this.compare(a.title, b.title, isAsc);
            case 'author' : return this.compare(a.author_last + ' ' + a.author_first + ' '+ a.series_num, b.author_last + ' ' + b.author_first + ' ' + b.series_num, isAsc);
            case 'type' : return this.compare(a.binding_type + ' ' + a.author_last + ' ' + a.author_first+ ' '+a.series_num, b.binding_type + ' '+ b.author_last + ' ' + b.author_first+ ' ' + b.series_num, isAsc);
            case 'series' : return this.compare(a.series + ' ' + a.author_last + ' ' + a.author_first + ' ' + a.series_num, b.series + ' ' + b.author_last + ' ' + b.author_first + ' ' + b.series_num, isAsc);
            default: return 0;
          }
      });
      this.setPage();
      this.books = orig.slice();
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editBook(row) {
    console.log(row);
  }


}
