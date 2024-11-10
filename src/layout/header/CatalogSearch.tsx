import { CatalogItem } from "@appTypes/CatalogItem";
import { Search } from "@mui/icons-material";
import { Autocomplete, TextField, Button, Typography } from "@mui/material";
import { getImageUrl } from "@utils/image";
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

	const inputRef = React.useRef<HTMLInputElement>(null);

	const performSearch = () => {
		if (inputRef.current) {
			inputRef.current.blur();
		}
		if (searchText === "") return;
		setSearchText("");
		navigate(`/search?q=${searchText}`);
	};

	return (
		<Autocomplete
			open={searchText !== ""}
			id="search-autocomplete"
			freeSolo
			disableClearable
			clearOnBlur
			blurOnSelect
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
			renderOption={(props, option) => (
				<li {...props}>
					<div className="gap-1 w-100 h-100 ai-c d-f fd-r">
						<div
							style={{
								height: 40,
								width: 40,
								borderRadius: 6,
								overflow: "hidden",
								flexShrink: 0,
							}}
						>
							<img
								width={40}
								height={40}
								src={getImageUrl(option.product.images.at(0)?.url ?? "", "small")}
								className="contain"
							/>
						</div>
						<div className="w-100">
							<Typography
								sx={{
									WebkitLineClamp: 2,
									display: "-webkit-box",
									WebkitBoxOrient: "vertical",
									overflow: "hidden",
									textOverflow: "ellipsis",
									maxWidth: "100%",
								}}
							>
								{option.product.title}
							</Typography>
						</div>
					</div>
				</li>
			)}
			renderInput={(params) => (
				<div className="w-100 br-12px ps-r">
					<TextField
						{...params}
						inputRef={inputRef}
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
						onClick={(e) => {
							e.stopPropagation();
							performSearch();
						}}
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
