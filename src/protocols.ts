export type ApplicationError = {
  name: string;
  message: string;
};

//Regra de Negócio

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};
