import * as AWS from "aws-sdk";
import { readFileSync } from "fs";
import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
const path = require("path");
const url = require("url");

const func = async () => {
  const s3 = new AWS.S3();

  const bucketName = "birthday-repository";
  const { file, fileName } = await readFile("birthday.csv");

  // Verifica se o bucket existe
  // ARRUMAR ISSO
  // await s3
  //   .headBucket({ Bucket: bucketName }, async (err, data) => {
  //     console.log("entrou no headBucket");
  //     if (err) {
  //       console.log("entrou no erro");
  //       await s3
  //         .createBucket({
  //           Bucket: bucketName,
  //         })
  //         .promise();
  //     }
  //   })
  //   .promise();

  await s3
    .putObject({
      Bucket: bucketName,
      Key: fileName,
      Body: file,
      ACL: "public-read",
      ContentType: "application/csv",
    })
    .promise();

  return formatJSONResponse({
    message: `File Uploaded to S3`,
  });
};

async function readFile(fileName: string): Promise<{
  file: Buffer;
  fileName: string;
}> {
  const filePath = url.pathToFileURL(
    path.join(__dirname, `../../../../../${fileName}`)
  );
  const file = readFileSync(filePath);

  return {
    file,
    fileName,
  };
}

export const main = middyfy(func);
