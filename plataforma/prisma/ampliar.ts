import type { PrismaClient } from "@prisma/client";
import { hashSenha } from "../src/lib/password";

const SENHA = "aprenda-local";

type NoDef = { slug: string; nome: string; tipo: string; pai?: string; antes?: string[] };

const NOS: NoDef[] = [
  { slug: "matematica", nome: "Matemática", tipo: "area" },
  { slug: "algebra", nome: "Álgebra", tipo: "disciplina", pai: "matematica" },
  { slug: "funcoes", nome: "Funções", tipo: "assunto", pai: "algebra" },
  { slug: "funcao-quadratica", nome: "Função quadrática", tipo: "subassunto", pai: "funcoes", antes: ["funcoes"] },
  { slug: "calculo", nome: "Cálculo", tipo: "disciplina", pai: "matematica", antes: ["funcoes"] },
  { slug: "limites", nome: "Limites", tipo: "assunto", pai: "calculo", antes: ["funcoes"] },
  { slug: "derivada", nome: "Derivada", tipo: "assunto", pai: "calculo", antes: ["limites"] },
  { slug: "fisica", nome: "Física", tipo: "area" },
  { slug: "mecanica", nome: "Mecânica", tipo: "disciplina", pai: "fisica" },
  { slug: "eletromagnetismo", nome: "Eletromagnetismo", tipo: "assunto", pai: "fisica", antes: ["mecanica"] },
  { slug: "quimica", nome: "Química", tipo: "area" },
  { slug: "biologia", nome: "Biologia", tipo: "area" },
  { slug: "historia", nome: "História", tipo: "area" },
  { slug: "geografia", nome: "Geografia", tipo: "area" },
  { slug: "portugues", nome: "Português", tipo: "area" },
  { slug: "literatura", nome: "Literatura", tipo: "disciplina", pai: "portugues" },
  { slug: "filosofia", nome: "Filosofia", tipo: "area" },
  { slug: "sociologia", nome: "Sociologia", tipo: "area" },
  { slug: "ingles", nome: "Inglês", tipo: "area" },
  { slug: "direito", nome: "Direito", tipo: "area" },
  { slug: "direito-constitucional", nome: "Direito Constitucional", tipo: "disciplina", pai: "direito" },
  { slug: "direitos-fundamentais", nome: "Direitos Fundamentais", tipo: "assunto", pai: "direito-constitucional" },
  { slug: "direito-civil", nome: "Direito Civil", tipo: "disciplina", pai: "direito" },
  { slug: "direito-penal", nome: "Direito Penal", tipo: "disciplina", pai: "direito" },
  { slug: "processo-civil", nome: "Processo Civil", tipo: "disciplina", pai: "direito" },
  { slug: "processo-penal", nome: "Processo Penal", tipo: "disciplina", pai: "direito" },
  { slug: "medicina", nome: "Medicina", tipo: "area" },
  { slug: "anatomia", nome: "Anatomia", tipo: "disciplina", pai: "medicina" },
  { slug: "fisiologia", nome: "Fisiologia", tipo: "disciplina", pai: "medicina", antes: ["anatomia"] },
  { slug: "clinica-medica", nome: "Clínica médica", tipo: "disciplina", pai: "medicina" },
  { slug: "residencia", nome: "Residência", tipo: "objetivo", pai: "medicina" },
  { slug: "medicina-evidencias", nome: "Medicina baseada em evidências", tipo: "assunto", pai: "medicina" },
  { slug: "tecnologia", nome: "Tecnologia", tipo: "area" },
  { slug: "programacao", nome: "Programação", tipo: "disciplina", pai: "tecnologia" },
  { slug: "python", nome: "Python", tipo: "assunto", pai: "programacao" },
  { slug: "javascript", nome: "JavaScript", tipo: "assunto", pai: "programacao" },
  { slug: "c-cpp", nome: "C e C++", tipo: "assunto", pai: "programacao" },
  { slug: "banco-de-dados", nome: "Banco de dados", tipo: "assunto", pai: "tecnologia" },
  { slug: "inteligencia-artificial", nome: "Inteligência artificial", tipo: "assunto", pai: "tecnologia", antes: ["programacao"] },
  { slug: "engenharia-de-software", nome: "Engenharia de software", tipo: "disciplina", pai: "tecnologia" },
  { slug: "arduino", nome: "Arduino", tipo: "assunto", pai: "tecnologia" },
  { slug: "robotica", nome: "Robótica", tipo: "assunto", pai: "tecnologia", antes: ["arduino"] },
  { slug: "engenharia", nome: "Engenharia", tipo: "area" },
  { slug: "engenharia-civil", nome: "Engenharia civil", tipo: "disciplina", pai: "engenharia" },
  { slug: "engenharia-mecanica", nome: "Engenharia mecânica", tipo: "disciplina", pai: "engenharia" },
  { slug: "engenharia-eletrica", nome: "Engenharia elétrica", tipo: "disciplina", pai: "engenharia" },
  { slug: "engenharia-computacao", nome: "Engenharia de computação", tipo: "disciplina", pai: "engenharia" },
  { slug: "resistencia-dos-materiais", nome: "Resistência dos materiais", tipo: "assunto", pai: "engenharia", antes: ["calculo"] },
  { slug: "ensino-fundamental", nome: "Ensino fundamental", tipo: "objetivo" },
  { slug: "ensino-medio", nome: "Ensino médio", tipo: "objetivo" },
  { slug: "vestibular", nome: "Vestibular", tipo: "objetivo" },
  { slug: "enem", nome: "ENEM", tipo: "objetivo" },
  { slug: "fuvest", nome: "FUVEST", tipo: "objetivo" },
  { slug: "ita", nome: "ITA", tipo: "objetivo" },
  { slug: "ime", nome: "IME", tipo: "objetivo" },
  { slug: "oab", nome: "OAB", tipo: "objetivo", pai: "direito" },
  { slug: "concursos", nome: "Concursos", tipo: "objetivo" },
  { slug: "graduacao", nome: "Graduação", tipo: "objetivo" },
  { slug: "pos-graduacao", nome: "Pós-graduação", tipo: "objetivo" },
  { slug: "certificacoes", nome: "Certificações", tipo: "objetivo" },
  { slug: "estudo-independente", nome: "Aprendizado independente", tipo: "objetivo" },
];

