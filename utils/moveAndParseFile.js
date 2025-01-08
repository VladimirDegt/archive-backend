const fs = require('fs/promises');
const path = require('path');
const pdfParse = require('pdf-parse');
const {parse} = require("date-fns");
const ukLocale = require("date-fns/locale/uk");
const {utcToZonedTime} = require("date-fns-tz");

const tempDir = path.join(__dirname, "../", "temp");
const publicDir = path.join(__dirname, "../", "public", "files");

async function moveAndParseFile(file) {
    try {
        const tempFilePath = path.join(tempDir, file.filename);
        const publicFilePath = path.join(publicDir, file.filename);

        // Перемещаем файл из temp в public/file
        await fs.rename(tempFilePath, publicFilePath);

        // Читаем файл
        const data = await fs.readFile(publicFilePath);

        // Парсим PDF
        const parseData = await pdfParse(data);
        const afterParsePDF = {};
        const textPDF = parseData.text.trim();

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

        const regexDateSigning = /Час перевірки.+(\d{2}.\d{2}.\d{4})/;
        const lines = textPDF.split('\n');
        let lastMatch = null;

        for (const line of lines) {
            const match = regexDateSigning.exec(line);
            if (match) {
                lastMatch = match;
            }
        }

        if (lastMatch) {
            const value = lastMatch[1];
            const date = parse(value, "dd.MM.yyyy", new Date(), {
                locale: ukLocale,
            });
            const targetTimeZone = "Europe/Kiev";
            const zonedDate = utcToZonedTime(date, targetTimeZone, {
                locale: ukLocale,
            });
            zonedDate.setMinutes(
                zonedDate.getMinutes() - zonedDate.getTimezoneOffset()
            );
            afterParsePDF["dateSigning"] = zonedDate;
        } else {
            afterParsePDF["dateSigning"] = "";
        }

        console.log("Парсінг .pdf файлу успішно завершено");

        // Возвращаем результат парсинга
        return { afterParsePDF };
    } catch (error) {
        console.error('Error moving or parsing file:', error);
        throw error;
    }
}

module.exports = moveAndParseFile;