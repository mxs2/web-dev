import {
  Box,
  Container,
  Heading,
  Link as ChakraLink,
  List,
  Stack,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container maxW="5xl" py={10}>
      <Stack gap={8}>
        <Box>
          <Heading size="xl">Aula de Componentização e Integração com API</Heading>
          <Text mt={3} color="gray.600">
            Nesta aplicação, a proposta é comparar duas formas de construir a
            mesma interface: uma versão inicial concentrada em um único arquivo
            e uma versão refatorada em componentes reutilizáveis.
          </Text>
        </Box>

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Heading size="md" mb={4}>
            Rotas da aplicação
          </Heading>

          <List.Root gap={3}>
            <List.Item>
              <ChakraLink asChild color="blue.600" fontWeight="medium">
                <Link href="/clientes-old">/clientes-old</Link>
              </ChakraLink>
              <Text color="gray.600">
                Versão inicial, construída em um único arquivo.
              </Text>
            </List.Item>

            <List.Item>
              <ChakraLink asChild color="blue.600" fontWeight="medium">
                <Link href="/clientes">/clientes</Link>
              </ChakraLink>
              <Text color="gray.600">
                Versão componentizada, com separação de responsabilidades.
              </Text>
            </List.Item>
          </List.Root>
        </Box>

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Heading size="md" mb={4}>
            Metodologia da aula
          </Heading>

          <List.Root gap={3}>
            <List.Item>
              Primeiro, analise a rota <strong>/clientes-old</strong> para
              observar toda a lógica reunida em um único arquivo.
            </List.Item>
            <List.Item>
              Depois, compare com a rota <strong>/clientes</strong> para
              entender como o mesmo problema pode ser resolvido com componentes
              menores e mais organizados.
            </List.Item>
            <List.Item>
              Observe como cada parte da interface pode ter uma responsabilidade
              própria: cabeçalho, mensagens, formulário, filtros, tabela e ações.
            </List.Item>
            <List.Item>
              Perceba também que a comunicação com a API foi separada em uma
              pasta <strong>services</strong>, deixando a página mais limpa.
            </List.Item>
          </List.Root>
        </Box>

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Heading size="md" mb={4}>
            Boas práticas trabalhadas
          </Heading>

          <List.Root gap={3}>
            <List.Item>
              Separação de responsabilidades entre página, componentes, services
              e types.
            </List.Item>
            <List.Item>
              Reaproveitamento de componentes para evitar repetição de código.
            </List.Item>
            <List.Item>
              Centralização das chamadas HTTP em arquivos específicos de serviço.
            </List.Item>
            <List.Item>
              Organização de tipagens em uma pasta própria.
            </List.Item>
            <List.Item>
              Uso de props para comunicação entre componentes.
            </List.Item>
            <List.Item>
              Maior facilidade de manutenção, leitura e evolução do projeto.
            </List.Item>
          </List.Root>
        </Box>

        <Box borderWidth="1px" rounded="lg" p={6}>
          <Heading size="md" mb={4}>
            Perguntas para reflexão
          </Heading>

          <List.Root gap={3}>
            <List.Item>
              Em qual versão fica mais fácil localizar responsabilidades?
            </List.Item>
            <List.Item>
              Em qual versão fica mais fácil reutilizar partes da interface?
            </List.Item>
            <List.Item>
              Em qual versão a manutenção tende a ser mais simples?
            </List.Item>
            <List.Item>
              O que vale a pena transformar em componente e o que não precisa?
            </List.Item>
          </List.Root>
        </Box>
      </Stack>
    </Container>
  );
}