type Pessoa = {
  email: string;
  nome: string;
  apelido: string;
  nascimento: string;
  especialista?: string;
};

const PESSOAS: Pessoa[] = [
  { email: "bruno@aprenda.local", nome: "Bruno Almeida", apelido: "Bruno", nascimento: "2003-04-02" },
  { email: "camila@aprenda.local", nome: "Camila Rocha", apelido: "Camila", nascimento: "2002-11-18" },
  { email: "diego@aprenda.local", nome: "Diego Martins", apelido: "Diego", nascimento: "2001-07-09" },
  { email: "elena@aprenda.local", nome: "Elena Duarte", apelido: "Elena", nascimento: "2004-01-22" },
  { email: "felipe@aprenda.local", nome: "Felipe Nunes", apelido: "Felipe", nascimento: "2009-05-02" },
  { email: "helena@aprenda.local", nome: "Helena Prado", apelido: "Helena", nascimento: "1990-06-12", especialista: "fisica" },
  { email: "igor@aprenda.local", nome: "Igor Bastos", apelido: "Igor", nascimento: "1998-02-14" },
  { email: "rita@aprenda.local", nome: "Rita Pacheco", apelido: "Rita", nascimento: "1987-08-21", especialista: "direito" },
];

export async function ampliar(db: PrismaClient) {
  const nos = new Map<string, string>();
  for (const item of NOS) {
    const paiId = item.pai ? nos.get(item.pai) : undefined;
    const salvo = await db.noConhecimento.upsert({
      where: { slug: item.slug },
      update: { nome: item.nome, tipo: item.tipo, paiId: paiId ?? null },
      create: { slug: item.slug, nome: item.nome, tipo: item.tipo, paiId },
    });
    nos.set(item.slug, salvo.id);
  }
  for (const item of NOS) {
    const noId = nos.get(item.slug);
    if (!noId) continue;
    for (const antes of item.antes ?? []) {
      const requisitoId = nos.get(antes);
      if (!requisitoId) continue;
      await db.noRequisito.upsert({
        where: { noId_requisitoId: { noId, requisitoId } },
        update: {},
        create: { noId, requisitoId },
      });
    }
  }

  const gente = new Map<string, string>();
  for (const pessoa of PESSOAS) {
    const usuario = await garantirUsuario(db, pessoa);
    gente.set(pessoa.apelido, usuario.id);
    if (pessoa.especialista) {
      const areaId = nos.get(pessoa.especialista);
      if (areaId) await garantirPapel(db, usuario.id, "especialista", areaId);
    }
  }

  const moderacao = await db.usuario.findUnique({ where: { email: "moderacao@aprenda.local" } });
  if (moderacao) gente.set("Moderação", moderacao.id);

  await garantirComunidades(db, nos, gente);
  await garantirConversas(db, nos, gente);
  await garantirLivros(db, nos);
  await ajustarReputacao(db, gente);
}

async function garantirUsuario(db: PrismaClient, pessoa: Pessoa) {
  const existente = await db.usuario.findUnique({ where: { email: pessoa.email } });
  const usuario =
    existente ??
    (await db.usuario.create({
      data: {
        email: pessoa.email,
        senhaHash: hashSenha(SENHA),
        nome: pessoa.nome,
        apelido: pessoa.apelido,
        nascimento: new Date(`${pessoa.nascimento}T00:00:00.000Z`),
      },
    }));
  await db.perfil.upsert({
    where: { usuarioId: usuario.id },
    update: {},
    create: {
      usuarioId: usuario.id,
      mostrarNome: false,
      mostrarReputacao: true,
      mostrarComunidades: true,
      mostrarAreas: true,
    },
  });
  await db.reputacao.upsert({
    where: { usuarioId: usuario.id },
    update: {},
    create: { usuarioId: usuario.id },
  });
  return usuario;
}

