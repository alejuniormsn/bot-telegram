const env = require("../.env");
const fs = require("fs");
const Telegraf = require("telegraf");
const Scene = require("telegraf/scenes/base");
const { Stage, Markup, session } = require("telegraf");
const { enter } = Stage;
const { login } = require("./services/loginService");
const {
  getHoleriteByMatricula,
  getDocumentDownload,
  getIsManager,
} = require("./services/RHService");
const { generatePdf } = require("./util/generatePdf");
const { greeting } = require("./util/greeting");
const { cleanNumber, reduceSize } = require("./util/convertValue");
const { getEscala } = require("./services/escalaService");
const {
  validateItem,
  dateNow,
  keepStr,
  keepStrOnlyHour,
  currency,
} = require("./util/convertValue");

const bot = new Telegraf(env.BOT_TOKEN);

//----- Botões
const buttonStart = Markup.keyboard([
  ["🔐 Efetue seu login"],
  ["🆘 Peça ajuda para nossa equipe de Atendimento"],
])
  .resize()
  .oneTime()
  .extra();

const buttonContact = {
  reply_markup: {
    keyboard: [
      [
        {
          text: "📲 Compartilhar seu número de telefone com a ETT. Esta ação é necessária para localizar sua chapa",
          request_contact: true,
        },
      ],
    ],
    one_time_keyboard: true,
  },
};

const startMenu = Markup.keyboard([
  ["🧑‍🤝‍🧑 Serviços do RH"],
  ["⏱ Consulta Escala do Motorista"],
  ["📴 Efetuar logoff"],
])
  .resize()
  .oneTime()
  .extra();

const buttonMenuRH = Markup.keyboard([
  ["📋 Segunda via do holerite"],
  ["🤕 Envio de Atestado"],
  ["📝 Envio de currículo para o RH"],
  ["📄 Envio de outros documentos para o RH"],
  ["🧐 Avaliação de Desempenho 2024"],
  ["❕ Sair"],
])
  .resize()
  .oneTime()
  .extra();

const buttonRH_SceneAvalia = Markup.keyboard([["❕ Sair"]])
  .resize()
  .oneTime()
  .extra();

//----- Scale_Scene
const Scale_Scene = new Scene("Scale_Scene");

Scale_Scene.enter(async (ctx) => {
  await ctx.reply("Sua solicitação está em processamento...");
  if (!ctx.session.user)
    return await ctx.reply("Estou com problemas, tente mais tarde.", startMenu);
  try {
    const { chapa, token } = ctx.session.user;
    const result = await getEscala(chapa, token);
    const saldo = Array.isArray(result.data.message.rel24d)
      ? currency(result.data.message.rel24d[0].saldo)
      : 0;
    if (
      Array.isArray(result.data.message.escala) &&
      result.data.message.escala.length > 0
    ) {
      result.data.message.escala.map((item, index) => {
        ctx.reply(
          `DATA: ${keepStr(item.data)}\nVEÍCULO: ${item.veiculo}\nLOCAL: ${
            item.local
          }\nLINHA: ${item.linha}\nINÍCIO: ${keepStrOnlyHour(item.inicio)}`
        );
      });
      await ctx.reply(
        `${
          saldo < 0
            ? `Você tem R$ ${saldo} de débito na conferência`
            : `Você não tem pendências`
        }`
      );
    } else {
      throw new Error();
    }
  } catch (error) {
    await ctx.reply("Não encontrei sua escala 😵");
  } finally {
    await ctx.reply("Escolha uma opção no menu:", startMenu);
  }
});

//----- Login_Scene
const Login_Scene = new Scene("Login_Scene");
Login_Scene.enter((ctx) => {
  ctx.reply(
    "Antes de qualquer coisa, preciso que você click abaixo em:\n📲 Compartilhar seu número de telefone com a ETT\npara localizarmos sua matricula.",
    buttonContact
  );
});

Login_Scene.on("contact", async (ctx) => {
  const contact = ctx.update.message.contact;
  const phone = contact.phone_number;
  try {
    const result = await login(cleanNumber(phone));
    ctx.session.user = result.data.message;
    ctx.session.isLogged = true;
    await ctx.reply(
      `Localizei você, ${reduceSize(result.data.message.nome_func)} !`
    );
    await ctx.reply(
      "Agora vou te mostrar como vamos trabalhar de forma simples e rápida 😉.\nBasta clicar no menu abaixo na tela.",
      startMenu
    );
    await ctx.scene.leave();
  } catch (error) {
    ctx.session.isLogged = false;
    ctx.reply(
      "Opa, parece que o seu telefone está incorreto 😔\nEntre em contato com a nossa equipe de RH para continuarmos a conversa.",
      buttonStart
    );
  }
});
Login_Scene.on("text", (ctx) =>
  ctx.reply(
    "Parece que estamos com problemas com as Credenciais!\nVamos tentar novamente?",
    buttonContact
  )
);
Login_Scene.on("message", async (ctx) => {
  await ctx.reply(
    `Para seguirmos, eu realmente preciso identificar você.\nVamos tentar mais uma vez, preciso que compartilhe seu telefone clicando no Botão abaixo:`
  );
  await ctx.replyWithMarkdown(
    "Caso os botões tenham desaparecido, só clicar no ícone do teclado\n*ícone do input de mensagem que parece com 4 mini-botões*",
    buttonContact
  );
});

