export interface identificationSchema{
    idType: string,
    idNumber : string,
    issuedBy : string,
    issueDate: string,
    expirationDate: string
  }

export interface addressSchema{
    address: string,
    city: string,
    state: string,
    zip: string
  }

export  interface queryParameters{
    text: string,
    values: Array<any>
  }