async function garantirPapel(db: PrismaClient, usuarioId: string, papel: string, areaId: string) {
  const existe = await db.papelUsuario.findFirst({ where: { usuarioId, papel, areaId } });
  if (!existe) await db.papelUsuario.create({ data: { usuarioId, papel, areaId } });
}

async function garantirComunidades(
  db: PrismaClient,
  nos: Map<string, string>,
  gente: Map<string, string>,
) {
  const comunidades = [
    ["fisica", "Física", "Mecânica, eletromagnetismo e leitura de gráficos.", "Separe o conceito da conta.", "fisica"],
    ["direito", "Direito", "Da graduação à OAB e aos concursos jurídicos.", "Separe lei, doutrina e opinião.", "direito"],
    ["medicina", "Medicina", "Anatomia, fisiologia, clínica e residência.", "Não dê conduta como se fosse prescrição.", "medicina"],
    ["programacao", "Programação", "Python, JavaScript, C, bancos e projetos.", "Mostre um exemplo mínimo e diga o que ele não cobre.", "programacao"],
    ["engenharia", "Engenharia", "Civil, mecânica, elétrica e resistência dos materiais.", "Diga a hipótese antes da fórmula.", "engenharia"],
    ["oab", "OAB", "Primeira fase, peças e rotina de estudo.", "Prova oficial só com link da banca.", "oab"],
    ["ensino-medio", "Ensino médio", "Base para quem ainda está na escola.", "Uma explicação curta vale mais que um atalho.", "ensino-medio"],
    ["vestibular", "Vestibular", "ENEM, FUVEST, ITA, IME e vestibulares regionais.", "Diga de qual prova você está falando.", "vestibular"],
    ["tecnologia", "Tecnologia", "Software, dados, Arduino e inteligência artificial.", "Cite a documentação quando a resposta depender de versão.", "tecnologia"],
  ] as const;

  for (const [slug, nome, descricao, regras, noSlug] of comunidades) {
    await db.comunidade.upsert({
      where: { slug },
      update: { nome, descricao, regras, noId: nos.get(noSlug) ?? null },
      create: { slug, nome, descricao, regras, noId: nos.get(noSlug) },
    });
  }

  const grupos: Record<string, string[]> = {
    fisica: ["Felipe", "Helena", "Bruno"],
    direito: ["Camila", "Igor", "Rita"],
    medicina: ["Elena", "Bruno"],
    programacao: ["Diego", "Bruno", "Camila"],
    engenharia: ["Bruno", "Diego", "Helena"],
    oab: ["Igor", "Camila", "Rita"],
    "ensino-medio": ["Felipe", "Helena"],
    vestibular: ["Felipe", "Elena", "Bruno"],
    tecnologia: ["Diego", "Bruno"],
    matematica: ["Felipe", "Helena", "Bruno"],
    enem: ["Felipe", "Helena"],
    "direito-constitucional": ["Camila", "Rita", "Igor"],
  };

  for (const [slug, apelidos] of Object.entries(grupos)) {
    const comunidade = await db.comunidade.findUnique({ where: { slug } });
    if (!comunidade) continue;
    for (const apelido of apelidos) {
      const usuarioId = gente.get(apelido);
      if (!usuarioId) continue;
      await db.membroComunidade.upsert({
        where: { usuarioId_comunidadeId: { usuarioId, comunidadeId: comunidade.id } },
        update: {},
        create: { usuarioId, comunidadeId: comunidade.id },
      });
    }
  }
}

