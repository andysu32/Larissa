export function AvisoOk({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p className="ok" role="status">
      {mensagem}
    </p>
  );
}
