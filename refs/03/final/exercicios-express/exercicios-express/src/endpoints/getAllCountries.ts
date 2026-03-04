import { Request, Response } from "express"
import { countries } from "../data"

export const getAllCountries = (
   req: Request,
   res: Response
): void => {

   console.log( req.query)
   res.statusMessage = "Mensagem customizada no cabeçalho da resposta"
   res.send(countries)
}