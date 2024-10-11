export const cartRouteAction = async ({ request }: { request: Request }) => {
	const formData = await request.formData();
	const orderItemsUnavailableError = formData.get("orderItemsUnavailableError");
	return { orderItemsUnavailableError };
};
