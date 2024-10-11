import { Configuration, FrontendApi } from "@ory/client";
import { AxiosError, isAxiosError } from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@appTypes/User";

export const oryClient = new FrontendApi(
	new Configuration({
		basePath: import.meta.env.AUTH_API_URL,
		baseOptions: {
			withCredentials: true,
		},
	})
);

/**
 * @param getFlow - Should be function to load a flow make it visible (Login.getFlow)
 * @param setFlow - Update flow data to view (Login.setFlow)
 * @param defaultNav - Default navigate target for errors
 * @param fatalToDash - When true and error can not be handled, then redirect to dashboard, else rethrow error
 */
export const SdkError = (
	getFlow: ((flowId: string) => Promise<void | AxiosError>) | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	setFlow: React.Dispatch<React.SetStateAction<any>> | undefined,
	defaultNav: string | undefined,
	fatalToDash = false
) => {
	const navigate = useNavigate();

	return useCallback(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(error: AxiosError<any, unknown>): Promise<AxiosError | void> => {
			console.error(`SDK Error: ${error}`);
			const responseData = error.response?.data || {};

			switch (error.response?.status) {
				case 400: {
					if (error.response.data?.error?.id === "session_already_available") {
						console.warn("sdkError 400: `session_already_available`. Navigate to /");
						navigate("/", { replace: true });
						return Promise.resolve();
					}
					// the request could contain invalid parameters which would set error messages in the flow
					if (setFlow !== undefined) {
						console.warn("sdkError 400: update flow data");
						setFlow(responseData);
						return Promise.resolve();
					}
					break;
				}
				case 401: {
					console.warn("sdkError 401: Navigate to /login");
					navigate("/login", { replace: true });
					return Promise.resolve();
				}
				case 403: {
					// the user might have a session, but would require 2FA (Two-Factor Authentication)
					if (responseData.error?.id === "session_aal2_required") {
						navigate("/login?aal2=true", { replace: true });
						return Promise.resolve();
					}

					if (responseData.error?.id === "session_refresh_required" && responseData.redirect_browser_to) {
						console.warn("sdkError 403: Redirect browser to");
						window.location = responseData.redirect_browser_to;
						return Promise.resolve();
					}
					break;
				}
				case 404: {
					if (defaultNav !== undefined) {
						console.warn("sdkError 404: Navigate to Error");
						const errorMsg = {
							data: error.response?.data || error,
							status: error.response?.status,
							statusText: error.response?.statusText,
							url: window.location.href,
						};

						navigate(`/error?error=${encodeURIComponent(JSON.stringify(errorMsg))}`, {
							replace: true,
						});
						return Promise.resolve();
					}
					break;
				}
				case 410: {
					if (getFlow !== undefined && responseData.use_flow_id !== undefined) {
						console.warn("sdkError 410: Update flow");
						return getFlow(responseData.use_flow_id).catch((error) => {
							// Something went seriously wrong - log and redirect to defaultNav if possible
							console.error(error);

							if (defaultNav !== undefined) {
								navigate(defaultNav, { replace: true });
							} else {
								// Rethrow error when can't navigate and let caller handle
								throw error;
							}
						});
					} else if (defaultNav !== undefined) {
						console.warn("sdkError 410: Navigate to", defaultNav);
						navigate(defaultNav, { replace: true });
						return Promise.resolve();
					}
					break;
				}
				case 422: {
					if (responseData.redirect_browser_to !== undefined) {
						const currentUrl = new URL(window.location.href);
						let redirectUrl: URL | null = null;

						const redirectToParam = responseData.redirect_browser_to;
						if (typeof redirectToParam === "string") {
							if (redirectToParam.startsWith("https://")) {
								redirectUrl = new URL(redirectToParam);
								window.location.href = redirectToParam;
								return Promise.resolve();
							} else {
								redirectUrl = new URL(redirectToParam, window.location.origin);
							}
						}

						const redirect =
							redirectUrl || new URL(responseData.redirect_browser_to, window.location.origin);

						// Path has changed
						if (currentUrl.pathname !== redirect.pathname) {
							console.warn("sdkError 422: Update path");
							// remove /ui prefix from the path in case it is present (not setup correctly inside the project config)
							// since this is an SPA we don't need to redirect to the Account Experience.
							redirect.pathname = redirect.pathname.replace("/ui", "");
							navigate(redirect.pathname + redirect.search, {
								replace: true,
							});
							return Promise.resolve();
						}

						// for webauthn we need to reload the flow
						const flowId = redirect.searchParams.get("flow");

						if (flowId != null && getFlow !== undefined) {
							// get new flow data based on the flow id in the redirect url
							console.warn("sdkError 422: Update flow");
							return getFlow(flowId).catch((error) => {
								// Something went seriously wrong - log and redirect to defaultNav if possible
								console.error(error);

								if (defaultNav !== undefined) {
									navigate(defaultNav, { replace: true });
								} else {
									// Rethrow error when can't navigate and let caller handle
									throw error;
								}
							});
						} else {
							console.warn("sdkError 422: Redirect browser to");
							window.location = responseData.redirect_browser_to;
							return Promise.resolve();
						}
					}
				}
			}

			console.error(error);

			if (fatalToDash) {
				console.warn("sdkError: fatal error redirect to dashboard");
				navigate("/", { replace: true });
				return Promise.resolve();
			}

			throw error;
		},
		[navigate, getFlow, setFlow, defaultNav, fatalToDash],
	);
};

export class AuthApiClient {
	private static client: FrontendApi = oryClient;

	public static async getUser(): Promise<User | null> {
		try {
			const oryResponse = await this.client.toSession();
			const session = oryResponse.data || null;
			const user: User | null = session?.identity
				? {
						email: session.identity.traits.email!,
						isAdmin: session.identity.schema_id === "Admin",
				  }
				: null;
			return user;
		} catch (e) {
			if (isAxiosError(e)) {
				if (e.code === "ECONNREFUSED") {
					console.warn("Cannot connect to Ory");
				}
				if (e.response?.status === 401) {
					console.warn("Unauthorized");
					return null;
				}
			} else {
				console.error(e);
			}
			throw e;
		}
	}
}
