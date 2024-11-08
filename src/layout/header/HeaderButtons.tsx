import { IconButton, Badge, Typography } from "@mui/material";

interface HeaderButtonProps {
	isMobile?: boolean;
	text: string;
	icon: React.ReactNode;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	badgeCount?: number;
}

const HeaderButtons = ({ isMobile, buttons }: { isMobile?: boolean; buttons: HeaderButtonProps[] }) => (
	<div className="h-100 ai-c d-f fd-r jc-fs" style={{ gap: isMobile ? 24 : 16 }}>
		{buttons.map(({ text, icon, onClick, badgeCount }) => (
			<IconButton sx={{ borderRadius: 2, padding: 1, margin: -1 }} onClick={onClick}>
				<div className="gap-4px ai-c d-f fd-c" style={{width: "90px"}}>
					<div className="w-4 h-4 ai-c d-f icon-secondary jc-c ps-r">
						<Badge color="warning" badgeContent={badgeCount}>
							{icon}
						</Badge>
					</div>
					{!(isMobile === true) && (
						<Typography sx={{ color: "text.secondary" }} variant="body2">
							{text}
						</Typography>
					)}
				</div>
			</IconButton>
		))}
	</div>
);

export { HeaderButtons };
