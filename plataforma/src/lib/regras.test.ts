import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  ESTADOS,
  deltaClareza,
  deltaContribuicaoVeredito,
  deltaPrecisao,
  ehAdministrador,
  estadosDisponiveis,
  faixaCadastro,
  iaPodeDefinirEstado,
  idadeEm,
  podeMudarEstado,
  votoNaoDecideCorrecao,
} from "./regras";
import { normalizarBusca, pareceFraudeAcademica } from "./texto";

const hoje = new Date("2026-11-08T12:00:00.000Z");

describe("idade e cadastro", () => {
  it("recusa menos de 13 anos", () => {
    const idade = idadeEm(new Date("2016-01-01T00:00:00.000Z"), hoje);
    assert.equal(idade, 10);
    assert.equal(faixaCadastro(idade), "recusado");
  });

  it("restringe de 13 a 15 anos", () => {
    assert.equal(faixaCadastro(idadeEm(new Date("2012-11-09T00:00:00.000Z"), hoje)), "restrito");
    assert.equal(faixaCadastro(15), "restrito");
  });

  it("aceita 16 anos como conta plena", () => {
    assert.equal(faixaCadastro(idadeEm(new Date("2010-11-08T00:00:00.000Z"), hoje)), "pleno");
  });
});

describe("veredito", () => {
  it("a IA só encaminha para análise humana", () => {
    for (const estado of ESTADOS) {
      const permitido = estado === "em_analise" || estado === "revisao_humana";
      assert.equal(iaPodeDefinirEstado(estado), permitido);
    }
    assert.equal(votoNaoDecideCorrecao(), true);
  });

  it("voto de clareza não muda a precisão", () => {
    assert.equal(deltaClareza(null, 1), 1);
    assert.equal(deltaClareza(null, -1), 0);
    assert.equal(deltaClareza(1, -1), -1);
    assert.equal(deltaPrecisao("revisao_humana", "revisao_humana"), 0);
  });

  it("impede a própria autora de fechar o veredito", () => {
    const resultado = podeMudarEstado({
      atorId: "ana",
      autorRespostaId: "ana",
      estado: "correta",
      explicacao: "Explicação longa o bastante para o teste.",
      precisao: 100,
      papeis: [{ papel: "administrador", areaId: null }],
      areasDaPergunta: ["mat"],
    });
    assert.equal(resultado.ok, false);
  });

  it("não deixa curtida ou precisão baixa marcarem resposta correta", () => {
    const resultado = podeMudarEstado({
      atorId: "bia",
      autorRespostaId: "ana",
      estado: "correta",
      explicacao: "Explicação longa o bastante para o teste.",
      precisao: 80,
      papeis: [],
      areasDaPergunta: ["mat"],
    });
    assert.equal(resultado.ok, false);
  });

  it("permite correção parcial a quem tem precisão, sem fechar como correta", () => {
    const base = {
      atorId: "bia",
      autorRespostaId: "ana",
      explicacao: "Explicação longa o bastante para o teste.",
      precisao: 30,
      papeis: [],
      areasDaPergunta: ["mat"],
    };
    assert.equal(podeMudarEstado({ ...base, estado: "parcialmente_correta" }).ok, true);
    assert.equal(podeMudarEstado({ ...base, estado: "correta" }).ok, false);
    assert.deepEqual(estadosDisponiveis(base), ["parcialmente_correta"]);
  });

  it("exige moderação para correta e incorreta, com explicação", () => {
    const base = {
      atorId: "mod",
      autorRespostaId: "ana",
      precisao: 0,
      papeis: [{ papel: "moderador", areaId: null }],
      areasDaPergunta: ["mat"],
    };
    assert.equal(
      podeMudarEstado({ ...base, estado: "correta", explicacao: "curta" }).ok,
      false,
    );
    assert.equal(
      podeMudarEstado({
        ...base,
        estado: "incorreta",
        explicacao: "O vértice não é o corte no eixo y.",
      }).ok,
      true,
    );
    assert.equal(
      podeMudarEstado({
        ...base,
        estado: "verificada_especialista",
        explicacao: "Explicação longa o bastante para o teste.",
      }).ok,
      false,
    );
  });

  it("reserva a verificação de especialista à área da pergunta", () => {
    const base = {
      atorId: "prof",
      autorRespostaId: "ana",
      estado: "verificada_especialista" as const,
      explicacao: "A fórmula do vértice segue de completar o quadrado.",
      precisao: 0,
      areasDaPergunta: ["mat", "funcoes"],
    };
    assert.equal(
      podeMudarEstado({ ...base, papeis: [{ papel: "especialista", areaId: "dir" }] }).ok,
      false,
    );
    assert.equal(
      podeMudarEstado({ ...base, papeis: [{ papel: "especialista", areaId: "mat" }] }).ok,
      true,
    );
    assert.equal(
      podeMudarEstado({
        ...base,
        papeis: [{ papel: "administrador", areaId: null }],
      }).ok,
      false,
    );
    assert.equal(ehAdministrador([{ papel: "administrador" }]), true);
  });

  it("reverte a precisão quando o veredito muda", () => {
    assert.equal(deltaPrecisao("nao_verificada", "correta"), 12);
    assert.equal(deltaPrecisao("correta", "incorreta"), -22);
    assert.equal(deltaContribuicaoVeredito("revisao_humana", "correta"), 2);
    assert.equal(deltaContribuicaoVeredito("correta", "incorreta"), -2);
  });
});

describe("texto", () => {
  it("ignora acentos na busca", () => {
    assert.equal(normalizarBusca("Física do ITA"), "fisica do ita");
  });

  it("reconhece pedido de fraude acadêmica", () => {
    assert.equal(pareceFraudeAcademica("Faça minha prova de cálculo"), true);
    assert.equal(pareceFraudeAcademica("Onde está o gabarito oficial do ENEM?"), false);
  });
});
