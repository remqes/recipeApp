import { AngularFireAuth } from '@angular/fire/compat/auth';
import { DialogComponent } from './../dialog/dialog.component';
import { Observable } from 'rxjs';
import { RecipeService } from './../../services/recipe.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Recipe } from 'src/app/model/recipe';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dataSource: MatTableDataSource<Recipe>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  observable: Observable<any>;
  recipeNotFound = false;

  constructor(private recipeService: RecipeService, private dialog: MatDialog, public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes(){
    this.recipeService.getRecipe().subscribe((response: any) => {
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
