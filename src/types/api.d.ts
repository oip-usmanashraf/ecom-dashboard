import { AxiosError } from 'axios';

export interface Pagination {
  page?: number
  total?: number
  limit?: number
}

export interface GetParams {
  query?: { [key: string]: string }
  pagination?: Pagination
}

// export interface IGetAllPayload<Entities> {
//   data: {
//     pagination: Pagination;
//     entities: Entities[];
//   };
//   message: string;
//   statusCode: string;
// }

// export interface IGetAllPayload<Entities> {
//   data: {
//     entity: Entities;
//   };
//   message: string;
//   statusCode: string;
// }

export interface IApiPayload<Data> {
  data: Data;
  message: string;
  statusCode: string;
}

export interface AxiosErrorResponse extends AxiosError {
  statusCode: number;
  message: string;
}
