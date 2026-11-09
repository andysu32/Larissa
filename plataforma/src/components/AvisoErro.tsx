export function AvisoErro({ erro }: { erro?: string }) {
  if (!erro) return null;
  return (
    <p className="erro" role="alert">
      {erro}
    </p>
  );
}
