import { finalize, map, Observable } from 'rxjs';
import { RecipeService } from './../../services/recipe.service';
import { Component, Inject, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {4

  addOnBlur = true;
  recipeForm: FormGroup;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadState: Observable<unknown>;
  uploadProgress: Observable<unknown>;
  editMode = false;
  btnCurrentValue = 'Confirm';
  userName: any;
  uid: any;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(private formbuilder: FormBuilder, private recipeService: RecipeService,
    private dialogRef: MatDialogRef<DialogComponent>, private afStorage: AngularFireStorage,
      @Inject(MAT_DIALOG_DATA) public editData: any, private afAuth: AngularFireAuth) {
        this.afAuth.authState.subscribe(user => {
          if(user){
            this.uid = user.uid;
            this.userName = user.displayName;
          }
        })
      }

  ngOnInit(): void {
    this.recipeForm = this.formbuilder.group({
      uid: ['', Validators.required],
      recipeName: ['', Validators.required],
      recipeType: ['', Validators.required],
      recipeCalories: ['', Validators.required],
      recipeIngredients: ['', Validators.required],
      recipePreparation: ['', Validators.required],
      recipeImage: ['', Validators.required],
      recipeTags: ['', Validators.required],
      userName: ['', Validators.required]
    });
    if(this.editData){
      this.editMode = true;
      this.btnCurrentValue = 'Update';
      this.recipeForm.controls['uid'].setValue(this.editData.uid);
      this.recipeForm.controls['recipeName'].setValue(this.editData.recipeName);
      this.recipeForm.controls['recipeType'].setValue(this.editData.recipeType);
      this.recipeForm.controls['recipeCalories'].setValue(this.editData.recipeCalories);
      this.recipeForm.controls['recipeIngredients'].setValue(this.editData.recipeIngredients);
      this.recipeForm.controls['recipePreparation'].setValue(this.editData.recipePreparation);
      this.recipeForm.controls['recipeImage'].setValue(this.editData.recipeImage);
      this.recipeForm.controls['recipeTags'].setValue(this.editData.recipeTags);
      this.recipeForm.controls['userName'].setValue(this.editData.userName);
    }
  }

  get tags(){
    return this.recipeForm.get('recipeTags');
  }

  upload(event){
    const id = Math.random().toString(36).substring(2);
    const file = event.target.files[0];
    let filePath = id;
    this.ref = this.afStorage.ref(id);
    this.task = this.afStorage.upload(filePath, file);
    this.uploadState = this.task.snapshotChanges().pipe(map(serv => serv.state));
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(finalize(() => {
      this.ref.getDownloadURL().subscribe(url => {
        this.recipeForm.patchValue({
          recipeImage: url,
          uid: this.uid,
          userName: this.userName
        })
      })
    })).subscribe();
  }

  addRecipe(){
      if(this.recipeForm.invalid) return;
      else{
        if(!this.editData){
          this.recipeService.saveRecipe(this.recipeForm.value).subscribe((response) => {
            alert("The recipe has been written");
            this.recipeForm.reset();
            this.dialogRef.close('save');
          }, error => alert("Recipe was not written successfully"));
        }
        else this.updateRecipe();
    }
  }

  updateRecipe(){
    this.recipeService.updateRecipe(this.recipeForm.value, this.editData.id).subscribe((response) => {
      alert("Recipe updated succesfully");
      this.recipeForm.reset();
      this.dialogRef.close('Update');
    }, error => {
      alert('Recipe updating failure');
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) { //trim removes whitespaces from string variable
      this.tags.setValue([...this.tags.value, value.trim()]);
      this.tags.updateValueAndValidity();
    }
    event.chipInput!.clear();
  }

  remove(tag: Tags): void {
    const index = this.tags.value.indexOf(tag);

    if (index >= 0) {
      this.tags.value.splice(index, 1);
      this.tags.updateValueAndValidity();
    }
  }

}

export interface Tags {
  type: string;
}
