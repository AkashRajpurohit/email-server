<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/AkashRajpurohit/email-server">
    <img src="https://media.tenor.com/q-zZSTX6jSIAAAAC/mail-download.gif" alt="Sending email" width="160" height="130">
  </a>

  <h3 align="center">Email Server</h3>

  <p align="center">
    <samp>A free email proxy server powered by Mailchannels and Cloudflare Workers</samp>
    <br />
    <br />
	<p align="center">
	  <img alt="Visitors count" src="https://visitor-badge.laobi.icu/badge?page_id=@akashrajpurohit~email-server.visitor-badge&style=flat-square&color=0088cc">
	  <a href="https://twitter.com/akashwhocodes">
	    <img alt="follow on twitter" src="https://img.shields.io/twitter/follow/akashwhocodes.svg?style=social&label=@akashwhocodes">
	  </a>
	</p>
    <p align="center">
		<a href="https://blog.cloudflare.com/sending-email-from-workers-with-mailchannels/">Why free?</a>
		·
		<a href="https://github.com/AkashRajpurohit/email-server/issues/new?template=bug_report.md">Bug report</a>
		·
		<a href="https://github.com/AkashRajpurohit/email-server/issues/new?template=feature_request.md">Feature request</a>
    </p>
  </p>
</p>

<br/>

