const puppeteer = require("puppeteer");
const { currency, formatDate, formatDateComp } = require("./convertValue");
// const fs = require("fs");

const generatePdf = async (data) => {
  let browser;
  try {
    const detailsForm = () => {
      let details = "";
      data.description.forEach((e) => {
        const item = `<div class="flex-container">
            <div
              class="flex-item"
              style="width: 30px"
            >
              <span>${e.codOp}</span>
            </div>
            <div
              class="flex-item"
              style="width: 300px"
            >
              <span>${e.history}</span>
            </div>
            <div
              class="flex-item text-end"
              style="width: 45px"
            >
              <span>${e.ref ? currency(e.ref) : ""}</span>
            </div>
            <div
              class="flex-item text-end"
              style="width: 135px"
            >
              <span>${e.codOp == 1 ? currency(e.valor) : ""}</span>
            </div>
            <div
              class="flex-item text-end"
              style="width: 110px"
            >
              <span>${e.codOp == 2 ? currency(e.valor) : ""}</span>
            </div>
          </div>
          `;
        details = details + item;
      });
      return details;
    };

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    const htmlContent = `
        <html>
          <head>
            <style>
              @page {
                size: A4;
                margin: 0;
              }
              .page {
                width: 190mm;
                height: 280mm;
                margin: 20px;
                position: relative;
                background: #fff;
              }
              .line {
                position: absolute;
                border: 1px solid #000;
                box-sizing: border-box;
              }
              .line-horizontal {
                width: 100%;
                height: 1px;
              }
              .line-vertical {
                width: 1px;
                height: 400px;
              }
              .line-vertical-tall {
                height: 500px;
              }
              .line-vertical-short {
                height: 92px;
              }
              .flex-container {
                display: flex;
                flex-direction: row;
              }
              .flex-container.space-around {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
              }
              .flex-container.column {
                flex-direction: column;
              }
              .flex-item {
                padding: 0 10px;
              }
              .text-end {
                text-align: end;
              }
              p {
                margin: 0;
                margin-left: 10px;
              }
              span {
                font-family: "Courier New", Courier, monospace;
                font-size: small;
              }
              .margin-top-20 {
                margin-top: 20px;
              }
              .margin-top-12 {
                margin-top: 12px;
              }
              .margin-top-10 {
                margin-top: 10px;
              }
              .margin-top-5 {
                margin-top: 5px;
              }
              .margin-left-10 {
                margin-left: 10px;
              }
              .margin-left-15 {
                margin-left: 15px;
              }
              .margin-left-255 {
                margin-left: 255px;
              }
              .margin-left-50 {
                margin-left: 50px;
              }
              .margin-left-80 {
                margin-left: 80px;
              }
              .margin-left-20 {
                margin-left: 20px;
              }
              .margin-left-35 {
                margin-left: 35px;
              }
              .margin-left-380 {
                margin-left: 380px;
              }
              .margin-left-480 {
                margin-left: 480px;
              }
            </style>
          </head>
          <body>
            <div class="page">
              <div
                class="line line-horizontal"
                style="top: 0; left: 0"
              >
                <p class="margin-top-10">
                  <span
                    >RECIBO DE PAGAMENTO DE SALÁRIO - 001 - EMPRESA DE TRANSPORTES E
                    TURISMO CARAPICUIBA LTDA.</span
                  >
                </p>
                <p class="margin-top-5">
                  <span>CNPJ: 73.056.459/0001-80 - PERÍODO: ${formatDateComp(
                    data.dataCompet
                  )}</span>
                </p>
              </div>
              <div
                class="line line-horizontal"
                style="top: 55px; left: 0"
              >
                <p class="margin-top-10"><span>Código - Nome do funcionário</span></p>
                <p>
                  <span>${data.matricula} - ${data.nome}</span>
                  <span class="margin-left-50">${data.cpf}</span>
                  <span class="margin-left-80">${data.func}</span>
                </p>
              </div>
              <div
                class="line line-horizontal"
                style="top: 110px; left: 0"
              >
                <p class="margin-top-5">
                  <span>COD.</span>
                  <span class="margin-left-15">DESCRIÇÃO</span>
                  <span class="margin-left-255">REF.</span>
                  <span class="margin-left-50">VENCIMENTOS</span>
                  <span class="margin-left-50">DESCONTOS</span>
                </p>
              </div>
              <div
                class="line line-horizontal"
                style="top: 140px; left: 0"
              ></div>
              <div style="top: 145px; position: absolute">
                ${detailsForm()}
              </div>
              <div
                class="line line-horizontal"
                style="top: 540px; left: 0"
              >
                <div class="flex-container">
                  <div
                    class="flex-container column margin-top-10"
                    style="width: 430px"
                  >
                    <span>SUA REMUNERAÇÃO É ASSUNTO CONFIDENCIAL!</span>
                    <span>EVITE A QUEBRA DE SIGILO.</span>
                  </div>
                  <div
                    class="text-end margin-top-5"
                    style="width: 140px"
                  >
                    <span>TOTAL VENCIMENTOS</span>
                    <span>${currency(data.totalVenc)}</span>
                  </div>
                  <div
                    class="text-end margin-top-5 margin-left-10"
                    style="width: 130px"
                  >
                    <span>TOTAL DESCONTOS</span>
                    <span>${currency(data.totalDesc)}</span>
                  </div>
                </div>
              </div>
              <div
                class="line line-horizontal"
                style="top: 590px; left: 430px; width: 288px"
              >
                <div class="flex-container">
                  <div
                    class="flex-item text-end margin-top-12"
                    style="width: 140px"
                  >
                    <span>VALOR LÍQUIDO >></span>
                  </div>
                  <div
                    class="flex-item text-end margin-top-12"
                    style="width: 130px"
                  >
                    <span style="font-size: medium">R$ ${currency(
                      data.totalLiqu
                    )}</span>
                  </div>
                </div>
              </div>
              <div
                class="line line-horizontal"
                style="top: 640px; left: 0"
              >
                <div class="flex-container space-around margin-top-10">
                  <div
                    class="flex-item text-end"
                    style="width: 110px"
                  >
                    <p><span>SALÁRIO BASE</span></p>
                    <span>R$ ${currency(data.salBase)}</span>
                  </div>
                  <div
                    class="flex-item text-end"
                    style="width: 90px"
                  >
                    <p><span>BASE INSS</span></p>
                    <span>R$ ${currency(data.baseInss)}</span>
                  </div>
                  <div
                    class="flex-item text-end"
                    style="width: 120px"
                  >
                    <p><span>BASE CALC FGTS</span></p>
                    <span>R$ ${currency(data.baseFgts)}</span>
                  </div>
                  <div
                    class="flex-item text-end"
                    style="width: 100px"
                  >
                    <p><span>FGTS DO MÊS</span></p>
                    <span>R$ ${currency(data.fgtsMes)}</span>
                  </div>
                  <div
                    class="flex-item text-end"
                    style="width: 120px"
                  >
                    <p><span>BASE CALC IRF</span></p>
                    <span>R$ ${currency(data.baseCalcIrf)}</span>
                  </div>
                </div>
              </div>
              <div
                class="line line-horizontal"
                style="top: 690px; left: 0"
              ></div>
              <div
                class="line line-horizontal"
                style="top: 710px; left: 0"
              >
                <p class="margin-top-10">
                  <span
                    >DECLARO TER RECEBIDO A IMPORTÂNCIA DISCRIMINADA NESTE RECIBO</span
                  >
                </p>
                <p class="margin-top-12">
                  <span class="margin-left-20">${formatDate(
                    data.dataPagto
                  )}</span>
                  <span class="margin-left-380">______________________________</span>
                </p>
                <p>
                  <span class="margin-left-35">DATA</span>
                  <span class="margin-left-380">ASSINATURA</span>
                </p>
              </div>
              <div
                class="line line-horizontal"
                style="top: 800px; left: 0"
              ></div>
              <div
                class="line line-vertical"
                style="top: 140px; left: 50px"
              ></div>
              <div
                class="line line-vertical"
                style="top: 140px; left: 370px"
              ></div>
              <div
                class="line line-vertical line-vertical-tall"
                style="top: 140px; left: 430px"
              ></div>
              <div
                class="line line-vertical line-vertical-tall"
                style="top: 140px; left: 585px"
              ></div>
              <div
                class="line line-vertical line-vertical-short"
                style="top: 710px; left: 0"
              ></div>
              <div
                class="line line-vertical line-vertical-short"
                style="top: 710px; left: 100%"
              ></div>
            </div>
          </body>
        </html>
      `;

    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: "A4" });
    // fs.writeFileSync("output.pdf", pdfBytes);
    return pdfBuffer;
  } catch (error) {
    console.error("Erro ao ler o arquivo:", error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = { generatePdf };
