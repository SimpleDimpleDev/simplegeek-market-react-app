import { Delivery } from "@appTypes/Delivery";
import { OrderCreate } from "@appTypes/Order";
import { DeliveryForm, DeliveryFormRef } from "@components/DelForm";
import { Button } from "@mui/material";
import { useRef, useState } from "react";

export function Component() {
	const deliveryFormRef = useRef<DeliveryFormRef>(null);

	const [renderForm, setRenderForm] = useState(false);

	const handleCreateOrder = (data: OrderCreate) => {
		console.log(data);
	}

	const handleSubmit = (delivery: Delivery, saveDelivery: boolean) => {
		handleCreateOrder({ delivery, saveDelivery, creditIds: [] });
	};

	const submit = () => {
		if (renderForm && deliveryFormRef.current) {
			deliveryFormRef.current.submit();
		} else {
			handleCreateOrder({ delivery: null, saveDelivery: false, creditIds: [] });
		}
	};

	return (
		<>
			<div className="gap-1 d-f fd-r" style={{ width: "300px" }}>
				<Button variant="contained" onClick={() => setRenderForm(!renderForm)}>
					{renderForm ? "Hide form" : "Show form"}
				</Button>
				<Button variant="contained" onClick={submit}>
					Submit
				</Button>
			</div>

			{renderForm && (
				<DeliveryForm
					ref={deliveryFormRef}
					defaultDelivery={{
						recipient: {
							fullName: "name",
							phone: "+79999999999",
						},
						service: "SELF_PICKUP",
						point: null,
					}}
					packages={[]}
					onSubmit={handleSubmit}
				/>
			)}
		</>
	);
}
