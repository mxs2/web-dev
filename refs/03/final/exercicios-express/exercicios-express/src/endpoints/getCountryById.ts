import { Request, Response } from "express"
import { countries } from "../data"
import { country } from "../types"

export const getCountryById = (
   req: Request,
   res: Response
): void => {

   const result: country | undefined = countries.find(
      country => country.id.toString() === req.params.id
   )

   if (result) {
      
      res.send(result )
   } else {
      res.statusCode = 404
      res.end()
   }

}