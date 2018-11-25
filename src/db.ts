import { ISequelizeConfig, Sequelize } from 'sequelize-typescript';

import { Item } from './models/Item';
import { ItemParameter } from './models/ItemParameter';
import { Parameter } from './models/Parameter';

class DBClient {
  private sequelize: Sequelize;
  constructor() {
    const config: ISequelizeConfig = {
      host: 'db',
      database: process.env.SEQ_DB,
      dialect: 'postgres',
      username: process.env.SEQ_USER,
      password: process.env.SEQ_PASSWORD,
      modelPaths: [`${__dirname}/models`]
    };
    this.sequelize = new Sequelize(config);
  }

  public init(): PromiseLike<void> {
    return this.sequelize.sync({ force: true });
    //return this._sequelize.sync();
  }

  public async test(): Promise<void> {
    const param: Parameter = new Parameter({
      name: 'size',
      defaultValue: 'medium',
      required: true,
      prompt: 'What size?',
      isSystemEntity: false,
      values: ['small', 'medium', 'large']
    });

    const item: Item = new Item({
      name: 'sideorder_size_SML',
      values: [
        'Fries',
        'Poutine',
        'Shawarma Poutine',
        'Potato Wedges',
        'Onion Rings'
      ]
    });

    await param.save();
    await item.save();

    const itemParameter: ItemParameter = new ItemParameter({
      itemId: item.id, parameterId: param.id
    });
    await itemParameter.save();
  }

  public async getItems(): Promise<Item[]> {
    return Item.findAll();
  }

  public async getParameters(): Promise<Parameter[]> {
    return Parameter.findAll();
  }
}

export const DB: DBClient = new DBClient();
