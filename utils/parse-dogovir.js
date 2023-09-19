const fs = require("fs").promises;
const { parse } = require("date-fns");
const ukLocale = require("date-fns/locale/uk");
const { utcToZonedTime } = require("date-fns-tz");
const pdfParse = require("pdf-parse");
const { addNumberDogovirToDB } = require("../services/servise-archive");

const parseDogovir = async (tempUploadPDF, id) => {
  try {
    const data = await fs.readFile(tempUploadPDF);
    const parseData = await pdfParse(data);
    const afterParsePDF = {};
    const textPDF = parseData.text.trim();

    const regexNumber = /ДОГОВІР No (\d+)/;
    const matchNumber = textPDF.match(regexNumber);
    if (matchNumber) {
      const value = matchNumber[1];
      afterParsePDF["numberDogovir"] = Number(value);
    } else {
      afterParsePDF["numberDogovir"] = "";
    }

    const regexDateDogovir = /Цей договір набирає чинності з (.+?) р. та діє /;
    const matchDateDogovir = textPDF.match(regexDateDogovir);
    if (matchDateDogovir) {
      const value = matchDateDogovir[1];
      const date = parse(value, "dd MMMM yyyy", new Date(), {
        locale: ukLocale,
      });
      const targetTimeZone = "Europe/Kiev";
      const zonedDate = utcToZonedTime(date, targetTimeZone, {
        locale: ukLocale,
      });
      zonedDate.setMinutes(
        zonedDate.getMinutes() - zonedDate.getTimezoneOffset()
      );
      afterParsePDF["dateDogovir"] = zonedDate;
    } else {
      afterParsePDF["dateDogovir"] = "";
    }

    const regexNumberForAct = /\(договір  No (\d+)\s+від/;
    const matchForAct = textPDF.match(regexNumberForAct);
    if (matchForAct) {
      const value = matchForAct[1];
      afterParsePDF["numberDogovirForAct"] = Number(value);
    } else {
      afterParsePDF["numberDogovirForAct"] = "";
    }

    const regexDateAct = /від (.+)/;
    const matchDateAct = textPDF.match(regexDateAct);
    if (matchDateAct) {
      const value = matchDateAct[1];
      const date = parse(value, "dd MMMM yyyy", new Date(), {
        locale: ukLocale,
      });
      const targetTimeZone = "Europe/Kiev";
      const zonedDate = utcToZonedTime(date, targetTimeZone, {
        locale: ukLocale,
      });
      zonedDate.setMinutes(
        zonedDate.getMinutes() - zonedDate.getTimezoneOffset()
      );
      afterParsePDF["dateAct"] = zonedDate;
    } else {
      afterParsePDF["dateAct"] = "";
    }

    const regexNumberForRachunok = /\(Рахунок\s+No\s+(.*)\s+від/;
    const matchForRachunok= textPDF.match(regexNumberForRachunok);
    if (matchForRachunok) {
      const value = matchForRachunok[1];
      afterParsePDF["numberRachunok"] = value.trim();
    } else {
      afterParsePDF["numberRachunok"] = "";
    }
   
    console.log("Парсінг .pdf файлу успішно завершено");

    await addNumberDogovirToDB(afterParsePDF, id);
  } catch (error) {
    console.log("Ошибка:", error.message);
  }
};

module.exports = parseDogovir;
