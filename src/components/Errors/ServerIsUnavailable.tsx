import { Typography } from "@mui/material";

export default function ServerIsUnavalable() {
    
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16
            }}>
                <Typography variant="h2">
                    Сервер недоступен
                </Typography>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <Typography variant="h6">
                        Попробуйте позже
                    </Typography>
                </div>
            </div>
        </div>
    )
}