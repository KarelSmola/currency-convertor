import React, { useReducer, useEffect } from "react";

const initialState = {
  currency1: "EUR",
  currency2: "CZK",
  inputValue: 0,
  result: 0,
  errorMessage: "",
};

const reducer = (state, action) => {
  if (action.type === "RESULT") {
    return { ...state, result: action.payload };
  }

  if (action.type === "ERROR_MESSAGE") {
    return { ...state, errorMessage: action.payload };
  }

  if (action.type === "INPUT_VALUE") {
    return { ...state, inputValue: action.payload };
  }

  if (action.type === "CURRENCY_1_VALUE") {
    return { ...state, currency1: action.payload };
  }

  if (action.type === "CURRENCY_2_VALUE") {
    return { ...state, currency2: action.payload };
  }

  if (action.type === "CLEAR_ERROR") {
    return { ...state, errorMessage: "" };
  }
  return state;
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currency1, currency2, inputValue, result, errorMessage } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "CLEAR_ERROR" });
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${inputValue}&from=${currency1}&to=${currency2}`
        );

        if (response.status === 422 || inputValue === 0)
          throw Error("Fill in the value you would like to convert");
        if (response.status === 404)
          throw new Error("Change one of the currency");
        const data = await response.json();

        dispatch({ type: "RESULT", payload: data.rates });
      } catch (error) {
        dispatch({ type: "ERROR_MESSAGE", payload: error.message });
        return;
      }
    };

    fetchData();
  }, [currency1, currency2, inputValue]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          dispatch({ type: "INPUT_VALUE", payload: e.target.value });
        }}
      />
      <select
        value={currency1}
        onChange={(e) => {
          dispatch({
            type: "CURRENCY_1_VALUE",
            payload: e.target.value,
          });
        }}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <select
        value={currency2}
        onChange={(e) => {
          dispatch({
            type: "CURRENCY_2_VALUE",
            payload: e.target.value,
          });
        }}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <p>{errorMessage ? errorMessage : result[currency2]}</p>
    </div>
  );
};

export default App;
