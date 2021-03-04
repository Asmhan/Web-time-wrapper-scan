const canvas = document.querySelector('#canvas');
const canvas2 = document.querySelector('#canvas2');
const canvas3 = document.querySelector('#canvas3');
const mainSection = document.querySelector('.main-controls');
const saveBtn = document.querySelector("#save-btn");
const startBtn = document.querySelector("#start");
const video = document.querySelector('video');
let raf;

const canvasCtx = canvas.getContext("2d");
const canvas2Ctx = canvas2.getContext("2d");
const canvas3Ctx = canvas3.getContext("2d");

const pixelsCount = 1;
let columnCount = 0;
if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');

  const constraints = { video: {width: 1500} };

  let onSuccess = function(stream) {
    video.srcObject = stream;

    video.onloadedmetadata = function(e) {
      video.play();
    };

    startBtn.onclick = function () {
      startBtn.style.display = "none";
      draw();
    }
  
    function draw() {
      canvasCtx.drawImage(video, 0, 0);

      const myImageData = canvasCtx.getImageData(columnCount, 0, pixelsCount, video.videoHeight);    
      canvas2Ctx.putImageData(myImageData, columnCount, 0);
      columnCount++;

      canvas3Ctx.clearRect(0, 0, canvas3.width,video.videoHeight)
      canvas3Ctx.fillStyle = '#09F';
      canvas3Ctx.fillRect(columnCount-1, 0, 2, video.videoHeight);

      if(columnCount <= canvas.width) {
        raf = window.requestAnimationFrame(draw);
      } else {
        window.cancelAnimationFrame(raf);
        video.pause();
        saveBtn.href =  canvas2.toDataURL('image/jpeg', 1);
        saveBtn.style.cursor = "pointer";
        saveBtn.style.opacity = 1;
      }
    }
    
  }

  let onError = function(err) {
    console.log('The following error occured: ' + err);
  }

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);

} else {
   console.log('getUserMedia not supported on your browser!');
}

window.onresize = function() {
  canvas.width = mainSection.offsetWidth;
}

window.onresize();
