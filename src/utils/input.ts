export const handleIntChange =
	(onChange: (value: string) => void, min?: number, max?: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { value } = e.target;

		// Allow empty input
		if (value === "") {
			onChange("");
			return;
		}

		// Validate the input value
		const intRegex = /^-?\d*$/;
		if (intRegex.test(value)) {
			const intValue = parseInt(value, 10);
			if (min !== undefined && intValue < min) {
				onChange(min.toString());
				return;
			}
			if (max !== undefined && intValue > max) {
				onChange(max.toString());
				return;
			}
			onChange(value);
		}
	};
