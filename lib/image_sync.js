[
 'img/champion',
 '8.9.1/img'
].forEach((path) => {
  const IMG_ROOT = `./dragontail-8.9.1/${path}`;
  const { exec } = require('child_process');
  const IMG_DEST = `./src/dt/${path}`;
  const child = exec(`mkdir -p ${IMG_DEST} && cp -r ${IMG_ROOT}/* ${IMG_DEST}`, (error, stdout, stderr) => {
    if (error) {
      throw error;
    }
    console.log(stdout);
  });
});
