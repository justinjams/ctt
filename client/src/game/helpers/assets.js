import data from '../../data/data.json'
import profileIcon from '../../dt/8.9.1/img/profileicon/501.png'

const ASSET_MAP = {
  img_champion_tiles: require.context('../../dt/img/champion/tiles', true, /0\.(jpg)$/),
  img_champion_splash: require.context('../../dt/img/champion/splash', true, /0\.(jpg)$/)
};
const assets = {};

Object.keys(ASSET_MAP).forEach((assetKey) => {
  const context = ASSET_MAP[assetKey];
  assets[assetKey] = {};
  context.keys().forEach((filename)=>{
    const champion = filename.match(/\.\/([^_]+)_/)[1];
    assets[assetKey][champion] = assets[assetKey][champion] || context(filename);
  });
});

assets.getTile = (champion) => {
  return assets.img_champion_tiles[champion];
}

assets.getRandomSplash = () => {
  const keys = Object.keys(assets.img_champion_splash);
  const index = Math.floor(keys.length * Math.random());
  return assets.img_champion_splash[keys[index]];
}

assets.getCardBack = () => {
  return profileIcon;
};

export default assets;