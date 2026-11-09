import { PrismaClient } from "@prisma/client";
import { hashSenha } from "../src/lib/password";

const db = new PrismaClient();
const SENHA = "aprenda-local";

async function garantirUsuario(input: {
  email: string;
  nome: string;
  apelido: string;
  nascimento: string;
}) {
  const existente = await db.usuario.findUnique({ where: { email: input.email } });
  const usuario =
    existente ??
    (await db.usuario.create({
      data: {
        email: input.email,
        senhaHash: hashSenha(SENHA),
        nome: input.nome,
        apelido: input.apelido,
        nascimento: new Date(`${input.nascimento}T00:00:00.000Z`),
      },
    }));

  await db.perfil.upsert({
    where: { usuarioId: usuario.id },
    update: {},
    create: { usuarioId: usuario.id, mostrarReputacao: true, mostrarComunidades: true },
  });
  await db.reputacao.upsert({
    where: { usuarioId: usuario.id },
    update: {},
    create: { usuarioId: usuario.id },
  });
  return usuario;
}

async function garantirNo(slug: string, nome: string, tipo: string, paiId?: string) {
  return db.noConhecimento.upsert({
    where: { slug },
    update: { nome, tipo, paiId: paiId ?? null },
    create: { slug, nome, tipo, paiId },
  });
}

