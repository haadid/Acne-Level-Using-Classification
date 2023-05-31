class Webcam {
  constructor(webcamElement) {
    this.webcamElement = webcamElement;
    this.stream = null;
  }

  async setup() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          this.stream = stream;
          this.webcamElement.srcObject = stream;
          this.webcamElement.addEventListener('loadeddata', () => {
            this.adjustVideoSize();
            resolve();
          }, false);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  adjustVideoSize() {
    const { videoWidth, videoHeight } = this.webcamElement;
    const aspectRatio = videoWidth / videoHeight;
    let width = videoWidth;
    let height = videoHeight;

    if (aspectRatio > 1) {
      height = this.webcamElement.offsetWidth / aspectRatio;
    } else {
      width = this.webcamElement.offsetHeight * aspectRatio;
    }

    this.webcamElement.width = width;
    this.webcamElement.height = height;
  }

  capture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = this.webcamElement.videoWidth;
    canvas.height = this.webcamElement.videoHeight;
    context.drawImage(this.webcamElement, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  }

  stop() {
    if (this.stream) {
      const tracks = this.stream.getTracks();
      tracks.forEach((track) => {
        track.stop();
      });
      this.stream = null;
      this.webcamElement.srcObject = null;
    }
  }
}
