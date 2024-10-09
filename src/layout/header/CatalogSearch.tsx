import { CatalogItem } from "@appTypes/CatalogItem";
import { Search } from "@mui/icons-material";
import { Autocomplete, TextField, Button } from "@mui/material";
import { isCatalogItemMatchQuery } from "@utils/search";
import React from "react";
import { useNavigate } from "react-router-dom";

interface CatalogSearchProps {
	catalogItems: CatalogItem[];
	isMobile?: boolean;
}

const CatalogSearch: React.FC<CatalogSearchProps> = ({ catalogItems, isMobile }) => {
	const navigate = useNavigate();
	const [searchText, setSearchText] = React.useState("");
	const [value, setValue] = React.useState<string | CatalogItem>("");

	const performSearch = () => {
		if (searchText === "") return;
		setSearchText("");
		navigate(`/search?q=${searchText}`);
	};

	return (
		<Autocomplete
			open={searchText !== ""}
			freeSolo
			id="free-solo-2-demo"
			disableClearable
			sx={!isMobile ? { maxWidth: 440, width: "100%" } : {}}
			options={catalogItems}
			getOptionLabel={(item) => (typeof item === "string" ? item : item.product.title)}
			inputValue={searchText}
			onInputChange={(_, newInputValue) => {
				setSearchText(newInputValue);
			}}
			value={value}
			onChange={(_, item) => {
				if (typeof item === "string") return;
				setSearchText("");
				setValue("");
				const variationParam = item.variationIndex !== null ? `?v=${item.variationIndex}` : "";
				navigate(`/item/${item.publicationLink}${variationParam}`);
			}}
			isOptionEqualToValue={(option) => isCatalogItemMatchQuery(option, searchText)}
			renderInput={(params) => (
				<div className="w-100 br-12px ps-r">
					<TextField
						{...params}
						label="Поиск"
						variant="filled"
						color="warning"
						slotProps={{
							input: {
								...params.InputProps,
								type: "search",
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.stopPropagation();
										performSearch();
									}
								},
							},
						}}
					/>
					<Button
						onClick={performSearch}
						variant="contained"
						style={{
							minWidth: 0,
							width: 56,
							height: 56,
							position: "absolute",
							right: 0,
							top: 0,
							zIndex: 1,
						}}
					>
						<Search sx={{ color: "icon.primary" }} />
					</Button>
				</div>
			)}
		/>
	);
};

export { CatalogSearch };
