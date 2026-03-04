"use client";

import { Box, Button, Container, Heading, Input, Spinner, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

type CidadeEncontrada = {
  name: string;
  country?: string;
  latitude: number;
  longitude: number;
};

type GeocodingResponse = {
  results?: CidadeEncontrada[];
};

type WeatherResponse = {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
  };
};

type Clima = {
  cidade: string;
  pais: string;
  temperatura: number;
  vento: number;
};

export default function ExemploFetchPage() {
  const [cidade, setCidade] = useState("");
  const [clima, setClima] = useState<Clima | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function buscarClima() {
    try {
      setLoading(true);
      setErro("");
      setClima(null);

      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`
      );
      console.log(geoRes, "geoRes geoRes geoRes geoRes")

      if (!geoRes.ok) {
        throw new Error("Erro ao buscar cidade");
      }

      const geoJson: GeocodingResponse = await geoRes.json();
      const local = geoJson.results?.[0];
      console.log(geoJson, "geoJson geoJson geoJson geoJson")

      if (!local) {
        throw new Error("Cidade não encontrada");
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,wind_speed_10m`
      );

      // Parâmetro "current" define quais dados atuais queremos receber da API;
      // temperature_2m → temperatura medida a 2 metros do solo;
      // wind_speed_10m → velocidade do vento a 10 metros;
      // Ou seja, estamos pedindo apenas essas informações específicas do clima atual.

      console.log(weatherRes, "weatherRes weatherRes weatherRes weatherRes")

      if (!weatherRes.ok) {
        throw new Error("Erro ao buscar clima");
      }

      const weatherJson: WeatherResponse = await weatherRes.json();

      if (!weatherJson.current) {
        throw new Error("Dados de clima indisponíveis");
      }

      setClima({
        cidade: local.name,
        pais: local.country ?? "Não informado",
        temperatura: weatherJson.current.temperature_2m,
        vento: weatherJson.current.wind_speed_10m,
      });
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao buscar clima");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxW="4xl" py={10}>
      <Stack gap={6}>
        <Box>
          <Heading size="lg">Exemplo De Fetch Com API De Tempo</Heading>
          <Text color="gray.600">
            Digite uma cidade para buscar clima atual;
          </Text>
        </Box>

        <Stack direction={{ base: "column", md: "row" }} gap={3}>
          <Input
            placeholder="Ex.: Recife"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
          />
          <Button onClick={buscarClima} loading={loading}>
            Buscar
          </Button>
        </Stack>

        {loading && (
          <Box textAlign="center">
            <Spinner />
          </Box>
        )}

        {erro && <Text color="red.500">{erro}</Text>}

        {clima && (
          <Box borderWidth="1px" rounded="md" p={4}>
            <Text fontWeight="bold">
              {clima.cidade} - {clima.pais};
            </Text>
            <Text>Temperatura: {clima.temperatura} °C;</Text>
            <Text>Velocidade Do Vento: {clima.vento} km/h;</Text>
          </Box>
        )}
      </Stack>
    </Container>
  );
}