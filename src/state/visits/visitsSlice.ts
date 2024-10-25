import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CatalogItemVisit = {
	id: string;
	visitsCount: number;
    lastVisit: Date;
};

interface VisitsState {
	visits: CatalogItemVisit[];
}

// Helper function to load state from localStorage
const loadStateFromLocalStorage = (): VisitsState | undefined => {
	try {
		const serializedState = localStorage.getItem("visitsState");
		return serializedState ? JSON.parse(serializedState) : undefined;
	} catch (err) {
        console.error(err);
		return undefined;
	}
};

// Helper function to save state to localStorage
const saveStateToLocalStorage = (state: VisitsState): void => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem("visitsState", serializedState);
	} catch (err) {
		console.error(err);
	}
};

const initialState: VisitsState = loadStateFromLocalStorage() || { visits: [] };

const visitsSlice = createSlice({
	name: "visits",
	initialState,
	reducers: {
		addVisit(state, action: PayloadAction<{ id: string }>) {
			const visit = action.payload;
			const existingVisit = state.visits.find((existingVisit) => existingVisit.id === visit.id);
			if (existingVisit) {
				existingVisit.visitsCount++;
                existingVisit.lastVisit = new Date();
			} else {
				state.visits.push({ id: visit.id, visitsCount: 1, lastVisit: new Date() });
			}
            saveStateToLocalStorage(state);
		},
	},
});

export const { addVisit } = visitsSlice.actions;
export default visitsSlice.reducer;
