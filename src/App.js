import React, { useState, useRef } from "react";
import {
    Box,
    Button,
    Input,
    Text,
    VStack,
    HStack,
    Heading,
    useToast,
} from "@chakra-ui/react";

function App() {
    const [step, setStep] = useState(1); // Controla el paso actual
    const [unidades, setUnidades] = useState([]); // Almacena las unidades
    const [unidadesConsumo, setUnidadesConsumo] = useState([]); // Almacena las unidades de consumo
    const [inputValue, setInputValue] = useState(""); // Maneja el valor del input
    const [isAddingUnidad, setIsAddingUnidad] = useState(true); // Alterna entre unidad y unidad de consumo
    const [editingIndex, setEditingIndex] = useState(null); // Índice del número que se está editando
    const [results, setResults] = useState([]); // Resultados de las multiplicaciones
    const [total, setTotal] = useState(0); // Total final
    const inputRef = useRef(null); // Referencia al input
    const toast = useToast(); // Para mostrar notificaciones

    // Maneja el cambio de valor en el input
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Agrega o actualiza el número dependiendo del contexto
    const handleAddOrUpdateNumber = () => {
        const number = parseFloat(inputValue) || (isAddingUnidad ? 0 : 1);

        if (!isNaN(number)) {
        if (editingIndex !== null) {
            // Si está en modo edición
            if (isAddingUnidad) {
            const updatedUnidades = [...unidades];
            updatedUnidades[editingIndex] = number;
            setUnidades(updatedUnidades);
            } else {
            const updatedConsumo = [...unidadesConsumo];
            updatedConsumo[editingIndex] = number;
            setUnidadesConsumo(updatedConsumo);
            }
            setEditingIndex(null); // Salir del modo edición
        } else {
            // Si está agregando
            if (isAddingUnidad) {
            setUnidades([...unidades, number]);
            } else {
            setUnidadesConsumo([...unidadesConsumo, number]);
            }
            setIsAddingUnidad(!isAddingUnidad); // Alterna entre unidad y unidad de consumo
        }
        setInputValue(""); // Limpia el input
        inputRef.current.focus(); // Devuelve el foco al input
        } else {
        toast({
            title: "Entrada inválida",
            description: "Por favor ingresa un número válido.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
        }
    };

    // Maneja la edición de un número
    const handleEditNumber = (index, isUnidad) => {
        if (isUnidad) {
        setInputValue(unidades[index]);
        setIsAddingUnidad(true);
        } else {
        setInputValue(unidadesConsumo[index]);
        setIsAddingUnidad(false);
        }
        setEditingIndex(index); // Marca el índice en edición
        inputRef.current.focus(); // Devuelve el foco al input
    };

    // Realiza los cálculos de las multiplicaciones y el total
    const handleCalculate = () => {
        if (unidades.length !== unidadesConsumo.length) {
        toast({
            title: "Error",
            description: "Ambas listas deben tener la misma cantidad de elementos.",
            status: "error",
            duration: 3000,
            isClosable: true,
        });
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

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
        handleAddOrUpdateNumber();
        }
    };

    return (
        <Box p={5} textAlign="center" display='flex' flexDir='column' alignItems='center'>
        <Heading fontFamily='poppins' as="h1" size="xl" mb={6}>
            Calculadora de Consumo
        </Heading>

        {step === 1 && (
            <VStack spacing={4} align="center" w={['90%','70%','60%']}>
            <Heading fontFamily='poppins'as="h2" size="lg">
                {editingIndex !== null
                ? "Editar Número"
                : isAddingUnidad
                ? "Ingresar Unidad"
                : "Ingresar Unidad de Consumo"}
            </Heading>

            <Input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder={`Ingresa una ${isAddingUnidad ? "unidad" : "unidad de consumo"}`}
            />

            <Button colorScheme="teal" onClick={handleAddOrUpdateNumber}>
                {editingIndex !== null ? "Actualizar" : "Agregar"}
            </Button>

            <VStack align="start" spacing={3} width="full">
                <Box>
                <Text fontWeight="bold">Unidades ingresadas:</Text>
                {unidades.map((unidad, index) => (
                    <HStack key={index} justify="start">
                    <Text mr='10px'>{unidad}</Text>
                    <Button size="sm" onClick={() => handleEditNumber(index, true)}>
                        Editar
                    </Button>
                    </HStack>
                ))}
                </Box>

                <Box>
                <Text fontWeight="bold">Unidades de Consumo ingresadas:</Text>
                {unidadesConsumo.map((consumo, index) => (
                    <HStack key={index} justify="start">
                    <Text mr='10px'>{consumo}</Text>
                    <Button size="sm" onClick={() => handleEditNumber(index, false)}>
                        Editar
                    </Button>
                    </HStack>
                ))}
                </Box>
            </VStack>

            <Button
                colorScheme="blue"
                onClick={handleCalculate}
                isDisabled={
                unidades.length === 0 ||
                unidades.length !== unidadesConsumo.length
                }
            >
                Calcular Resultados
            </Button>
            </VStack>
        )}

        {step === 2 && (
            <VStack spacing={4} align="center">
            <Heading as="h2" size="lg">
                Resultados
            </Heading>

            {results.map((res, index) => (
                <Text key={index}>
                {res.unidad} × {res.consumo} = {res.resultado}
                </Text>
            ))}

            <Text fontWeight="bold" fontSize="lg">
                Total: {total}
            </Text>

            <Button colorScheme="red" onClick={() => window.location.reload()}>
                Reiniciar
            </Button>
            </VStack>
        )}
        </Box>
    );
}

export default App;
