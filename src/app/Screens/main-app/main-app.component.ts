import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IexFetchingService } from 'src/app/services/iex-fetching.service';
import { DbUserWatchlistService } from 'src/app/services/db-user-watchlist.service';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.css']
})
export class MainAppComponent implements OnInit {

  user: any;
  data;

  constructor(public auth: AuthService, public configService: IexFetchingService, public db: DbUserWatchlistService) { }

  ngOnInit() {
    // if(this.auth.user$){
    //   this.auth.user$.subscribe(res => {
    //     this.db.getAuthUser();

        // this.configService.getChart('aapl','1m').subscribe( res => {
        //   this.data = res['chart'][0]['date'];
        //   console.log(this.data);
        // })
        // this.data = this.configService.chartData;
        // console.log(this.data)
    //   })

    // }
  }

}