//----- RH_Scene
const RH_Scene = new Scene("RH_Scene");

RH_Scene.enter(async (ctx) => {
  await ctx.reply("Bem vindo ao RH");
  await ctx.reply("Escolha uma das opções no menu abaixo:", buttonMenuRH);
});

RH_Scene.hears(/(.*\bSegunda via do holerite\b)/, async (ctx) => {
  await ctx.reply(
    "Preciso que me informe o mês e ano que você quer:\n(nesse formato: 012024)"
  );
});

RH_Scene.hears(/^\d{6}$/, async (ctx) => {
  const dataComp = ctx.update.message.text;
  const { chapa, token } = ctx.session.user;
  if (validateItem(dataComp)) {
    await ctx.reply("Sua solicitação está em processamento, só um instante...");
    try {
      const result = await getHoleriteByMatricula(chapa, dataComp, token);
      await ctx.reply("Ok, encontrei seu holerite");
      const pdfBuffer = await generatePdf(result.data.message);
      await ctx.replyWithDocument({
        source: pdfBuffer,
        filename: "document.pdf",
      });
    } catch (error) {
      await ctx.reply(
        "Não estou encontrando seu holerite 😵\nTente novamente com outra data ou entre em contato com a equipe de suporte para resolvermos."
      );
    }
    await ctx.reply("Escolha uma opção no menu:", buttonMenuRH);
  } else ctx.reply("Data inválida! Tente novamente...");
});

RH_Scene.hears(/(.*\bEnvio de Atestado\b)/, async (ctx) => {
  ctx.session.documentType = "atestado";
  await ctx.reply("Envie seu documento usando 📎 no input de mensagem.");
});

RH_Scene.hears(/(.*\bEnvio de outros documentos para o RH\b)/, async (ctx) => {
  ctx.session.documentType = "outros";
  await ctx.reply("Envie seu documento usando 📎 no input de mensagem.");
});

RH_Scene.hears(/(.*\bEnvio de currículo para o RH\b)/, async (ctx) => {
  ctx.session.documentType = "cv";
  await ctx.reply("Envie o currículo usando 📎 no input de mensagem.");
});

RH_Scene.on("document", async (ctx) => {
  try {
    const fileId = ctx.message.document.file_id;
    const fileName = ctx.message.document.file_name;
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const result = await getDocumentDownload(fileLink);
    const { chapa } = ctx.session.user;
    let filePath;
    switch (ctx.session.documentType) {
      case "atestado":
        filePath = `${env.SOURCE_FILE_ENF}/${chapa}_${dateNow()}_${fileName}`;
        break;
      case "outros":
      case "cv":
        filePath = `${env.SOURCE_FILE_RH}/${chapa}_${dateNow()}_${fileName}`;
        break;
      default:
        ctx.reply("Tipo de documento desconhecido.");
    }
    fs.writeFileSync(filePath, result.data);
    await ctx.reply(
      "Recebi seu arquivo.\nPode enviar mais um ou escolher uma opção no menu:",
      buttonMenuRH
    );
    delete ctx.session.documentType;
  } catch (error) {
    ctx.reply(
      "Tive um problema com o meu servidor 😵\nPor gentileza, entre em contato com a equipe de suporte para resolvermos.",
      buttonMenuRH
    );
  }
});

RH_Scene.on("photo", async (ctx) => {
  try {
    const fileId = ctx.message.photo[1].file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);
    const result = await getDocumentDownload(fileLink);
    const { chapa } = ctx.session.user;
    let fileNameComp;
    switch (ctx.session.documentType) {
      case "atestado":
        fileNameComp = `${env.SOURCE_FILE_ENF}/${chapa}_${dateNow()}.jpg`;
        break;
      case "outros":
      case "cv":
        fileNameComp = `${env.SOURCE_FILE_RH}/${chapa}_${dateNow()}.jpg`;
        break;
      default:
        ctx.reply("Tipo de documento desconhecido.");
    }
    fs.writeFileSync(fileNameComp, result.data);
    await ctx.reply(
      "Recebi seu arquivo.\nPode enviar mais um ou escolher uma opção no menu:",
      buttonMenuRH
    );
  } catch (error) {
    ctx.reply(
      "Tive um problema com o meu servidor 😵\nPor gentileza, entre em contato com a equipe de suporte para resolvermos.",
      buttonMenuRH
    );
  }
});