async function main() {
  const matematica = await garantirNo("matematica", "Matemática", "area");
  const funcoes = await garantirNo("funcoes", "Funções", "assunto", matematica.id);
  const limites = await garantirNo("limites", "Limites", "assunto", matematica.id);
  const derivada = await garantirNo("derivada", "Derivada", "assunto", matematica.id);
  const direito = await garantirNo("direito", "Direito", "area");
  const constitucional = await garantirNo(
    "direito-constitucional",
    "Direito Constitucional",
    "disciplina",
    direito.id,
  );
  await garantirNo(
    "direitos-fundamentais",
    "Direitos Fundamentais",
    "assunto",
    constitucional.id,
  );
  await garantirNo("enem", "ENEM", "objetivo");

  await db.noRequisito.upsert({
    where: { noId_requisitoId: { noId: limites.id, requisitoId: funcoes.id } },
    update: {},
    create: { noId: limites.id, requisitoId: funcoes.id },
  });
  await db.noRequisito.upsert({
    where: { noId_requisitoId: { noId: derivada.id, requisitoId: limites.id } },
    update: {},
    create: { noId: derivada.id, requisitoId: limites.id },
  });

  const ana = await garantirUsuario({
    email: "ana@aprenda.local",
    nome: "Ana Souza",
    apelido: "Ana",
    nascimento: "2004-03-15",
  });
  const moderacao = await garantirUsuario({
    email: "moderacao@aprenda.local",
    nome: "Equipe local",
    apelido: "Moderação",
    nascimento: "1992-01-20",
  });

  const admin = await db.papelUsuario.findFirst({
    where: { usuarioId: moderacao.id, papel: "administrador", areaId: null },
  });
  if (!admin) {
    await db.papelUsuario.create({
      data: { usuarioId: moderacao.id, papel: "administrador" },
    });
  }
  const especialista = await db.papelUsuario.findFirst({
    where: { usuarioId: moderacao.id, papel: "especialista", areaId: matematica.id },
  });
  if (!especialista) {
    await db.papelUsuario.create({
      data: { usuarioId: moderacao.id, papel: "especialista", areaId: matematica.id },
    });
  }

  await db.objetivoEstudo.upsert({
    where: { usuarioId: ana.id },
    update: {},
    create: {
      usuarioId: ana.id,
      descricao: "Quero entender funções antes de avançar para derivada.",
      nivel: "Ensino médio",
      prova: "ENEM",
      minutosPorDia: 40,
      dificuldades: "Função quadrática e o significado do vértice.",
    },
  });

  await db.pergunta.upsert({
    where: { id: "seed-vertice" },
    update: {},
    create: {
      id: "seed-vertice",
      titulo: "Como encontrar o vértice de uma função quadrática?",
      corpo: "Estou estudando f(x) = ax² + bx + c e confundo o vértice com o ponto em que a parábola corta o eixo y. Como achar o vértice e o que ele representa?",
      dificuldade: "medio",
      nivelEducacional: "medio",
      objetivo: "entender funções",
      autorId: ana.id,
      nos: { create: [{ noId: funcoes.id }] },
    },
  });

  await db.resposta.upsert({
    where: { id: "seed-vertice-r1" },
    update: {},
    create: {
      id: "seed-vertice-r1",
      perguntaId: "seed-vertice",
      autorId: ana.id,
      estado: "revisao_humana",
      corpo: "O vértice é o ponto em que a parábola corta o eixo y. Basta olhar o valor de c.",
      pareceres: {
        create: {
          id: "seed-parecer-vertice",
          confianca: "baixa",
          texto: "A revisão automática não confirma correção e não classifica a resposta como certa. Uma pessoa precisa analisar.",
        },
      },
    },
  });

  await db.job.upsert({
    where: { id: "seed-job-vertice" },
    update: {},
    create: {
      id: "seed-job-vertice",
      tipo: "parecer",
      payload: "seed-vertice-r1",
      status: "concluido",
    },
  });

  const comunidades = [
    {
      slug: "matematica",
      nome: "Matemática",
      descricao: "Funções, limites, derivadas e o caminho entre eles.",
      regras: "Explique o raciocínio e cite a fonte quando usar um resultado pronto.",
      noId: matematica.id,
    },
    {
      slug: "direito-constitucional",
      nome: "Direito Constitucional",
      descricao: "Constituição, direitos fundamentais e discussões da graduação.",
      regras: "Separe o texto da lei, a doutrina e a sua opinião.",
      noId: constitucional.id,
    },
    {
      slug: "enem",
      nome: "ENEM",
      descricao: "Estudos para o ENEM, sem transformar voto em gabarito.",
      regras: "Dúvida de prova vai para Perguntas, onde a resposta pode ser verificada.",
      noId: null,
    },
  ];

  for (const comunidade of comunidades) {
    await db.comunidade.upsert({
      where: { slug: comunidade.slug },
      update: {
        nome: comunidade.nome,
        descricao: comunidade.descricao,
        regras: comunidade.regras,
      },
      create: comunidade,
    });
  }

  const matematicaComunidade = await db.comunidade.findUniqueOrThrow({ where: { slug: "matematica" } });
  await db.membroComunidade.upsert({
    where: {
      usuarioId_comunidadeId: { usuarioId: moderacao.id, comunidadeId: matematicaComunidade.id },
    },
    update: {},
    create: { usuarioId: moderacao.id, comunidadeId: matematicaComunidade.id },
  });
  await db.membroComunidade.upsert({
    where: { usuarioId_comunidadeId: { usuarioId: ana.id, comunidadeId: matematicaComunidade.id } },
    update: {},
    create: { usuarioId: ana.id, comunidadeId: matematicaComunidade.id },
  });

  await db.publicacao.upsert({
    where: { id: "seed-pub-funcoes" },
    update: {},
    create: {
      id: "seed-pub-funcoes",
      titulo: "Por onde começar em funções?",
      corpo: "Antes da derivada, vale revisar o que uma função faz com cada valor de x e como ler um gráfico.",
      etiqueta: "discussao",
      comunidadeId: matematicaComunidade.id,
      autorId: moderacao.id,
    },
  });

  const enqueteExiste = await db.enquete.findUnique({ where: { publicacaoId: "seed-pub-enquete" } });
  if (!enqueteExiste) {
    await db.publicacao.create({
      data: {
        id: "seed-pub-enquete",
        titulo: "Qual pré-requisito você quer revisar primeiro?",
        corpo: "A enquete não decide conteúdo. Ela só organiza a conversa da comunidade.",
        etiqueta: "enquete",
        comunidadeId: matematicaComunidade.id,
        autorId: moderacao.id,
        enquete: {
          create: {
            opcoes: {
              create: [{ texto: "Funções" }, { texto: "Limites" }, { texto: "Derivada" }],
            },
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (erro) => {
    console.error(erro);
    await db.$disconnect();
    process.exit(1);
  });