async function garantirConversas(db: PrismaClient, nos: Map<string, string>, gente: Map<string, string>) {
  const id = (apelido: string) => {
    const valor = gente.get(apelido);
    if (!valor) throw new Error(`Pessoa ausente: ${apelido}`);
    return valor;
  };

  await pergunta(db, {
    id: "conv-direitos",
    titulo: "Qual a diferença entre direitos e garantias fundamentais?",
    corpo: "Na aula de constitucional, os dois termos aparecem juntos. Ainda não consigo explicar a diferença com as minhas palavras.",
    dificuldade: "medio",
    nivelEducacional: "graduacao",
    objetivo: "faculdade de Direito",
    autor: "Camila",
    no: "direitos-fundamentais",
  }, nos, id);
  await resposta(db, {
    id: "conv-direitos-r1",
    perguntaId: "conv-direitos",
    autor: "Igor",
    estado: "parcialmente_correta",
    corpo: "Garantia fundamental é só o habeas corpus e o mandado de segurança. O resto é direito.",
    veredito: "Rita",
    explicacao: "A lista está curta. Garantias são instrumentos de proteção, e não se resumem a dois remédios. A resposta acerta a ideia geral e erra o alcance.",
  }, id);
  await resposta(db, {
    id: "conv-direitos-r2",
    perguntaId: "conv-direitos",
    autor: "Camila",
    estado: "verificada_especialista",
    corpo: "Direito é a posição jurídica, como a liberdade de expressão. Garantia é o meio de proteger esse direito quando ele é ameaçado, como o habeas corpus. Os dois podem estar no mesmo artigo e ainda assim não serem a mesma coisa.",
    veredito: "Rita",
    explicacao: "A distinção entre a posição jurídica e o instrumento de proteção está correta e cabe no art. 5º da Constituição.",
    fonte: {
      titulo: "Constituição da República, texto oficial",
      url: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
      citacao: "Art. 5º. O texto oficial não substitui um comentário, mas é a fonte primária.",
    },
  }, id);

  await pergunta(db, {
    id: "conv-python",
    titulo: "Em Python, lista e tupla são a mesma coisa?",
    corpo: "Usei as duas para guardar uma sequência de números e não vi diferença no resultado. Quando a escolha importa?",
    dificuldade: "facil",
    nivelEducacional: "livre",
    objetivo: "aprender Python",
    autor: "Diego",
    no: "python",
  }, nos, id);
  await resposta(db, {
    id: "conv-python-r1",
    perguntaId: "conv-python",
    autor: "Bruno",
    estado: "incorreta",
    corpo: "São a mesma coisa. Tupla é só o nome de uma lista que a gente decide não mudar.",
    veredito: "Moderação",
    explicacao: "A tupla é um tipo diferente. Ela é imutável e não é uma lista com um acordo social. A resposta confunde o tipo com a intenção de quem programa.",
  }, id);
  await resposta(db, {
    id: "conv-python-r2",
    perguntaId: "conv-python",
    autor: "Camila",
    estado: "correta",
    corpo: "Não. A lista pode receber, remover e trocar itens. A tupla fica como foi criada. As duas guardam sequência, mas a tupla serve quando aquele conjunto não deve mudar, por exemplo uma coordenada.",
    veredito: "Moderação",
    explicacao: "A diferença de mutabilidade está correta e o exemplo da coordenada mostra quando a escolha importa.",
    fonte: {
      titulo: "Tutorial oficial de Python",
      url: "https://docs.python.org/pt-br/3/tutorial/datastructures.html",
      citacao: "A documentação separa listas e tuplas nas estruturas de dados.",
    },
  }, id);

  await pergunta(db, {
    id: "conv-coracao",
    titulo: "O que separa o átrio do ventrículo no coração?",
    corpo: "Na peça de anatomia eu vejo o septo e também uma válvula. Não sei qual dos dois responde a essa pergunta.",
    dificuldade: "medio",
    nivelEducacional: "graduacao",
    objetivo: "faculdade de Medicina",
    autor: "Elena",
    no: "anatomia",
  }, nos, id);
  await resposta(db, {
    id: "conv-coracao-r1",
    perguntaId: "conv-coracao",
    autor: "Igor",
    estado: "incorreta",
    corpo: "É o septo interventricular. Ele fica exatamente entre o átrio e o ventrículo do mesmo lado.",
    veredito: "Moderação",
    explicacao: "O septo interventricular separa os dois ventrículos. Quem separa átrio e ventrículo do mesmo lado é a valva atrioventricular.",
  }, id);
  await resposta(db, {
    id: "conv-coracao-r2",
    perguntaId: "conv-coracao",
    autor: "Bruno",
    estado: "revisao_humana",
    corpo: "As valvas atrioventriculares ficam entre o átrio e o ventrículo. O septo separa o lado direito do esquerdo. Ainda quero que alguém da área confirme os nomes das valvas.",
    fonte: {
      titulo: "Anatomy and Physiology 2e, OpenStax",
      url: "https://openstax.org/details/books/anatomy-and-physiology-2e",
      citacao: "O capítulo do coração descreve as valvas atrioventriculares. O PDF é gratuito na página oficial.",
    },
  }, id);

  await pergunta(db, {
    id: "conv-viga",
    titulo: "Na flexão de uma viga, onde a tensão normal é maior?",
    corpo: "Estou em resistência dos materiais. No desenho, o eixo neutro fica no meio e as fibras de cima e de baixo ficam longe dele.",
    dificuldade: "dificil",
    nivelEducacional: "graduacao",
    objetivo: "engenharia civil",
    autor: "Diego",
    no: "resistencia-dos-materiais",
  }, nos, id);
  await resposta(db, {
    id: "conv-viga-r1",
    perguntaId: "conv-viga",
    autor: "Felipe",
    estado: "incorreta",
    corpo: "É maior no eixo neutro, porque é ali que a viga mais trabalha.",
    veredito: "Moderação",
    explicacao: "No eixo neutro a tensão normal da flexão é nula. Ela cresce com a distância até esse eixo.",
  }, id);
  await resposta(db, {
    id: "conv-viga-r2",
    perguntaId: "conv-viga",
    autor: "Bruno",
    estado: "correta",
    corpo: "Nas fibras mais afastadas do eixo neutro. Na flexão simples, a tensão normal varia de forma linear com a distância até o eixo, então o máximo está na borda superior ou na inferior.",
    veredito: "Moderação",
    explicacao: "A variação linear e o máximo na fibra extrema estão de acordo com a flexão simples de uma viga.",
  }, id);

  await pergunta(db, {
    id: "conv-enem-grafico",
    titulo: "No gráfico de velocidade por tempo, como acho a aceleração?",
    corpo: "A prova do ENEM mostra uma reta subindo. Eu sei ler o ponto, mas não sei o que a inclinação significa.",
    dificuldade: "facil",
    nivelEducacional: "medio",
    objetivo: "ENEM",
    autor: "Felipe",
    no: "mecanica",
  }, nos, id);
  await resposta(db, {
    id: "conv-enem-grafico-r1",
    perguntaId: "conv-enem-grafico",
    autor: "Bruno",
    estado: "verificada_especialista",
    corpo: "A aceleração é a inclinação desse gráfico. Num trecho reto, divida a variação da velocidade pela variação do tempo. Se a reta sobe, a aceleração é positiva no sentido escolhido para a velocidade.",
    veredito: "Helena",
    explicacao: "A leitura da inclinação como aceleração está correta para o gráfico velocidade × tempo, que é o caso descrito.",
    fonte: {
      titulo: "College Physics 2e, OpenStax",
      url: "https://openstax.org/details/books/college-physics-2e",
      citacao: "O capítulo de cinemática trata a aceleração como a taxa de variação da velocidade. PDF gratuito na página oficial.",
    },
  }, id);

  const programacao = await db.comunidade.findUnique({ where: { slug: "programacao" } });
  if (programacao) {
    await db.publicacao.upsert({
      where: { id: "conv-pub-python" },
      update: {},
      create: {
        id: "conv-pub-python",
        titulo: "Livro gratuito para começar Python?",
        corpo: "Quero um material que eu possa abrir sem pagar e que explique lista, tupla e função. Se alguém já usou, conta o que ajudou e o que faltou.",
        etiqueta: "material",
        comunidadeId: programacao.id,
        autorId: id("Diego"),
      },
    });
    await comentario(db, "conv-com-python", "conv-pub-python", "Camila", "Eu comecei pelo tutorial oficial, em português. Ele não é romanceado, mas a diferença entre lista e tupla fica clara.");
    await comentario(db, "conv-com-python-2", "conv-pub-python", "Bruno", "O Think Python também é gratuito na página da autora. Eu li o capítulo das estruturas antes de tentar a pergunta que o Diego abriu.");
  }

  const medicina = await db.comunidade.findUnique({ where: { slug: "medicina" } });
  if (medicina) {
    await db.publicacao.upsert({
      where: { id: "conv-pub-coracao" },
      update: {},
      create: {
        id: "conv-pub-coracao",
        titulo: "Estou confundindo septo e valva",
        corpo: "Abri uma pergunta na área de anatomia. Se alguém for responder, explica com uma frase o que cada estrutura separa. Eu ainda não quero um resumo do coração inteiro.",
        etiqueta: "discussao",
        comunidadeId: medicina.id,
        autorId: id("Elena"),
        perguntaId: "conv-coracao",
      },
    });
    await comentario(db, "conv-com-coracao", "conv-pub-coracao", "Bruno", "Respondi por lá e deixei em revisão humana. Não sou da medicina, então preferi citar o OpenStax em vez de cravar o nome das valvas.");
  }

  const enem = await db.comunidade.findUnique({ where: { slug: "enem" } });
  if (enem) {
    await db.publicacao.upsert({
      where: { id: "conv-pub-enem" },
      update: {},
      create: {
        id: "conv-pub-enem",
        titulo: "Gráfico de cinemática sem decoreba",
        corpo: "Fiz uma pergunta sobre velocidade por tempo. Se a sua dúvida for a mesma, entra nela em vez de abrir outra igual.",
        etiqueta: "discussao",
        comunidadeId: enem.id,
        autorId: id("Felipe"),
        perguntaId: "conv-enem-grafico",
      },
    });
    await comentario(db, "conv-com-enem", "conv-pub-enem", "Helena", "O Bruno descreveu a inclinação e eu verifiquei. Se a reta mudar de direção, a aceleração muda de sinal. Isso já é outro exercício.");
  }
}

