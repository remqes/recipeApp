import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { RecipeService } from 'src/app/services/recipe.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Recipe } from 'src/app/model/recipe';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-myrecipes',
  templateUrl: './myrecipes.component.html',
  styleUrls: ['./myrecipes.component.css']
})
export class MyrecipesComponent implements OnInit {

  dataSource: MatTableDataSource<Recipe>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  observable: Observable<any>;
  recipeNotFound = false;
  uid: any;
  uidname: any;

  constructor(private recipeService: RecipeService, private dialog: MatDialog, public afAuth: AngularFireAuth, public router: Router) {
    this.afAuth.authState.subscribe(user => {
      if(user){
        this.uid = user.uid;
        this.uidname = user.displayName;
      }
    })
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if(user) this.getAllRecipes();
    })
  }

  getAllRecipes(){
    this.recipeService.getUserRecipes().subscribe((response: any) => {
      if(response.length == 0) this.recipeNotFound = true;
      else{
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.observable = this.dataSource.connect();
      }
    }, error => {
      alert('Error occured while featching data');
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editRecipe(recipeData: any){
    console.log(recipeData);
    this.dialog.open(DialogComponent, {width: '100%', data: recipeData }).afterClosed().subscribe((value) => {
        this.getAllRecipes();
    });
  }

  deleteRecipe(id: number){
    if(confirm('Are you sure this recipe is to be removed?')){
      this.recipeService.deleteRecipe(id).subscribe((response) => {
        alert("Recipe removed succesfully");
        this.getAllRecipes();
      }, error => {
        alert("Recipe not found");
      });
    }
  }

}
