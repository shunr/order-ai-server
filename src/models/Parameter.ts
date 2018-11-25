import { BelongsToMany, Column, DataType, Model, Table, Unique } from 'sequelize-typescript';

import { Item } from './Item';
import { ItemParameter } from './ItemParameter';

@Table
export class Parameter extends Model<Parameter> {

  @Unique
  @Column
  public name: string;

  @Column(DataType.JSON)
  public defaultValue: string;

  @Column
  public required: boolean = true;

  @Column
  public prompt: string;

  @Column
  public isSystemEntity: boolean;

  @Column
  public systemEntity?: string;

  @Column(DataType.ARRAY(DataType.STRING))
  public values?: string[];

  @BelongsToMany(() => Item, () => ItemParameter)
  public items: Item[];
}