async function pergunta(
  db: PrismaClient,
  item: {
    id: string;
    titulo: string;
    corpo: string;
    dificuldade: string;
    nivelEducacional: string;
    objetivo: string;
    autor: string;
    no: string;
  },
  nos: Map<string, string>,
  idDe: (apelido: string) => string,
) {
  const noId = nos.get(item.no);
  await db.pergunta.upsert({
    where: { id: item.id },
    update: {},
    create: {
      id: item.id,
      titulo: item.titulo,
      corpo: item.corpo,
      dificuldade: item.dificuldade,
      nivelEducacional: item.nivelEducacional,
      objetivo: item.objetivo,
      autorId: idDe(item.autor),
      ...(noId ? { nos: { create: [{ noId }] } } : {}),
    },
  });
}

async function resposta(
  db: PrismaClient,
  item: {
    id: string;
    perguntaId: string;
    autor: string;
    estado: string;
    corpo: string;
    veredito?: string;
    explicacao?: string;
    fonte?: { titulo: string; url: string; citacao: string };
  },
  idDe: (apelido: string) => string,
) {
  await db.resposta.upsert({
    where: { id: item.id },
    update: {},
    create: {
      id: item.id,
      perguntaId: item.perguntaId,
      autorId: idDe(item.autor),
      estado: item.estado,
      corpo: item.corpo,
      explicacaoVeredito: item.explicacao ?? "",
      vereditoPorId: item.veredito ? idDe(item.veredito) : undefined,
      ...(item.fonte ? { fontes: { create: [{ id: `${item.id}-fonte`, ...item.fonte }] } } : {}),
      pareceres: {
        create: {
          id: `${item.id}-parecer`,
          confianca: "baixa",
          texto: "A revisão automática não confirma correção e não classifica a resposta como certa. Uma pessoa precisa analisar.",
        },
      },
    },
  });
}

