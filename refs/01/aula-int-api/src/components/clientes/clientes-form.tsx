import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Stack,
  Switch,
} from "@chakra-ui/react";
import type { FormEvent } from "react";

type ClientesFormProps = {
  editingId: number | null;
  nome: string;
  email: string;
  ativo: boolean;
  saving: boolean;
  onNomeChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onAtivoChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  onReset: () => void;
};

export function ClientesForm({
  editingId,
  nome,
  email,
  ativo,
  saving,
  onNomeChange,
  onEmailChange,
  onAtivoChange,
  onSubmit,
  onReset,
}: ClientesFormProps) {
  return (
    <Box borderWidth="1px" rounded="lg" p={6}>
      <Heading size="md" mb={4}>
        {editingId === null ? "Novo Cliente" : `Editando #${editingId}`}
      </Heading>

      <form onSubmit={onSubmit}>
        <Stack gap={4}>
          <Input
            placeholder="Nome"
            value={nome}
            onChange={(e) => onNomeChange(e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />

          <Switch.Root
            checked={ativo}
            onCheckedChange={(details) => onAtivoChange(!!details.checked)}
          >
            <Switch.HiddenInput />
            <Switch.Control />
            <Switch.Label>Ativo</Switch.Label>
          </Switch.Root>

          <HStack>
            <Button type="submit" loading={saving}>
              {editingId === null ? "Cadastrar" : "Salvar"}
            </Button>

            <Button type="button" variant="outline" onClick={onReset}>
              Limpar
            </Button>
          </HStack>
        </Stack>
      </form>
    </Box>
  );
}