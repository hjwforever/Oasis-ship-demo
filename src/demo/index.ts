import 'regenerator-runtime';

import {
  WebGLEngine,
  Entity,
  MeshRenderer,
  SkyBox,
  GPUParticleSystem,
  Vector3,
  Camera,
  DirectLight,
  SystemInfo,
  AssetType,
} from 'oasis-engine';

import {
  FreeControl
} from '@oasis-engine/controls';

import ShipController from './ship';
import Coin from './coin';

// 创建引擎
const engine = new WebGLEngine('oasis-demo');
// 设置引擎的 canvas 画布大小
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
// 创建一个 Entity 作为 RootEntity
const rootEntity = new Entity();
// 当前场景
const scene = engine.sceneManager.activeScene;
scene.addRootEntity(rootEntity);

// 在 rootEntity 上创建相机实体
const cameraEntity = rootEntity.createChild('camera');
// 给相机实体添加相机组件
const camera = cameraEntity.addComponent(Camera);
// 透视相机近平面
camera.nearClipPlane = 0.1;
// 透视相机远平面
camera.farClipPlane = 100;
// 透视相机视角
camera.fieldOfView = 45;
// 设置相机位置
cameraEntity.transform.position = new Vector3(0, 0, 10);

// 控制器
const controler = cameraEntity.addComponent(FreeControl);
controler.movementSpeed = 100;
controler.jumpY = 50;

// 在 rootEntity 上创建方向光
const lightEntity = rootEntity.createChild("light");
const light = lightEntity.addComponent(DirectLight);

// // 显示 gltf 模型
// async function showGLTF() {
//   // 加载模型
//   const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/feb92a84-616f-43c9-8855-59bf64637ffe/47000054/0.6954274921449404.gltf');
//   // 将模型实体加在 rootEntity 上
//   rootEntity.addChild(gltf.defaultSceneRoot);

//   // 调整大小
//   gltf.defaultSceneRoot.transform.scale = new Vector3(2, 2, 2);
//   // 调整位置
//   gltf.defaultSceneRoot.transform.position = new Vector3(1, 0, 0);
// }

// 显示 gltf 模型，并添加贴图
async function showGLTF() {
  // 加载模型
  const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/feb92a84-616f-43c9-8855-59bf64637ffe/47000054/0.6954274921449404.gltf');
  const shipEntity = rootEntity.createChild("ship");
  shipEntity.addChild(gltf.defaultSceneRoot);
  // 获取 mesh
  const mesh = gltf.defaultSceneRoot.findByName('feichuan').getComponent(MeshRenderer);
  // 获取材质
  const material = mesh.getSharedMaterial(0);
  // 法线纹理
  const normalTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/883804df-dc71-439e-a0f7-c6d5f39f975e/47000054/0.41043666532942336.jpg');
  material.normalTexture = normalTexture;
  // 基础颜色纹理
  const baseColorTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/59ac6721-a745-4857-813b-d69e9dd651f6/47000054/0.04283367251926573.jpg');
  material.baseColorTexture = baseColorTexture;

  // 给飞船添加 Ship 脚本组件
  shipEntity.addComponent(ShipController);
}

// 显示天空盒
async function showSkyBox() {
  const cubeTextureResource = {
    type: AssetType.TextureCube,
    urls: [
      // 图片顺序：px nx py ny pz nz
      "https://gw.alipayobjects.com/zos/OasisHub/8bb10590-1789-4da6-880e-72303a8a3f7a/47000054/0.6024001409406203.jpg",
      "https://gw.alipayobjects.com/zos/OasisHub/91ecd3ac-ac1b-4bef-bbdb-ea7d701c6c51/47000054/0.7585085509165117.jpg",
      "https://gw.alipayobjects.com/zos/OasisHub/2e921a5c-f391-4157-826f-5b1a7a4f476c/47000054/0.7185865174121622.jpg",
      "https://gw.alipayobjects.com/zos/OasisHub/1f723b12-1aa3-4b4f-b919-bc93bc95beb0/47000054/0.06822289263412062.jpg",
      "https://gw.alipayobjects.com/zos/OasisHub/147a8010-f3f0-45ae-818e-e156fa017d5a/47000054/0.7529954566752075.jpg",
      "https://gw.alipayobjects.com/zos/OasisHub/805d16df-3ac6-4094-81c8-0d503f8cccb7/47000054/0.5168773806174725.jpg"
    ]
  };
  const cubeTexture = await engine.resourceManager.load(cubeTextureResource);
  const skyBox = rootEntity.createChild("skybox");
  const render = skyBox.addComponent(SkyBox);
  render.skyBoxMap = cubeTexture;
}

// 播放粒子效果
async function showParticle() {
  const particle = rootEntity.createChild('particle');
  const particleSystem = particle.addComponent(GPUParticleSystem);

  // 粒子贴图
  const particleTex = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/b6439b0a-da09-4b67-a9e1-d34a3b7fff0d/47000054/0.08155146614293218.png');
  
  // 初始化
  particleSystem.initialize({
    texture: particleTex,
    maxCount: 30, // 最大粒子数
    is2d: true,
    scaleFactor: 1,
    options: {
      size: 0.1, // 粒子大小
      sizeRandomness: 0.6,
      lifetime: 0.5,
      velocityRandomness: new Vector3(10, 10, 0.5), // 速度随机范围
      acceleration: new Vector3(0, -0.05, 0) // 加速度
    }
  });
  // 播放粒子
  particleSystem.start();
}

async function showCoin() {
  // 加载模型
  const gltf = await engine.resourceManager.load('https://gw.alipayobjects.com/os/OasisHub/71919cef-d58e-41c2-b5d9-5277ec668fc0/150000189/0.5631354547806537.gltf');
  const coinEntity = rootEntity.createChild("coin");
  coinEntity.addChild(gltf.defaultSceneRoot);

  // 获取 mesh
  const mesh = gltf.defaultSceneRoot.findByName('coin').getComponent(MeshRenderer);
  // 获取材质
  const material = mesh.getSharedMaterial(0);
  // 法线纹理
  const normalTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/d65f2bb7-b63a-4a4f-9555-2be52de35d5a/150000189/0.5841235862272591.webp');
  material.normalTexture = normalTexture;
  // 基础颜色纹理
  const baseColorTexture = await engine.resourceManager.load('https://gw.alipayobjects.com/zos/OasisHub/345fb38f-9256-42c6-8986-12d26c6a407f/150000189/0.29263800037768006.webp');
  material.baseColorTexture = baseColorTexture;

  // 添加金币组件
  coinEntity.addComponent(Coin);
}

showSkyBox();
showGLTF();
showCoin();
// showParticle();

engine.run();
