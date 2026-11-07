(function () {
    "use strict";

    var STORAGE = "medicina-estudo-v1";

    var questions = [
        { id: 1, theme: "linguagem", stem: "Na posição anatômica, as palmas das mãos estão:", options: ["Voltadas para trás", "Apoiadas no abdome", "Voltadas para a frente", "Em pronação completa"], answer: 2, why: "Na posição anatômica o corpo está ereto, o olhar vai para a frente e as palmas também. Assim o rádio e a ulna ficam paralelos, e medial e lateral do antebraço deixam de ser ambíguos." },
        { id: 2, theme: "linguagem", stem: "O plano que separa o corpo em metade direita e metade esquerda é o:", options: ["Coronal", "Sagital mediano", "Transversal", "Horizontal"], answer: 1, why: "O plano sagital separa direita e esquerda. O mediano é o sagital da linha média. O coronal separa anterior e posterior. O transversal separa superior e inferior." },
        { id: 3, theme: "osso", stem: "O número clássico de ossos do esqueleto adulto, usado na revisão, fica em torno de:", options: ["106", "206", "306", "80"], answer: 1, why: "O adulto tem cerca de 206 ossos. Sesamoides e ossos wormianos mudam um pouco a conta. A criança tem mais peças, porque várias ainda não se fundiram." },
        { id: 4, theme: "osso", stem: "A contagem clássica da coluna móvel é:", options: ["7 cervicais, 12 torácicas e 5 lombares", "8 cervicais, 10 torácicas e 6 lombares", "5 cervicais, 12 torácicas e 7 lombares", "12 cervicais, 7 torácicas e 5 lombares"], answer: 0, why: "São 7 cervicais, 12 torácicas e 5 lombares, mais o sacro, de cinco vértebras fundidas, e o cóccix. Há 12 pares de costelas." },
        { id: 5, theme: "osso", stem: "Qual osso não se articula com nenhum outro osso?", options: ["Estribo", "Hioide", "Patela", "Atlas"], answer: 1, why: "O hioide fica suspenso no pescoço por músculos e ligamentos. É marco de língua e laringe. O estribo é o menor osso do corpo, mas articula-se com a bigorna." },
        { id: 6, theme: "respiratorio", stem: "O principal músculo da inspiração em repouso é o:", options: ["Esternocleidomastóideo", "Reto abdominal", "Diafragma", "Intercostal interno"], answer: 2, why: "O diafragma desce, o tórax aumenta de volume e a pressão intrapulmonar cai. O ar entra. Quem o inerva é o nervo frênico, de C3 a C5." },
        { id: 7, theme: "cardio", stem: "A valva entre o átrio esquerdo e o ventrículo esquerdo é a:", options: ["Tricúspide", "Pulmonar", "Aórtica", "Mitral"], answer: 3, why: "A mitral, ou bicúspide, fica à esquerda. A tricúspide fica à direita. Pulmonar e aórtica são as valvas semilunares, na saída dos ventrículos." },
        { id: 8, theme: "cardio", stem: "O sangue venoso que volta do corpo chega primeiro ao:", options: ["Átrio esquerdo", "Ventrículo esquerdo", "Átrio direito", "Tronco da aorta"], answer: 2, why: "As veias cavas superior e inferior desembocam no átrio direito. Dali o sangue cruza a tricúspide, enche o ventrículo direito e segue pela artéria pulmonar." },
        { id: 9, theme: "cardio", stem: "As veias pulmonares conduzem sangue:", options: ["Pobre em oxigênio até o átrio direito", "Oxigenado até o átrio esquerdo", "Oxigenado até o ventrículo direito", "Pobre em oxigênio até a aorta"], answer: 1, why: "Depois dos alvéolos, as veias pulmonares voltam ao átrio esquerdo. É a exceção clássica: veia com sangue oxigenado e artéria pulmonar com sangue pobre em oxigênio." },
        { id: 10, theme: "cardio", stem: "O marcapasso normal do coração é o:", options: ["Nó atrioventricular", "Feixe de His", "Nó sinoatrial", "Conjunto das fibras de Purkinje"], answer: 2, why: "O nó sinoatrial, no átrio direito, dispara primeiro. O estímulo desce ao nó atrioventricular, passa pelo feixe de His e chega às fibras de Purkinje." },
        { id: 11, theme: "respiratorio", stem: "A troca gasosa entre o ar e o sangue acontece principalmente:", options: ["Na traqueia", "Nos brônquios principais", "Nos alvéolos", "Na laringe"], answer: 2, why: "Nariz, faringe, laringe, traqueia e brônquios conduzem o ar. A hematose ocorre na membrana alveolocapilar." },
        { id: 12, theme: "respiratorio", stem: "O surfactante pulmonar é produzido pelos:", options: ["Pneumócitos tipo I", "Pneumócitos tipo II", "Macrófagos alveolares", "Cílios da traqueia"], answer: 1, why: "O surfactante reduz a tensão superficial e dificulta o colapso dos alvéolos. Os pneumócitos tipo I formam a parede fina por onde o gás difunde." },
        { id: 13, theme: "laringe", stem: "O único músculo intrínseco da laringe que abre as pregas vocais é o:", options: ["Cricoaritenóideo posterior", "Cricotireóideo", "Tireoaritenóideo", "Cricoaritenóideo lateral"], answer: 0, why: "O cricoaritenóideo posterior é o abdutor da glote. Laterais, tireoaritenóideo e interaritenóideo fecham. O cricotireóideo alonga e tensiona a prega." },
        { id: 14, theme: "laringe", stem: "O músculo cricotireóideo é inervado pelo:", options: ["Nervo laríngeo recorrente", "Ramo externo do nervo laríngeo superior", "Nervo hipoglosso", "Nervo frênico"], answer: 1, why: "O laríngeo superior, ramo do vago, manda o ramo externo ao cricotireóideo e o ramo interno à sensibilidade acima das pregas. Os outros intrínsecos ficam com o recorrente." },
        { id: 15, theme: "laringe", stem: "Na laringe, as pregas vocais verdadeiras ficam:", options: ["Acima das pregas vestibulares", "Abaixo das pregas vestibulares", "Dentro do esôfago", "No palato mole"], answer: 1, why: "As pregas vestibulares são as falsas e ficam mais acima. As verdadeiras, com o ligamento vocal, produzem a voz e ficam abaixo." },
        { id: 16, theme: "audicao", stem: "Na orelha interna, a cóclea é responsável pela:", options: ["Audição", "Mastigação", "Olfação", "Abertura da tuba auditiva"], answer: 0, why: "A cóclea guarda o órgão de Corti. Vestíbulo e canais semicirculares cuidam do equilíbrio. Os dois caminhos seguem pelo VIII par, o vestibulococlear." },
        { id: 17, theme: "audicao", stem: "A tuba auditiva comunica a orelha média com a:", options: ["Laringe", "Rinofaringe", "Orelha interna", "Traqueia"], answer: 1, why: "A tuba equaliza a pressão da orelha média com o ambiente. Obstrução nasal e otite média se encontram com frequência por causa desse caminho." },
        { id: 18, theme: "audicao", stem: "No teste de Weber, uma perda condutiva unilateral faz o som parecer mais forte:", options: ["No ouvido saudável", "No ouvido afetado", "Sempre nos dois lados por igual", "Apenas na nuca, sem lateralizar"], answer: 1, why: "Na perda condutiva, o Weber lateraliza para o lado doente. Na neurossensorial unilateral, lateraliza para o lado melhor. Quem confirma é a audiometria." },
        { id: 19, theme: "audicao", stem: "Um Rinne negativo significa que:", options: ["A via aérea foi melhor do que a óssea", "A via óssea pareceu melhor do que a aérea", "A pessoa não ouviu o diapasão", "Há certeza de perda só neurossensorial"], answer: 1, why: "Rinne positivo, via aérea melhor que a óssea, é o achado normal e também o da perda neurossensorial. Rinne negativo sugere perda condutiva. O teste é de triagem." },
        { id: 20, theme: "neuro", stem: "No modelo clássico, a fala pouco fluente com compreensão relativamente preservada aponta para a área de:", options: ["Wernicke", "Broca", "Somente o cerebelo", "Somente a medula"], answer: 1, why: "Broca fica no frontal inferior do hemisfério dominante. Wernicke, no temporal, combina fala fluente e compreensão pior. O modelo ajuda na prova e simplifica uma rede mais ampla." },
        { id: 21, theme: "neuro", stem: "O nervo hipoglosso inerva principalmente:", options: ["A mímica da face", "Os músculos da língua", "A audição", "O músculo estapédio"], answer: 1, why: "O XII move a língua. Na lesão, a língua desvia para o lado fraco quando é projetada para fora. O palatoglosso é a exceção e vai com o vago. A mímica e o estapédio são do facial." },
        { id: 22, theme: "degluticao", stem: "A fase da deglutição em que a laringe sobe e a via aérea se fecha, de modo reflexo, é a:", options: ["Oral preparatória", "Oral de propulsão", "Faríngea", "Esofágica"], answer: 2, why: "A fase faríngea é rápida e reflexa: o véu sobe, a laringe se eleva e o bolo é desviado da via aérea. A fase esofágica é a peristalse até o estômago." },
        { id: 23, theme: "degluticao", stem: "Material que ultrapassa o plano das pregas vocais recebe o nome de:", options: ["Penetração", "Aspiração", "Respiração oral", "Disfonia"], answer: 1, why: "Penetração entra no vestíbulo da laringe e não passa das pregas. Aspiração passa. A aspiração silenciosa não provoca tosse, por isso a clínica sozinha pode falhar." },
        { id: 24, theme: "fono", stem: "O teste da orelhinha, obrigatório nas maternidades do Brasil, procura principalmente:", options: ["Perda auditiva no recém-nascido", "Rouquidão", "Gagueira", "Somente frênulo lingual"], answer: 0, why: "A triagem auditiva neonatal usa emissões otoacústicas e, quando a conduta pede, o potencial evocado de tronco encefálico. Falha na triagem significa reteste e diagnóstico, não um laudo final." },
        { id: 25, theme: "fono", stem: "A gagueira, na classificação de estudo da fonoaudiologia, é um transtorno da:", options: ["Voz", "Audição periférica", "Fluência", "Deglutição"], answer: 2, why: "Repetições, prolongamentos e bloqueios marcam a gagueira. A taquifemia é outro quadro de fluência, com fala muito rápida e irregular. Voz é outro eixo, o da qualidade laríngea." },
        { id: 26, theme: "fono", stem: "Na escala GRBAS, a letra B corresponde à:", options: ["Bitonalidade", "Soprosidade", "Bradicinesia", "Bloqueio"], answer: 1, why: "GRBAS: grau, rugosidade, soprosidade, astenia e tensão. A soprosidade vem de breathiness. No Brasil também se estuda a RASATI, que inclui a instabilidade." },
        { id: 27, theme: "fono", stem: "O músculo masseter é inervado pelo:", options: ["Nervo facial", "Nervo vago", "Ramo mandibular do trigêmeo", "Nervo hipoglosso"], answer: 2, why: "A mastigação é do trigêmeo mandibular: masseter, temporal e pterigóideos. O facial move a mímica e os lábios. Confundir os dois é um erro clássico de prova." },
        { id: 28, theme: "digestao", stem: "A bile é produzida no fígado e, em geral, armazenada na:", options: ["Vesícula biliar", "Glândula parótida", "Baço", "Medula óssea"], answer: 0, why: "A bile emulsifica gorduras. O pâncreas acrescenta enzimas e também insulina e glucagon. O baço é órgão linfoide, não uma glândula digestória." },
        { id: 29, theme: "urinario", stem: "A unidade funcional do rim é o:", options: ["Ureter", "Néfron", "Alvéolo", "Glomérulo sem nenhum túbulo"], answer: 1, why: "O néfron junta corpúsculo e túbulos. Filtra, reabsorve e secreta. O ureter só conduz a urina pronta até a bexiga." },
        { id: 30, theme: "endocrino", stem: "A insulina é produzida pelas células beta das ilhotas do:", options: ["Fígado", "Pâncreas", "Rim", "Timo"], answer: 1, why: "As ilhotas são a parte endócrina do pâncreas. O glucagon sai das células alfa. O fígado responde à insulina, mas não a fabrica." },
        { id: 31, theme: "neuro", stem: "As meninges, de fora para dentro, são:", options: ["Pia, aracnoide e dura", "Dura-máter, aracnoide e pia-máter", "Aracnoide, dura e pia", "Somente a dura-máter"], answer: 1, why: "A dura é a camada externa. O liquor circula no espaço subaracnóideo, entre a aracnoide e a pia." },
        { id: 32, theme: "neuro", stem: "Quantos pares de nervos cranianos existem?", options: ["8", "10", "12", "31"], answer: 2, why: "São 12 pares cranianos. Os nervos espinais são 31 pares: 8 cervicais, 12 torácicos, 5 lombares, 5 sacrais e 1 coccígeo." },
        { id: 33, theme: "neuro", stem: "O quadro clássico da afasia de Wernicke é:", options: ["Fala pouco fluente e compreensão boa", "Fala fluente e compreensão prejudicada", "Somente rouquidão", "Paralisia isolada da língua"], answer: 1, why: "A pessoa fala com facilidade, o sentido escapa e a compreensão falha. Disartria é outra coisa: a execução motora da fala sofre e a linguagem pode estar preservada." },
        { id: 34, theme: "osso", stem: "O osso mais longo do corpo é o:", options: ["Úmero", "Tíbia", "Fêmur", "Esterno"], answer: 2, why: "O fêmur é o mais longo. O menor osso é o estribo, na orelha média. Os dois caem em prova de anatomia geral." },
        { id: 35, theme: "cardio", stem: "Na definição anatômica, artéria é o vaso que:", options: ["Sempre conduz sangue oxigenado", "Leva sangue para fora de um ventrículo", "Sempre desemboca num átrio", "Só existe do lado esquerdo do coração"], answer: 1, why: "Artéria sai do coração. A artéria pulmonar sai do ventrículo direito com sangue pobre em oxigênio. Por isso artéria não é sinônimo de sangue oxigenado." },
        { id: 36, theme: "respiratorio", stem: "O nervo frênico se origina principalmente de:", options: ["C3 a C5", "T10 a T12", "L1 e L2", "Somente do nervo vago"], answer: 0, why: "C3, C4 e C5 mantêm o diafragma. Uma lesão cervical alta pode comprometer a inspiração. O vago não é o nervo do diafragma." },
        { id: 37, theme: "fono", stem: "A respiração oral, em motricidade orofacial, deve ser entendida como:", options: ["Sempre um hábito, sem causa possível", "Um modo que pode ser hábito ou efeito de obstrução", "Uma doença exclusiva da laringe", "Sinônimo de gagueira"], answer: 1, why: "Rinite, adenoide e desvio de septo pedem olhar otorrinolaringológico. A fono trabalha função, postura e hábito. Exercício não desfaz sozinho uma obstrução nasal." },
        { id: 38, theme: "degluticao", stem: "Na fase faríngea, o véu palatino principalmente:", options: ["Desce e abre a rinofaringe", "Eleva-se e ajuda a fechar a passagem nasal", "Abre as pregas vocais", "Contrai o masseter"], answer: 1, why: "O levantador do véu, inervado pelo vago, reduz o escape do bolo para o nariz. Quando esse fechamento falha, a fala pode ficar hipernasal." },
        { id: 39, theme: "sangue", stem: "As hemácias transportam oxigênio sobretudo por meio da:", options: ["Hemoglobina", "Insulina", "Bile", "Mielina"], answer: 0, why: "O ferro da hemoglobina liga o oxigênio. Parte do gás carbônico viaja dissolvida, como bicarbonato ou também ligada à hemoglobina." },
        { id: 40, theme: "sangue", stem: "As plaquetas participam principalmente da:", options: ["Troca gasosa alveolar", "Hemostasia", "Produção de bile", "Condução do som"], answer: 1, why: "As plaquetas formam o tampão inicial. A cascata de coagulação firma o coágulo. Leucócitos defendem. Hemácias carregam gás." }
    ];

    var exams = [
        { id: "geral", title: "Simulado 1 · Linguagem do corpo e ossos", blurb: "Posição anatômica, planos, coluna, hioide, fêmur, meninges e nervos.", ids: [1, 2, 3, 4, 5, 34, 31, 32] },
        { id: "cardio", title: "Simulado 2 · Coração, sangue e respiração", blurb: "Valvas, circuito, marcapasso, alvéolos, diafragma e hemácias.", ids: [6, 7, 8, 9, 10, 11, 12, 35, 36, 39] },
        { id: "cabeca", title: "Simulado 3 · Laringe, orelha e nervos da fala", blurb: "Pregas vocais, tuba auditiva, Weber, Rinne, hipoglosso e masseter.", ids: [13, 14, 15, 16, 17, 18, 19, 21, 27, 38] },
        { id: "fono", title: "Simulado 4 · Fonoaudiologia", blurb: "Deglutição, triagem auditiva, fluência, voz, afasia e respiração oral.", ids: [22, 23, 24, 25, 26, 20, 33, 37, 40, 30] },
        { id: "misto", title: "Simulado 5 · Revisão mista", blurb: "Dez questões sorteadas do banco inteiro. Cada tentativa muda.", ids: [] }
    ];

    var cards = [
        ["Posição anatômica", "Ereto, olhar à frente, palmas à frente, pés paralelos."],
        ["Plano sagital mediano", "Divide o corpo em metades direita e esquerda."],
        ["Plano coronal", "Divide o corpo em anterior e posterior."],
        ["Cerca de 206 ossos", "Contagem clássica do adulto. A criança tem mais peças."],
        ["7, 12, 5", "Vértebras cervicais, torácicas e lombares."],
        ["Hioide", "Não se articula com outro osso. Marco de língua e laringe."],
        ["Estribo", "Menor osso do corpo. Fica na orelha média."],
        ["Fêmur", "Osso mais longo do corpo."],
        ["Diafragma", "Principal músculo da inspiração. Nervo frênico, C3–C5."],
        ["Valva mitral", "Entre átrio esquerdo e ventrículo esquerdo."],
        ["Valva tricúspide", "Entre átrio direito e ventrículo direito."],
        ["Veias pulmonares", "Trazem sangue oxigenado ao átrio esquerdo."],
        ["Nó sinoatrial", "Marcapasso normal, no átrio direito."],
        ["Alvéolos", "Lugar da troca gasosa."],
        ["Pneumócito tipo II", "Produz surfactante."],
        ["Cricoaritenóideo posterior", "Único abdutor das pregas vocais."],
        ["Cricotireóideo", "Tensiona a prega. Nervo laríngeo superior, ramo externo."],
        ["Nervo laríngeo recorrente", "Inerva os outros músculos intrínsecos da laringe."],
        ["Cóclea", "Audição, na orelha interna."],
        ["Tuba auditiva", "Liga a orelha média à rinofaringe."],
        ["Weber condutivo", "Lateraliza para o ouvido afetado."],
        ["Rinne negativo", "Via óssea parece melhor que a aérea. Sugere perda condutiva."],
        ["Broca", "Fala pouco fluente, compreensão relativamente melhor."],
        ["Wernicke", "Fala fluente, compreensão prejudicada."],
        ["Hipoglosso", "Músculos da língua. O desvio vai para o lado fraco."],
        ["Aspiração", "O material ultrapassa as pregas vocais."],
        ["Penetração", "O material entra na laringe e não passa das pregas."],
        ["GRBAS", "Grau, rugosidade, soprosidade, astenia, tensão."],
        ["Masseter", "Mastigação. Trigêmeo mandibular, V3."],
        ["Néfron", "Unidade funcional do rim."],
        ["Insulina", "Células beta do pâncreas."],
        ["12 pares", "Nervos cranianos. Espinais são 31 pares."],
        ["Hemoglobina", "Proteína da hemácia que transporta oxigênio."],
        ["Artéria", "Vaso que sai de um ventrículo, não um sinônimo de sangue oxigenado."]
    ];

    var byId = {};
    questions.forEach(function (q) { byId[q.id] = q; });

    var state = null;
    var cardIndex = 0;
    var cardFlipped = false;
    var knew = 0;
    var again = 0;
    var clock = null;

    function loadStore() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE)) || { checks: {}, best: {} };
        } catch (e) {
            return { checks: {}, best: {} };
        }
    }

    function saveStore(data) {
        localStorage.setItem(STORAGE, JSON.stringify(data));
    }

    function initChecks() {
        var data = loadStore();
        var boxes = document.querySelectorAll("[data-check]");
        var bar = document.querySelector("[data-progress]");
        var label = document.querySelector("[data-progress-label]");

        function paint() {
            var done = 0;
            boxes.forEach(function (box) {
                if (box.checked) done += 1;
            });
            if (bar) bar.style.width = boxes.length ? (done / boxes.length * 100) + "%" : "0";
            if (label) label.textContent = done + " de " + boxes.length + " itens de revisão marcados neste navegador.";
        }

        boxes.forEach(function (box) {
            box.checked = !!data.checks[box.getAttribute("data-check")];
            box.addEventListener("change", function () {
                data.checks[box.getAttribute("data-check")] = box.checked;
                saveStore(data);
                paint();
            });
        });
        paint();

        var reset = document.querySelector("[data-reset-checks]");
        if (reset) {
            reset.addEventListener("click", function () {
                data.checks = {};
                saveStore(data);
                boxes.forEach(function (box) { box.checked = false; });
                paint();
            });
        }
    }

    function initSearch() {
        var input = document.querySelector("[data-search]");
        var status = document.querySelector("[data-search-status]");
        if (!input) return;
        var items = document.querySelectorAll("[data-find]");
        input.addEventListener("input", function () {
            var q = input.value.trim().toLowerCase();
            var shown = 0;
            items.forEach(function (el) {
                var hay = ((el.getAttribute("data-find") || "") + " " + el.textContent).toLowerCase();
                var hide = q.length > 1 && hay.indexOf(q) === -1;
                el.classList.toggle("is-hidden", hide);
                if (!hide) shown += 1;
            });
            if (status) {
                status.textContent = q.length > 1
                    ? shown + " de " + items.length + " blocos combinam com a busca."
                    : "A busca olha sistemas, fichas, áreas da fono e a biblioteca.";
            }
        });
    }

    function initLightbox() {
        var dialog = document.querySelector("[data-lightbox]");
        if (!dialog) return;
        var img = dialog.querySelector("img");
        var cap = dialog.querySelector("p");
        document.querySelectorAll(".plate img, .hero-plate img").forEach(function (source) {
            source.addEventListener("click", function () {
                img.src = source.currentSrc || source.src;
                img.alt = source.alt;
                cap.textContent = source.closest("figure").querySelector("figcaption").textContent;
                dialog.showModal();
            });
        });
        dialog.querySelector("[data-close]").addEventListener("click", function () {
            dialog.close();
        });
    }

    function pad(n) { return n < 10 ? "0" + n : String(n); }

    function formatTime(ms) {
        var s = Math.floor(ms / 1000);
        return pad(Math.floor(s / 60)) + ":" + pad(s % 60);
    }

    function initQuiz() {
        var root = document.querySelector("[data-quiz]");
        if (!root) return;
        var list = root.querySelector("[data-exams]");
        var stage = root.querySelector("[data-stage]");
        exams.forEach(function (exam) {
            var button = document.createElement("button");
            button.type = "button";
            button.className = "card";
            button.style.textAlign = "left";
            button.style.cursor = "pointer";
            button.style.font = "inherit";
            button.style.color = "inherit";
            button.style.width = "100%";
            var title = document.createElement("strong");
            title.textContent = exam.title;
            var text = document.createElement("p");
            text.textContent = exam.blurb;
            button.appendChild(title);
            button.appendChild(text);
            button.addEventListener("click", function () { startExam(exam); });
            list.appendChild(button);
        });

        function setOf(exam) {
            if (exam.id !== "misto") return exam.ids.map(function (id) { return byId[id]; });
            var pool = questions.slice();
            for (var i = pool.length - 1; i > 0; i -= 1) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = pool[i];
                pool[i] = pool[j];
                pool[j] = tmp;
            }
            return pool.slice(0, 10);
        }

        function startExam(exam) {
            state = {
                exam: exam,
                items: setOf(exam),
                index: 0,
                score: 0,
                misses: [],
                locked: false,
                started: Date.now()
            };
            list.classList.add("is-hidden");
            stage.classList.remove("is-hidden");
            if (clock) clearInterval(clock);
            clock = setInterval(function () {
                var timer = stage.querySelector("[data-timer]");
                if (timer && state) timer.textContent = formatTime(Date.now() - state.started);
            }, 1000);
            render();
        }

        function render() {
            var q = state.items[state.index];
            stage.innerHTML = "";
            var top = document.createElement("div");
            top.className = "quiz-top";
            var count = document.createElement("span");
            count.textContent = "Questão " + (state.index + 1) + " de " + state.items.length;
            var timer = document.createElement("span");
            timer.setAttribute("data-timer", "");
            timer.textContent = formatTime(Date.now() - state.started);
            top.appendChild(count);
            top.appendChild(timer);

            var stem = document.createElement("h3");
            stem.textContent = q.stem;

            var options = document.createElement("div");
            options.className = "options";
            q.options.forEach(function (text, i) {
                var button = document.createElement("button");
                button.type = "button";
                button.className = "option";
                button.textContent = text;
                button.addEventListener("click", function () { choose(i, options); });
                options.appendChild(button);
            });

            stage.appendChild(top);
            stage.appendChild(stem);
            stage.appendChild(options);
            stage.focus();
        }

        function choose(index, options) {
            if (state.locked) return;
            state.locked = true;
            var q = state.items[state.index];
            var buttons = options.querySelectorAll("button");
            buttons.forEach(function (button, i) {
                button.disabled = true;
                if (i === q.answer) button.classList.add("good");
                if (i === index && i !== q.answer) button.classList.add("bad");
            });
            if (index === q.answer) state.score += 1;
            else state.misses.push({ q: q, picked: index });

            var explain = document.createElement("div");
            explain.className = "explain";
            explain.textContent = q.why;
            var next = document.createElement("button");
            next.type = "button";
            next.className = "btn";
            next.style.marginTop = "0.8rem";
            next.textContent = state.index === state.items.length - 1 ? "Ver resultado" : "Próxima questão";
            next.addEventListener("click", function () {
                state.index += 1;
                state.locked = false;
                if (state.index >= state.items.length) finish();
                else render();
            });
            stage.appendChild(explain);
            stage.appendChild(next);
            next.focus();
        }

        function finish() {
            if (clock) clearInterval(clock);
            var elapsed = Date.now() - state.started;
            var total = state.items.length;
            var data = loadStore();
            var previous = data.best[state.exam.id] || 0;
            if (state.score > previous) {
                data.best[state.exam.id] = state.score;
                saveStore(data);
            }
            stage.innerHTML = "";
            var title = document.createElement("h3");
            title.textContent = state.exam.title;
            var score = document.createElement("p");
            score.className = "score";
            score.textContent = state.score + " / " + total;
            var detail = document.createElement("p");
            var percent = Math.round(state.score / total * 100);
            var verdict = percent === 100
                ? "Você fechou este simulado."
                : percent >= 70
                    ? "A base está firme. Releia só o que errou."
                    : "Volte às fichas deste tema e repita o simulado amanhã, sem consultar.";
            detail.textContent = verdict + " Tempo: " + formatTime(elapsed) + ". Melhor marca salva neste navegador: " + Math.max(state.score, previous) + ".";
            stage.appendChild(title);
            stage.appendChild(score);
            stage.appendChild(detail);

            if (state.misses.length) {
                var heading = document.createElement("h4");
                heading.textContent = "O que revisar";
                var ul = document.createElement("ul");
                ul.className = "misses";
                state.misses.forEach(function (miss) {
                    var li = document.createElement("li");
                    li.textContent = miss.q.stem + " Resposta: " + miss.q.options[miss.q.answer] + ". " + miss.q.why;
                    ul.appendChild(li);
                });
                stage.appendChild(heading);
                stage.appendChild(ul);
            }

            var actions = document.createElement("div");
            actions.className = "row";
            actions.style.marginTop = "1rem";
            var retry = document.createElement("button");
            retry.type = "button";
            retry.className = "btn";
            retry.textContent = "Refazer este simulado";
            retry.addEventListener("click", function () { startExam(state.exam); });
            var back = document.createElement("button");
            back.type = "button";
            back.className = "btn ghost";
            back.textContent = "Escolher outro";
            back.addEventListener("click", function () {
                state = null;
                stage.classList.add("is-hidden");
                stage.innerHTML = "";
                list.classList.remove("is-hidden");
            });
            actions.appendChild(retry);
            actions.appendChild(back);
            stage.appendChild(actions);
        }
    }

    function initCards() {
        var root = document.querySelector("[data-flash]");
        if (!root) return;
        var scene = root.querySelector("[data-scene]");
        var inner = root.querySelector("[data-inner]");
        var front = root.querySelector("[data-front]");
        var back = root.querySelector("[data-back]");
        var count = root.querySelector("[data-card-count]");
        var tally = root.querySelector("[data-card-tally]");

        function paint() {
            var pair = cards[cardIndex];
            front.textContent = pair[0];
            back.textContent = pair[1];
            count.textContent = (cardIndex + 1) + " de " + cards.length;
            tally.textContent = "Sei: " + knew + " · Ainda erro: " + again;
            inner.classList.toggle("is-flipped", cardFlipped);
        }

        function flip() {
            cardFlipped = !cardFlipped;
            paint();
        }

        scene.addEventListener("click", flip);
        scene.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                flip();
            }
        });

        root.querySelector("[data-prev]").addEventListener("click", function () {
            cardIndex = (cardIndex - 1 + cards.length) % cards.length;
            cardFlipped = false;
            paint();
        });
        root.querySelector("[data-next]").addEventListener("click", function () {
            cardIndex = (cardIndex + 1) % cards.length;
            cardFlipped = false;
            paint();
        });
        root.querySelector("[data-know]").addEventListener("click", function () {
            knew += 1;
            cardIndex = (cardIndex + 1) % cards.length;
            cardFlipped = false;
            paint();
        });
        root.querySelector("[data-again]").addEventListener("click", function () {
            again += 1;
            cardIndex = (cardIndex + 1) % cards.length;
            cardFlipped = false;
            paint();
        });
        paint();
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.body.classList.add("reduce-motion");
    }

    initChecks();
    initSearch();
    initLightbox();
    initQuiz();
    initCards();
})();
