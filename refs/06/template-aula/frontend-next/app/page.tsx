"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Badge,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Code,
} from "@chakra-ui/react";
import type { ApiResponse } from "./lib/apiTypes";

type LastCallState = {
  durationMs: number | null;
  summary: string | null;
  full: string | null;
};

async function fetchReport(baseUrl: string): Promise<ApiResponse> {
  const res = await fetch(`${baseUrl}/api/sales/report`);
  if (!res.ok) {
    throw new Error(`Erro ao chamar ${baseUrl}: ${res.status}`);
  }
  const data = (await res.json()) as ApiResponse;
  return data;
}

export default function Page() {
  const [slow, setSlow] = useState<LastCallState>({
    durationMs: null,
    summary: null,
    full: null,
  });
  const [fast, setFast] = useState<LastCallState>({
    durationMs: null,
    summary: null,
    full: null,
  });
  const [loading, setLoading] = useState<"slow" | "fast" | null>(null);

  async function handleCall(kind: "slow" | "fast") {
    try {
      setLoading(kind);
      const baseUrl =
        kind === "slow" ? "http://localhost:3001" : "http://localhost:3002";
      const data = await fetchReport(baseUrl);

      const summary = {
        generatedAt: data.report.generatedAt,
        totalSales: data.report.totalSales,
        totalAmount: data.report.totalAmount,
        sectors: data.report.sectors,
        fromCache: data.fromCache ?? false,
      };

      const state: LastCallState = {
        durationMs: data.durationMs,
        summary: JSON.stringify(summary, null, 2),
        full: JSON.stringify(data, null, 2),
      };

      if (kind === "slow") {
        setSlow(state);
      } else {
        setFast(state);
      }
    } catch (err: any) {
      const state: LastCallState = {
        durationMs: null,
        summary: `Erro: ${err?.message ?? "erro desconhecido"}`,
        full: null,
      };
      if (kind === "slow") {
        setSlow(state);
      } else {
        setFast(state);
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <Box px={{ base: 4, md: 10 }} py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        gap={4}
        mb={8}
      >
        <Box>
          <Heading size="lg" mb={1}>
            Dashboard de Performance
          </Heading>
          <Text color="gray.400" fontSize="sm">
            Comparando um endpoint pesado sem cache com o mesmo cenário otimizado
            com Redis + cron job, usando PostgreSQL como banco.
          </Text>
        </Box>

        <Flex gap={2} align="center">
          <Badge
            borderRadius="full"
            px={3}
            py={1}
            colorScheme="red"
            variant="subtle"
          >
            Sem Cache
          </Badge>
          <Badge
            borderRadius="full"
            px={3}
            py={1}
            colorScheme="green"
            variant="subtle"
          >
            Com Redis + Cron
          </Badge>
        </Flex>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={10}>
        <Card
          bg="gray.900"
          border="1px solid"
          borderColor="red.900"
          className="shadow-xl"
        >
          <CardBody>
            <Badge
              mb={3}
              borderRadius="full"
              px={2}
              py={1}
              colorScheme="red"
              variant="outline"
            >
              Backend Lento (Postgres)
            </Badge>
            <Heading size="md" mb={1}>
              Sem cache
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={4}>
              Consulta pesada no PostgreSQL + processamento intenso em memória.
            </Text>

            <Button
              colorScheme="red"
              size="sm"
              borderRadius="full"
              onClick={() => handleCall("slow")}
              isLoading={loading === "slow"}
            >
              Chamar /api/sales/report
            </Button>

            <Stat mt={6}>
              <StatLabel>Último tempo de resposta</StatLabel>
              <StatNumber>
                {slow.durationMs != null
                  ? `${slow.durationMs.toFixed(2)} ms`
                  : "–"}
              </StatNumber>
              <StatHelpText fontSize="xs" color="gray.500">
                Esperado: vários milhares de ms (segundos), pois não há cache.
              </StatHelpText>
            </Stat>

            <Text mt={4} mb={2} fontSize="xs" textTransform="uppercase">
              Resumo da resposta
            </Text>
            <Box
              as="pre"
              fontSize="xs"
              bg="blackAlpha.800"
              p={3}
              borderRadius="md"
              maxH="220px"
              overflow="auto"
            >
              {slow.summary ?? "Nenhuma requisição ainda."}
            </Box>
          </CardBody>
        </Card>

        <Card
          bg="gray.900"
          border="1px solid"
          borderColor="green.900"
          className="shadow-xl"
        >
          <CardBody>
            <Badge
              mb={3}
              borderRadius="full"
              px={2}
              py={1}
              colorScheme="green"
              variant="outline"
            >
              Backend Cacheado (Postgres + Redis)
            </Badge>
            <Heading size="md" mb={1}>
              Com Redis + cron
            </Heading>
            <Text fontSize="sm" color="gray.400" mb={4}>
              O mesmo relatório, pré-calculado periodicamente e servido a partir do
              cache.
            </Text>

            <Button
              colorScheme="green"
              size="sm"
              borderRadius="full"
              onClick={() => handleCall("fast")}
              isLoading={loading === "fast"}
            >
              Chamar /api/sales/report
            </Button>

            <Stat mt={6}>
              <StatLabel>Último tempo de resposta</StatLabel>
              <StatNumber>
                {fast.durationMs != null
                  ? `${fast.durationMs.toFixed(2)} ms`
                  : "–"}
              </StatNumber>
              <StatHelpText fontSize="xs" color="gray.500">
                Esperado: poucos ms, pois o backend lê direto do Redis.
              </StatHelpText>
            </Stat>

            <Text mt={4} mb={2} fontSize="xs" textTransform="uppercase">
              Resumo da resposta
            </Text>
            <Box
              as="pre"
              fontSize="xs"
              bg="blackAlpha.800"
              p={3}
              borderRadius="md"
              maxH="220px"
              overflow="auto"
            >
              {fast.summary ?? "Nenhuma requisição ainda."}
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Tabs variant="enclosed-colored" colorScheme="blue">
        <TabList>
          <Tab>JSON completo (última resposta)</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Box
              as="pre"
              fontSize="xs"
              bg="blackAlpha.800"
              p={4}
              borderRadius="md"
              maxH="320px"
              overflow="auto"
            >
              {fast.full ??
                slow.full ??
                "Clique em um dos botões acima para ver o JSON completo retornado pela API."}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
