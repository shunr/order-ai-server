import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Item } from './Item';
import { Parameter } from './Parameter';

@Table
export class ItemParameter extends Model<ItemParameter> {

  @ForeignKey(() => Item)
  @Column
  public itemId: number;

  @ForeignKey(() => Parameter)
  @Column
  public parameterId: number;
}
