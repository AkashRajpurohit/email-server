import { MCContact, MCContent, MCEmail, MCPersonalization } from './types';
import { Contact, Email } from './zod';

export const convertEmail = (email: Email) => {
  const personalizations: MCPersonalization[] = [];

  // Convert 'to' field
  const toContacts: MCContact[] = convertContacts(email.to);
  personalizations.push({ to: toContacts });

  let replyTo: MCContact | undefined = undefined;
  let bccContacts: MCContact[] | undefined = undefined;
  let ccContacts: MCContact[] | undefined = undefined;

  // Convert 'replyTo' field
  if (email.replyTo) {
    const replyToContacts: MCContact[] = convertContacts(email.replyTo);
    replyTo =
      replyToContacts.length > 0
        ? replyToContacts[0]
        : { email: '', name: undefined };
  }

  // Convert 'cc' field
  if (email.cc) {
    ccContacts = convertContacts(email.cc);
  }

  // Convert 'bcc' field
  if (email.bcc) {
    bccContacts = convertContacts(email.bcc);
  }

  const from: MCContact = convertContact(email.from);

  // Convert 'subject' field
  const subject: string = email.subject;

  // Convert 'text' field
  const textContent: MCContent[] = [];
  if (email.text) {
    textContent.push({ type: 'text/plain', value: email.text });
  }

  // Convert 'html' field
  const htmlContent: MCContent[] = [];
  if (email.html) {
    htmlContent.push({ type: 'text/html', value: email.html });
  }

  const content: MCContent[] = [...textContent, ...htmlContent];

  return {
    personalizations,
    from,
    cc: ccContacts,
    bcc: bccContacts,
    reply_to: replyTo,
    subject,
    content,
  } as MCEmail;
};

export const convertContacts = (contacts: Contact | Contact[]) => {
  if (!contacts) {
    return [];
  }

  const contactArray: Contact[] = Array.isArray(contacts)
    ? contacts
    : [contacts];
  const convertedContacts: MCContact[] = contactArray.map(convertContact);

  return convertedContacts;
};

export const convertContact = (contact: Contact) => {
  if (typeof contact === 'string') {
    return { email: contact, name: undefined };
  }

  return { email: contact.email, name: contact.name } as MCContact;
};