async function comentario(db: PrismaClient, id: string, publicacaoId: string, autor: string, corpo: string) {
  const pessoa = await db.usuario.findFirst({ where: { apelido: autor } });
  if (!pessoa) return;
  await db.comentario.upsert({
    where: { id },
    update: {},
    create: { id, publicacaoId, autorId: pessoa.id, corpo },
  });
}

async function ajustarReputacao(db: PrismaClient, gente: Map<string, string>) {
  const marcas: Record<string, { precisao: number; clareza: number; contribuicao: number; detalhe: string }> = {
    Camila: { precisao: 26, clareza: 2, contribuicao: 5, detalhe: "Respostas de Direito e de Python foram aceitas." },
    Igor: { precisao: 4, clareza: 1, contribuicao: 3, detalhe: "Resposta parcial sobre garantias fundamentais." },
    Bruno: { precisao: 16, clareza: 1, contribuicao: 5, detalhe: "Errou a tupla, acertou a viga e teve a cinemática verificada." },
    Diego: { precisao: 0, clareza: 1, contribuicao: 3, detalhe: "Abriu perguntas e indicou materiais na comunidade." },
    Elena: { precisao: 0, clareza: 0, contribuicao: 2, detalhe: "Abriu a dúvida de anatomia e a conversa na comunidade." },
    Felipe: { precisao: 0, clareza: 1, contribuicao: 2, detalhe: "Perguntou sobre o gráfico do ENEM e acompanhou a resposta." },
    Helena: { precisao: 8, clareza: 2, contribuicao: 4, detalhe: "Verificou a leitura do gráfico de velocidade no tempo." },
    Rita: { precisao: 8, clareza: 1, contribuicao: 3, detalhe: "Verificou respostas de Direito Constitucional na própria área." },
  };
  for (const [apelido, marca] of Object.entries(marcas)) {
    const usuarioId = gente.get(apelido);
    if (!usuarioId) continue;
    await db.reputacao.update({
      where: { usuarioId },
      data: { precisao: marca.precisao, clareza: marca.clareza, contribuicao: marca.contribuicao },
    });
    await db.eventoReputacao.upsert({
      where: { id: `evt-${apelido.toLowerCase()}` },
      update: {},
      create: {
        id: `evt-${apelido.toLowerCase()}` ,
        usuarioId,
        tipo: "veredito",
        detalhe: marca.detalhe,
        deltaPrecisao: marca.precisao,
        deltaClareza: marca.clareza,
        deltaContribuicao: marca.contribuicao,
      },
    });
  }
}

