import * as AWS from "aws-sdk";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";

const func = async () => {
  console.log("Starting birthday alert");
  let file = await getFile();
  let data = treatData(file.Body.toString());
  let birthdays = {};

  data.forEach((person: any) => {
    if (isHisBirthday(person.birthday)) {
      person.age = getOld(new Date(person.birthday).getFullYear());
      person.group.forEach((group: string) => {
        if (birthdays[group]) birthdays[group]["person"].push(person);
        else birthdays[group] = { person: [person] };
      });
    }
  });

  Object.keys(birthdays).map((group) => {
    birthdays[group]["person"].forEach((person: any) => {
      if (!birthdays[group]["message"])
        birthdays[group][
          "message"
        ] = `Os aniversariantes do(s) ${group} do dia são: \n\n`;

      birthdays[group]["message"] += `-  ${formatDate(
        new Date(person.birthday)
      )}: ${person.name} - ${person.age} anos\n`;
    });
  });

  Object.keys(birthdays).map((group) => {
    sendWhatsappMessage(birthdays[group]["message"], group);
  });

  return formatJSONResponse({
    message: `Birthday alert sent`,
    birthdays,
  });
};

async function getFile() {
  const s3 = new AWS.S3();

  const params = {
    Bucket: "birthday-repository",
    Key: "birthday.csv",
  };

  return await s3
    .getObject(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        throw new Error(err.message);
      } else {
        return data.Body;
      }
    })
    .promise();
}

function treatData(data: string) {
  let file: string[] | object[] = data.split("\n");
  file.shift();
  file = file.map((line: string) => {
    let data = line.replace("\r", "").split(";");
    return {
      birthday: data[0],
      name: data[1],
      group: data[2].split(" "),
    };
  });
  return file;
}

function isHisBirthday(bdDate: string) {
  const birthday = new Date(bdDate);
  const date = new Date();

  const formattedBirthday = formatDate(birthday);
  const formattedDate = formatDate(date);

  return formattedBirthday === formattedDate;
}

function getOld(year: number) {
  const date = new Date();
  return date.getFullYear() - year;
}

function formatDate(date: Date) {
  console.log();
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });

  return formatter.format(date);
}

async function sendWhatsappMessage(message: string, group: string) {
  console.log(message, group);
  console.log("-----");
}

export const main = middyfy(func);
