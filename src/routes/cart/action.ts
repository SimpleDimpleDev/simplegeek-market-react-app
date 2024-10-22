export const cartRouteAction = async ({
	request,
}: {
	request: Request;
}): Promise<{ orderError: { message: string; details: string[] | null } | null | undefined }> => {
	const formData = await request.formData();
	let message = "Что-то пошло не так";
	let details: string[] | null = null;
	const messageStringValue = formData.get("message");
	const detailsJsonValue = formData.get("details");
	if (messageStringValue) {
		message = messageStringValue.toString();
	}
	if (detailsJsonValue) {
		details = JSON.parse(detailsJsonValue.toString());
	}
	return { orderError: { message, details } };
};
