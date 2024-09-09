import { Button, Stack, TextField, Typography } from "@mui/material";
import { RootState } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { increment, decrement, incrementByAmount } from "../state/counter/counterSlice";
import { useState } from "react";

const Counter: React.FC = () => {
	const count = useSelector((state: RootState) => state.counter.value);
	const dispatch = useDispatch();
	const [value, setValue] = useState(0);
	return (
		<Stack direction={"column"}>
			<Typography color="warning.main" variant="h5">
				{count}
			</Typography>
			<Stack direction="row" spacing={2}>
				<Button variant="contained" onClick={() => dispatch(decrement())}>
					-
				</Button>

				<Button variant="contained" onClick={() => dispatch(increment())}>
					+
				</Button>
			</Stack>
			<TextField value={value} onChange={(e) => setValue(parseInt(e.target.value))} />
			<Button
				variant="contained"
				onClick={() => {
					dispatch(incrementByAmount(value));
					setValue(0);
				}}
			>
				Add Amount
			</Button>
		</Stack>
	);
};

export default Counter;
