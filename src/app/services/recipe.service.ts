import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Recipe } from '../model/recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  uid: any;
  constructor(private http: HttpClient, private afAuth: AngularFireAuth) {
    this.afAuth.authState.subscribe(user => {
      if(user) this.uid = user.uid;
    })
  }

  saveRecipe(data: any){
    return this.http.post<any>
        ("https://recipe-app-5d345-default-rtdb.europe-west1.firebasedatabase.app/recipeList.json", data);
  }

  getRecipe(){
    //i'm expexting result of type object, object contains id of type number and contains data of recipe
    return this.http.get<{[id: string]:Recipe}>
       ('https://recipe-app-5d345-default-rtdb.europe-west1.firebasedatabase.app/recipeList.json').pipe(map(data=>{
        let recipeData: Recipe[] = [];
        for(let id in data){
          recipeData.push({...data[id], id});
        }
        return recipeData;
       }));
       //object which contains an array and that array has id, that id contains object that contains the data
       //when data is received in the data value, it is iterated and data is pushing data according of different id
       //and we return catched data
  }

  updateRecipe(data: any, id: number){
    return this.http.put<any>
      ('https://recipe-app-5d345-default-rtdb.europe-west1.firebasedatabase.app/recipeList/' + id + '.json', data);
  }

  deleteRecipe(id: number){
    return this.http.delete<any>
      ('https://recipe-app-5d345-default-rtdb.europe-west1.firebasedatabase.app/recipeList/' + id + '.json');
  }

  getUserRecipes(){
    return this.http.get<{[id: string]:Recipe}>
       ('https://recipe-app-5d345-default-rtdb.europe-west1.firebasedatabase.app/recipeList.json').pipe(map(data=>{
        let recipeData: Recipe[] = [];
        for(let id in data){
          recipeData.push({...data[id], id});
        }
        let result: Recipe[] = [];
        result = recipeData.filter(data => data.uid == this.uid);
        return result;
       }));
  }
}
