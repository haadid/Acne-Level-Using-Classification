let model;
let webcam;

async function loadModel() {
  try {
    model = await tf.loadGraphModel('data/model.json');
    return model;
  } catch (error) {
    throw new Error('Failed to load the model: ' + error);
  }
}

async function startWebcam() {
  try {
    const video = document.getElementById('video');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');

    webcam = new Webcam(video);
    await webcam.setup();

    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Failed to start the webcam: ' + error;
  }
}

function stopWebcam() {
  if (webcam) {
    webcam.stop();
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    startButton.disabled = false;
    stopButton.disabled = true;
  }
}

async function predictAcneLevel() {
  const predictionContainer = document.getElementById('prediction');
  predictionContainer.textContent = '';

  try {
    const image = webcam.capture();

    const img = new Image();
    img.src = image;

    img.onload = async () => {
      const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([150, 150]).toFloat().expandDims();
      const prediction = await model.predict(tensor).data();
      const acneLevel = Math.round(prediction[0]);

      predictionContainer.textContent = 'Predicted Acne Level: ' + acneLevel;
    };
  } catch (error) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = 'Failed to predict acne level: ' + error;
  }
}

async function initialize() {
  await loadModel();
  document.getElementById('start-button').addEventListener('click', startWebcam);
  document.getElementById('stop-button').addEventListener('click', stopWebcam);
  document.getElementById('predict-button').addEventListener('click', predictAcneLevel);
}

initialize();
