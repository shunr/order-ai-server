import { BelongsToMany, Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

import { ItemParameter } from './ItemParameter';
import { Parameter } from './Parameter';

@Table
export class Item extends Model<Item> {
  @Unique
  @Column
  public name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  public values: string[];

  @BelongsToMany(() => Parameter, () => ItemParameter)
  public parameters: Parameter[];
}
