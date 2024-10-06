import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function SomethingWentWrong() {

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
                textAlign: "center",
                gap: 8
            }}>
                <Typography variant="h5">
                    Что-то пошло не так
                </Typography>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <Typography variant="h6">
                        Повторите попытку позже
                    </Typography>
                </div>

                <Button variant="contained" onClick={() => navigate("/")}>
                    На главную
                </Button>
            </div>
        </div>
    )
}