async function createModel() {
    const checkpointURL = "http://localhost/teachmachine3/modelo/model.json"; // Ruta local
    const metadataURL = "http://localhost/teachmachine3/modelo/metadata.json"; // Ruta local

    const recognizer = speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL
    );

    await recognizer.ensureModelLoaded();
    return recognizer;
}

async function init() {
    const recognizer = await createModel();
    const classLabels = recognizer.wordLabels(); // Obtener etiquetas del modelo
    const labelContainer = document.getElementById("label-container");

    labelContainer.innerHTML = ""; // Limpiar el contenido previo
    classLabels.forEach(() => labelContainer.appendChild(document.createElement("div")));

    recognizer.listen(result => {
        result.scores.forEach((score, i) => {
            labelContainer.childNodes[i].innerText = `${classLabels[i]}: ${score.toFixed(2)}`;
        });
    }, {
        probabilityThreshold: 0.75,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.5
    });

    // Detener la escucha después de 5 segundos
    setTimeout(() => recognizer.stopListening(), 5000);
}
