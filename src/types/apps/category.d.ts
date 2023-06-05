import { Pagination, IApiPayload } from 'src/types/api'

export interface ICategory {
  order: number
  name: string
  title: string
  status: string
  id: string
  image: string
}

export interface CategoryApi extends ICategory {
  id: string,
  createdAt: Date
  updatedAt: Date
}

export interface CategoryForm extends Omit<ICategory, ['id', 'createdAt', 'updatedAt']> { }

export type CategoryKeys = keyof CategoryForm;

export interface IPayload {
  pagination: Pagination;
  entities: CategoryApi[];
}

interface IGetAll extends IApiPayload<IPayload> {}
