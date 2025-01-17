import React, { useState } from "react";

function App() {
  const [step, setStep] = useState(1); // Controla el paso actual (1: ingreso intercalado, 2: resultados)
  const [unidades, setUnidades] = useState([]); // Almacena las unidades
  const [unidadesConsumo, setUnidadesConsumo] = useState([]); // Almacena las unidades de consumo
  const [inputValue, setInputValue] = useState(""); // Maneja el valor del input
  const [isAddingUnidad, setIsAddingUnidad] = useState(true); // Alterna entre unidad y unidad de consumo
  const [results, setResults] = useState([]); // Resultados de las multiplicaciones
  const [total, setTotal] = useState(0); // Total final

  // Maneja el cambio de valor en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Agrega el número dependiendo del contexto (unidad o unidad de consumo)
  const handleAddNumber = () => {
    const number = parseFloat(inputValue) || (isAddingUnidad ? 0 : 1); // 0 para unidades, 1 para unidades de consumo si está vacío
    if (!isNaN(number)) {
      if (isAddingUnidad) {
        setUnidades([...unidades, number]);
      } else {
        setUnidadesConsumo([...unidadesConsumo, number]);
      }
      setInputValue(""); // Limpia el input
      setIsAddingUnidad(!isAddingUnidad); // Alterna entre unidad y unidad de consumo
    } else {
      alert("Por favor ingresa un número válido.");
    }
  };

  // Detecta la tecla Enter para agregar el número
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNumber();
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
    setStep(2); // Ir al paso de resultados
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Calculadora de Consumo</h1>

      {step === 1 && (
        <div>
          <h2>
            {isAddingUnidad ? "Ingresar Unidad" : "Ingresar Unidad de Consumo"}
          </h2>
          <input
            type="number"
            inputMode="numeric"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Ingresa una ${
              isAddingUnidad ? "unidad" : "unidad de consumo"
            }`}
          />
          <button onClick={handleAddNumber}>Agregar</button>
          <div>
            <h3>Unidades ingresadas:</h3>
            <p>{unidades.join(", ") || "Ninguna unidad agregada aún."}</p>
            <h3>Unidades de Consumo ingresadas:</h3>
            <p>
              {unidadesConsumo.join(", ") ||
                "Ninguna unidad de consumo agregada aún."}
            </p>
          </div>
          <button
            onClick={handleCalculate}
            disabled={
              unidades.length === 0 ||
              unidades.length !== unidadesConsumo.length
            }
          >
            Calcular Resultados
          </button>
        </div>
      )}

      {step === 2 && (
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
