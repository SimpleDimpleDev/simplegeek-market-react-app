import { AccountCircle, ShoppingBag } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import NavButton from "@components/NavButton";

import { IntlProvider, CustomTranslations, ThemeProvider as OryThemeProvider } from "@ory/elements";
import customTranslations from "src/oryLocale";
import oryTheme from "src/oryTheme.ts";
import { useIsMobile } from "src/hooks/useIsMobile";

export function Component() {
	const isMobile = useIsMobile();

	return (
		<>
			<OryThemeProvider themeOverrides={oryTheme}>
				<IntlProvider<CustomTranslations>
					locale="ru"
					defaultLocale="ru"
					customTranslations={customTranslations}
				>
					{isMobile ? (
						<Outlet />
					) : (
						<Box display={"flex"} flexDirection={"row"} gap={3} width={"100%"} height={"100%"}>
							<Box
								position={"sticky"}
								top={24}
								display={"flex"}
								flexDirection={"column"}
								flexShrink={0}
								gap={3}
								p={2}
								width={360}
								height={"fit-content"}
								borderRadius={4}
								sx={{
									bgcolor: "surface.primary",
								}}
							>
								<Typography variant={"h5"}>Профиль</Typography>
								<NavButton to="/profile/orders" text={"Заказы"} icon={<ShoppingBag />} />
								<NavButton to="/profile/settings" text={"Мои данные"} icon={<AccountCircle />} />
							</Box>

							<Outlet />
						</Box>
					)}
				</IntlProvider>
			</OryThemeProvider>
		</>
	);
}
