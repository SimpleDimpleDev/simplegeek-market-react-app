import {
    Breadcrumbs,
    Link,
    Typography,
    styled
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const FunctionalLink = styled(RouterLink)({
    textDecoration: "none",
    color: "inherit"
});

interface BreadcrumbsHeaderProps {
    isMobile: boolean,
    isBig?: boolean,
    path?: {
        title: string,
        link: string
    }[],
    current: string
};

const BreadcrumbsPageHeader = ({ isMobile, isBig = true, path, current }: BreadcrumbsHeaderProps) => (
    <div className="w-100 d-f fd-c gap-2 py-2 ai-bl">
        {!isMobile && path && (
            <Breadcrumbs>
                {path.map((element, index) => (
                    <FunctionalLink key={index} to={element.link}>
                        {element.title}
                    </FunctionalLink>
                ))}
                <Link color="typography.primary" underline="hover">
                    {current}
                </Link>
            </Breadcrumbs>
        )}
        <Typography variant={isMobile ? (isBig ? 'h4' : 'h5') : (isBig ? 'h3' : 'h4')}>
            {current}
        </Typography>
    </div>
);

export default BreadcrumbsPageHeader
