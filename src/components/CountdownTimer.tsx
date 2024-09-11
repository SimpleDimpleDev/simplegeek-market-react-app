import { DateFormatter } from '@utils/format';
import React, { useEffect, useRef, useState } from 'react';

interface CountdownTimerProps {
	deadline: Date;
	onTimerEnd?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, onTimerEnd }) => {
	const [timeLeft, setTimeLeft] = useState<string>('');
	const frameId = useRef<number | null>(null);

	const updateTimer = () => {
		const currentTime = new Date();
		const rawDifference = deadline.getTime() - currentTime.getTime();

		// If the difference is negative, the deadline has passed
		if (rawDifference <= 0) {
			onTimerEnd?.();
			return;
		}

		// Update the state with the new time
		setTimeLeft(DateFormatter.HHMMSS(rawDifference));

		// Request next frame update
		frameId.current = requestAnimationFrame(updateTimer);
	};

	useEffect(() => {
		frameId.current = requestAnimationFrame(updateTimer);

		// Cancel the animation frame on component unmount
		return () => {
			if (frameId.current) {
				cancelAnimationFrame(frameId.current);
			}
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [deadline]);

	return <>{timeLeft}</>;
};

export default CountdownTimer;