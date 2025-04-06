export interface Student{
    id: string,
    firstName: string,
    lastName: string,
    country: string,
    email: string,
    courses ?: Course[]
}

export interface Course{
    id:string,
    courseName:string,
    students ?: Student[]
    isAssigned ?: boolean;
}

export interface Country{
    id:string,
    countryName:string,
    code : string
}

export interface Fault{
    faultcode:string,
    faultstring : string,
    detail : Detail
}

export interface Detail{
    errorCode:number,
    errorMessage: string
}