import { convertEmail } from './utils';
import { Email } from './zod';

export const sendEmail = async (email: Email) => {
  const mcEmail = convertEmail(email);

  // send email through MailChannels
  const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(mcEmail),
  });

  // check if email was sent successfully
  if (resp.status > 299 || resp.status < 200) {
    throw new Error(`Error sending email: ${resp.status} ${resp.statusText}`);
  }
};