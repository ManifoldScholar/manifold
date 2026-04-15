import { createContext, useContext, useState, useCallback, useMemo } from "react";

const SelectionContext = createContext(null);

function keyFor(item) {
  return `${item.type}:${item.id}`;
}

export function SelectionProvider({ children }) {
  const [items, setItems] = useState([]);

  const add = useCallback(item => {
    setItems(current => {
      const key = keyFor(item);
      if (current.some(i => keyFor(i) === key)) return current;
      return [...current, item];
    });
  }, []);

  const remove = useCallback(item => {
    setItems(current => {
      const key = keyFor(item);
      return current.filter(i => keyFor(i) !== key);
    });
  }, []);

  const has = useCallback(
    item => items.some(i => keyFor(i) === keyFor(item)),
    [items]
  );

  const value = useMemo(() => ({ items, add, remove, has }), [
    items,
    add,
    remove,
    has
  ]);

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSelection must be used within SelectionProvider");
  return ctx;
}
