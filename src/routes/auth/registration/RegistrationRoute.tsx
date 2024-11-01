/* eslint-disable react-hooks/exhaustive-deps */
import { SdkError, oryClient } from "@api/auth/client";
import { CircularProgress } from "@mui/material";
import { RegistrationFlow, UpdateRegistrationFlowBody } from "@ory/client";
import { UserAuthCard } from "@ory/elements";
import { AppDispatch } from "@state/store";
import { fetchUser } from "@state/user/thunks";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

/** Registration is a React component that renders the Registration form using Ory Elements.
 * It is used to handle the registration flow for a variety of authentication methods.
 *
 * The Registration component also handles the OAuth2 registration flow (as an OAuth2 provider)
 * For more information regarding OAuth2 registration, please see the following documentation:
 * https://www.ory.sh/docs/oauth2-oidc/custom-login-consent/flow
 *
 */
export function Component() {
	const [flow, setFlow] = useState<RegistrationFlow | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const dispatch = useDispatch<AppDispatch>();

	// The return_to is a query parameter is set by you when you would like to redirect
	// the user back to a specific URL after registration is successful
	// In most cases it is not necessary to set a return_to if the UI business logic is
	// handled by the SPA.
	// In OAuth flows this value might be ignored in favor of keeping the OAuth flow
	// intact between multiple flows (e.g. Login -> Recovery -> Settings -> OAuth2 Consent)
	// https://www.ory.sh/docs/oauth2-oidc/identity-provider-integration-settings
	const returnTo = searchParams.get("return_to");

	// The login_challenge is a query parameter set by the Ory OAuth2 registration flow
	// Switching between pages should keep the login_challenge in the URL so that the
	// OAuth flow can be completed upon completion of another flow (e.g. Login).
	const loginChallenge = searchParams.get("login_challenge");

	const navigate = useNavigate();

	// Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
	const getFlow = useCallback(
		(flowId: string) =>
			oryClient
				// the flow data contains the form fields, error messages and csrf token
				.getRegistrationFlow({ id: flowId })
				.then(({ data: flow }) => setFlow(flow))
				.catch(sdkErrorHandler),
		[]
	);

	// initialize the sdkError for generic handling of errors
	const sdkErrorHandler = SdkError(getFlow, setFlow, "/auth/registration", true);

	// create a new registration flow
	const createFlow = () => {
		oryClient
			// we don't need to specify the return_to here since we are building an SPA. In server-side browser flows we would need to specify the return_to
			.createBrowserRegistrationFlow({
				...(returnTo && { returnTo: returnTo }),
				...(loginChallenge && { loginChallenge: loginChallenge }),
			})
			.then(({ data: flow }) => {
				// Update URI query params to include flow id
				setSearchParams({ ["flow"]: flow.id });
				// Set the flow data
				setFlow(flow);
			})
			.catch(sdkErrorHandler);
	};

	// submit the registration form data to Ory
	const submitFlow = (body: UpdateRegistrationFlowBody) => {
		// something unexpected went wrong and the flow was not set
		if (!flow) return navigate("/auth/registration", { replace: true });

		oryClient
			.updateRegistrationFlow({
				flow: flow.id,
				updateRegistrationFlowBody: body,
			})
			.then(({ data }) => {
				if ("continue_with" in data) {
					for (const cw of data.continue_with ?? []) {
						if (cw.action === "show_verification_ui") {
							const search = new URLSearchParams();
							search.set("flow", cw.flow.id);
							navigate(
								{
									pathname: "/auth/verification",
									search: search.toString(),
								},
								{ replace: true }
							);
							return;
						}
					}
				}

				dispatch(fetchUser());
				if (returnTo) {
					navigate(returnTo, { replace: true });
				} else {
					navigate("/", { replace: true });
				}
			})
			.catch(sdkErrorHandler);
	};

	useEffect(() => {
		// we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
		const flowId = searchParams.get("flow");
		// the flow already exists
		if (flowId) {
			getFlow(flowId).catch(createFlow); // if for some reason the flow has expired, we need to get a new one
			return;
		}
		// we assume there was no flow, so we create a new one
		createFlow();
	}, [navigate]);

	// the flow is not set yet, so we show a loading indicator
	return (
		<>
			<Helmet>
				<title>SimpleGeek | Регистрация</title>
			</Helmet>
			{flow ? (
				// create a registration form that dynamically renders based on the flow data using Ory Elements
				<div className="gap-5 bg-primary p-3 pt-2 br-3 d-f fd-c">
					<UserAuthCard
						flowType={"registration"}
						// we always need to pass the flow to the card since it contains the form fields, error messages and csrf token
						flow={flow}
						// the registration card needs a way to navigate to the login page
						additionalProps={{
							loginURL: {
								handler: () => {
									const search = new URLSearchParams();
									if (flow.return_to) search.set("return_to", flow.return_to);
									if (flow.oauth2_login_challenge)
										search.set("login_challenge", flow.oauth2_login_challenge);
									navigate({ pathname: "/login", search: search.toString() }, { replace: true });
								},
							},
						}}
						// include the necessary scripts for webauthn to work
						includeScripts={true}
						// submit the registration form data to Ory
						onSubmit={({ body }) => submitFlow(body as UpdateRegistrationFlowBody)}
					/>
				</div>
			) : (
				<div className="w-100 h-100 ai-c d-f jc-c">
					<CircularProgress />
				</div>
			)}
		</>
	);
}
