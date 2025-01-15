import React, { useState } from "react";
import axios from "axios";
import '../src/App.css'

function App() {
    const [image, setImage] = useState(null);
    const [lines, setLines] = useState([]);
    const [total, setTotal] = useState(0);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("image", image);

        try {
            const response = await axios.post("http://localhost:5000/process-image", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setLines(response.data.lines);
            setTotal(response.data.total);
        } catch (error) {
            console.error("Error al procesar la imagen:", error);
        }
    };

    return (
        <div className='div1'>
            <h1>Control Carrefour</h1>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Procesar Imagen</button>
            </form>

            {lines.length > 0 && (
                <div>
                    <h2>Detalles de las líneas:</h2>
                    <ul>
                        {lines.map((lineData, index) => (
                            <li key={index}>
                                <strong>Línea {lineData.line}:</strong> Números detectados = {" "}
                                {lineData.numbers.join(" x ")}  
                            </li>
                        ))}
                    </ul>
                    <h3>Total acumulado: {total}</h3>
                </div>
            )}
        </div>
    );
}

export default App;

