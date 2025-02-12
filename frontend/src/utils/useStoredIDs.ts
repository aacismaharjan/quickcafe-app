import { useState } from "react";

const STORAGE_KEYS = {
  CANTEEN_ID: "canteenID",
  LEDGER_ID: "ledgerID",
} as const;

type UseStoredIDsReturn = {
  canteenID: number;
  setCanteenID: (id: number) => void;
  ledgerID: number;
  setLedgerID: (id: number) => void;
};

const getStoredValue = (key: string, defaultValue: number): number => {
  const storedValue = localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : defaultValue;
};

const useStoredIDs = (): UseStoredIDsReturn => {
  // Initializing state with the value from localStorage (or default if not set)
  const [canteenID, setCanteenIDState] = useState<number>(() => getStoredValue(STORAGE_KEYS.CANTEEN_ID, 3));
  const [ledgerID, setLedgerIDState] = useState<number>(() => getStoredValue(STORAGE_KEYS.LEDGER_ID, 9));

  // Function to update canteenID in both state and localStorage
  const setCanteenID = (id: number) => {
    localStorage.setItem(STORAGE_KEYS.CANTEEN_ID, JSON.stringify(id)); // Store new value
    setCanteenIDState(id); // Update state
  };

  // Function to update ledgerID in both state and localStorage
  const setLedgerID = (id: number) => {
    localStorage.setItem(STORAGE_KEYS.LEDGER_ID, JSON.stringify(id)); // Store new value
    setLedgerIDState(id); // Update state
  };

  return {
    canteenID,
    setCanteenID,
    ledgerID,
    setLedgerID,
  };
};

export default useStoredIDs;
