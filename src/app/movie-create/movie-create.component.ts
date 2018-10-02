import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location} from '@angular/common';

import { Movie } from '../../models/movie';
import { MovieService } from '../movie.service';

@Component({
    selector: 'app-movie-create',
    templateUrl: './movie-create.component.html',
    styleUrls: ['./movie-create.component.css']
})
export class MovieCreateComponent implements OnInit {

    newMovie: Movie;
    title = new FormControl();
    constructor(
        private route: ActivatedRoute,
        private movieService: MovieService,
        private location: Location
    ) { }

    ngOnInit() {
        this.newMovie = new Movie;
    }

    addMovie(): void {
        this.movieService.addMovie(this.newMovie).
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
