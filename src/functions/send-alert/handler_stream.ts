import * as AWS from "aws-sdk";
import { formatJSONResponse } from "@libs/api-gateway";
import { parse } from "csv-parse";
import { formatDate, getOld } from "src/utils/date";
import { Member } from "./@types";
import { sendWhatsapp } from "@libs/call-me-bot";
// import { sendWhatsapp } from "@libs/twilio";

const func = async () => {
  const bucketName = "birthday-repository";
  const key = "birthday.csv";
  const s3 = new AWS.S3();
  let birthdays = {};

  const stream = s3
    .getObject({
      Bucket: bucketName,
      Key: key,
    })
    .createReadStream()
    .pipe(parse({ delimiter: ";", from_line: 2 }));

  for await (const record of stream) {
    let member: Member = {
      birthday: record[0],
      name: record[1],
      group: record[2].split(" "),
      age: 0,
    };

    if (isHisBirthday(member.birthday)) {
      member["age"] = getOld(new Date(member.birthday).getFullYear());

      member.group.forEach((group: string) => {
        if (birthdays[group]) birthdays[group]["person"].push(member);
        else birthdays[group] = { person: [member] };

        if (!birthdays[group]["message"])
          birthdays[group][
            "message"
          ] = `Os aniversariantes do(s) ${group} do dia são: \n\n`;

        birthdays[group]["message"] += `-  ${formatDate(
          new Date(member.birthday)
        )}: ${member.name} - ${member.age} anos\n`;
      });
    }
  }

  Object.keys(birthdays).map((group) => {
    sendMessage(birthdays[group]["message"], group);
  });

  return formatJSONResponse({
    message: `Birthday alert sents!`,
  });
};

function isHisBirthday(bdDate: string): boolean {
  const birthday = new Date(bdDate);
  const date = new Date();

  const formattedBirthday = formatDate(birthday);
  const formattedDate = formatDate(date);

  return formattedBirthday === formattedDate;
}

function sendMessage(message: string, group: string) {
  const groups = {
    Jovens: {
      phone_key: "sound_leader_phone",
      apiKey_key: "sound_leader_key",
    },
  };

  if (!groups[group]) return;
  const { phone_key, apiKey_key } = groups[group];

  sendWhatsapp(message, { phone_key, apiKey_key });
}

export const main = func;
