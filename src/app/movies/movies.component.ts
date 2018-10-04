import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Movie } from '../../models/movie';
import { MovieService } from '../movie.service';
import { PagerService } from '../pager.service';
import { MatTableDataSource, PageEvent, Sort} from "@angular/material";

@Component({
    selector: 'app-movies',
    templateUrl: './movies.component.html',
    styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {

    movies: Movie[];
    newMovie: Movie;
    columnsToDisplay = ['title', 'director', 'series', 'movie_num', 'owner', 'format' ];
    isLoading = true;
    pager: any;
    pagedItems: any[];
    currentPage = 1;
    pageSize = 20;
    dataSource: any;


    constructor(private movieService: MovieService, private pagerService: PagerService) { }

    ngOnInit() {
        this.getMovies();
    }

    getMovies(): void {
        this.movieService.getMovies()
            .subscribe(
                movies => { this.movies = movies; this.setPage(); },
                response => { console.log('error getting movies'); },
                () => { console.log('get complete'); });
    }

    handlePageEvent(e: any): void {
        this.currentPage = e.pageIndex + 1;
        this.pageSize = e.pageSize;
        this.pagedItems = [];
        this.dataSource = new MatTableDataSource(this.pagedItems);
        this.setPage();
    }

    setPage() {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.movies.length, this.currentPage, this.pageSize);
        // get current page of items
        this.pagedItems = this.movies.slice(this.pager.startIndex, this.pager.endIndex + 1);
        this.dataSource = new MatTableDataSource(this.pagedItems);
        this.isLoading = false;
    }

    sortData(sort: Sort) {
        const data = this.movies.slice();
        const orig = data.slice();
        if(!sort.active || sort.direction === '') {
            this.setPage();
            return;
        }

        this.movies = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'title' : return this.compare(a.title, b.title, isAsc);
                default: return 0;
            }
        });
        this.setPage();
        this.movies = orig.slice();
    }

    compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    editMovie(row) {
        console.log(row);
    }
}
