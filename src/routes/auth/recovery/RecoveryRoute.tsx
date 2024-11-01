/* eslint-disable react-hooks/exhaustive-deps */
import { SdkError, oryClient } from "@api/auth/client";
import { CircularProgress } from "@mui/material";
import { RecoveryFlow, UpdateRecoveryFlowBody } from "@ory/client";
import { UserAuthCard } from "@ory/elements";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Component() {
	const [flow, setFlow] = useState<RecoveryFlow | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const navigate = useNavigate();

	const getFlow = useCallback(
		(flowId: string) =>
			oryClient
				.getRecoveryFlow({ id: flowId })
				.then(({ data: flow }) => setFlow(flow))
				.catch(sdkErrorHandler),
		[]
	);

	// initialize the sdkError for generic handling of errors
	const sdkErrorHandler = SdkError(getFlow, setFlow, "/auth/recovery");

	// create a new recovery flow
	const createFlow = () => {
		oryClient
			.createBrowserRecoveryFlow()
			// flow contains the form fields, error messages and csrf token
			.then(({ data: flow }) => {
				// Update URI query params to include flow id
				setSearchParams({ ["flow"]: flow.id });
				// Set the flow data
				setFlow(flow);
			})
			.catch(sdkErrorHandler);
	};

	const submitFlow = (body: UpdateRecoveryFlowBody) => {
		// something unexpected went wrong and the flow was not set
		if (!flow) return navigate("/auth/login", { replace: true });

		oryClient
			.updateRecoveryFlow({ flow: flow.id, updateRecoveryFlowBody: body })
			.then(({ data: flow }) => {
				// Form submission was successful, show the message to the user!
				setFlow(flow);
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
	}, []);

	// we check if the flow is set, if not we show a loading indicator
	return (
		<>
			<Helmet>
				<title>SimpleGeek | Восстановление</title>
			</Helmet>
			{flow ? (
				// We create a dynamic Recovery form based on the flow using Ory Elements
				<div className="gap-5 bg-primary p-3 pt-2 br-3 d-f fd-c">
					<UserAuthCard
						flowType={"recovery"}
						// the flow is always required since it contains the UI form elements, UI error messages and csrf token
						flow={flow}
						// the recovery form should allow users to navigate to the login page
						additionalProps={{
							loginURL: {
								handler: () => {
									navigate(
										{
											pathname: "/auth/login",
										},
										{ replace: true }
									);
								},
							},
						}}
						// submit the form data to Ory
						onSubmit={({ body }) => submitFlow(body as UpdateRecoveryFlowBody)}
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
