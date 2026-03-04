import { app } from "./app"
import { deleteCountryById } from "./endpoints/deleteCountryById"
import { getAllCountries } from "./endpoints/getAllCountries"
import { getCountryById } from "./endpoints/getCountryById"
import { getRandomCountry } from "./endpoints/getRandomCountry"

app.get("/countries", getAllCountries)
app.get("/countries/random", getRandomCountry) // precisa vir antes de /countries/:id
app.get("/countries/:id", getCountryById)
app.get("/countries/:valor", (req, res) => { res.send("resposta") }) // nunca será acessada );
app.delete("/countries/:id", deleteCountryById)