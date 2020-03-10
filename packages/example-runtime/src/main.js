const RequestAdapterAxios = require("@xyng/yuoshi-request-adapter-axios")

const { BackendAdapter, StudipOauthAuthenticationHandler } = require("@xyng/yuoshi-backend-adapter-argonauts")

const { RequestError } = require("@xyng/yuoshi-backend-adapter")

const readline = require("readline")

const secrets = require("../secrets.json")

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

async function logRequest(respPromise) {
	let resp;

	try {
		resp = await respPromise
	} catch (e) {
		console.log(
			typeof e,
			e.constructor.name,
			e instanceof RequestError
		)
		if (e instanceof RequestError) {
			console.log("request had error: ", e.status, e.response.statusText)

			return null
		}

		console.log("unexpected error: ", e)

		return null
	}

	console.log(resp)
}

const base = "http://localhost:8123"

;(async () => {
	let auth_tokens = secrets.users.test_autor

	const studipOauthAuthenticationHandler = new StudipOauthAuthenticationHandler({
		consumer: secrets.client,
		endpoints: {
			request_token: `${base}/dispatch.php/api/oauth/request_token`,
			access_token: `${base}/dispatch.php/api/oauth/access_token`,
			authorize: `${base}/dispatch.php/api/oauth/authorize`,
			// our url - user will be redirected after auth
			callback: "http://localhost:10000"
		}
	}, () => {
		return auth_tokens
	})

	const requestAdapter = new RequestAdapterAxios(studipOauthAuthenticationHandler, {
		base,
	})

	const argonautsAdapter = new BackendAdapter(requestAdapter)

	console.log("initialized backend adapter")

	try {
		// we are not authenticated. do it now!
		if (!auth_tokens || !auth_tokens.key || !auth_tokens.secret) {
			try {
				const tokens = await studipOauthAuthenticationHandler.getRequestToken(
					requestAdapter
				)

				console.log(`Please click on link and grant access: ${tokens.url}`)

				const oauth_verifier = await askQuestion("Enter verifier")

				const { oauth_token, oauth_token_secret } = await studipOauthAuthenticationHandler.exchangeTokens(
					requestAdapter,
					{
						key: tokens.oauth_token,
						secret: tokens.oauth_token_secret
					},
					oauth_verifier
				)

				auth_tokens = {
					key: oauth_token,
					secrets: oauth_token_secret,
				}

				console.log(auth_tokens)
			} catch (e) {
				console.log(e)
			}
		}
	} catch (e) {
		console.log(
			typeof e,
			e.constructor.name,
			e instanceof RequestError
		)
		if (e instanceof RequestError) {
			console.log("request had error: ", e.status, e.response.statusText)

			return
		}

		console.log("unexpected error: ", e)

		return
	}

	// const data = await makeRequest(backendAdapter.userAdapter.getInfo())
	// const data = await makeRequest(backendAdapter.courseAdapter.getCourses("e7a0a84b161f3e8c09b4a0a2e8a58147"))
	// const data = await makeRequest(backendAdapter.courseAdapter.getCourses("76ed43ef286fb55cf9e41beadb484a9f"))

	const packages = argonautsAdapter.packageAdapter.getPackagesForCourse("a07535cf2f8a72df33c12ddfa4b53dde")
	try {
		for await (let packageItem of packages) {
			console.log(packageItem)

			for await (let task of packageItem.tasks) {
				console.log(task)

				for await (let content of task.contents) {
					console.log(content)

					for await (let quest of content.quests) {
						console.log(quest)

						for await (let answer of quest.answers) {
							console.log(answer)
						}
					}
				}
			}
		}
	} catch (e) {
		console.log(e)
		debugger
	}
})()
