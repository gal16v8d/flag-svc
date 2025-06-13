import { Document, Model, PopulateOptions } from 'mongoose';
/**
 * Include the basic CRUD operations for any service who touch DB.
 *
 * @param S schema related data object
 * @param R request data
 */
export class GenericService<S, R> {
  constructor(
    private readonly model: Model<S & Document>,
    private readonly populateOpts?: PopulateOptions[],
  ) {}

  getKey(expanded?: boolean): string {
    return `${this.model.modelName}-${!!expanded}`;
  }

  async create(data: R): Promise<S> {
    return this.model.create(data);
  }

  async findAll(): Promise<Array<S>> {
    return this.model.find();
  }

  async findAllExpanded(): Promise<Array<S>> {
    return this.model.find().then((data) => this.expandDataArr(data));
  }

  async findOne(id: string): Promise<S> {
    return this.model.findOne({ _id: id });
  }

  async findOneExpanded(id: string): Promise<S> {
    return this.model
      .findOne({ _id: id })
      .then((data) => this.expandData(data));
  }

  async findByName(name: string): Promise<S> {
    return this.model.findOne({ name: name });
  }

  async findByNameExpanded(name: string): Promise<S> {
    return this.model
      .findOne({ name: name })
      .then((data) => this.expandData(data));
  }

  async update(id: string, data: R): Promise<S> {
    return this.model.findByIdAndUpdate(id, data).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete({ _id: id }).exec();
  }

  async expandData(data: S) {
    return this.populateOpts
      ? await this.model.populate(data, this.populateOpts ?? [])
      : data;
  }

  async expandDataArr(data: Array<S>) {
    return this.populateOpts
      ? await Promise.all(data.map((d) => this.expandData(d)))
      : data;
  }
}
