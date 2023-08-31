import React, { useState, useEffect } from "react";

const App = () => {
  const [inputValue, setInputValue] = useState(0);
  const [currency1, setCurrency1] = useState("EUR");
  const [currency2, setCurrency2] = useState("CZK");
  const [result, setResult] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorMessage("");
        const response = await fetch(
          `https://api.frankfurter.app/latest?amount=${inputValue}&from=${currency1}&to=${currency2}`
        );
        if (!response.ok) throw new Error("Change one of the currency");
        const data = await response.json();

        setResult(data.rates);
      } catch (error) {
        setErrorMessage(error.message);
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
          setInputValue(e.target.value);
        }}
      />
      <select
        value={currency1}
        onChange={(e) => {
          setCurrency1(e.target.value);
        }}
      >
        <option value="CZK">CZK</option>
        <option value="EUR">EUR</option>
        <option value="USD">USD</option>
      </select>
      <select
        value={currency2}
        onChange={(e) => {
          setCurrency2(e.target.value);
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
