import React, { useState } from "react";

function App() {
  const [step, setStep] = useState(1); // Controla el paso actual
  const [unidades, setUnidades] = useState([]); // Almacena las unidades
  const [unidadesConsumo, setUnidadesConsumo] = useState([]); // Almacena las unidades de consumo
  const [inputValue, setInputValue] = useState(""); // Maneja el valor del input
  const [results, setResults] = useState([]); // Resultados de las multiplicaciones
  const [total, setTotal] = useState(0); // Total final

  // Maneja el cambio de valor en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Agrega un número a la lista actual
  const handleAddNumber = () => {
    const number = parseFloat(inputValue);
    if (!isNaN(number)) {
      if (step === 1) {
        setUnidades([...unidades, number]);
      } else if (step === 2) {
        setUnidadesConsumo([...unidadesConsumo, number]);
      }
      setInputValue(""); // Limpia el input
    } else {
      alert("Por favor ingresa un número válido.");
    }
  };

  // Realiza los cálculos de las multiplicaciones y el total
  const handleCalculate = () => {
    if (unidades.length !== unidadesConsumo.length) {
      alert("Ambas listas deben tener la misma cantidad de elementos.");
      return;
    }

    const calcResults = unidades.map((unidad, index) => {
      const consumo = unidadesConsumo[index];
      return { unidad, consumo, resultado: unidad * consumo };
    });

    const calcTotal = calcResults.reduce((acc, curr) => acc + curr.resultado, 0);

    setResults(calcResults);
    setTotal(calcTotal);
    setStep(3); // Ir al paso de resultados
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Calculadora de Consumo</h1>
      {step === 1 && (
        <div>
          <h2>Ingresar Unidades</h2>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ingresa una unidad"
          />
          <button onClick={handleAddNumber}>Agregar Unidad</button>
          <div>
            <h3>Unidades ingresadas:</h3>
            <p>{unidades.join(", ") || "Ninguna unidad agregada aún."}</p>
          </div>
          <button onClick={() => setStep(2)} disabled={unidades.length === 0}>
            Continuar con Unidades de Consumo
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Ingresar Unidades de Consumo</h2>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ingresa una unidad de consumo"
          />
          <button onClick={handleAddNumber}>Agregar Unidad de Consumo</button>
          <div>
            <h3>Unidades de Consumo ingresadas:</h3>
            <p>{unidadesConsumo.join(", ") || "Ninguna unidad de consumo agregada aún."}</p>
          </div>
          <button
            onClick={handleCalculate}
            disabled={unidadesConsumo.length === 0 || unidadesConsumo.length !== unidades.length}
          >
            Calcular Resultados
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Resultados</h2>
          {results.map((res, index) => (
            <p key={index}>
              {res.unidad} × {res.consumo} = {res.resultado}
            </p>
          ))}
          <h3>Total: {total}</h3>
          <button onClick={() => window.location.reload()}>Reiniciar</button>
        </div>
      )}
    </div>
  );
}

export default App;
