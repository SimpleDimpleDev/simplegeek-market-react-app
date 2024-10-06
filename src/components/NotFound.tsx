import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {

    const navigate = useNavigate();
    
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
            }}>
                <Typography variant="h1">
                    404
                </Typography>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <Typography variant="h6">
                        Что-то пошло не так
                    </Typography>
                    <Typography variant="body1">
                        Похоже данной страницы не существует
                    </Typography>
                </div>

                <Button variant="contained" onClick={() => navigate("/")}>
                    На главную
                </Button>
            </div>
        </div>
    )
}