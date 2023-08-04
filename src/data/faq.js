export const questions = [
  {
    id: 1,
    title: "Quais são os requisitos mínimos que o meu dispositivo precisa ter para usar a Microdigo Code?",
    response: "Você não precisa ter uma configuração específica de dispositivo. Por ser uma plataforma online basta estar conectado à uma rede de internet e possuir um navegador/browser (Aconselhamos você utilizar a versão mais atual do navegador Google Chrome).",
    category: "Usabilidade",
    anchorManual: ''
  },
  {
    id: 2,
    title: "Em quais dispositivos eu posso acessar a Microdigo Code?",
    response: "Você pode acessar a plataforma usando, por exemplo, smartphone, tablet ou computador. Basta que o disposivo tenha acesso à internet e que possua um navegador/browser (Aconselhamos você utilizar a versão mais atual do navegador Google Chrome).",
    category: "Usabilidade",
    anchorManual: ''
  },
  {
    id: 3,
    title: "Onde eu encontro instruções para usar a plataforma Microdigo Code? ",
    response: "Temos o manual em vídeo, em PDF para baixar e disponível para leitura na web. Algumas perguntas do FAQ oferecem um resumo da resposta e direciona você para o vídeo que está relacionado com a sua necessidade. Você pode acessar todos os vídeos gratuitamente na nossa plataforma do Youtube na Playlist Microdigo em https://www.youtube.com/@digo.edtech. Você também pode baixar o manual completo em formato PDF em <link> ou acessar https://<> e acessar o manual online. ",
    category: "Usabilidade",
    anchorManual: ''
  },
  {
    id: 4,
    title: "Como faço para salvar o meu projeto?",
    response: "Até o momento (agosto/2023) não é possível salvar os seus projetos na plataforma, mas já estamos cuidando disso!",
    category: "Usabilidade",
    anchorManual: ''
  },
  {
    id: 5,
    title: "O que é Microdigo Code?",
    response: "É uma plataforma educacional que combina hardware e recursos educacionais , permitindo que você explore os conceitos de maneira prática e divertida.",
    category: "Usabilidade",
    anchorManual: "introdução"
  },
  {
    id: 6,
    title: "O que é a interface da plataforma? ",
    response: "É o layout intuitivo projetado para facilitar sua navegação e maximizar sua experiência de aprendizado. Nesta tela você verá o cabeçalho, a barra lateral com uma variedade de componentes e ferramentas e o painel de montagem, onde você construirá seus projetos. ",
    category: "Interface",
    anchorManual: "#interface"
  },
  {
    id: 7,
    title: "Como faço para navegar pelos componentes?",
    response: "À esquerda, temos a barra lateral, onde você encontrará colunas: A primeira é onde selecionamos o tipo de componente que será usado, a segunda coluna exibe uma lista de elementos relacionados ao tipo que foi escolhido na primeira coluna. Esta seção é onde você pode selecionar e arrastar os elementos necessários para a criação de um projeto. ",
    category: "Barra Lateral",
    anchorManual: "#barra_lateral"
  },
  {
    id: 8,
    title: "Quais os tipos de componentes que eu posso utilizar?",
    response: "Na primeira coluna da barra lateral os componentes são agrupados em cinco conjuntos: os de entrada, de saída, os condicionais, para eventos e de hardware. ",
    category: "Barra Lateral",
    anchorManual: "#barra_lateral"
  },
  {
    id: 9,
    title: "O que são os componentes de entrada?",
    response: "Os componentes de entrada permitem a comunicação por meio da inserção de dados, assim, algum tipo de informação precisa ser fornecido, sejam humanas ou não. Botões ou sensores de temperatura são exemplos de componentes de entrada. ",
    category: "Componentes",
    anchorManual: "#tipos_de_componentes"
  },
  {
    id: 10,
    title: "O que são os componentes de saída?",
    response: "Os componentes de saída permitem a comunicação no sentido de obter resultados, então exibem uma resposta após certa operação ser concluída. Buzzer e LEDs são exemplos de componentes de saída.",
    category: "Componentes",
    anchorManual: "#tipos_de_componentes"
  },
  {
    id: 11,
    title: "O que são os componentes de condicionais?",
    response: "Os componentes condicionais são encontrados somente no ambiente virtual e nunca como um dispositivo físico. São usados para processar e tratar informações recebidas pelos componentes de entrada e as entregando para os componentes de saída. ",
    category: "Componentes",
    anchorManual: "#tipos_de_componentes"
  },
  {
    id: 12,
    title: "O que são os componentes de evento?",
    response: "E os componentes de evento, assim como os componentes condicionais, são encontrados exclusivamente no ambiente virtual. São dos mais variados tipos, recebendo e passando informações. Podem esperar uma certa quantidade de segundos antes de transmitir o dado ou mudar a cor de um LED RGB. ",
    category: "Componentes",
    anchorManual: "#tipos_de_componentes"
  },
  {
    id: 13,
    title: "O que são componentes de hardware?",
    response: "stes componentes de hardware, também chamados de endpoints, variam entre componentes de entrada e saída, e serão aqueles que possuem correspondentes físicos, podendo ser manuseados e, por meio da plataforma, interagem com outros dispositivos, virtuais ou não.",
    category: "Componentes",
    anchorManual: "#tipos_de_componentes"
  },
  {
    id: 14,
    title: "O que é o painel de montagem?",
    response: "No centro da tela encontra-se o painel de montagem, onde você construirá seus projetos. Aqui, você terá uma visão clara dos componentes selecionados, poderá realizar conexões e ajustar configurações específicas para o seu experimento. \nNesse espaço também é possível encontrar, na parte direita inferior, os botões de zoom e FAQ. ",
    category: "Painel de montagem",
    anchorManual: "#painel_de_montagem"
  },
  {
    id: 15,
    title: "O que são fluxos?",
    response: "Ao adicionar componentes no painel de montagem, será montado um fluxo pelo usurário. Após a criação da lógica, o usuário deve passar um dado ao computador que será processado e então devolvido. Um fluxo sempre se iniciará a partir de um componente de entrada e terminará em um de saída. ",
    category: "Painel de montagem",
    anchorManual: "#fluxos_conectores_conexoes"
  },
  {
    id: 16,
    title: "Como as conexões e os conectores dos componentes funcionam?",
    response: "Quando um componente for arrastado ao painel de montagem ele terá um conector, representado por um pequeno ponto ao lado direito, esquerdo ou em ambos os lados, e é por meio deles que serão feitas as conexões. Um conector à direita tem função de transmitir algum dado, enquanto um à esquerda irá recebe-lo. Os fluxos serão montados a partir da junção desses conectores. ",
    category: "Painel de montagem",
    anchorManual: "#fluxos_conectores_conexoes"
  },
  {
    id: 17,
    title: "Como eu aumento ou diminuo o tamanho dos componentes na tela? ",
    response: "Para aumentar ou diminuir o tamanho dos componentes na tela ou quando se deseja ter uma vista mais próxima ou mais longe do seu projeto você deve usar o botão de zoom. O botão de zoom, no canto direito inferior da tela, ao ser selecionado, mostrará um slider à direita da interface. Ao arrastá-lo é possível aproximar ou afastar os componentes.",
    category: "Painel de montagem",
    anchorManual: "#zoom_faq"
  },
  {
    id: 18,
    title: "O que é o FAQ (perguntas frequentes) e como usa-lo?",
    response: "Ao lado do botão de zoom, no canto direito inferior da tela, temos o botão de FAQ. Nele é possível encontrar perguntas e respostas para sanar possíveis dúvidas em relação ao funcionamento da plataforma. ",
    category: "Painel de montagem",
    anchorManual: "#zoom_faq"
  },
  {
    id: 19,
    title: "O que é possível fazer com a Microdigo Code? ",
    response: "A plataforma Microdigo Code te ajuda a aprender a programar por meio de projetos utilizando fluxos lógicos. As funções disponíveis em nossa plataforma são: adicionar componentes ao painel de montagem, criar conexões, excluir conexões e componentes, manusear os fluxos criados e conectar dispositivos físicos. ",
    category: "Usabilidade",
    anchorManual: "#usando_plataforma_microdigo"
  },
  {
    id: 20,
    title: "Como eu adiciono componentes ao painel de montagem para montar os meus projetos?",
    response: "Na barra lateral esquerda selecione, através dos botões circulares, qual o tipo de componente você deseja utilizar. Em seguida, na lista de componentes do tipo selecionado, escolha qual será usado. Clique no elemento, arraste e solte-o no painel de montagem. Depois de inserido na tela é possível reposicioná-lo como necessário.",
    category: "Painel de montagem",
    anchorManual: "#adicionando_componentes_ao_painel_montagem"
  },
  {
    id: 21,
    title: "Como eu faço para criar conexões entre os componentes?",
    response: "Para criar conexões, certifique-se que de há, pelo menos, dois componentes com conectores de tipos diferentes na tela. Se adicionado um componente de entrada, por exemplo, é possível acrescentar uma condicional ou um componente de saída. \nAo clicar em um conector, surgirá uma linha amarela. Para criar a conexão, arraste o cursor e solte a linha amarela sobre o conector do segundo componente. Caso queira cancelar a ação, basta soltar a linha amarela em qualquer espaço vazio do painel de montagem. Atenção: Alguns componentes não podem ser conectados com outros, como, por exemplo, um componente de entrada com outro componente de entrada. Alguns componentes são dedicados como, por exemplo, o componente de evento \"pick color\" somente se conecta ao componente de saída \"LED RGB\"",
    category: "Componentes",
    anchorManual: "#criando_conexoes"
  },
  {
    id: 22,
    title: "Como faço para excluir uma conexão ou um componente?",
    response: "Para excluir uma conexão, clique sobre a linha amarela que deseja excluir, isso fará aparecer um botão vermelho de exclusão. Isso fará com que a conexão seja apagada. Caso queira cancelar a ação de excluir uma conexão, basta clicar sobre a linha amarela novamente. \nPara apagar componentes que estejam no painel de montagem, clique no dispositivo que deseja excluir, basta arrastá-lo para a barra lateral e soltar. Outra forma de apagar um componente é clicando sobre ele e, em seguida, no símbolo de lixeira que aparecerá à esquerda superior. Confirme a exclusão apertando o botão “confirmar” na janela que aparecerá em sua tela. ",
    category: "Componentes",
    anchorManual: "#excluindo_conexoes_componentes"
  },
  {
    id: 23,
    title: "Como faço para criar um fluxo?",
    response: "Os fluxos permitem que você projete sequências de ações e interações entre os componentes. Para criar um fluxo, arraste até o painel de montagem os componentes desejados, sendo necessário que um deles seja um componente de entrada e um de saída. Organize os elementos em sua tela da forma que deseja e crie as conexões, iniciando com o componente de entrada e finalizando com o componente de saída. ",
    category: "Painel de montagem",
    anchorManual: "#criando_fluxos"
  },
  {
    id: 24,
    title: "Como faço para utilizar os dispositivos virtuais de entrada e saída?",
    response: "Caso haja um componente de entrada virtual em um determinado fluxo, ele poderá ter seu valor alterado através da plataforma. Acima dele haverá um botão de correr, o qual possibilita a mudança do valor. ",
    category: "Painel de montagem",
    anchorManual: "#manuseando_fluxos_criados"
  },
  {
    id: 25,
    title: "Como uitlizo dispositivo físicos?",
    response: "Para utilizar dispositivos físicos (hardware) você precisa ter um dos kits da microdigo. Para configurar os seus hardwares, você pode utilizar o manual que acompanha o seu kit. A plataforma Microdigo Code oferece a possibilidade de conectar dispositivos físicos, integrando componentes do mundo real ao seu projeto, e observando o impacto das ações virtuais no ambiente físico. \nPara isso, tenha em mãos o dispositivo físico que será conectado, clique no botão “connect” e ao fim do pareamento uma janela de configuração aparecerá em sua tela. Preencha os campos com o nome e a cor desejados para o dispositivo e selecione o sensor que estará ligado a ele. Para finalizar, clique em salvar. ",
    category: "Hardware",
    anchorManual: ''
  }
]
