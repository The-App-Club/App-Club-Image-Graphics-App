// https://css-tricks.com/almanac/properties/b/background-blend-mode/

let stats;
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

function convertFileObject2Base64(fileObject) {
  const fileReader = new FileReader();
  return new Promise((resolve, reject) => {
    fileReader.onloadend = (e) => {
      resolve(fileReader.result);
    };
    fileReader.readAsDataURL(fileObject);
  });
}

function reflectChangedBlendMode() {
  const workspaceOutputDom = document.querySelector('.workspace.output');
  workspaceOutputDom.style.backgroundBlendMode = parameter.blendMode;
}

function reflectChangedMixColor() {
  const workspaceOutputDom = document.querySelector('.workspace.output');
  workspaceOutputDom.style.backgroundColor = parameter.mixColor;
}

let parameter = {
  blendMode: 'normal',
  mixColor: '#222222',
};

let controllerInfo = {
  'Blend Mode': parameter.blendMode,
  'Mix Color': parameter.mixColor,
  'File Upload': () => {
    // http://zhangwenli.com/blog/2015/05/29/upload-images-with-dat-gui/
    const fileDom = document.querySelector('.file');
    fileDom.addEventListener('change', async (event) => {
      const fileObject = event.target.files[0];
      const webURL = URL.createObjectURL(fileObject);

      const base64 = await convertFileObject2Base64(fileObject);
      const workspaceDom = document.querySelector('.workspace');
      const workspaceOutputDom = document.querySelector('.workspace.output');
      workspaceDom.style.backgroundImage = `url(${base64})`;
      workspaceOutputDom.style.backgroundImage = `url(${base64})`;
      URL.revokeObjectURL(webURL);
      for (let i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
      }
    });
    fileDom.click();
  },
};

const gui = new dat.GUI();
gui.width = 300;
gui.add(controllerInfo, 'File Upload');
gui
  .add(controllerInfo, 'Blend Mode', [
    'normal',
    'multiply',
    'overlay',
    'screen',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
  ])
  .onChange((event) => {
    detectChangeParameter(event, 'Blend Mode');
  });
gui.addColor(controllerInfo, 'Mix Color').onChange((event) => {
  detectChangeParameter(event, 'Mix Color');
});
function detectChangeParameter(event, keyName) {
  if (keyName === 'Blend Mode') {
    parameter.blendMode = event;
  }
  if (keyName === 'Mix Color') {
    parameter.mixColor = event;
  }
  reflectChangedBlendMode();
  reflectChangedMixColor();
}

function loop() {
  requestAnimationFrame(loop);
  stats.begin();
  stats.end();
}

loop();
