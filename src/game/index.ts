import 'regenerator-runtime';

import {
  Entity,
  Camera,
  SkyBox,
  DirectLight,
  AssetType,
  Engine
} from 'oasis-engine';

import initShip from './ship/index';
import initCoin from './coin/index';
import GameController from './gameController';

// 添加相机
function addCamera(parentEntity: Entity) {
  // 在 rootEntity 上创建相机实体
  const cameraEntity = parentEntity.createChild('camera');
  // 给相机实体添加相机组件
  const camera = cameraEntity.addComponent(Camera);
  // 透视相机近平面
  camera.nearClipPlane = 0.1;
  // 透视相机远平面
  camera.farClipPlane = 100;
  // 透视相机视角
  camera.fieldOfView = 45;
  // 设置相机位置
  cameraEntity.transform.setPosition(0, 3, 5);
  cameraEntity.transform.setRotation(-20, 0, 0);
}

// 添加方向光
function addDirectLight(parentEntity: Entity) {
  const lightEntity = parentEntity.createChild('directLight');
  lightEntity.addComponent(DirectLight);
  lightEntity.transform.setPosition(3, 3, 5);
  lightEntity.transform.setRotation(-30, 20, 0);
}

// 添加天空盒
async function addSkyBox(engine: Engine, parentEntity: Entity) {
  const cubeTextureResource = {
    type: AssetType.TextureCube,
    urls: [
      // 图片顺序：px nx py ny pz nz
      'https://gw.alipayobjects.com/zos/OasisHub/8bb10590-1789-4da6-880e-72303a8a3f7a/47000054/0.6024001409406203.jpg',
      'https://gw.alipayobjects.com/zos/OasisHub/91ecd3ac-ac1b-4bef-bbdb-ea7d701c6c51/47000054/0.7585085509165117.jpg',
      'https://gw.alipayobjects.com/zos/OasisHub/2e921a5c-f391-4157-826f-5b1a7a4f476c/47000054/0.7185865174121622.jpg',
      'https://gw.alipayobjects.com/zos/OasisHub/1f723b12-1aa3-4b4f-b919-bc93bc95beb0/47000054/0.06822289263412062.jpg',
      'https://gw.alipayobjects.com/zos/OasisHub/147a8010-f3f0-45ae-818e-e156fa017d5a/47000054/0.7529954566752075.jpg',
      'https://gw.alipayobjects.com/zos/OasisHub/805d16df-3ac6-4094-81c8-0d503f8cccb7/47000054/0.5168773806174725.jpg'
    ]
  };
  const cubeTexture = await engine.resourceManager.load(cubeTextureResource);
  // 给 entity 添加天空盒组件
  const skyBoxCmp = parentEntity.addComponent(SkyBox);
  skyBoxCmp.skyBoxMap = cubeTexture;
}

export default async function init (engine: Engine, rootEntity: Entity) {
  addCamera(rootEntity);
  addDirectLight(rootEntity);
  await addSkyBox(engine, rootEntity);
  await initShip(engine, rootEntity);
  await initCoin(engine, rootEntity);

  // 给 rootEntity 添加一个游戏控制脚本，用来和 web 交互
  rootEntity.addComponent(GameController);
}