> Self host your free email proxy server powered by [MailChannels](https://blog.mailchannels.com/mailchannels-enables-free-email-sending-for-cloudflare-workers-customers) and Cloudflare Workers.

> [!WARNING]\
> Mailchannels have dropped their support for Free emails from Cloudflare workers, so this no longer works. The code will still be up but now you need a paid account on Mailchannels in order to send out emails. Read more about this on [their blog](https://support.mailchannels.com/hc/en-us/articles/26814255454093-End-of-Life-Notice-Cloudflare-Workers)

# Self Hosting Guide 📖

Self hosting this is pretty straight forward, there are two ways.

The simplest way is to use the "Deploy with Workers" button and deploy the current version of service on your Cloudflare account.

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/AkashRajpurohit/email-server)

Another way is to [fork this repository](https://docs.github.com/en/get-started/quickstart/fork-a-repo) under your own Github account which will run the `deploy-to-cf` Github action workflow.

> Note: This workflow requires some environment variables so make sure add those as mentioned below

## Environment Variables 👀

### Github Actions

Add these to the forked repository [github actions variables](https://docs.github.com/en/actions/learn-github-actions/variables).

- `CF_API_TOKEN` -> This is your Cloudflare API token which has permissions for Worker scripts.
- `CF_ACCOUNT_ID` -> This would be your Cloudflare Account ID.

### Cloudflare Worker

- `TOKEN` - Generate a random token that will be used in the "Authorization" header to make authenticated calls to your proxy server to send emails.

  <details>
    <summary>Generate random tokens quickly</summary>
    <p>Pro tip! If you just want some random string for generating the token, use this command in your linux/mac system <code>head -c 20 /dev/urandom | base64</code></p>
  </details>

Once these are added, run the workflow and you should see the service being deployed on Cloudflare workers.

## Setup SPF 🕵🏻‍♂️

SPF is a DNS record that helps prevent email spoofing. You will need to add an SPF record to your domain to allow MailChannels to send emails on your behalf. **This step is required**.

Add a `TXT` record to your domain with the following values:

| Name | Value                                           |
| ---- | ----------------------------------------------- |
| @    | v=spf1 a mx include:relay.mailchannels.net ~all |

If you already have a SPF record added for your domain, note that you cannot add another `TXT` record for spf. In such cases merge the existing SPF record with mailchannels.

For example if your current SPF record is added for zoho like this `v=spf1 include:zoho.in ~all` then append the `include:relay.mailchannels.net` to the same value.

So the new record value will be like this `v=spf1 include:zoho.in include:relay.mailchannels.net ~all`

## Domain Lockdown 🙅🏻‍♂️

Mailchannels imposes [domain lockdown](https://support.mailchannels.com/hc/en-us/articles/16918954360845-Secure-your-domain-name-against-spoofing-with-Domain-Lockdown) to avoid domain spoofing, basically this is a security check to prevent attackers from using your domain to send out emails.

To validate you own the domain from which you will be sending out the emails, you need to add this `TXT` record.

| Name            | Value                             |
| --------------- | --------------------------------- |
| _mailchannels   | v=mc1 cfid=yourdomain.workers.dev |

Replace `yourdomain` with your workers subdomain which you can find on the `Workers & Pages` section of Cloudflare

## Setup DKIM (Optional) 🏃🏻

This step is optional, but highly recommended. DKIM is a DNS record that helps prevent email spoofing. You may follow the steps listed in the [MailChannels documentation](https://support.mailchannels.com/hc/en-us/articles/7122849237389-Adding-a-DKIM-Signature) under subsection of `Creating a DKIM private and public key` and `Creating the public DNS records` to set up DKIM for your domain.

If you are setting up DKIM, then make sure you add these two additional environment variables for your worker.

1. `DKIM_DOMAIN` - This would be your email domain.
2. `DKIM_PRIVATE_KEY` - This would be the private key that you generated based on the documentation of MailChannels.

# Usage 🚀

Once you have deployed this worker function to Cloudflare Workers, you can send emails by making a `POST` request to the worker on the `/send` endpoint with the following parameters:

You need to pass an `Authorization` header with the [secure token](#cloudflare-worker). Like the following: `Authorization: TOKEN`

## Basic Email

The Most basic request would look like this:

```json
{
	"to": "john@example.com",
	"from": "me@example.com",
	"subject": "Hello World",
	"text": "Hello World"
}
```

## HTML Emails

You can also send HTML emails by adding an `html` parameter to the request. This can be used in conjunction with the `text` parameter to send a multi-part email.

```json
{
	"to": "john@example.com",
	"from": "me@example.com",
	"subject": "Hello World",
	"html": "<h1>Hello World</h1>"
}
```

## Sender and Recipient Name

You can also specify a sender and recipient name by adding a `name` parameter to the request. This can be used for both the `to` and `from` parameters.

```json
{
	"to": { "email": "john@example.com",  "name": "John Doe" },
	"from": { "email": "me@example.com", "name": "Jane Doe" },
	"subject": "Hello World",
	"text": "Hello World"
}
```

## Sending to Multiple Recipients

You may also send to multiple recipients by passing an array of emails, or an array of objects with `email` and `name` properties.

```json
{
	"to": [
		"john@example.com",
		"rose@example.com"
 	],
	"from": "me@example.com",
	"subject": "Hello World",
	"text": "Hello World"
}
```

OR

```json
{
	"to": [
		{ "email": "john@example.com", "name": "John Doe" },
		{ "email": "rose@example.com", "name": "Rose Doe" }
 	],
	"from": "me@example.com",
	"subject": "Hello World",
	"text": "Hello World"
}
```

## Sending BCC and CC

You can also send BCC and CC emails by passing an array of emails, an object with `email` and `name` properties, or an array of either, similar to the `to` parameter.

```json
{
	"to": "john@example.com",
	"from": "me@example.com",
	"subject": "Hello World",
	"text": "Hello World",
	"cc": [
		"jim@example.com",
		"rose@example.com"
	],
	"bcc": [
		"gil@example.com"
	]
}
```

## Reply To

You can also specify a reply to email address by adding a `replyTo` parameter to the request. Again, you can use an email string, an object with `email` and `name` properties, or an array of either.

```json
{
	"to": "john@example.com",
	"from": "me@example.com",
	"replyTo": "support@example.com",
	"subject": "Hello World",
	"text": "Hello World"
}
```


# Technology Stack 💻

- Framework - [Hono](https://honojs.dev/)
- Deployment - [Cloudflare Workers](https://workers.cloudflare.com/)

# Bugs or Requests 🐛

If you encounter any problems feel free to open an [issue](https://github.com/AkashRajpurohit/email-server/issues/new?template=bug_report.md). If you feel the project is missing a feature, please raise a [ticket](https://github.com/AkashRajpurohit/email-server/issues/new?template=feature_request.md) on GitHub and I'll look into it. Pull requests are also welcome.

# Where to find me? 👀

[![Website Badge](https://img.shields.io/badge/-akashrajpurohit.com-3b5998?logo=google-chrome&logoColor=white)](https://akashrajpurohit.com/)
[![Twitter Badge](https://img.shields.io/badge/-@akashwhocodes-00acee?logo=Twitter&logoColor=white)](https://twitter.com/AkashWhoCodes)
[![Linkedin Badge](https://img.shields.io/badge/-@AkashRajpurohit-0e76a8?logo=Linkedin&logoColor=white)](https://linkedin.com/in/AkashRajpurohit)
[![Instagram Badge](https://img.shields.io/badge/-@akashwho.codes-e4405f?logo=Instagram&logoColor=white)](https://instagram.com/akashwho.codes/)
[![Telegram Badge](https://img.shields.io/badge/-@AkashRajpurohit-0088cc?logo=Telegram&logoColor=white)](https://t.me/AkashRajpurohit)
