const assets = {};

assets.getTile = (championName, skinId) => {
  return `http://assets.justinjams.com/champion/tiles/${championName}_0.jpg`;
};

assets.getProfileIcon = (icon) => {
  return `http://assets.justinjams.com/profileicon/${icon}.png`;
};

export default assets;