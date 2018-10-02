import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    routeLinks: any[];
    activeLinkIndex = -1;

  constructor(private router: Router) {
      this.routeLinks = [
          {
              label: 'Books',
              link: './books',
              index: 0
          },
          {
              label: 'Movies',
              link: './movies',
              index: 1
          }
      ];
  }

  ngOnInit() {
    this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.routeLinks.indexOf(this.routeLinks.find(tab => tab.link === '.' + this.router.url));
    });
  }

}
