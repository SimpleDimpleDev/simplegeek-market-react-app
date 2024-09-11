import { Box, Typography } from "@mui/material"
import { getRuGoodsWord } from "@utils/format";

export const CountPageHeader = ({ isMobile, title, count }: { isMobile: boolean, title: string, count: number }) => {
    return (
        <Box
            width={"100%"}
            padding={"16px 0px"}
            display={"flex"}
            flexDirection={"row"}
            alignItems={"baseline"}
            gap={"16px"}
        >
            <Typography sx={{ verticalAlign: "baseline" }} variant={isMobile ? "h4" : "h3"}>
                {title}
            </Typography>

            <Typography color={"typography.secondary"} variant="body1">
                {count} {getRuGoodsWord(count)}
            </Typography>

        </Box>
    );
};