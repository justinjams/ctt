const assets = {};

assets.getTile = (championName) => {
  return `https://s3.amazonaws.com/champions-triple-triad/champion/tiles/${championName}_0.jpg`;
}

export default assets;