async function garantirLivros(db: PrismaClient, nos: Map<string, string>) {
  const livros: {
    slug: string;
    titulo: string;
    autores: string;
    descricao: string;
    nivel: string;
    edicao: string;
    tipoAcesso: string;
    ondeObter: string;
    direitoUso: string;
    no: string;
  }[] = [
    livro("openstax-prealgebra", "Prealgebra 2e", "Lynn Marecek, MaryAnne Anthony-Smith e Andrea Honeycutt Mathis", "Base de aritmética e pré-álgebra. O PDF gratuito está na página oficial.", "Fundamental e início do médio", "2ª edição", "gratuito", "https://openstax.org/details/books/prealgebra-2e", "licenca_compativel", "matematica"),
    livro("openstax-algebra", "College Algebra 2e", "Jay Abramson", "Funções, equações e gráficos. PDF gratuito na OpenStax, licença aberta.", "Médio e vestibular", "2ª edição", "gratuito", "https://openstax.org/details/books/college-algebra-2e", "licenca_compativel", "algebra"),
    livro("openstax-calculo-1", "Calculus Volume 1", "Gilbert Strang e Edwin Herman", "Limites, derivadas e integrais iniciais. PDF gratuito na página oficial.", "Graduação", "1º volume", "gratuito", "https://openstax.org/details/books/calculus-volume-1", "licenca_compativel", "calculo"),
    livro("openstax-calculo-2", "Calculus Volume 2", "Gilbert Strang e Edwin Herman", "Continuação do cálculo, com aplicações. PDF gratuito na OpenStax.", "Graduação", "2º volume", "gratuito", "https://openstax.org/details/books/calculus-volume-2", "licenca_compativel", "calculo"),
    livro("openstax-estatistica", "Introductory Statistics 2e", "Barbara Illowsky e Susan Dean", "Estatística introdutória com exercícios. PDF gratuito.", "Médio e graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/introductory-statistics-2e", "licenca_compativel", "matematica"),
    livro("openstax-fisica-faculdade", "College Physics 2e", "Paul Peter Urone e Roger Hinrichs", "Física algébrica para o ensino médio avançado e o início da graduação. PDF gratuito.", "Médio e graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/college-physics-2e", "licenca_compativel", "fisica"),
    livro("openstax-fisica-universitaria", "University Physics Volume 1", "William Moebs, Samuel Ling e Jeff Sanny", "Mecânica com cálculo. PDF gratuito na OpenStax.", "Graduação", "1º volume", "gratuito", "https://openstax.org/details/books/university-physics-volume-1", "licenca_compativel", "mecanica"),
    livro("openstax-fisica-universitaria-2", "University Physics Volume 2", "William Moebs, Samuel Ling e Jeff Sanny", "Ondas, termodinâmica e eletricidade. PDF gratuito.", "Graduação", "2º volume", "gratuito", "https://openstax.org/details/books/university-physics-volume-2", "licenca_compativel", "eletromagnetismo"),
    livro("openstax-quimica", "Chemistry 2e", "Paul Flowers, Klaus Theopold, Richard Langley e William R. Robinson", "Química geral. PDF gratuito e licença aberta.", "Médio e graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/chemistry-2e", "licenca_compativel", "quimica"),
    livro("openstax-biologia", "Biology 2e", "Mary Ann Clark, Matthew Douglas e Jung Choi", "Biologia geral. PDF gratuito na página oficial.", "Médio e graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/biology-2e", "licenca_compativel", "biologia"),
    livro("openstax-anatomia", "Anatomy and Physiology 2e", "J. Gordon Betts e outros", "Anatomia e fisiologia com figuras. PDF gratuito na OpenStax.", "Graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/anatomy-and-physiology-2e", "licenca_compativel", "anatomia"),
    livro("openstax-microbiologia", "Microbiology", "Nina Parker, Mark Schneegurt, Anh-Hue Thi Tu e outros", "Microbiologia introdutória. PDF gratuito.", "Graduação", "1ª edição", "gratuito", "https://openstax.org/details/books/microbiology", "licenca_compativel", "biologia"),
    livro("libretexts-medicina", "LibreTexts Medicine", "Vários autores, edição aberta", "Textos abertos de medicina e áreas próximas. Não é um livro único: é uma estante gratuita.", "Graduação", "edição contínua", "gratuito", "https://med.libretexts.org/", "licenca_compativel", "medicina"),
    livro("openstax-psicologia", "Psychology 2e", "Rose Spielman, Kathryn Dumper, William Jenkins e outros", "Introdução à psicologia. PDF gratuito.", "Graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/psychology-2e", "licenca_compativel", "estudo-independente"),
    livro("openstax-sociologia", "Introduction to Sociology 3e", "Tonja Conerly, Kathleen Holmes e Asha Lal Tamang", "Sociologia introdutória. PDF gratuito.", "Médio e graduação", "3ª edição", "gratuito", "https://openstax.org/details/books/introduction-sociology-3e", "licenca_compativel", "sociologia"),
    livro("openstax-economia", "Principles of Economics 3e", "Steven Greenlaw, David Shapiro e Daniel MacDonald", "Economia introdutória. PDF gratuito.", "Graduação", "3ª edição", "gratuito", "https://openstax.org/details/books/principles-economics-3e", "licenca_compativel", "estudo-independente"),
    livro("openstax-astronomia", "Astronomy 2e", "Andrew Fraknoi, David Morrison e Sidney Wolff", "Astronomia geral. PDF gratuito.", "Médio e graduação", "2ª edição", "gratuito", "https://openstax.org/details/books/astronomy-2e", "licenca_compativel", "fisica"),
    livro("gutenberg-darwin", "On the Origin of Species", "Charles Darwin", "Texto em domínio público no Project Gutenberg, com opções de leitura e download.", "Graduação e estudo livre", "1ª edição, 1859", "dominio_publico", "https://www.gutenberg.org/ebooks/1228", "dominio_publico", "biologia"),
    livro("gutenberg-dom-casmurro", "Dom Casmurro", "Machado de Assis", "Romance em domínio público. A página do Gutenberg oferece vários formatos, inclusive para leitura offline.", "Médio e vestibular", "1899", "dominio_publico", "https://www.gutenberg.org/ebooks/55752", "dominio_publico", "literatura"),
    livro("constituicao", "Constituição da República Federativa do Brasil", "Assembleia Nacional Constituinte", "Texto oficial consolidado. Não é um PDF de doutrina: é a fonte primária, no portal do Planalto.", "Graduação, OAB e concursos", "texto constitucional vigente", "gratuito", "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm", "somente_link_oficial", "direito-constitucional"),
    livro("codigo-civil", "Código Civil, Lei 10.406", "Congresso Nacional", "Texto oficial da lei. Use como fonte, não como comentário doutrinário.", "Graduação e OAB", "texto compilado oficial", "gratuito", "https://www.planalto.gov.br/ccivil_03/leis/2002/l10406compilada.htm", "somente_link_oficial", "direito-civil"),
    livro("codigo-penal", "Código Penal, Decreto-Lei 2.848", "Congresso Nacional", "Texto oficial compilado no Planalto.", "Graduação, OAB e concursos", "texto compilado oficial", "gratuito", "https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm", "somente_link_oficial", "direito-penal"),
    livro("python-tutorial", "Tutorial de Python", "Python Software Foundation", "Tutorial oficial em português. É gratuito e acompanha a versão da linguagem.", "Iniciante", "documentação atual", "gratuito", "https://docs.python.org/pt-br/3/tutorial/index.html", "licenca_compativel", "python"),
    livro("think-python", "Think Python", "Allen B. Downey", "Introdução a Python liberada pela autora para leitura gratuita no site oficial.", "Iniciante", "2ª edição", "gratuito", "https://greenteapress.com/wp/think-python-2e/", "licenca_compativel", "python"),
    livro("eloquent-js", "Eloquent JavaScript", "Marijn Haverbeke", "Livro de JavaScript disponível de graça no site do autor, com exercícios.", "Iniciante e intermediário", "4ª edição", "gratuito", "https://eloquentjavascript.net/", "licenca_compativel", "javascript"),
    livro("mdn-javascript", "Guia JavaScript da MDN", "Colaboradores da MDN", "Guia gratuito mantido pela MDN. Não é um romance: é referência viva.", "Iniciante e intermediário", "edição contínua", "gratuito", "https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide", "licenca_compativel", "javascript"),
    livro("gnu-c", "GNU C Reference Manual", "Trevis Rothwell e James Youngman", "Manual livre de C, no site do projeto GNU.", "Intermediário", "edição do projeto GNU", "gratuito", "https://www.gnu.org/software/gnu-c-manual/gnu-c-manual.html", "licenca_compativel", "c-cpp"),
    livro("beej-c", "Beej's Guide to C", "Brian Hall", "Guia introdutório de C, gratuito na página do autor.", "Iniciante", "edição do autor", "gratuito", "https://beej.us/guide/bgc/", "licenca_compativel", "c-cpp"),
    livro("postgres-docs", "Documentação do PostgreSQL", "The PostgreSQL Global Development Group", "Manual oficial e gratuito do banco usado por muita aplicação.", "Intermediário", "versão atual", "gratuito", "https://www.postgresql.org/docs/current/", "licenca_compativel", "banco-de-dados"),
    livro("deep-learning-book", "Deep Learning", "Ian Goodfellow, Yoshua Bengio e Aaron Courville", "Livro disponibilizado de graça pelos autores no site oficial.", "Graduação e pós", "edição dos autores", "gratuito", "https://www.deeplearningbook.org/", "licenca_compativel", "inteligencia-artificial"),
    livro("arduino-docs", "Documentação do Arduino", "Arduino", "Referência oficial e gratuita das placas, da linguagem e das bibliotecas.", "Iniciante", "documentação atual", "gratuito", "https://docs.arduino.cc/", "somente_link_oficial", "arduino"),
    livro("linguagem-c-comercial", "The C Programming Language", "Brian Kernighan e Dennis Ritchie", "Livro comercial clássico. A plataforma não guarda o arquivo. Procure a edição na biblioteca da escola ou na editora.", "Intermediário", "2ª edição", "comercial", "https://www.informit.com/store/c-programming-language-9780131103627", "direitos_reservados", "c-cpp"),
    livro("resistencia-comercial", "Resistência dos materiais, edições comerciais", "Vários autores", "Os manuais mais usados na graduação são comerciais. Não há arquivo aqui. Use a biblioteca da universidade ou compre a edição.", "Graduação", "várias edições", "comercial", "https://www.worldcat.org/search?q=resistencia+dos+materiais", "direitos_reservados", "resistencia-dos-materiais"),
    livro("enem-provas", "Provas e gabaritos do ENEM", "INEP", "Provas oficiais e gabaritos no portal do INEP. O link é a fonte oficial, não uma cópia solta.", "Médio e vestibular", "vários anos", "gratuito", "https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos", "somente_link_oficial", "enem"),
  ];

  for (const item of livros) {
    const { no, ...dados } = item;
    const noId = nos.get(no) ?? null;
    await db.livro.upsert({
      where: { slug: item.slug },
      update: { ...dados, noId },
      create: { ...dados, noId },
    });
  }
}

function livro(
  slug: string,
  titulo: string,
  autores: string,
  descricao: string,
  nivel: string,
  edicao: string,
  tipoAcesso: string,
  ondeObter: string,
  direitoUso: string,
  no: string,
) {
  return { slug, titulo, autores, descricao, nivel, edicao, tipoAcesso, ondeObter, direitoUso, no };
}
