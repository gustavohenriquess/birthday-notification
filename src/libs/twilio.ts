const twilio = require("twilio");
const twilioAccount = "AC2856817495869b6dff5de6da5527aad9";
const twilioToken = "0d7af05e0c55123e95673130e62d221a";

const client = new twilio(twilioAccount, twilioToken);
// const client = require("twilio")(twilioAccount, twilioToken);

export async function sendWhatsapp() {
  const message = await client.messages.create({
    body: "Your appointment is coming up on July 21 at 3PM",
    from: "whatsapp:+14155238886",
    to: "whatsapp:+5511954838418",
  });
  console.log(message);
}
