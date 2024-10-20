export const cartRouteAction = async ({
	request,
}: {
	request: Request;
}): Promise<{ orderError: { message: string; details: string[] | null } | null | undefined }> => {
	const formData = await request.formData();
	console.log(formData);
	return { orderError: { message: "Продукты недоступны", details: null } };
};
