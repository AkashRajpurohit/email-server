import app from '../src/index';

describe('/', () => {
	it('should redirect to youtube url for / route', async () => {
		const res = await app.request('http://localhost/');

		expect(res.status).toBe(302);
		expect(res.headers.get('location')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
	});
});

describe('POST /send', () => {
	it('should return 500 if no token is passed', async () => {
		const res = await app.request(
			'http://localhost/send',
			{
				method: 'POST',
				body: JSON.stringify({}),
				headers: {
					'Content-Type': 'application/json',
				},
			},
			{}
		);

		expect(res.status).toBe(500);
		expect(await res.json()).toEqual({
			success: false,
			message: 'You must set the TOKEN environment variable.',
		});
	});

	it('should return 401 if token does not match with env token', async () => {
		const res = await app.request(
			'http://localhost/send',
			{
				method: 'POST',
				body: JSON.stringify({}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: '456',
				},
			},
			{ TOKEN: '123' }
		);

		expect(res.status).toBe(401);
		expect(await res.json()).toEqual({
			success: false,
			message: 'Missing authorization',
		});
	});

	it('should return 400 if email schema is invalid', async () => {
		const res = await app.request(
			'http://localhost/send',
			{
				method: 'POST',
				body: JSON.stringify({}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: '123',
				},
			},
			{ TOKEN: '123' }
		);

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({
			success: false,
			issues: {
				formErrors: [],
				fieldErrors: {
					to: ['Invalid input'],
					from: ['Invalid input'],
					subject: ['Required'],
				},
			},
		});
	});

	// TODO: figure out how to nock the calls to mailchannels
	it.skip('should return failed response if email is not sent via mailchannels', async () => {
		const res = await app.request(
			'http://localhost/send',
			{
				method: 'POST',
				body: JSON.stringify({
					to: 'test@test.com',
					from: 'test2@test.com',
					subject: 'Test',
					text: 'Hello',
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: '123',
				},
			},
			{ TOKEN: '123' }
		);

		expect(res.status).toBe(400);
		expect(await res.json()).toEqual({
			success: false,
			message: 'Request failed with status code 400',
		});
	});

	// TODO: figure out how to nock the calls to mailchannels
	it.skip('should return success response if email is sent via mailchannels', async () => {
		const res = await app.request(
			'http://localhost/send',
			{
				method: 'POST',
				body: JSON.stringify({
					to: 'test@test.com',
					from: 'test2@test.com',
					subject: 'Test',
					text: 'Hello',
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: '123',
				},
			},
			{ TOKEN: '123' }
		);

		expect(res.status).toBe(202);
		expect(await res.json()).toEqual({
			success: true,
			status: 202,
			body: {
				message: 'Accepted',
			},
		});
	});
});

describe('Not found', () => {
	it('should return 404 not found for unknown route', async () => {
		const res = await app.request('http://localhost/unknown');

		expect(res.status).toBe(404);
		expect(await res.json()).toEqual({ ok: false, message: 'Not Found' });
	});
});
