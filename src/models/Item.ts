import {Table, Column, Model, HasMany} from 'sequelize-typescript';
 
@Table
export class Item extends Model<Item> {

  @Column
  name: string;

}