export type Bindings = {
	TOKEN: string;
	DKIM_PRIVATE_KEY: string;
	DKIM_DOMAIN: string;
};

export type MCContact = { email: string; name: string | undefined };

export type MCContent = { type: string; value: string };

export type MCPersonalization = { to: MCContact[] };

export type MCEmail = {
	personalizations: MCPersonalization[];
	from: MCContact;
	reply_to: MCContact | undefined;
	cc: MCContact[] | undefined;
	bcc: MCContact[] | undefined;
	subject: string;
	content: MCContent[];
};
