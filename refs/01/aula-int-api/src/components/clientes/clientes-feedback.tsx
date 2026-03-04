import { Alert } from "@chakra-ui/react";

type ClientesFeedbackProps = {
  erro: string;
  mensagem: string;
};

export function ClientesFeedback({
  erro,
  mensagem,
}: ClientesFeedbackProps) {
  return (
    <>
      {erro && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Erro</Alert.Title>
            <Alert.Description>{erro}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {mensagem && (
        <Alert.Root status="success">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Sucesso</Alert.Title>
            <Alert.Description>{mensagem}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}
    </>
  );
}