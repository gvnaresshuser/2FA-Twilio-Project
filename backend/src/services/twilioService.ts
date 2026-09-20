import twilio from "twilio";

import { env } from "../config/env.js";

const client = twilio(
  env.twilioAccountSid,
  env.twilioAuthToken,
);

//USE THIS FOR DEVELOPMENT
export const sendSms = async (
  to: string,
): Promise<void> => {
  await client.messages.create({
    body: "sms_2fa",
    from: env.twilioPhoneNumber,
    to,
  });
};
/*
//USE THIS FOR PRODUCTION
export const sendSms = async (
  to: string,
  message: string,
): Promise<void> => {
  await client.messages.create({
    body: message,
    from: env.twilioPhoneNumber,
    to,
  });
};
*/