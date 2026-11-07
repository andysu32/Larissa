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
        { id: 40, theme: "sangue", stem: "As plaquetas participam principalmente da:", options: ["Troca gasosa alveolar", "Hemostasia", "Produção de bile", "Condução do som"], answer: 1, why: "As plaquetas formam o tampão inicial. A cascata de coagulação firma o coágulo. Leucócitos defendem. Hemácias carregam gás." },
        { id: 41, theme: "basico", stem: "A maior parte do ATP da célula com oxigênio é produzida na:", options: ["Membrana nuclear", "Mitocôndria", "Parede celular", "Vesícula de Golgi apenas"], answer: 1, why: "A mitocôndria concentra o ciclo de Krebs e a cadeia respiratória. Sem oxigênio, a célula fica limitada à glicólise, que rende bem menos ATP." },
        { id: 42, theme: "basico", stem: "No modelo clássico, a transcrição acontece no núcleo e produz:", options: ["DNA a partir de proteína", "RNA a partir de DNA", "Glicose a partir de gordura", "Anticorpo a partir de lipídio"], answer: 1, why: "Transcrição copia um trecho de DNA em RNA. A tradução, no ribossomo, lê esse RNA e monta a proteína." },
        { id: 43, theme: "basico", stem: "Uma vacina, no sentido clássico, é um exemplo de imunização:", options: ["Passiva, porque entrega anticorpo pronto", "Ativa, porque o corpo aprende a responder", "Só inata, sem memória", "Restrita a vírus, nunca a bactéria"], answer: 1, why: "A vacina apresenta um antígeno para o corpo produzir a própria resposta e memória. Soro com anticorpo pronto é imunização passiva." },
        { id: 44, theme: "basico", stem: "Antibiótico, na definição de estudo, age contra:", options: ["Qualquer febre", "Bactérias", "Todo vírus respiratório", "Apenas fungos"], answer: 1, why: "Antibiótico tem alvo em estrutura ou metabolismo bacteriano. Vírus não tem essa maquinaria. Usar antibiótico em virose não trata a causa e favorece resistência." },
        { id: 45, theme: "basico", stem: "Na coloração de Gram, a bactéria que fica roxa, com parede espessa de peptideoglicano, é a:", options: ["Gram-negativa", "Gram-positiva", "Sem parede, sempre", "Um vírus encapsulado"], answer: 1, why: "Gram-positiva retém o cristal violeta. Gram-negativa perde esse corante, fica rosa com a safranina e tem membrana externa." },
        { id: 46, theme: "basico", stem: "Os quatro sinais clássicos da inflamação, descritos desde Celso, são:", options: ["Febre, tosse, dor e cianose", "Calor, rubor, tumor e dor", "Palidez, sudorese, sede e oligúria", "Icterícia, ascite, edema e prurido"], answer: 1, why: "Calor, rubor, tumor e dor. A perda da função foi acrescentada depois. Tumor aqui significa inchaço, não câncer." },
        { id: 47, theme: "basico", stem: "O pH do sangue arterial, na faixa de referência habitual, fica em torno de:", options: ["6,8 a 7,0", "7,35 a 7,45", "8,0 a 8,2", "5,5 a 6,0"], answer: 1, why: "O sangue é levemente alcalino. Abaixo de cerca de 7,35 fala-se em acidemia. Acima de cerca de 7,45, em alcalemia. Os pulmões e os rins participam desse equilíbrio." },
        { id: 48, theme: "basico", stem: "Na farmacologia, um agonista é a molécula que:", options: ["Liga o receptor e o ativa", "Só impede o agonista, sem ativar", "Destrói o receptor na primeira passagem", "Age apenas no tubo digestório, nunca no receptor"], answer: 0, why: "Agonista liga e provoca o efeito. Antagonista ocupa o receptor e bloqueia. Os dois podem ligar. A diferença é a ativação." },
        { id: 49, theme: "clinica", stem: "Um dos princípios do SUS, ao lado da universalidade e da integralidade, é a:", options: ["Equidade", "Seleção por renda alta", "Atendimento só hospitalar", "Cobrança prévia obrigatória"], answer: 0, why: "Universalidade é o acesso de todos. Integralidade é o cuidado completo, não só a queixa. Equidade é ajustar o cuidado à necessidade, para reduzir desigualdade." },
        { id: 50, theme: "clinica", stem: "Em epidemiologia, incidência mede:", options: ["Quem tem a condição num instante", "Os casos novos num período", "A gravidade de um único paciente", "O preço do tratamento"], answer: 1, why: "Incidência conta casos novos ao longo de um tempo. Prevalência conta quem tem a condição naquele momento, novos e antigos." },
        { id: 51, theme: "clinica", stem: "A ordem clássica do exame físico é:", options: ["Ausculta, cirurgia, laboratório e alta", "Inspeção, palpação, percussão e ausculta", "Palpação profunda antes de olhar", "Só ausculta, nos quatro sistemas"], answer: 1, why: "Olhar, palpar, percutir e auscultar. No abdome, a ausculta vem antes da palpação para não alterar os ruídos. A história vem antes de tudo isso." },
        { id: 52, theme: "basico", stem: "O ectoderma, no embrião, dá origem principalmente a:", options: ["Músculo e sangue", "Pele e sistema nervoso", "Revestimento do intestino", "Somente à placenta"], answer: 1, why: "Ectoderma forma epiderme e o sistema nervoso. Mesoderma forma músculo, osso, sangue, coração e rins. Endoderma reveste o tubo digestório e o respiratório." },
        { id: 53, theme: "clinica", stem: "Um tumor benigno, no contraste clássico com o maligno, tende a:", options: ["Invadir e metastatizar cedo", "Ficar localizado e mais bem delimitado", "Nascer sempre do sangue", "Ser sinônimo de carcinoma"], answer: 1, why: "Benigno empurra e costuma ter limite. Maligno invade e pode metastatizar. Carcinoma é maligno de origem epitelial. Benigno não é carcinoma." },
        { id: 54, theme: "cardio", stem: "A primeira bulha cardíaca, B1, corresponde sobretudo ao:", options: ["Fechamento das valvas atrioventriculares", "Fechamento das valvas aórtica e pulmonar", "Abertura da mitral apenas", "Fluxo da aorta no pescoço"], answer: 0, why: "B1 marca o fechamento da mitral e da tricúspide no começo da sístole. B2 marca o fechamento da aórtica e da pulmonar no começo da diástole." },
        { id: 55, theme: "clinica", stem: "Na bioética principialista, respeitar a decisão informada da pessoa corresponde sobretudo à:", options: ["Autonomia", "Justiça distributiva apenas", "Não maleficência isolada da informação", "Beneficência sem escutar"], answer: 0, why: "Autonomia pede informação compreensível e liberdade de aceitar ou recusar. Beneficência busca o bem. Não maleficência evita o dano. Justiça reparte recurso e cuidado." },
        { id: 56, theme: "clinica", stem: "Na pediatria de revisão, o teste da orelhinha é uma:", options: ["Confirmação definitiva de surdez", "Triagem, que pede reteste se falhar", "Prova de linguagem aos dois anos", "Medida da visão do recém-nascido"], answer: 1, why: "Triagem não fecha diagnóstico. Falha leva a reteste e, se preciso, ao potencial evocado e à audiometria adequada à idade." },
        { id: 57, theme: "urgencia", stem: "Na suspeita de síndrome coronariana aguda, a diretriz ACC/AHA de 2025 pede o primeiro ECG em até:", options: ["10 minutos do primeiro contato médico", "1 hora", "6 horas", "Só depois do resultado da troponina"], answer: 0, why: "O ECG de 12 derivações deve ser feito e lido em até 10 minutos. A troponina é colhida em paralelo e não atrasa o traçado." },
        { id: 58, theme: "urgencia", stem: "Supradesnivelamento do ST em DII, DIII e aVF aponta para a parede:", options: ["Anterior", "Lateral alta", "Inferior", "Posterior isolada"], answer: 2, why: "DII, DIII e aVF olham a face inferior, que na maioria das pessoas depende da coronária direita. V1 a V4 olham a parede anterior. DI, aVL, V5 e V6, a lateral." },
        { id: 59, theme: "urgencia", stem: "O músculo papilar que mais rompe no infarto, por ter em geral uma só artéria, é o:", options: ["Anterolateral do ventrículo esquerdo", "Posteromedial do ventrículo esquerdo", "Septal do ventrículo direito", "Anterior do ventrículo direito"], answer: 1, why: "O posteromedial costuma depender só da descendente posterior. O anterolateral recebe da descendente anterior e da circunflexa. A ruptura dá insuficiência mitral aguda." },
        { id: 60, theme: "urgencia", stem: "Depois de um AVC, antes de liberar comida, líquido ou remédio pela boca, a diretriz AHA/ASA pede:", options: ["Triagem de deglutição", "Ressonância de controle", "Sonda para todos, sem avaliar", "Esperar 72 horas sem avaliar"], answer: 0, why: "A triagem precoce de disfagia vem antes de qualquer oferta oral. Quem falha segue para avaliação completa, que pode incluir exame instrumental." },
        { id: 61, theme: "urgencia", stem: "Abre os olhos à pressão, fala palavras soltas e localiza a dor. Qual é a Glasgow?", options: ["8", "10", "12", "13"], answer: 1, why: "Abertura ocular 2, verbal 3, motora 5: total 10. De 9 a 12 o trauma é moderado. Registre os três componentes, não só a soma." },
        { id: 62, theme: "urgencia", stem: "Na Glasgow com pupilas (GCS-P), uma pupila sem reação à luz:", options: ["Soma 1 ponto", "Tira 1 ponto", "Tira 2 pontos", "Não muda a nota"], answer: 1, why: "O escore de reatividade pupilar vale 0, 1 ou 2, conforme nenhuma, uma ou as duas pupilas não reagem. GCS-P é a Glasgow menos esse escore e vai de 1 a 15." },
        { id: 63, theme: "urgencia", stem: "O índice de Apgar serve para:", options: ["Decidir se a reanimação começa", "Descrever o estado do recém-nascido no 1º e no 5º minuto", "Diagnosticar asfixia sozinho", "Prever o desempenho escolar"], answer: 1, why: "A reanimação começa antes do primeiro minuto, guiada por respiração, tônus e frequência cardíaca. O Apgar descreve o estado e a resposta. Sozinho, não diagnostica asfixia." },
        { id: 64, theme: "urgencia", stem: "Um corpo estranho aspirado por um adulto sentado tende a ir para:", options: ["O brônquio principal esquerdo", "O brônquio principal direito", "O esôfago", "A tuba auditiva"], answer: 1, why: "No adulto, o brônquio direito é mais largo, mais curto e mais vertical. Na criança pequena o esquerdo aparece quase tanto quanto o direito, então não descarte esse lado." },
        { id: 65, theme: "clinica", stem: "Adulto com 80 kg e 1,60 m tem IMC de cerca de:", options: ["25,0", "28,1", "31,3", "50,0"], answer: 2, why: "IMC é peso dividido pela altura ao quadrado: 80 ÷ 2,56 ≈ 31,3. Na tabela da OMS, de 30 a 34,9 é obesidade grau I. O IMC não separa gordura de músculo." },
        { id: 66, theme: "clinica", stem: "Um teste muito sensível, quando dá negativo, ajuda principalmente a:", options: ["Confirmar a doença", "Afastar a doença", "Medir a prevalência", "Dispensar a história clínica"], answer: 1, why: "Alta sensibilidade quase não deixa passar doente, então o negativo afasta. Alta especificidade quase não acusa sadio, então o positivo confirma." },
        { id: 67, theme: "clinica", stem: "Mantendo sensibilidade e especificidade, o valor preditivo positivo de um teste:", options: ["Sobe quando a prevalência sobe", "Não depende da prevalência", "Cai quando a prevalência sobe", "É sempre igual à sensibilidade"], answer: 0, why: "Com mais doentes na população testada, um positivo tem mais chance de ser verdadeiro. Por isso o mesmo exame rende mais num ambulatório de risco do que numa triagem geral." },
        { id: 68, theme: "neuro", stem: "No adulto, a medula espinal costuma terminar, no cone medular, perto de:", options: ["C7", "T6", "L1–L2", "S4"], answer: 2, why: "Abaixo do cone seguem as raízes da cauda equina. Por isso a punção lombar é feita mais abaixo, em geral entre L3–L4 ou L4–L5." },
        { id: 69, theme: "neuro", stem: "A área de Broca, no modelo clássico, fica no giro:", options: ["Frontal inferior do hemisfério dominante", "Pós-central", "Occipital lateral", "Do cíngulo"], answer: 0, why: "Partes opercular e triangular do giro frontal inferior. Wernicke fica na parte posterior do giro temporal superior. No 3D do cérebro dá para achar as duas." },
        { id: 70, theme: "neuro", stem: "Uma lesão no córtex motor esquerdo causa fraqueza principalmente:", options: ["Na face e nos membros do lado esquerdo", "Na face e nos membros do lado direito", "Só nos músculos da laringe", "Nos dois lados por igual"], answer: 1, why: "O trato corticoespinal cruza na decussação das pirâmides, no bulbo. Por isso a lesão de um hemisfério enfraquece o lado oposto do corpo." },
        { id: 71, theme: "neuro", stem: "Na ficha ISNCSCI, o músculo-chave da raiz C5 é o:", options: ["Flexor do cotovelo", "Extensor do punho", "Flexor profundo do dedo médio", "Abdutor do dedo mínimo"], answer: 0, why: "C5 flexores do cotovelo, C6 extensores do punho, C7 extensores do cotovelo, C8 flexor profundo do dedo médio e T1 abdutor do dedo mínimo." },
        { id: 72, theme: "neuro", stem: "O liquor é produzido principalmente:", options: ["Pelo plexo corioide dos ventrículos", "Pela dura-máter", "Pelo cerebelo", "Pelas raízes da cauda equina"], answer: 0, why: "O plexo corioide produz a maior parte. O liquor passa dos ventrículos laterais ao terceiro, pelo aqueduto ao quarto, e sai para o espaço subaracnóideo." },
        { id: 73, theme: "digestao", stem: "Na divisão de Couinaud, o fígado tem:", options: ["4 segmentos", "8 segmentos", "12 segmentos", "2 lobos e nenhum segmento"], answer: 1, why: "São oito segmentos funcionais, cada um com seu ramo da porta, da artéria hepática e do ducto biliar. O segmento I é o lobo caudado. A divisão guia as ressecções." },
        { id: 74, theme: "respiratorio", stem: "O segmento broncopulmonar importa na cirurgia porque cada um:", options: ["Tem brônquio segmentar e ramo arterial próprios", "Não tem irrigação", "Corresponde a uma costela", "Fica fora da pleura"], answer: 0, why: "Com brônquio e artéria próprios, um segmento pode ser retirado sozinho. O pulmão direito tem 10. O esquerdo costuma ter de 8 a 10, conforme os segmentos que se fundem." },
        { id: 75, theme: "audicao", stem: "Weber lateraliza para a esquerda e o Rinne é negativo à esquerda. O mais provável é perda:", options: ["Condutiva à esquerda", "Neurossensorial à esquerda", "Condutiva à direita", "Neurossensorial à direita"], answer: 0, why: "Na condutiva, a via óssea vence a aérea do lado doente e o Weber vai para ele. Na neurossensorial esquerda, o Weber iria para a direita e o Rinne ficaria positivo. A audiometria confirma." },
        { id: 76, theme: "degluticao", stem: "Na escala de penetração e aspiração de Rosenbek, o nível 8 significa:", options: ["Nada entrou na via aérea", "Penetração que foi expelida", "Aspiração sem nenhum esforço para expelir", "Tosse eficaz depois da aspiração"], answer: 2, why: "O 8 é a aspiração silenciosa: o material passa das pregas vocais e não há reação. O 1 é nenhuma entrada. Do 2 ao 5 é penetração. Do 6 ao 8, aspiração." },
        { id: 77, theme: "fono", stem: "A diretriz americana de disfonia indica ver a laringe quando a rouquidão dura mais de:", options: ["4 semanas, ou antes se houver sinal de alarme", "1 dia", "1 ano", "Nunca: basta a fonoterapia"], answer: 0, why: "Rouquidão por mais de quatro semanas, ou com sinal de alarme, pede laringoscopia. A laringe também deve ser vista antes de começar a fonoterapia." },
        { id: 78, theme: "urgencia", stem: "Os três itens do qSOFA são:", options: ["Febre, leucócitos altos e taquicardia", "FR ≥ 22, alteração mental e PA sistólica ≤ 100 mmHg", "Lactato > 2, PAM < 65 e vasopressor", "Ureia alta, idade ≥ 65 e tosse"], answer: 1, why: "Sepsis-3: frequência respiratória de 22 ou mais, mental alterado e pressão sistólica de 100 ou menos. Cada um vale um ponto. Dois ou três, fora da UTI, pedem investigar disfunção orgânica. qSOFA não diagnostica sepse." },
        { id: 79, theme: "urgencia", stem: "Sepse, na definição Sepsis-3, é:", options: ["Infecção mais dois critérios de SIRS", "Disfunção orgânica ameaçadora da vida por resposta desregulada à infecção", "Qualquer febre no hospital", "qSOFA de 2 pontos, sozinho"], answer: 1, why: "Operacionalmente, isso é um aumento de 2 pontos ou mais no SOFA. qSOFA só avisa. SIRS não define mais sepse." },
        { id: 80, theme: "urgencia", stem: "No choque séptico possível, a Surviving Sepsis Campaign 2021 pede antimicrobiano:", options: ["Depois do resultado de todas as culturas", "Imediatamente, dentro da primeira hora", "Só se o lactato passar de 4", "Em 24 horas, se a febre persistir"], answer: 1, why: "No choque, antibiótico imediato, dentro de 1 hora. Culturas entram se não atrasarem. Lactato também é pedido cedo. O fármaco é do protocolo do serviço." },
        { id: 81, theme: "clinica", stem: "No CURB-65, cada um destes vale um ponto, exceto:", options: ["Confusão mental nova", "Frequência respiratória > 30", "Febre maior que 38 °C", "Idade ≥ 65 anos"], answer: 2, why: "CURB-65: Confusion, Urea, Respiratory rate, Blood pressure e 65 anos. Febre não entra na conta. A escala não dispensa oxigenação nem comorbidade." },
        { id: 82, theme: "clinica", stem: "CURB-65 de 0 ou 1, sem hipoxemia e com ingestão oral possível, sugere sobretudo:", options: ["UTI de imediato", "Considerar tratamento ambulatorial", "Broncoscopia urgente", "Isolamento por tuberculose, sempre"], answer: 1, why: "Zero ou um: mortalidade baixa, ambulatorial entra na conversa. Dois: pensar em internar. Três ou mais: hospital. A SBPT usa esse recorte no Brasil, junto de oxigenação e contexto." },
        { id: 83, theme: "clinica", stem: "Pré-eclâmpsia, no Manual de Gestação de Alto Risco de 2022, é hipertensão após a 20ª semana em quem era normotensa, mais:", options: ["Edema de membros, obrigatório", "Proteinúria significativa, ou disfunção de órgão-alvo, ou sofrimento placentário", "Apenas cefaleia", "Glicemia de jejum ≥ 92 mg/dL"], answer: 1, why: "Proteinúria significativa ainda define. Sem ela, disfunção de órgão-alvo ou restrição de crescimento também fecham pré-eclâmpsia. Edema deixou de ser critério obrigatório." },
        { id: 84, theme: "clinica", stem: "Proteinúria significativa na pré-eclâmpsia começa em cerca de:", options: ["30 mg em 24 horas", "300 mg em 24 horas, ou relação proteína/creatinina ≥ 0,3", "3 g na fita, só", "Qualquer traço na urina de jejum"], answer: 1, why: "≥ 300 mg/24 h, ou relação ≥ 0,3, ou pelo menos uma cruz na fita quando os outros métodos faltam. Uma cruz na fita é cerca de 30 mg/dL, não 30 mg no dia." },
        { id: 85, theme: "clinica", stem: "No PCDT de hipertensão do SUS, o diagnóstico no adulto de consultório usa:", options: ["Uma medida de 130/80", "PA ≥ 140/90 mmHg que se mantém em outra ocasião, salvo crise ou lesão de órgão-alvo", "Só o MAPA, nunca o consultório", "PA ≥ 160/100 numa única medida, sempre"], answer: 1, why: "Grau 1 pede confirmação em 7 a 14 dias. Uma medida isolada fecha se for ≥ 180/110 ou se houver doença cardiovascular ou lesão de órgão-alvo." },
        { id: 86, theme: "clinica", stem: "Na apendicite clássica, a dor costuma:", options: ["Começar na fossa ilíaca esquerda", "Começar periumbilical e depois fincar na fossa ilíaca direita", "Ser só no ombro direito, desde o primeiro minuto", "Sumir quando há peritonite"], answer: 1, why: "Primeiro é visceral, pouco localizada. Quando o peritônio parietal inflama, a dor vira somática no ponto de McBurney. Migração da dor, anorexia e febre formam o quadro clássico." },
        { id: 87, theme: "clinica", stem: "Sobre perguntar risco de suicídio na consulta de depressão, a linha de cuidado do Ministério da Saúde diz que:", options: ["Perguntar aumenta o risco e deve ser evitado", "O tema deve ser investigado, com escuta e sem julgamento", "Só o psiquiatra pode perguntar", "Basta entregar um folheto, sem falar"], answer: 1, why: "Identificar, avaliar, manejar e encaminhar com certeza de atendimento. Violência autoprovocada é notificação compulsória. CVV 188 e SAMU 192 são os números de apoio e emergência." },
        { id: 88, theme: "clinica", stem: "Pela DCN de 2025, o internato dura no mínimo dois anos e corresponde a pelo menos:", options: ["10% da carga horária do curso", "35% da carga horária do curso", "50% da carga horária do curso", "Somente o último semestre"], answer: 1, why: "Artigo 32: internato ≥ 35% da carga, duração mínima de dois anos. Pelo menos 30% disso em MFC e urgência/emergência do SUS." },
        { id: 89, theme: "clinica", stem: "Os 70% restantes do internato, depois de MFC e urgência, devem contemplar:", options: ["Somente cirurgia e UTI", "Clínica médica, cirurgia, ginecologia e obstetrícia, pediatria e saúde mental", "Apenas especialidades de acesso direto", "Só pesquisa e extensão"], answer: 1, why: "Artigo 32, parágrafo 3º. Saúde coletiva, medicina intensiva e traumato-ortopedia atravessam os rodízios." },
        { id: 90, theme: "clinica", stem: "A prova do Enamed tem 100 questões e cobre, entre outras, estas áreas:", options: ["Somente anatomia e bioquímica", "Clínica, cirurgia, GO, pediatria, MFC, saúde mental e saúde coletiva", "Apenas residência de acesso direto", "Somente inglês médico"], answer: 1, why: "Portaria MEC nº 413/2025. Saúde mental e saúde coletiva entram de forma interdisciplinar. No 8º semestre a nota é diagnóstica. No concluinte, 60 pontos marcam proficiência." }
    ];

    var exams = [
        { id: "geral", title: "Simulado 1 · Linguagem do corpo e ossos", blurb: "Posição anatômica, planos, coluna, hioide, fêmur, meninges e nervos.", ids: [1, 2, 3, 4, 5, 34, 31, 32] },
        { id: "cardio", title: "Simulado 2 · Coração, sangue e respiração", blurb: "Valvas, circuito, marcapasso, alvéolos, diafragma e hemácias.", ids: [6, 7, 8, 9, 10, 11, 12, 35, 36, 39] },
        { id: "cabeca", title: "Simulado 3 · Laringe, orelha e nervos da fala", blurb: "Pregas vocais, tuba auditiva, Weber, Rinne, hipoglosso e masseter.", ids: [13, 14, 15, 16, 17, 18, 19, 21, 27, 38] },
        { id: "fono", title: "Simulado 4 · Fonoaudiologia", blurb: "Deglutição, escala de aspiração, triagem auditiva, fluência, voz, afasia e respiração oral.", ids: [22, 23, 24, 25, 26, 20, 33, 37, 76, 77] },
        { id: "misto", title: "Simulado 5 · Revisão mista", blurb: "Dez questões sorteadas do banco inteiro. Cada tentativa muda.", ids: [] },
        { id: "curso", title: "Simulado 6 · Do básico à clínica", blurb: "Célula, imunidade, micróbio, SUS, semiologia, patologia e ética.", ids: [41, 42, 43, 44, 45, 46, 48, 49, 50, 51, 53, 55] },
        { id: "urgencia", title: "Simulado 7 · Casos, escalas e urgência", blurb: "ECG na dor torácica, Glasgow, Apgar, AVC, corpo estranho, IMC e testes diagnósticos.", ids: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 75] },
        { id: "neuro", title: "Simulado 8 · Neuro, medula e o 3D", blurb: "Cone medular, músculos-chave, Broca, liquor, decussação, Couinaud e segmentos do pulmão.", ids: [68, 69, 70, 71, 72, 73, 74, 31, 32, 21] },
        { id: "internato", title: "Simulado 9 · Internato e Enamed", blurb: "Sepse, CURB-65, pré-eclâmpsia, HAS, apendicite, suicídio, DCN e as sete áreas da prova.", ids: [78, 79, 80, 81, 82, 83, 85, 86, 87, 88, 89, 90] },
        { id: "goaps", title: "Simulado 10 · GO, APS e pediatria", blurb: "Pré-eclâmpsia, proteinúria, hipertensão na APS, Apgar, orelhinha e o internato da DCN.", ids: [83, 84, 85, 63, 56, 24, 88, 89] }
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
        ["Artéria", "Vaso que sai de um ventrículo, não um sinônimo de sangue oxigenado."],
        ["Mitocôndria", "Produz a maior parte do ATP quando há oxigênio."],
        ["Transcrição", "DNA vira RNA, no núcleo."],
        ["Tradução", "RNA vira proteína, no ribossomo."],
        ["Vacina", "Imunização ativa. O corpo aprende."],
        ["Soro", "Imunização passiva. Anticorpo pronto."],
        ["Gram-positiva", "Parede espessa. Fica roxa."],
        ["Antibiótico", "Age em bactéria. Não trata vírus."],
        ["Calor, rubor, tumor e dor", "Os quatro sinais clássicos da inflamação."],
        ["pH do sangue", "Cerca de 7,35 a 7,45."],
        ["Agonista", "Liga o receptor e o ativa."],
        ["Antagonista", "Liga o receptor e bloqueia."],
        ["Incidência", "Casos novos num período."],
        ["Prevalência", "Quem tem a condição agora."],
        ["Ectoderma", "Pele e sistema nervoso."],
        ["SUS", "Universalidade, integralidade e equidade."],
        ["B1", "Fechamento da mitral e da tricúspide."],
        ["Autonomia", "Decisão informada da própria pessoa."],
        ["ECG na dor torácica", "Feito e lido em até 10 minutos do primeiro contato médico."],
        ["DII, DIII e aVF", "Parede inferior. Em geral, coronária direita."],
        ["Papilar posteromedial", "Uma só artéria. Rompe mais no infarto inferior."],
        ["Glasgow", "Ocular 4, verbal 5, motora 6. Vai de 3 a 15."],
        ["GCS-P", "Glasgow menos as pupilas que não reagem: 0, 1 ou 2."],
        ["Apgar", "Cor, frequência, irritabilidade, tônus e respiração. 1º e 5º minuto."],
        ["Cone medular", "No adulto, perto de L1–L2."],
        ["Corpo estranho no adulto", "Brônquio principal direito, mais largo, curto e vertical."],
        ["PAS 8", "Aspiração sem esforço para expelir: silenciosa."],
        ["Couinaud", "Oito segmentos funcionais do fígado."],
        ["Teste sensível negativo", "Ajuda a afastar a doença."],
        ["Valor preditivo positivo", "Sobe quando a prevalência sobe."],
        ["qSOFA", "FR ≥ 22, mental alterado, PA sistólica ≤ 100. Dois pontos pedem olhar. Não diagnostica sepse."],
        ["Sepse", "Disfunção orgânica ameaçadora da vida por resposta desregulada à infecção. ΔSOFA ≥ 2."],
        ["Choque séptico", "Vasopressor para PAM ≥ 65 e lactato > 2 mmol/L, sem hipovolemia."],
        ["CURB-65", "Confusão, ureia, FR > 30, pressão baixa, ≥ 65 anos."],
        ["Pré-eclâmpsia", "HAS após a 20ª semana + proteinúria ou disfunção de órgão ou placenta."],
        ["Proteinúria significativa", "≥ 300 mg/24 h ou relação proteína/creatinina ≥ 0,3."],
        ["HAS no adulto, SUS", "Consultório ≥ 140/90, confirmada em outra ocasião."],
        ["McBurney", "Um terço da espinha ilíaca ântero-superior direita até o umbigo."],
        ["Internato, DCN 2025", "≥ 35% da carga, mínimo de dois anos. 30% em MFC e urgência."],
        ["Enamed", "100 questões. 8º semestre diagnóstico. 12º semestre: 60 é proficiente."]
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
        var items = Array.prototype.slice.call(document.querySelectorAll("[data-find]"));
        var inicial = status ? status.textContent : "";
        var textos = items.map(function (el) {
            return semAcento((el.getAttribute("data-find") || "") + " " + el.textContent);
        });
        input.addEventListener("input", function () {
            var q = semAcento(input.value.trim());
            var shown = 0;
            items.forEach(function (el, i) {
                var hide = q.length > 1 && textos[i].indexOf(q) === -1;
                el.classList.toggle("is-hidden", hide);
                if (!hide) shown += 1;
                if (q.length > 1 && !hide && el.tagName === "DETAILS") el.open = true;
            });
            if (!status) return;
            if (q.length < 2) status.textContent = inicial;
            else if (!shown) status.textContent = "Nada combina com “" + input.value.trim() + "”. Tente uma palavra mais curta ou sem acento.";
            else status.textContent = shown + " de " + items.length + " blocos combinam com a busca.";
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

    var zonas = {
        cabeca: {
            kicker: "Cabeça",
            title: "Cérebro, olho e orelha",
            copy: "Nervos cranianos, audição, visão e as afasias. É daqui que a fonoaudiologia puxa a linguagem e o equilíbrio.",
            href: "#nervoso",
            label: "Abrir a ficha nervosa"
        },
        pescoco: {
            kicker: "Pescoço",
            title: "Laringe e via aérea",
            copy: "Pregas vocais, epiglote e o nervo que abre a glote. Voz e deglutição passam por este trecho.",
            href: "#respiracao",
            label: "Abrir laringe e respiração"
        },
        torax: {
            kicker: "Tórax",
            title: "Coração e pulmões",
            copy: "Quatro câmaras, duas circulações e o diafragma. Decore o circuito antes de qualquer sopro.",
            href: "#coracao",
            label: "Abrir o coração"
        },
        abdome: {
            kicker: "Abdome",
            title: "Digestão, fígado e rins",
            copy: "O alimento desce o tubo. A bile nasce no fígado. O néfron filtra o sangue.",
            href: "#digestao",
            label: "Abrir digestão e rins"
        },
        membro: {
            kicker: "Membros",
            title: "Osso, músculo e movimento",
            copy: "Fêmur, coluna e o diafragma. Anatomia de membro é origem, inserção e o nervo que manda.",
            href: "#ossos",
            label: "Abrir o esqueleto"
        }
    };

    function initBody() {
        var title = document.querySelector("[data-body-title]");
        var copy = document.querySelector("[data-body-copy]");
        var kicker = document.querySelector("[data-body-kicker]");
        var link = document.querySelector("[data-body-link]");
        if (!title) return;
        function show(id) {
            var zona = zonas[id];
            if (!zona) return;
            document.querySelectorAll(".zone").forEach(function (zone) {
                zone.classList.toggle("is-on", zone.getAttribute("data-zone") === id);
            });
            kicker.textContent = zona.kicker;
            title.textContent = zona.title;
            copy.textContent = zona.copy;
            link.href = zona.href;
            link.textContent = zona.label;
        }
        document.querySelectorAll(".zone").forEach(function (zone) {
            var id = zone.getAttribute("data-zone");
            zone.addEventListener("click", function () { show(id); });
            zone.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    show(id);
                }
            });
        });
    }

    function initFilters() {
        var buttons = document.querySelectorAll("[data-filter]");
        if (!buttons.length) return;
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var name = button.getAttribute("data-filter");
                buttons.forEach(function (other) { other.classList.toggle("is-on", other === button); });
                document.querySelectorAll("[data-track], [data-group]").forEach(function (block) {
                    var track = block.getAttribute("data-track") || block.getAttribute("data-group");
                    block.classList.toggle("is-hidden", name !== "tudo" && track !== name);
                });
            });
        });
    }

    function initReading() {
        var bar = document.querySelector("[data-readbar]");
        var links = document.querySelectorAll(".top-links a[href^='#']");
        var marks = [];
        var ultimo = null;
        links.forEach(function (link) {
            var id = link.getAttribute("href").slice(1);
            var section = document.getElementById(id);
            if (section) marks.push({ link: link, section: section });
        });
        function paint() {
            var scrolled = window.scrollY;
            var height = document.documentElement.scrollHeight - window.innerHeight;
            if (bar) bar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + "%";
            var current = null;
            marks.forEach(function (mark) {
                if (mark.section.getBoundingClientRect().top < 160) current = mark;
            });
            links.forEach(function (link) { link.classList.remove("is-here"); });
            if (current) current.link.classList.add("is-here");
            if (current && current !== ultimo) {
                ultimo = current;
                var nav = current.link.parentElement;
                if (nav.scrollWidth > nav.clientWidth) {
                    var dx = current.link.getBoundingClientRect().left - nav.getBoundingClientRect().left;
                    nav.scrollTo({ left: nav.scrollLeft + dx - (nav.clientWidth - current.link.offsetWidth) / 2, behavior: "smooth" });
                }
            }
        }
        paint();
        window.addEventListener("scroll", paint, { passive: true });
    }

    var vistas = [
        { id: "frente", nome: "Frente", theta: 0, phi: 75, raio: 105 },
        { id: "direita", nome: "Direita", theta: -90, phi: 75, raio: 105 },
        { id: "atras", nome: "Atrás", theta: 180, phi: 78, raio: 110 },
        { id: "esquerda", nome: "Esquerda", theta: 90, phi: 75, raio: 105 },
        { id: "cima", nome: "De cima", theta: 180, phi: 1, raio: 115 },
        { id: "baixo", nome: "De baixo", theta: 0, phi: 179, raio: 120 }
    ];

    var orgaos = [
        {
            id: "coracao", nome: "Coração", peso: "1,4 MB",
            titulo: "Quatro câmaras, quatro valvas",
            casca: function (chave) { return /cardiac_atrium|_ventricle$/.test(chave); },
            frente: "De frente, o ventrículo direito ocupa quase toda a face anterior. O ápice, do ventrículo esquerdo, aponta para baixo, para a frente e para a esquerda. A valva pulmonar é a mais alta e a mais anterior.",
            direita: "Pelo lado direito do paciente aparece o átrio direito, que recebe as veias cavas. Este modelo traz câmaras, valvas e músculos papilares. Grandes vasos e coronárias não fazem parte dele.",
            atras: "Por trás fica o átrio esquerdo, a câmara mais posterior, encostada no esôfago. Por isso o ecocardiograma transesofágico enxerga tão bem o átrio esquerdo.",
            esquerda: "Pelo lado esquerdo, o ventrículo esquerdo forma a borda e o ápice. A parede dele é a mais grossa do coração, porque bombeia contra a pressão da aorta.",
            cima: "De cima, sem os grandes vasos, aparecem as valvas. A aórtica fica no centro, encaixada entre as outras três. Ligue o raio-x para ver as quatro.",
            baixo: "Por baixo fica a face diafragmática, apoiada no diafragma e formada sobretudo pelos ventrículos. No infarto inferior, é esta parede que sofre."
        },
        {
            id: "pulmao", nome: "Pulmões e laringe", peso: "2,9 MB",
            titulo: "Da laringe aos segmentos",
            casca: function (chave) { return /bronchopulmonary_segment|^hilum/.test(chave); },
            frente: "De frente, a laringe no alto, a traqueia no meio e os pulmões divididos em segmentos. Cada segmento tem brônquio e artéria próprios e pode ser retirado sozinho numa cirurgia.",
            direita: "Pelo lado direito se veem os três lobos: superior, médio e inferior. Cada lobo tem um tom. O lobo médio só existe deste lado.",
            atras: "Por trás, os segmentos dos lobos inferiores ocupam quase toda a face posterior. Por isso a ausculta das bases se faz pelas costas.",
            esquerda: "Pelo lado esquerdo há dois lobos. A língula, na frente do lobo superior, ocupa o lugar do lobo médio.",
            cima: "De cima, os ápices sobem acima da clavícula, até a base do pescoço. No centro, a laringe e a traqueia.",
            baixo: "De baixo, as bases côncavas que se apoiam no diafragma. Ligue o raio-x: o brônquio principal direito é mais curto, largo e vertical, e é para ele que vai a maioria dos corpos estranhos aspirados."
        },
        {
            id: "cerebro", nome: "Cérebro", peso: "9 MB",
            titulo: "Córtex, núcleos e ventrículos",
            alfaCasca: 0.03,
            casca: function (chave, grupo) {
                return /^Lobo |^Ínsula$/.test(grupo) ||
                    /white_matter|cingulate|parahippocampal|subcallosal|perirhinal|isthmus|ambiens|hemisphere_of_cerebellum|paravermis|cerebellar_vermis/.test(chave);
            },
            frente: "De frente, os lobos frontais e, embaixo e dos lados, os polos temporais. A fissura longitudinal separa os dois hemisférios.",
            direita: "De lado: frontal na frente, parietal em cima, temporal embaixo e occipital atrás. O giro pré-central, motor, fica logo à frente do pós-central, sensitivo.",
            atras: "Por trás, os polos occipitais, onde chega a visão, e o cerebelo embaixo. Lesão do córtex visual de um lado apaga a metade oposta do campo visual, nos dois olhos.",
            esquerda: "O hemisfério esquerdo costuma ser o dominante para a linguagem. Procure o giro frontal inferior, área de Broca, e a parte posterior do temporal superior, área de Wernicke.",
            cima: "De cima, os dois hemisférios. A fronteira entre o giro pré-central e o pós-central marca o sulco central.",
            baixo: "Por baixo: giros orbitais, bulbo olfatório, quiasma óptico, hipotálamo, tronco encefálico e cerebelo. Ligue o raio-x para ver ventrículos, núcleos da base e hipocampo."
        },
        {
            id: "rim", nome: "Rim", peso: "0,8 MB",
            titulo: "Cápsula, córtex, pirâmides e papilas",
            casca: function (chave) { return /capsule|outer_cortex|renal_column/.test(chave); },
            frente: "Este é o rim direito, em forma de feijão. A borda côncava, o hilo, olha para a linha média e um pouco para a frente.",
            direita: "Pelo lado direito do paciente se vê a borda lateral, convexa. O rim direito costuma ficar um pouco mais baixo que o esquerdo, por causa do fígado.",
            atras: "Por trás, o rim se apoia nos músculos da parede posterior do abdome, junto das últimas costelas. É por isso que se percute o rim pelas costas.",
            esquerda: "Pelo lado esquerdo você olha de frente para o hilo, por onde passam a veia, a artéria e a pelve renal.",
            cima: "O polo superior fica coberto pela glândula suprarrenal, que não faz parte deste modelo.",
            baixo: "Ligue o raio-x: aparecem as pirâmides da medula, separadas pelas colunas renais. A ponta de cada pirâmide é uma papila, que goteja urina num cálice."
        },
        {
            id: "figado", nome: "Fígado", peso: "0,5 MB",
            titulo: "Os oito segmentos de Couinaud",
            casca: function (chave) { return /capsule|surface|bare_area|impression|quadrate/.test(chave); },
            frente: "De frente, a face diafragmática e o ligamento falciforme, que separa os lobos anatômicos direito e esquerdo. Ligue o raio-x para ver os segmentos, que seguem a veia porta e as veias hepáticas.",
            direita: "Pelo lado direito, o grande lobo direito, protegido pelas costelas. Os segmentos V a VIII ficam deste lado.",
            atras: "Por trás aparecem a área nua, sem peritônio, e o lobo caudado, o segmento I, encostado na veia cava inferior.",
            esquerda: "Pelo lado esquerdo, o lobo esquerdo se afina sobre o estômago. Ali ficam os segmentos II e III.",
            cima: "De cima, a cúpula acompanha o diafragma. Irritação logo abaixo do diafragma pode doer no ombro direito, pelo nervo frênico.",
            baixo: "Por baixo fica a face visceral: a porta do fígado, o lobo quadrado e as impressões do rim, do duodeno, do cólon e do estômago."
        },
        {
            id: "olho", nome: "Olho", peso: "3,7 MB",
            titulo: "Da córnea à retina",
            alfaCasca: 0.05,
            casca: function (chave) { return /sclera|conjunctiva|choroid|corneo_scleral|vitreous|^retina_L$|ora_serrata/.test(chave); },
            frente: "De frente, a córnea transparente, a íris e a pupila. Este é o olho esquerdo.",
            direita: "Pelo lado direito do paciente você vê o lado nasal deste olho. O disco óptico fica deste lado da mácula.",
            atras: "Por trás, o polo posterior: mácula, fóvea e disco óptico. O disco não tem fotorreceptores e por isso é o ponto cego.",
            esquerda: "Pelo lado esquerdo, o lado temporal. Ligue o raio-x e procure o corpo ciliar e as fibras que seguram o cristalino.",
            cima: "Com o raio-x ligado, de cima, aparece a ordem que a luz percorre: córnea, humor aquoso, pupila, cristalino, vítreo e retina.",
            baixo: "A esclera, branca e firme, envolve quase todo o globo. Na junção com a córnea fica o canal de Schlemm, por onde o humor aquoso sai."
        },
        {
            id: "joelho", nome: "Joelho", peso: "0,2 MB",
            titulo: "Ossos, cartilagem e menisco",
            casca: function (chave) { return /^femur|^tibia|^fibula|^patella_R$/.test(chave); },
            frente: "Este é o membro inferior direito, com fêmur, patela, tíbia e fíbula inteiros. A patela desliza na face patelar do fêmur.",
            direita: "Pelo lado direito do paciente, a face lateral. A fíbula aparece deste lado, presa à tíbia, sem tocar o fêmur.",
            atras: "Por trás, a fossa intercondilar, entre os côndilos. É nela que se prendem os ligamentos cruzados. O modelo marca essas inserções.",
            esquerda: "Pelo lado esquerdo, a face medial. O côndilo medial do fêmur é maior e desce mais que o lateral.",
            cima: "De cima, a cabeça do fêmur, que encaixa no quadril. Ligue o raio-x e chegue perto do joelho para ver cartilagem e menisco.",
            baixo: "De baixo, as pontas da tíbia e da fíbula, que formam o tornozelo com o tálus."
        },
        {
            id: "pancreas", nome: "Pâncreas", peso: "0,1 MB",
            titulo: "Cabeça, colo, corpo, cauda e processo uncinado",
            casca: null,
            frente: "O pâncreas atravessa o abdome deitado, atrás do estômago. A cabeça fica à direita do paciente, na curva do duodeno. A cauda sobe para a esquerda, até o baço.",
            direita: "Pelo lado direito, a cabeça e o processo uncinado, que se dobra para trás e para a esquerda.",
            atras: "Por trás, o processo uncinado passa atrás dos vasos mesentéricos superiores, que não estão neste modelo. A dor da pancreatite costuma irradiar para as costas, em faixa.",
            esquerda: "Pelo lado esquerdo, a cauda, que chega ao hilo do baço.",
            cima: "De cima, o colo marca o ponto onde os vasos mesentéricos superiores passam por trás. Ali a veia mesentérica superior se junta à esplênica e forma a veia porta.",
            baixo: "Por dentro há duas glândulas. As ilhotas soltam insulina e glucagon no sangue. O resto do órgão manda enzimas ao duodeno."
        },
        {
            id: "baco", nome: "Baço", peso: "0,2 MB",
            titulo: "Filtro do sangue, não do alimento",
            casca: null,
            frente: "O baço fica no alto e à esquerda, atrás do estômago, sob as costelas 9 a 11. Não produz bile e não digere comida.",
            direita: "Pelo lado direito do paciente, a face visceral: gástrica, renal e cólica, com o hilo no meio.",
            atras: "Por trás, a face renal, apoiada no rim esquerdo, e a face diafragmática, voltada para as costas.",
            esquerda: "Pelo lado esquerdo, a face diafragmática, lisa e convexa, sob o diafragma e as costelas.",
            cima: "Trauma nas costelas de baixo, à esquerda, pode romper o baço. A dor pode ir para o ombro esquerdo, pelo frênico.",
            baixo: "Quando o baço cresce, ele desce e avança para a frente e para a direita, e passa a ser palpável abaixo da costela."
        },
        {
            id: "intestino", nome: "Intestino delgado", peso: "0,4 MB",
            titulo: "Duodeno, jejuno e íleo",
            casca: function (chave) { return /^jejunum$|^ileum$/.test(chave); },
            frente: "De frente, as alças do jejuno e do íleo ocupam o centro do abdome. Ligue o raio-x para ver o duodeno em C, atrás delas.",
            direita: "À direita fica a parte descendente do duodeno, onde a bile e o suco pancreático chegam pela papila maior.",
            atras: "Por trás, quase todo o duodeno fica fixo na parede posterior, fora da cavidade peritoneal.",
            esquerda: "Em cima e à esquerda predomina o jejuno. O ângulo duodenojejunal, preso pelo ligamento de Treitz, separa a hemorragia digestiva alta da baixa.",
            cima: "De cima, o bulbo duodenal, logo depois do piloro. É ali que fica a maioria das úlceras duodenais.",
            baixo: "Embaixo e à direita, o íleo terminal chega à válvula ileocecal. É o lugar típico da doença de Crohn."
        },
        {
            id: "bexiga", nome: "Bexiga", peso: "0,1 MB",
            titulo: "Domo, trígono e colo",
            casca: function (chave) { return /dome|base1|neck/.test(chave); },
            frente: "A bexiga fica atrás do púbis. Vazia, cabe na pelve. Cheia, sobe para o abdome e pode ser palpada.",
            direita: "Pelo lado direito, a parede lateral. Os ureteres entram por trás e de lado, num trajeto oblíquo pela parede que impede a urina de voltar.",
            atras: "Este modelo é de um homem. Atrás da bexiga ficam as vesículas seminais e o reto. Na mulher, o útero e a vagina.",
            esquerda: "A parede é músculo liso, o detrusor. Ele contrai para esvaziar, comandado pelo parassimpático de S2 a S4.",
            cima: "De cima, o domo, coberto por peritônio. Ligue o raio-x para ver o trígono, entre os dois óstios dos ureteres e o colo.",
            baixo: "Embaixo, o colo leva à uretra. No homem, a próstata envolve esse começo da uretra."
        },
        {
            id: "medula", nome: "Medula espinal", peso: "0,2 MB",
            titulo: "Segmento por segmento, de C1 a S5",
            casca: null,
            frente: "A medula desce pelo canal vertebral, do forame magno até perto das vértebras L1–L2. Cada região tem uma cor: cervical, torácica, lombar e sacral.",
            direita: "De lado se veem as duas intumescências: a cervical, de onde saem os nervos dos braços, e a lombossacral, de onde saem os das pernas.",
            atras: "Por trás chegam as raízes dorsais, sensitivas. As colunas posteriores levam tato fino e propriocepção. As raízes não fazem parte deste modelo.",
            esquerda: "Repare nos tamanhos. Os segmentos lombares e sacrais se espremem em poucos centímetros no fim da medula. Por isso o segmento não fica na vértebra de mesmo número.",
            cima: "Em cima, C1 continua o bulbo, logo abaixo do forame magno. De C3 a C5 sai o frênico, que move o diafragma.",
            baixo: "Embaixo fica o cone medular. Abaixo dele só há raízes, a cauda equina. Por isso a punção lombar é feita abaixo de L2, entre L3 e L4 ou entre L4 e L5."
        }
    ];

    function semAcento(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function cenaInterna(viewer) {
        var chave = Object.getOwnPropertySymbols(viewer).filter(function (s) { return s.description === "scene"; })[0];
        return chave ? viewer[chave] : null;
    }

    function initAtlas3d() {
        var viewer = document.getElementById("orgao3d");
        var picker = document.querySelector("[data-organs]");
        var views = document.querySelector("[data-views]");
        var dadosAtlas = window.ATLAS3D;
        if (!viewer || !picker || !views || !dadosAtlas) return;
        var title = document.querySelector("[data-3d-title]");
        var copy = document.querySelector("[data-3d-copy]");
        var kicker = document.querySelector("[data-3d-kicker]");
        var status = document.querySelector("[data-3d-status]");
        var hover = document.querySelector("[data-3d-hover]");
        var btnSpin = document.querySelector("[data-3d-spin]");
        var btnXray = document.querySelector("[data-3d-xray]");
        var btnIsolar = document.querySelector("[data-3d-isolate]");
        var btnReset = document.querySelector("[data-3d-reset]");
        var partGroup = document.querySelector("[data-part-group]");
        var partName = document.querySelector("[data-part-name]");
        var partInfo = document.querySelector("[data-part-info]");
        var lista = document.querySelector("[data-parts]");
        var contagem = document.querySelector("[data-parts-count]");
        var filtro = document.querySelector("[data-parts-filter]");
        var quizStart = document.querySelector("[data-quiz3d-start]");
        var quizAsk = document.querySelector("[data-quiz3d-ask]");
        var quizScore = document.querySelector("[data-quiz3d-score]");
        var quizActions = document.querySelector("[data-quiz3d-actions]");
        var quizNext = document.querySelector("[data-quiz3d-next]");
        var quizSkip = document.querySelector("[data-quiz3d-skip]");
        var quizStop = document.querySelector("[data-quiz3d-stop]");

        var atual = orgaos[0];
        var dados = dadosAtlas[atual.id];
        var partes = {};
        var materiais = [];
        var porNome = {};
        var malhas = {};
        var selecionado = null;
        var raiox = false;
        var isolar = false;
        var girando = false;
        var quiz = null;
        var pulso = 0;
        var inicio = null;
        var pendente = null;

        orgaos.forEach(function (orgao, index) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = orgao.nome;
            button.setAttribute("data-orgao", orgao.id);
            button.setAttribute("aria-pressed", index === 0 ? "true" : "false");
            button.addEventListener("click", function () { escolher(orgao); });
            picker.appendChild(button);
        });

        vistas.forEach(function (item) {
            var button = document.createElement("button");
            button.type = "button";
            button.textContent = item.nome;
            button.setAttribute("data-vista", item.id);
            button.setAttribute("aria-pressed", item.id === "frente" ? "true" : "false");
            button.addEventListener("click", function () { olhar(item.id); });
            views.appendChild(button);
        });

        function metros(valor) { return valor.toFixed(4) + "m"; }

        function centro() {
            var c = dados.caixa;
            pulso = 1 - pulso;
            return metros(c[0] + pulso * 0.00001) + " " + metros(c[1]) + " " + metros(c[2]);
        }

        function olhar(id) {
            var item = vistas.filter(function (v) { return v.id === id; })[0];
            views.querySelectorAll("button").forEach(function (button) {
                button.setAttribute("aria-pressed", button.getAttribute("data-vista") === id ? "true" : "false");
            });
            viewer.cameraTarget = centro();
            viewer.cameraOrbit = (item.theta + pulso * 0.01) + "deg " + item.phi + "deg " + item.raio + "%";
            viewer.fieldOfView = "auto";
            copy.textContent = atual[id];
        }

        function aproximar(parte) {
            var c = parte.centro;
            var caixa = dados.caixa;
            var raio = Math.min(Math.max(c[3] * 3.2, caixa[3] * 0.3), caixa[3] * 1.4);
            var orbita = viewer.getCameraOrbit();
            var theta = orbita.theta;
            var phi = orbita.phi;
            var dx = c[0] - caixa[0];
            var dy = c[1] - caixa[1];
            var dz = c[2] - caixa[2];
            var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist > caixa[3] * 0.12) {
                theta = Math.atan2(dx, dz);
                phi = Math.min(Math.max(Math.acos(dy / dist), 0.35), 2.8);
            }
            pulso = 1 - pulso;
            viewer.cameraTarget = metros(c[0] + pulso * 0.00001) + " " + metros(c[1]) + " " + metros(c[2]);
            viewer.cameraOrbit = theta + "rad " + phi + "rad " + metros(raio);
            viewer.fieldOfView = "auto";
        }

        function nomeDe(chave) {
            return partes[chave] ? partes[chave].nome : chave.replace(/_/g, " ");
        }

        function pintar() {
            materiais.forEach(function (m) {
                var cor = m.cor;
                var alfa = cor[3];
                var modo = m.modo;
                var escolhido = m.nome === selecionado;
                if (isolar && selecionado && !escolhido) {
                    alfa = 0.06;
                    modo = "BLEND";
                } else if (raiox && m.casca && !escolhido) {
                    alfa = Math.min(alfa, atual.alfaCasca || 0.12);
                    modo = "BLEND";
                }
                m.mat.pbrMetallicRoughness.setBaseColorFactor([cor[0], cor[1], cor[2], alfa]);
                m.mat.setAlphaMode(modo);
                m.mat.setEmissiveFactor(escolhido ? [0.42, 0.3, 0.06] : [0, 0, 0]);
                (malhas[m.nome] || []).forEach(function (malha) {
                    malha.userData.noHit = alfa < 0.2 && !escolhido;
                });
            });
        }

        function mostrarParte(chave) {
            var parte = partes[chave];
            if (!parte) {
                partGroup.textContent = "Nenhuma estrutura escolhida";
                partName.textContent = "Toque o modelo";
                partInfo.textContent = "Clique numa parte do órgão ou escolha na lista abaixo. No celular, toque sem arrastar.";
                return;
            }
            partGroup.textContent = parte.grupo;
            partName.textContent = parte.nome;
            partInfo.textContent = parte.info || dados.grupos[parte.grupo] ||
                "Use o nome para procurar a estrutura no atlas de imagens e nos livros da biblioteca.";
        }

        function marcarNaLista(chave) {
            lista.querySelectorAll("[data-parte]").forEach(function (chip) {
                chip.setAttribute("aria-pressed", chip.getAttribute("data-parte") === chave ? "true" : "false");
            });
        }

        function selecionar(chave, mover) {
            selecionado = partes[chave] ? chave : null;
            mostrarParte(selecionado);
            marcarNaLista(selecionado);
            pintar();
            if (selecionado && mover) aproximar(partes[selecionado]);
        }

        function montarLista() {
            lista.innerHTML = "";
            var grupos = [];
            var porGrupo = {};
            dados.partes.forEach(function (p) {
                if (!porGrupo[p[2]]) {
                    porGrupo[p[2]] = [];
                    grupos.push(p[2]);
                }
                porGrupo[p[2]].push(p);
            });
            var aberto = dados.partes.length <= 40;
            grupos.forEach(function (grupo, index) {
                var bloco = document.createElement("details");
                bloco.className = "parts-group";
                if (aberto || index === 0) bloco.open = true;
                var resumo = document.createElement("summary");
                resumo.textContent = grupo + " · " + porGrupo[grupo].length;
                bloco.appendChild(resumo);
                var chips = document.createElement("div");
                chips.className = "chips";
                porGrupo[grupo].forEach(function (p) {
                    var chip = document.createElement("button");
                    chip.type = "button";
                    chip.textContent = p[1];
                    chip.setAttribute("data-parte", p[0]);
                    chip.setAttribute("data-busca", semAcento(p[1] + " " + p[0].replace(/_/g, " ")));
                    chip.setAttribute("aria-pressed", "false");
                    chip.addEventListener("click", function () {
                        if (quiz) return;
                        selecionar(p[0], true);
                    });
                    chips.appendChild(chip);
                });
                bloco.appendChild(chips);
                lista.appendChild(bloco);
            });
            if (contagem) contagem.textContent = "(" + dados.partes.length + ")";
            if (filtro) filtro.value = "";
        }

        if (filtro) {
            filtro.addEventListener("input", function () {
                var q = semAcento(filtro.value.trim());
                lista.querySelectorAll(".parts-group").forEach(function (bloco) {
                    var visiveis = 0;
                    bloco.querySelectorAll("[data-parte]").forEach(function (chip) {
                        var ok = !q || chip.getAttribute("data-busca").indexOf(q) !== -1;
                        chip.classList.toggle("is-hidden", !ok);
                        if (ok) visiveis += 1;
                    });
                    bloco.classList.toggle("is-hidden", visiveis === 0);
                    if (q && visiveis) bloco.open = true;
                });
            });
        }

        function prepararModelo() {
            materiais = [];
            porNome = {};
            malhas = {};
            var model = viewer.model;
            if (!model) return;
            model.materials.forEach(function (mat) {
                var parte = partes[mat.name];
                var item = {
                    mat: mat,
                    nome: mat.name,
                    cor: mat.pbrMetallicRoughness.baseColorFactor.slice(),
                    modo: mat.getAlphaMode(),
                    casca: !!(atual.casca && atual.casca(mat.name, parte ? parte.grupo : ""))
                };
                materiais.push(item);
                porNome[mat.name] = item;
            });
            var cena = cenaInterna(viewer);
            if (cena && cena.traverse) {
                cena.traverse(function (obj) {
                    if (!obj.isMesh || !obj.material) return;
                    var nome = obj.material.name;
                    (malhas[nome] = malhas[nome] || []).push(obj);
                });
            }
            if (btnXray) btnXray.disabled = !atual.casca;
            pintar();
        }

        function escolher(orgao) {
            if (quiz) pararQuiz();
            atual = orgao;
            dados = dadosAtlas[orgao.id];
            partes = {};
            dados.partes.forEach(function (p) {
                partes[p[0]] = { chave: p[0], nome: p[1], grupo: p[2], info: p[3], centro: p[4] };
            });
            selecionado = null;
            materiais = [];
            kicker.textContent = orgao.nome + " · " + dados.partes.length + " estruturas";
            title.textContent = orgao.titulo;
            viewer.setAttribute("src", "assets/medicina/3d/" + orgao.id + ".glb");
            viewer.setAttribute("alt", "Modelo tridimensional de " + orgao.nome.toLowerCase() + ", reconstruído de um corpo real");
            viewer.minCameraOrbit = "auto 1deg " + metros(dados.caixa[3] * 0.06);
            picker.querySelectorAll("button").forEach(function (button) {
                button.setAttribute("aria-pressed", button.getAttribute("data-orgao") === orgao.id ? "true" : "false");
            });
            if (status) status.textContent = "Carregando " + orgao.nome.toLowerCase() + " (" + orgao.peso + ")…";
            mostrarParte(null);
            montarLista();
            olhar("frente");
        }

        function pegar(event) {
            var mat = viewer.materialFromPoint(event.clientX, event.clientY);
            return mat && partes[mat.name] ? mat.name : null;
        }

        viewer.addEventListener("load", function () {
            prepararModelo();
            if (status) status.textContent = "Arraste para girar. Use a roda ou dois dedos para chegar perto. Toque uma parte para ver o nome.";
            if (pendente) {
                selecionar(pendente, true);
                pendente = null;
            }
        });
        viewer.addEventListener("error", function () {
            if (status) status.textContent = "O modelo não carregou. Confira a conexão e escolha o órgão de novo.";
        });
        viewer.addEventListener("progress", function (event) {
            var valor = event.detail && event.detail.totalProgress;
            if (status && valor < 1) status.textContent = "Carregando o modelo real… " + Math.round(valor * 100) + "%";
        });

        viewer.addEventListener("pointerdown", function (event) {
            inicio = { x: event.clientX, y: event.clientY };
            if (hover) hover.hidden = true;
        });
        viewer.addEventListener("click", function (event) {
            if (inicio && Math.abs(event.clientX - inicio.x) + Math.abs(event.clientY - inicio.y) > 6) return;
            var chave = pegar(event);
            if (quiz) {
                responder(chave);
                return;
            }
            selecionar(chave === selecionado ? null : chave, false);
        });

        var esperando = false;
        viewer.addEventListener("pointermove", function (event) {
            if (!hover || event.pointerType !== "mouse" || event.buttons || quiz || esperando) return;
            esperando = true;
            requestAnimationFrame(function () {
                esperando = false;
                var chave = pegar(event);
                viewer.classList.toggle("is-pointing", !!chave);
                if (!chave) {
                    hover.hidden = true;
                    return;
                }
                var caixa = viewer.getBoundingClientRect();
                hover.textContent = nomeDe(chave);
                hover.style.left = (event.clientX - caixa.left + 14) + "px";
                hover.style.top = (event.clientY - caixa.top + 12) + "px";
                hover.hidden = false;
            });
        });
        viewer.addEventListener("pointerleave", function () {
            if (hover) hover.hidden = true;
        });

        function alternar(botao, ligado) {
            if (botao) botao.setAttribute("aria-pressed", ligado ? "true" : "false");
        }

        if (btnXray) {
            btnXray.addEventListener("click", function () {
                raiox = !raiox;
                alternar(btnXray, raiox);
                pintar();
            });
        }
        if (btnIsolar) {
            btnIsolar.addEventListener("click", function () {
                isolar = !isolar;
                alternar(btnIsolar, isolar);
                if (isolar && !selecionado && status) status.textContent = "Escolha uma estrutura para isolar: toque o modelo ou use a lista.";
                pintar();
            });
        }
        if (btnReset) {
            btnReset.addEventListener("click", function () {
                selecionar(null, false);
                olhar("frente");
            });
        }
        if (btnSpin) {
            btnSpin.addEventListener("click", function () {
                girando = !girando;
                if (girando) viewer.setAttribute("auto-rotate", "");
                else viewer.removeAttribute("auto-rotate");
                alternar(btnSpin, girando);
            });
        }

        function placar() {
            quizScore.textContent = "Acertos: " + quiz.acertos + " de " + quiz.feitas + (quiz.feitas ? " · " + Math.round(quiz.acertos / quiz.feitas * 100) + "%" : "");
        }

        function novaPergunta() {
            var caixa = dados.caixa[3];
            var pool = dados.partes.filter(function (p) {
                return p[4][3] >= caixa * 0.06 && quiz.vistas.indexOf(p[0]) === -1;
            });
            if (!pool.length) {
                quiz.vistas = [];
                pool = dados.partes.filter(function (p) { return p[4][3] >= caixa * 0.06; });
            }
            var alvo = pool[Math.floor(Math.random() * pool.length)];
            quiz.alvo = alvo[0];
            quiz.erros = 0;
            quiz.fechada = false;
            quiz.vistas.push(alvo[0]);
            var aviso = "";
            if (raiox && porNome[alvo[0]] && porNome[alvo[0]].casca) {
                raiox = false;
                alternar(btnXray, false);
                aviso = " O raio-x foi desligado, porque esta fica por fora.";
            }
            selecionar(null, false);
            quizAsk.textContent = "Onde fica: " + alvo[1] + "?" + aviso;
            quizNext.hidden = true;
            quizSkip.hidden = false;
            placar();
        }

        function fechar(acertou) {
            quiz.fechada = true;
            quiz.feitas += 1;
            if (acertou) quiz.acertos += 1;
            quizNext.hidden = false;
            quizSkip.hidden = true;
            placar();
            quizNext.focus();
        }

        function responder(chave) {
            if (!quiz || quiz.fechada || !chave) return;
            if (chave === quiz.alvo) {
                selecionar(chave, false);
                quizAsk.textContent = "Certo: " + nomeDe(chave) + ".";
                fechar(true);
                return;
            }
            quiz.erros += 1;
            if (quiz.erros < 2) {
                quizAsk.textContent = "Isso é " + nomeDe(chave) + ". Tente outra vez: " + nomeDe(quiz.alvo) + ".";
                return;
            }
            selecionar(quiz.alvo, true);
            quizAsk.textContent = "Era aqui, em destaque: " + nomeDe(quiz.alvo) + ".";
            fechar(false);
        }

        function pararQuiz() {
            quiz = null;
            quizAsk.hidden = true;
            quizScore.hidden = true;
            quizActions.hidden = true;
            quizStart.hidden = false;
            lista.classList.remove("is-locked");
            selecionar(null, false);
        }

        if (quizStart) {
            quizStart.addEventListener("click", function () {
                quiz = { acertos: 0, feitas: 0, vistas: [], alvo: null, erros: 0, fechada: false };
                quizStart.hidden = true;
                quizAsk.hidden = false;
                quizScore.hidden = false;
                quizActions.hidden = false;
                lista.classList.add("is-locked");
                if (hover) hover.hidden = true;
                novaPergunta();
            });
            quizNext.addEventListener("click", novaPergunta);
            quizSkip.addEventListener("click", function () {
                if (!quiz || quiz.fechada) return;
                selecionar(quiz.alvo, true);
                quizAsk.textContent = "Fica aqui, em destaque: " + nomeDe(quiz.alvo) + ".";
                fechar(false);
            });
            quizStop.addEventListener("click", pararQuiz);
        }

        document.addEventListener("click", function (event) {
            var link = event.target.closest("[data-ver3d]");
            if (!link) return;
            var alvo = link.getAttribute("data-ver3d").split(":");
            var orgao = orgaos.filter(function (o) { return o.id === alvo[0]; })[0];
            if (!orgao) return;
            if (orgao !== atual) {
                pendente = alvo[1];
                escolher(orgao);
            } else {
                if (quiz) pararQuiz();
                selecionar(alvo[1], true);
            }
        });

        escolher(orgaos[0]);
    }

    var anos = [
        {
            id: "1", botao: "1º ano", periodos: "1º e 2º períodos",
            titulo: "O corpo normal, e o SUS desde cedo",
            resumo: "Estrutura e função do corpo saudável. A DCN de 2025 pede atividade prática na rede de saúde desde os períodos iniciais <a href=\"#ref-dcn\" class=\"cite\">[R]</a>.",
            materias: ["Anatomia geral e dos sistemas", "Histologia e embriologia", "Biologia celular e bioquímica", "Início da fisiologia", "Saúde coletiva, SUS e atenção primária", "Metodologia científica"],
            treino: [["#tresd", "Atlas 3D: ache valvas, lobos e segmentos"], ["#revisao", "Fichas de anatomia por sistema"], ["#metodo", "Como estudar: teste e revisão espaçada"], ["#simulados", "Simulados 1, 2 e 6"]],
            marco: "<strong>Sem prova nacional neste ano.</strong> Crie o hábito de se testar e de espaçar a revisão. As duas técnicas rendem mais do que reler <a href=\"#ref-dunlosky\" class=\"cite\">[R]</a> <a href=\"#ref-cepeda\" class=\"cite\">[R]</a>."
        },
        {
            id: "2", botao: "2º ano", periodos: "3º e 4º períodos",
            titulo: "Como a doença acontece",
            resumo: "Do mecanismo normal ao que sai do lugar: agressão, defesa, lesão e remédio.",
            materias: ["Fisiologia e biofísica", "Neuroanatomia", "Imunologia, microbiologia e parasitologia", "Patologia geral", "Farmacologia geral", "Epidemiologia e bioestatística"],
            treino: [["#tresd", "Cérebro com 283 regiões e medula"], ["#ferramentas", "Valor preditivo: mude a prevalência"], ["#glossario", "Glossário mínimo"], ["#simulados", "Simulados 6 e 8"]],
            marco: "<strong>Misture os temas ao revisar.</strong> Treinar quadros parecidos lado a lado ajudou estudantes a acertar mais o diagnóstico de ECG <a href=\"#ref-hatala\" class=\"cite\">[R]</a>."
        },
        {
            id: "3", botao: "3º ano", periodos: "5º e 6º períodos",
            titulo: "Semiologia e a clínica por sistemas",
            resumo: "História, exame físico e raciocínio. O caso clínico passa a ser a forma de estudar.",
            materias: ["Semiologia e propedêutica", "Clínica médica por sistemas", "Patologia dos órgãos", "Farmacologia clínica", "Saúde mental", "Laboratório e imagem"],
            treino: [["#casos", "Casos clínicos passo a passo"], ["#ferramentas", "Glasgow, IMC e valor preditivo"], ["#ouvido", "Weber e Rinne"], ["#simulados", "Simulado 7"]],
            marco: "<strong>Explique para você cada achado.</strong> Na semiologia, a pergunta é sempre o porquê. Explicar o raciocínio em voz alta melhorou o diagnóstico de casos clínicos <a href=\"#ref-chamberland\" class=\"cite\">[R]</a>."
        },
        {
            id: "4", botao: "4º ano", periodos: "7º e 8º períodos",
            titulo: "Especialidades, e o primeiro Enamed",
            resumo: "Pediatria, ginecologia e obstetrícia, cirurgia e as outras áreas da clínica. É o último ano antes do internato.",
            materias: ["Pediatria e neonatologia", "Ginecologia e obstetrícia", "Clínica cirúrgica", "Neurologia", "Infectologia", "Ortopedia, otorrino e as outras especialidades do seu curso"],
            treino: [["#carreira", "Como é o Enamed"], ["#ferramentas", "Apgar, Glasgow e CURB-65"], ["#casos", "Recém-nascido, GO e trauma de crânio"], ["#simulados", "Simulados 9 e 10"]],
            marco: "<strong>Enamed, 1ª etapa:</strong> no 8º semestre, antes do internato. Essa etapa é diagnóstica e mostra onde reforçar <a href=\"#ref-enamed\" class=\"cite\">[R]</a>."
        },
        {
            id: "5", botao: "5º ano", periodos: "9º e 10º períodos",
            titulo: "Internato",
            resumo: "Estágio obrigatório em serviço, com supervisão. Pela DCN de 2025, dura no mínimo dois anos e soma pelo menos 35% da carga horária do curso <a href=\"#ref-dcn\" class=\"cite\">[R]</a>.",
            materias: ["Pelo menos 30% do internato em medicina de família e em urgência e emergência do SUS", "Os outros 70% em clínica médica, cirurgia, ginecologia e obstetrícia, pediatria e saúde mental", "Saúde coletiva, medicina intensiva e traumato-ortopedia, ao longo dos rodízios", "Plantões de até 12 horas, sem passar de 40 horas por semana"],
            treino: [["#casos", "Os doze casos do internato"], ["#ferramentas", "Glasgow, Apgar, qSOFA e CURB-65"], ["#simulados", "Simulado 9 · internato"], ["#cartas", "Cartões para o intervalo do plantão"]],
            marco: "<strong>Leve um caso por dia para casa.</strong> Escreva as dúvidas que ele deixou e responda a elas sem consulta na semana seguinte. Testar-se de novo fixa mais do que estudar de novo <a href=\"#ref-larsen\" class=\"cite\">[R]</a>."
        },
        {
            id: "6", botao: "6º ano", periodos: "11º e 12º períodos",
            titulo: "Fim do internato e a residência",
            resumo: "Os rodízios continuam, e a pergunta agora é qual especialidade seguir.",
            materias: ["Rodízios que faltam do internato", "Escolha entre 55 especialidades", "Acesso direto ou com pré-requisito", "Enare e outras seleções de residência"],
            treino: [["#carreira", "As 55 especialidades e as 64 áreas"], ["#simulados", "Os dez simulados, com cronômetro"], ["#revisao", "Fichas para a revisão final"], ["#fontes", "Diretrizes e livros originais"]],
            marco: "<strong>Enamed, 2ª etapa:</strong> no 12º semestre. A primeira nota do concluinte vai para o histórico <a href=\"#ref-enamed\" class=\"cite\">[R]</a> e é a nota do Enare no acesso direto <a href=\"#ref-enare\" class=\"cite\">[R]</a>."
        }
    ];

    var especialidades = [
        ["Acupuntura", "", 2],
        ["Alergia e imunologia", "clínica médica", 2],
        ["Anestesiologia", "", 3],
        ["Angiologia", "clínica médica", 2],
        ["Cardiologia", "clínica médica", 2],
        ["Cirurgia cardiovascular", "", 5],
        ["Cirurgia da mão", "ortopedia e traumatologia ou cirurgia plástica", 2],
        ["Cirurgia de cabeça e pescoço", "cirurgia geral ou otorrinolaringologia", 2],
        ["Cirurgia do aparelho digestivo", "cirurgia geral", 2],
        ["Cirurgia geral", "", 3],
        ["Cirurgia oncológica", "cirurgia geral", 3],
        ["Cirurgia pediátrica", "cirurgia geral", 3],
        ["Cirurgia plástica", "cirurgia geral", 3],
        ["Cirurgia torácica", "cirurgia geral", 2],
        ["Cirurgia vascular", "cirurgia geral", 2],
        ["Clínica médica", "", 2],
        ["Coloproctologia", "cirurgia geral", 2],
        ["Dermatologia", "", 3],
        ["Endocrinologia e metabologia", "clínica médica", 2],
        ["Endoscopia", "clínica médica ou cirurgia geral", 2],
        ["Gastroenterologia", "clínica médica", 2],
        ["Genética médica", "", 3],
        ["Geriatria", "clínica médica", 2],
        ["Ginecologia e obstetrícia", "", 3],
        ["Hematologia e hemoterapia", "clínica médica", 2],
        ["Homeopatia", "", 2],
        ["Infectologia", "", 3],
        ["Mastologia", "ginecologia e obstetrícia ou cirurgia geral", 2],
        ["Medicina de emergência", "", 3],
        ["Medicina de família e comunidade", "", 2],
        ["Medicina do trabalho", "", 2],
        ["Medicina do tráfego", "", 2],
        ["Medicina esportiva", "", 3],
        ["Medicina física e reabilitação", "", 3],
        ["Medicina intensiva", "", 3],
        ["Medicina legal e perícia médica", "", 2],
        ["Medicina nuclear", "", 3],
        ["Medicina preventiva e social", "", 2],
        ["Nefrologia", "clínica médica", 2],
        ["Neurocirurgia", "", 5],
        ["Neurologia", "", 3],
        ["Nutrologia", "clínica médica ou cirurgia geral", 2],
        ["Oftalmologia", "", 3],
        ["Oncologia clínica", "clínica médica", 3],
        ["Ortopedia e traumatologia", "", 3],
        ["Otorrinolaringologia", "", 3],
        ["Patologia", "", 3],
        ["Patologia clínica/medicina laboratorial", "", 3],
        ["Pediatria", "", 3],
        ["Pneumologia", "clínica médica", 2],
        ["Psiquiatria", "", 3],
        ["Radiologia e diagnóstico por imagem", "", 3],
        ["Radioterapia", "", 4],
        ["Reumatologia", "clínica médica", 2],
        ["Urologia", "cirurgia geral", 3]
    ];

    var areasAtuacao = [
        "Administração em saúde", "Alergia e imunologia pediátrica", "Angiorradiologia e cirurgia endovascular",
        "Atendimento ao queimado", "Auditoria médica", "Cardiointensivismo", "Cardiologia pediátrica",
        "Cirurgia bariátrica", "Cirurgia crânio-maxilo-facial", "Cirurgia do trauma", "Cirurgia videolaparoscópica",
        "Citopatologia", "Densitometria óssea", "Dor", "Ecocardiografia", "Ecografia vascular com doppler",
        "Eletrofisiologia clínica invasiva", "Emergência pediátrica", "Endocrinologia pediátrica",
        "Endoscopia digestiva", "Endoscopia ginecológica", "Endoscopia respiratória", "Ergometria",
        "Estimulação cardíaca eletrônica implantável", "Foniatria", "Gastroenterologia pediátrica", "Hansenologia",
        "Hematologia e hemoterapia pediátrica", "Hemodinâmica e cardiologia intervencionista", "Hepatologia",
        "Infectologia hospitalar", "Infectologia pediátrica", "Mamografia", "Medicina aeroespacial",
        "Medicina do adolescente", "Medicina do sono", "Medicina fetal", "Medicina intensiva pediátrica",
        "Medicina marítima e hiperbárica", "Medicina paliativa", "Medicina tropical", "Nefrologia pediátrica",
        "Neonatologia", "Neurofisiologia clínica", "Neurologia pediátrica", "Neurorradiologia",
        "Nutrição parenteral e enteral", "Nutrição parenteral e enteral pediátrica", "Nutrologia pediátrica",
        "Oncogenética", "Oncologia pediátrica", "Pneumologia pediátrica", "Psicogeriatria", "Psicoterapia",
        "Psiquiatria da infância e adolescência", "Psiquiatria forense",
        "Radiologia intervencionista e angiorradiologia", "Reprodução assistida", "Reumatologia pediátrica",
        "Sexologia", "Toxicologia médica", "Transplante de medula óssea",
        "Ultrassonografia em ginecologia e obstetrícia", "Ultrassonografia geral"
    ];

    function numero(valor, casas) {
        return valor.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas });
    }

    function numerarCitacoes(raiz) {
        var lista = document.querySelector("[data-refs]");
        if (!lista) return;
        var ordem = {};
        Array.prototype.forEach.call(lista.children, function (li, i) {
            if (li.id) ordem[li.id] = { n: i + 1, texto: li.textContent.replace(/\s+/g, " ").trim() };
        });
        (raiz || document).querySelectorAll("a.cite[href^='#']").forEach(function (link) {
            var ref = ordem[link.getAttribute("href").slice(1)];
            if (!ref) return;
            link.textContent = "[" + ref.n + "]";
            link.title = ref.texto.length > 180 ? ref.texto.slice(0, 177) + "…" : ref.texto;
            link.setAttribute("aria-label", "Referência " + ref.n);
        });
    }

    function initContagens() {
        var questoes = document.querySelector("[data-conta='questoes']");
        var resumo = document.querySelector("[data-conta='resumo']");
        var casos = document.querySelectorAll(".case").length;
        if (questoes) questoes.textContent = questions.length + " questões originais, em " + exams.length + " simulados.";
        if (resumo) resumo.textContent = exams.length + " simulados, " + casos + " casos e " + cards.length + " cartões";
    }

    function initAnos() {
        var picker = document.querySelector("[data-anos]");
        if (!picker) return;
        var card = picker.parentElement.querySelector(".year-card");
        var campo = function (nome) { return card.querySelector("[data-ano-" + nome + "]"); };
        var CHAVE = "medicina-ano";
        var salvo = null;
        try { salvo = localStorage.getItem(CHAVE); } catch (e) { salvo = null; }

        function preencher(lista, itens) {
            lista.innerHTML = "";
            itens.forEach(function (item) {
                var li = document.createElement("li");
                if (Array.isArray(item)) {
                    var link = document.createElement("a");
                    link.href = item[0];
                    link.textContent = item[1];
                    li.appendChild(link);
                } else {
                    li.textContent = item;
                }
                lista.appendChild(li);
            });
        }

        function mostrar(ano) {
            picker.querySelectorAll("button").forEach(function (button) {
                button.setAttribute("aria-pressed", button.getAttribute("data-ano") === ano.id ? "true" : "false");
            });
            campo("kicker").textContent = ano.botao + " · " + ano.periodos;
            campo("titulo").textContent = ano.titulo;
            campo("resumo").innerHTML = ano.resumo;
            preencher(campo("materias"), ano.materias);
            preencher(campo("treino"), ano.treino);
            campo("marco").innerHTML = ano.marco;
            numerarCitacoes(card);
        }

        anos.forEach(function (ano) {
            var button = document.createElement("button");
            button.type = "button";
            button.setAttribute("data-ano", ano.id);
            var forte = document.createElement("strong");
            forte.textContent = ano.botao;
            var sub = document.createElement("span");
            sub.textContent = ano.periodos;
            button.appendChild(forte);
            button.appendChild(sub);
            button.addEventListener("click", function () {
                mostrar(ano);
                try { localStorage.setItem(CHAVE, ano.id); } catch (e) { /* modo privado */ }
            });
            picker.appendChild(button);
        });

        mostrar(anos.filter(function (ano) { return ano.id === salvo; })[0] || anos[0]);
    }

    function initCasos() {
        document.querySelectorAll(".case").forEach(function (caso) {
            var passos = Array.prototype.slice.call(caso.querySelectorAll(".case-steps > li"));
            var respostas = passos.map(function (li) { return li.querySelector(".case-answer"); });
            var vistos = passos.map(function () { return false; });
            var aviso = document.createElement("p");
            aviso.className = "case-next";
            caso.querySelector(".case-steps").after(aviso);

            function liberar() {
                var livre = true;
                var abertos = 1;
                passos.forEach(function (li, i) {
                    li.hidden = !livre;
                    if (livre && i > 0) abertos = i + 1;
                    livre = livre && vistos[i];
                });
                if (abertos < passos.length) aviso.textContent = "Responda de cabeça e abra a resposta para liberar a pergunta " + (abertos + 1) + " de " + passos.length + ".";
                else if (!vistos[passos.length - 1]) aviso.textContent = "Última pergunta. Tenha a sua resposta antes de abrir.";
                else aviso.textContent = "Caso completo. Volte a ele daqui a alguns dias, sem olhar as respostas.";
            }

            respostas.forEach(function (detalhe, i) {
                if (!detalhe) return;
                var resumo = detalhe.querySelector("summary");
                detalhe.addEventListener("toggle", function () {
                    resumo.textContent = detalhe.open ? "Esconder resposta" : "Mostrar resposta";
                    if (detalhe.open) vistos[i] = true;
                    liberar();
                });
            });

            var pe = caso.querySelector(".case-foot");
            if (pe) {
                var reset = document.createElement("button");
                reset.type = "button";
                reset.className = "btn ghost";
                reset.textContent = "Recomeçar o caso";
                reset.addEventListener("click", function () {
                    vistos = vistos.map(function () { return false; });
                    respostas.forEach(function (detalhe) { if (detalhe) detalhe.open = false; });
                    liberar();
                });
                pe.appendChild(reset);
            }
            liberar();
        });
        initCasoFiltros();
    }

    function initCasoFiltros() {
        var botoes = document.querySelectorAll("[data-caso-filtro]");
        var casos = document.querySelectorAll("[data-casos] .case");
        var status = document.querySelector("[data-caso-status]");
        if (!botoes.length) return;
        function aplicar(filtro) {
            var vistas = 0;
            casos.forEach(function (caso) {
                var tags = (caso.getAttribute("data-caso") || "").split(/\s+/);
                var passa = filtro === "tudo" || tags.indexOf(filtro) !== -1;
                caso.hidden = !passa;
                if (passa) vistas += 1;
            });
            botoes.forEach(function (botao) {
                botao.setAttribute("aria-pressed", botao.getAttribute("data-caso-filtro") === filtro ? "true" : "false");
            });
            if (status) {
                status.textContent = filtro === "tudo"
                    ? vistas + " casos, cobrindo as áreas do internato e do Enamed."
                    : vistas + (vistas === 1 ? " caso neste filtro." : " casos neste filtro.");
            }
        }
        botoes.forEach(function (botao) {
            botao.addEventListener("click", function () {
                aplicar(botao.getAttribute("data-caso-filtro"));
            });
        });
        aplicar("tudo");
    }

    var calculos = {
        glasgow: function (f) {
            var itens = [["AO", f.o.value], ["RV", f.v.value], ["RM", f.m.value]];
            var registro = itens.map(function (item) { return item[0] + (item[1] === "NT" ? " NT" : item[1]); }).join(" ");
            var faltam = itens.filter(function (item) { return item[1] === "NT"; });
            if (faltam.length) {
                return ["Sem soma", registro + ". Com um componente não testável, registre cada parte e o motivo, como olho fechado por edema ou intubação. O total não deve ser usado."];
            }
            var total = itens.reduce(function (soma, item) { return soma + Number(item[1]); }, 0);
            var grau = total <= 8 ? "grave" : total <= 12 ? "moderado" : "leve";
            var linhas = ["Glasgow " + total, registro + ". No trauma de crânio, 3–8 é grave, 9–12 é moderado e 13–15 é leve. Aqui: " + grau + "."];
            if (f.p.value === "") linhas.push("Pupilas não avaliadas: sem GCS-P.");
            else linhas.push("GCS-P " + (total - Number(f.p.value)) + ": " + total + " menos " + f.p.value + " do escore pupilar.");
            return linhas;
        },
        apgar: function (f) {
            var total = ["cor", "fc", "irr", "tonus", "resp"].reduce(function (soma, nome) { return soma + Number(f[nome].value); }, 0);
            var faixa = total >= 7 ? "tranquilizador" : total >= 4 ? "moderadamente alterado" : "baixo";
            var linhas = ["Apgar " + total, "No 5º minuto, de 7 a 10 é tranquilizador, de 4 a 6 é moderadamente alterado e de 0 a 3 é baixo. Este resultado: " + faixa + "."];
            if (total < 7) linhas.push("Abaixo de 7 no 5º minuto, repita a nota a cada 5 minutos, até 20 minutos.");
            if (total <= 5) linhas.push("Com 5 ou menos no 5º minuto, colha gasometria arterial do cordão, se possível.");
            return linhas;
        },
        imc: function (f) {
            var peso = Number(f.peso.value);
            var metros = Number(f.altura.value) / 100;
            if (!(peso > 0) || !(metros > 0.3)) return ["—", "Digite o peso em quilos e a altura em centímetros."];
            var imc = peso / (metros * metros);
            var classe = imc < 18.5 ? "baixo peso" : imc < 25 ? "peso adequado" : imc < 30 ? "sobrepeso" : imc < 35 ? "obesidade grau I" : imc < 40 ? "obesidade grau II" : "obesidade grau III";
            return ["IMC " + numero(imc, 1), numero(peso, 1) + " kg ÷ (" + numero(metros, 2) + " m)². Em adultos, pela OMS: " + classe + "."];
        },
        preditivo: function (f) {
            var sens = Math.min(Math.max(Number(f.sens.value), 0), 100) / 100;
            var espec = Math.min(Math.max(Number(f.espec.value), 0), 100) / 100;
            var prev = Math.min(Math.max(Number(f.prev.value), 0), 100) / 100;
            var doentes = 1000 * prev;
            var sadios = 1000 - doentes;
            var vp = sens * doentes;
            var fn = doentes - vp;
            var vn = espec * sadios;
            var fp = sadios - vn;
            var vpp = vp + fp > 0 ? numero(vp / (vp + fp) * 100, 1) + "%" : "—";
            var vpn = vn + fn > 0 ? numero(vn / (vn + fn) * 100, 1) + "%" : "—";
            return [
                "VPP " + vpp,
                "VPN " + vpn + ".",
                "Em 1.000 pessoas testadas: " + numero(doentes, 0) + " doentes, " + numero(vp, 0) + " positivos verdadeiros e " + numero(fp, 0) + " falsos positivos."
            ];
        },
        qsofa: function (f) {
            var total = Number(f.fr.value) + Number(f.mental.value) + Number(f.pas.value);
            var linhas = ["qSOFA " + total];
            if (total >= 2) linhas.push("Dois ou três pontos, fora da UTI, em quem tem infecção suspeita: investigar disfunção orgânica, intensificar a vigilância e pensar em sepse. Isto não é o diagnóstico.");
            else linhas.push("Menos de dois pontos não afasta infecção grave. qSOFA é um aviso, não um teste de exclusão.");
            return linhas;
        },
        curb: function (f) {
            var total = ["conf", "ureia", "fr", "pa", "idade"].reduce(function (soma, nome) { return soma + Number(f[nome].value); }, 0);
            var faixa = total <= 1 ? "risco baixo: tratamento ambulatorial entra na conversa, se oxigenação, comorbidade e contexto permitirem" : total === 2 ? "risco intermediário: pensar em internar" : "risco alto: hospital; os mais altos pedem olhar de UTI";
            return ["CURB-65 " + total, "Na derivação original, a mortalidade em 30 dias sobe com a nota. Aqui: " + faixa + ".", "A SBPT, no Brasil, usa ureia > 50 mg/dL. O artigo de 2003 usa > 7 mmol/L. A escala não substitui a saturação nem o julgamento."];
        }
    };

    function initFerramentas() {
        document.querySelectorAll("form[data-tool]").forEach(function (form) {
            var out = form.querySelector("[data-out]");
            var calcular = calculos[form.getAttribute("data-tool")];
            if (!out || !calcular) return;
            function rodar() {
                var linhas = calcular(form.elements);
                out.innerHTML = "";
                linhas.forEach(function (texto, i) {
                    var el = document.createElement(i === 0 ? "strong" : "span");
                    el.textContent = texto;
                    out.appendChild(el);
                });
            }
            form.addEventListener("input", rodar);
            form.addEventListener("change", rodar);
            form.addEventListener("submit", function (event) { event.preventDefault(); });
            rodar();
        });
    }

    function initCarreira() {
        var corpo = document.querySelector("[data-spec]");
        var areas = document.querySelector("[data-areas]");
        if (areas) {
            areasAtuacao.forEach(function (nome) {
                var li = document.createElement("li");
                li.textContent = nome;
                if (nome === "Foniatria") li.className = "is-fono";
                areas.appendChild(li);
            });
        }
        if (!corpo) return;
        var filtro = document.querySelector("[data-spec-filtro]");
        var status = document.querySelector("[data-spec-status]");
        var tipos = document.querySelectorAll("[data-spec-tipo]");
        var tipo = "tudo";
        var diretas = especialidades.filter(function (e) { return !e[1]; }).length;

        var linhas = especialidades.map(function (e) {
            var tr = document.createElement("tr");
            var nome = document.createElement("td");
            nome.textContent = e[0];
            var acesso = document.createElement("td");
            var tag = document.createElement("span");
            tag.className = "tag " + (e[1] ? "pre" : "direto");
            tag.textContent = e[1] ? "Pré-requisito: " + e[1] : "Acesso direto";
            acesso.appendChild(tag);
            var duracao = document.createElement("td");
            duracao.textContent = e[2] + " anos";
            tr.appendChild(nome);
            tr.appendChild(acesso);
            tr.appendChild(duracao);
            corpo.appendChild(tr);
            return { tr: tr, direto: !e[1], texto: semAcento(e[0] + " " + e[1] + " " + e[2] + " anos") };
        });

        function aplicar() {
            var q = filtro ? semAcento(filtro.value.trim()) : "";
            var vistas = 0;
            linhas.forEach(function (linha) {
                var passa = (tipo === "tudo" || (tipo === "direto") === linha.direto) && (!q || linha.texto.indexOf(q) !== -1);
                linha.tr.hidden = !passa;
                if (passa) vistas += 1;
            });
            if (!status) return;
            if (!vistas) status.textContent = "Nenhuma especialidade combina com o filtro.";
            else if (vistas === linhas.length) status.textContent = linhas.length + " especialidades: " + diretas + " de acesso direto e " + (linhas.length - diretas) + " com pré-requisito.";
            else status.textContent = vistas + " de " + linhas.length + " especialidades.";
        }

        if (filtro) filtro.addEventListener("input", aplicar);
        tipos.forEach(function (button) {
            button.addEventListener("click", function () {
                tipo = button.getAttribute("data-spec-tipo");
                tipos.forEach(function (outro) { outro.setAttribute("aria-pressed", outro === button ? "true" : "false"); });
                aplicar();
            });
        });
        aplicar();
    }

    initChecks();
    initSearch();
    initLightbox();
    initQuiz();
    initCards();
    initBody();
    initFilters();
    initReading();
    initContagens();
    initAnos();
    initCasos();
    initFerramentas();
    initCarreira();
    numerarCitacoes();
    initAtlas3d();
})();
