import {Sequelize} from 'sequelize-typescript';
import {Item} from './models/Item'

export class DB {
  _sequelize: Sequelize;
  constructor() {
    this._sequelize = new Sequelize({
      host: 'db',
      database: process.env.SEQ_DB,
      dialect: 'postgres',
      username: process.env.SEQ_USER,
      password: process.env.SEQ_PASSWORD,
      modelPaths: [__dirname + '/models']
    });
  }
  init() {
    return this._sequelize.sync({force: true});
  }
  async writeItem(name: string) {
    const item: Item = new Item({name: "test"});
    await item.save();
  }
}