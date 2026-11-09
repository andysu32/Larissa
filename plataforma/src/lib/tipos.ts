export type UsuarioAtual = {
  id: string;
  email: string;
  nome: string;
  apelido: string;
  restrito: boolean;
  bloqueado: boolean;
  publicacaoRestrita: boolean;
  precisao: number;
  clareza: number;
  contribuicao: number;
  papeis: { papel: string; areaId: string | null }[];
  tamanhoFonte: "sm" | "md" | "lg";
  mostrarNome: boolean;
};

export type Resultado<T extends object = object> =
  | ({ ok: true } & T)
  | { ok: false; erro: string };
