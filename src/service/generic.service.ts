import { Document, Model, PopulateOptions } from 'mongoose';
/**
 * Include the basic CRUD operations for any service who touch DB.
 *
 * @param S schema related data object
 * @param R request data
 */
export class GenericService<S, R> {
  constructor(
    private readonly model: Model<
      S & Document<any, any, any>,
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      any
    >,
    private readonly populateOpts?: PopulateOptions[],
  ) {}

  populateData(data: S, expanded: boolean) {
    return expanded && this.populateOpts
      ? this.model.populate(data, this.populateOpts ?? [])
      : data;
  }

  populateDataArr(data: S[], expanded: boolean) {
    return expanded && this.populateOpts
      ? this.model.populate(data, this.populateOpts ?? [])
      : data;
  }

  async create(data: R): Promise<S> {
    return this.model.create(data);
  }

  async findAll(expanded: boolean): Promise<S[]> {
    return this.model
      .find()
      .then((data) => this.populateDataArr(data, expanded));
  }

  async findOne(id: string, expanded: boolean): Promise<S> {
    return this.model
      .findOne({ _id: id })
      .then((data) => this.populateData(data, expanded));
  }

  async findByName(name: string, expanded: boolean): Promise<S> {
    return this.model
      .findOne({ name: name })
      .then((data) => this.populateData(data, expanded));
  }

  async update(id: string, data: R): Promise<S> {
    return this.model.findByIdAndUpdate(id, data).exec();
  }

  async delete(id: string): Promise<S> {
    return this.model.findByIdAndRemove({ _id: id }).exec();
  }
}