RH_Scene.on("video", (ctx) => {
  ctx.reply(
    "Recebi seu arquivo, porém este tipo de arquivo não é permitido.",
    buttonMenuRH
  );
});

const RH_SceneAvalia = new Scene("RH_SceneAvalia");

RH_Scene.hears(/.*\bAvaliação de Desempenho 2024\b/, enter("RH_SceneAvalia"));

RH_Scene.hears(/.*\bSair\b/i, async (ctx) => {
  await ctx.scene.leave();
  await ctx.reply(
    "Escolha uma das opções,no menu abaixo, pra eu te ajudar.",
    startMenu
  );
});

//----- SubScene RH_SceneAvalia
RH_SceneAvalia.enter(async (ctx) => {
  await ctx.reply("Vamos iniciar a Avaliação de Desempenho 2024");
  await ctx.reply("Informe o período da Avaliação:\n(Ex. 2024)");
});

RH_SceneAvalia.hears(/^\d{4}$/, async (ctx) => {
  const period = ctx.update.message.text;
  await ctx.reply(`Período: ${period}`);
});

RH_SceneAvalia.hears(/.*\bSair\b/i, async (ctx) => {
  await ctx.scene.leave();
  ctx.scene.enter("RH_Scene"); // Retornar à cena RH_Scene
});

RH_SceneAvalia.on("text", (ctx) =>
  ctx.reply(
    "Precisamos nos entender melhor...\nVamos tentar novamente...\nSiga a instrução conforme solicitado.",
    buttonRH_SceneAvalia
  )
);

RH_Scene.on("message", (ctx) => {
  ctx.replyWithMarkdown(
    "Para seguirmos, eu realmente preciso que você *siga a instrução conforme solicitado*",
    buttonRH_SceneAvalia
  );
});

RH_Scene.on("text", (ctx) =>
  ctx.reply(
    "Precisamos nos entender melhor...\nVamos tentar novamente, escolha uma opção do menu.",
    buttonMenuRH
  )
);

RH_Scene.on("message", (ctx) => {
  ctx.replyWithMarkdown(
    "Para seguirmos, eu realmente preciso que você *utilize o menu*.\nCaso os botões tenham desaparecido, só clicar no ícone do teclado\n*ícone do input de mensagem que parece com 4 mini-botões*",
    buttonMenuRH
  );
});

const stage = new Stage([Login_Scene, Scale_Scene, RH_Scene, RH_SceneAvalia]);

bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  await ctx.reply(
    `${greeting()}, ${
      ctx.update.message.from.first_name
    }, seja bem-vindo (a)! 🎉`
  );
  await ctx.reply(
    "Sou o assistente Akira e estou aqui para te ajudar a explorar todas as funcionalidades e serviços da ETT.\nPara iniciar seu atendimento, escolha a opção 🔐 Efetue seu login",
    buttonStart
  );
});

bot.hears(/.*\bEfetue seu login\b/, enter("Login_Scene"));
bot.hears(/.*\bServiços do RH\b/, enter("RH_Scene"));
bot.hears(/.*\bEscala do Motorista\b/, enter("Scale_Scene"));

bot.hears(/(.*\bequipe de Atendimento\b)/, (ctx) =>
  ctx.replyWithMarkdown(
    "🚍 Atendimento ETT\n☎ tel: (11) 4167–7000 ramal: 117\n📲 WhatsApp: (11) 4747-0277\nou ainda pelo nosso 🌎 [site ETT:](https://ettcarapicuiba.com.br/contato/)",
    buttonStart
  )
);

bot.hears(/.*\bEfetuar logoff\b/, (ctx) => {
  ctx.reply(
    "Espero que você tenha encontrado tudo o que precisa.\nSe tiver alguma dúvida ou precisar de assistência não hesite em me chamar.\nEstarei aqui para te ajudar, até logo! 😊🚀",
    buttonStart
  );
  ctx.session.isLogged = false;
});

bot.hears(/^(\/start)?(?!\/start).*/i, (ctx) => {
  ctx.session.isLogged
    ? ctx.reply(
        "Escolha uma das opções,no menu abaixo, pra eu te ajudar.",
        startMenu
      )
    : ctx.reply(
        `${greeting()}, ${
          ctx.update.message.from.first_name
        }\nEscolha uma opção no menu abaixo para iniciarmos...`,
        buttonStart
      );
});
bot.on("message", (ctx) => ctx.reply(`Apenas texto, por favor!`));

bot.startPolling();
