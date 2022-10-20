/**
 * Include the basic CRUD operations for any service who touch DB.
 *
 * @param S schema related data object
 * @param R request data
 */
export class GenericService<S, R> {
  constructor(private readonly model: any) {}

  async create(data: R): Promise<S> {
    return this.model.create(data);
  }

  async findAll(): Promise<S[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<S> {
    return this.model.findOne({ _id: id }).exec();
  }

  async findByName(name: string): Promise<S> {
    return this.model.findOne({ name: name }).exec();
  }

  async update(id: string, data: R): Promise<S> {
    return this.model.findByIdAndUpdate(id, data).exec();
  }

  async delete(id: string): Promise<S> {
    return this.model.findByIdAndRemove({ _id: id }).exec();
  }
}
