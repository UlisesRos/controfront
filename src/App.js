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
    Flex,
} from "@chakra-ui/react";

function App() {
    const [step, setStep] = useState(1);
    const [unidades, setUnidades] = useState([]);
    const [unidadesConsumo, setUnidadesConsumo] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [nextInput, setNextInput] = useState("unidad"); // Controla la alternancia automática
    const [forceMode, setForceMode] = useState(null); // Permite sobrescribir el modo
    const [editingIndex, setEditingIndex] = useState(null);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const inputRef = useRef(null);
    const toast = useToast();

    // Determina el modo actual (prioriza el forceMode si existe)
    const currentMode = forceMode || nextInput;

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleAddOrUpdateNumber = () => {
        const number = parseFloat(inputValue) || (currentMode === "unidad" ? 0 : 1);

        if (!isNaN(number)) {
            if (editingIndex !== null) {
                // Modo edición
                if (currentMode === "unidad") {
                    const updatedUnidades = [...unidades];
                    updatedUnidades[editingIndex] = number;
                    setUnidades(updatedUnidades);
                } else {
                    const updatedConsumo = [...unidadesConsumo];
                    updatedConsumo[editingIndex] = number;
                    setUnidadesConsumo(updatedConsumo);
                }
                setEditingIndex(null);
                setForceMode(null); // Resetear el modo forzado después de editar
            } else {
                // Modo agregar
                if (currentMode === "unidad") {
                    setUnidades([...unidades, number]);
                    setNextInput("consumo"); // Alternancia automática
                } else {
                    setUnidadesConsumo([...unidadesConsumo, number]);
                    setNextInput("unidad"); // Alternancia automática
                }
                setForceMode(null); // Resetear el modo forzado después de agregar
            }
            setInputValue("");
            inputRef.current.focus();
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

    const handleDeleteNumber = (index, isUnidad) => {
        if (isUnidad) {
            const newUnidades = unidades.filter((_, i) => i !== index);
            setUnidades(newUnidades);
            if (index < unidadesConsumo.length) {
                const newConsumo = unidadesConsumo.filter((_, i) => i !== index);
                setUnidadesConsumo(newConsumo);
            }
        } else {
            const newConsumo = unidadesConsumo.filter((_, i) => i !== index);
            setUnidadesConsumo(newConsumo);
            if (index < unidades.length) {
                const newUnidades = unidades.filter((_, i) => i !== index);
                setUnidades(newUnidades);
            }
        }
    };

    const handleEditNumber = (index, isUnidad) => {
        if (isUnidad) {
            setInputValue(unidades[index]);
            setForceMode("unidad");
        } else {
            setInputValue(unidadesConsumo[index]);
            setForceMode("consumo");
        }
        setEditingIndex(index);
        inputRef.current.focus();
    };

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
        setStep(2);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleAddOrUpdateNumber();
        }
    };

    const toggleForceMode = (mode) => {
        setForceMode(mode);
        inputRef.current.focus();
    };

    return (
        <Box p={5} textAlign="center" display='flex' flexDir='column' alignItems='center'>
            <Heading fontFamily='poppins' as="h1" size="xl" mb={6}>
                Calculadora de Consumo
            </Heading>

            {step === 1 && (
                <VStack spacing={4} align="center" w={['90%','70%','60%']}>
                    <Heading fontFamily='poppins' as="h2" size="lg">
                        {editingIndex !== null
                            ? `Editando ${currentMode === "unidad" ? "Unidad" : "Consumo"}`
                            : `Ingresar ${currentMode === "unidad" ? "Unidad" : "Consumo"}`}
                    </Heading>

                    <Flex gap={2} w="100%" justifyContent="center">
                        <Button 
                            colorScheme={currentMode === "unidad" ? "teal" : "gray"} 
                            onClick={() => toggleForceMode("unidad")}
                        >
                            Unidad
                        </Button>
                        <Button 
                            colorScheme={currentMode === "consumo" ? "teal" : "gray"} 
                            onClick={() => toggleForceMode("consumo")}
                        >
                            Consumo
                        </Button>
                    </Flex>

                    <Input
                        ref={inputRef}
                        type="number"
                        inputMode="numeric"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                        placeholder={`Ingresa ${currentMode === "unidad" ? "una unidad" : "un consumo"}`}
                    />

                    <Button colorScheme="teal" onClick={handleAddOrUpdateNumber}>
                        {editingIndex !== null ? "Actualizar" : "Agregar"}
                    </Button>

                    <VStack align="start" spacing={3} width="full">
                        <Box>
                            <Text fontWeight="bold">Unidades ingresadas:</Text>
                            {unidades.map((unidad, index) => (
                                <HStack key={index} justify="start" spacing={2} mb='5px'>
                                    <Text mr='10px'>{unidad}</Text>
                                    <Button size="sm" onClick={() => handleEditNumber(index, true)}>
                                        Editar
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        colorScheme="red" 
                                        onClick={() => handleDeleteNumber(index, true)}
                                    >
                                        Eliminar
                                    </Button>
                                </HStack>
                            ))}
                        </Box>

                        <Box>
                            <Text fontWeight="bold">Unidades de Consumo ingresadas:</Text>
                            {unidadesConsumo.map((consumo, index) => (
                                <HStack key={index} justify="start" spacing={2} mb='5px'>
                                    <Text mr='10px'>{consumo}</Text>
                                    <Button size="sm" onClick={() => handleEditNumber(index, false)}>
                                        Editar
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        colorScheme="red" 
                                        onClick={() => handleDeleteNumber(index, false)}
                                    >
                                        Eliminar
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