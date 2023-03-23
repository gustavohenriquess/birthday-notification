# Birthday Notification

This project was created to send a message on whatsapp for one person to remember birthdays by a csv file

## Improvements

- [ ] receive file by csv route
- [ ] Add Twilio

## Lambdas

### send-alert

- Path: /send-alert
- Method: **POST**
- Response:

  ```
  {
      "message": "Birthday alert sents!"
  }
  ```

### upload-csv

- Path: /csv
- Method: **POST**
- Response:
  ```
  {
      "message": "File Uploaded to S3"
  }
  ```

## Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

[Serverless Documentation](./sls.MD)
