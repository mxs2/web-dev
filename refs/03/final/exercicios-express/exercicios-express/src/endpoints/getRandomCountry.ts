import { Request, Response } from "express"
import { countries } from "../data"
import { country } from "../types"

export const getRandomCountry = (
   req: Request,
   res: Response
): void => {
   const index = Math.floor(Math.random() * 190)

   const result: country | undefined = countries.find(
      country => country.id === index
   )

   console.log(index);


   if (result) {

      res.send(result)
   } else {
      res.statusCode = 404
      res.end()
   }

}