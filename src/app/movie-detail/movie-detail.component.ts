import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Movie } from '../../models/movie';
import { MovieService } from '../movie.service';
import { CoverService } from '../cover.service';

@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

    @Input() movie: Movie;
    coverUrl = '';
    coverLoading = true;
    defaultCoverUrl = '/assets/no-image.jpg';
    deleteBtnText = 'Delete Movie';
    saveBtnText = 'Save Changes';
    movieLoading = true;

    constructor(
        private route: ActivatedRoute,
        private movieService: MovieService,
        private coverService: CoverService,
        private location: Location
    ) { }

    ngOnInit(): void {
        this.getMovie();
    }


    getMovie(): void {
        const id = +this.route.snapshot.paramMap.get('id');
        this.movieService.getMovie(id)
            .subscribe(movie => {
                this.movie = movie[0];
                this.movieLoading = false;
                if (this.movie.title) {
                    this.coverService.getMoviePoster(this.movie.title)
                        .subscribe(res => {
                            const items = res['results'];
                            if (typeof items !== 'undefined' && items.length > 0) {
                                this.coverUrl = 'http://image.tmdb.org/t/p/w500/' + items[0].poster_path;
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
        this.movieService.editMovie(id, this.movie).subscribe(data => {
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

    removeMovie(id: number): void {
        if (confirm('ALERT: Are you sure to delete this movie?')) {
            this.deleteBtnText = 'Deleting..';
            this.movieService.removeMovie(id).subscribe(data => {
            }, data => {
                console.log('error');
                this.deleteBtnText = 'Delete Movie';
            }, () => {
                console.log('deleted');
                this.deleteBtnText = 'Delete Movie';
                this.goBack();
            });
        }
    }

    goBack(): void {
        this.location.back();
    }

}
