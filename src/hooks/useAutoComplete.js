import { useState, useEffect } from "react";
import { getAutocompletion } from "../data/autocomplete.js";

export function useAutoComplete(value, isDisabled = false) {
  const [ghostText, setGhostText] = useState("");

  useEffect(() => {
    if (isDisabled) {
      setGhostText("");
      return;
    }
    setGhostText(getAutocompletion(value));
  }, [value, isDisabled]);

  const acceptCompletion = () => {
    if (ghostText) {
      setGhostText("");
      return value + ghostText;
    }
    return value;
  };

  return { ghostText, acceptCompletion };
}
