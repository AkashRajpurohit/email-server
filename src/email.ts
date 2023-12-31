import { convertEmail } from './utils';
import { Email } from './zod';
import { Bindings } from './types';

export const sendEmail = async (email: Email, env: Bindings) => {
  const mcEmail = convertEmail(email, env);

  // send email through MailChannels
  const resp = await fetch('https://api.mailchannels.net/tx/v1/send', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(mcEmail),
  });

  const respJson = await resp.json();

  return {
    success: resp.status < 299 || resp.status >= 200,
    status: resp.status,
    message: resp.statusText,
    body: respJson
  }
};
