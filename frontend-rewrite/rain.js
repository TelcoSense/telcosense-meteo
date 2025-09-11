class Rain {
  constructor({
    target,
    resources: { cloud, drop },
    rainCount,
    skyColor,
    cloudDensity,
  }) {
    this.target = target;
    this.size = {
      width: target.clientWidth,
      height: target.clientHeight,
    };
    this.resources = { cloud, drop };
    this.color = {
      fog: skyColor,
      drop: 0xffeeee,
      ambientLight: 0xffffff,
      directionalLight: 0xffeedd,
      pointLight1: 0x04267e,
      pointLight2: 0x7488fe,
    };
    this.cloudParticles = [];
    this.rainCount = rainCount;
    this.scene = null;
    this.camera = null;
    this.rain = null;
    this.rainGeometry = null;
    this.cloud = null;
    this.ambientLight = null;
    this.directionalLight = null;
    this.pointLight = null;
    this.pointLight1 = null;
    this.pointLight2 = null;
    this.renderer = null;
    this.lightningTimer = null;
    this.cloudDensity = cloudDensity;
    this.init();
  }

  init() {
    this.initRainCount(this.rainCount);
    this.initScene();
    this.initCamera();
    this.initLoader();
    this.initAmbientLight();
    this.initDirectionalLight();
    this.initpointLight();
    this.initRain();
    this.initCloud();
    this.initRenderer();
    this.appendDom();
    this.animate();

    // adapt the Three.js renderer and camera based on the window dims
    this.updateSize = this.updateSize.bind(this);
    window.addEventListener("resize", this.updateSize, false);
  }

  updateSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  initRainCount(rainCount) {
    this.rainCount = rainCount;
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(this.color.fog, 0.0005);
  }

  initCamera() {
    const {
      size: { width, height },
    } = this;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
    this.camera.position.z = 200;
    this.camera.position.y = 50;
    this.camera.rotation.x = 0.6;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;
  }

  initLoader() {
    this.loader = new THREE.TextureLoader();
  }

  initAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(this.color.ambientLight);
    this.scene.add(this.ambientLight);
  }

  initDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(
      this.color.directionalLight
    );
    this.directionalLight.position.set(0, 0, 1);
    this.scene.add(this.directionalLight);
  }

  initpointLight() {
    this.pointLight1 = new THREE.PointLight(this.color.pointLight1, 30, 500, 2);
    this.pointLight2 = new THREE.PointLight(
      this.color.pointLight2,
      20,
      500,
      1.5
    );
    this.pointLight = this.pointLight1;
    // this.scene.add(this.pointLight1);
    // this.scene.add(this.pointLight2);
  }

  initRain() {
    const rainMeterial = this.getRainMeterial();
    const rainGeometry = this.getRainGeometry();

    this.rain = new THREE.Points(rainGeometry, rainMeterial);
    this.rainGeometry = rainGeometry;
    this.scene.add(this.rain);
  }

  getRainGeometry() {
    const rainGeometry = new THREE.Geometry();

    for (let i = 0, len = this.rainCount; i < len; i++) {
      const randomX = Math.random() * 500 - 250;
      const randomY = Math.random() * 500 - 250;
      const randomZ = Math.random() * 1000 - 500;
      const rainDrop = new THREE.Vector3(randomX, randomY, randomZ);
      rainDrop.originalX = randomX;
      rainDrop.originalZ = randomZ;
      rainDrop.velocity = 0;

      rainGeometry.vertices.push(rainDrop);
    }

    return rainGeometry;
  }

  getRainMeterial() {
    const {
      resources: { drop },
      color,
    } = this;

    return new THREE.PointsMaterial({
      color: color.drop,
      size: 1.25,
      map: this.loader.load(drop),
      depthTest: false,
      blending: THREE.AdditiveBlending,
      opacity: 1,
      transparent: true,
    });
  }

  initCloud() {
    const {
      size: { width, height },
      resources: { cloud },
    } = this;
    const cloudLength = Math.floor((width * height) / this.cloudDensity);
    const cloudGeometry = new THREE.PlaneBufferGeometry(400, 400);
    const cloudMaterial = new THREE.MeshLambertMaterial({
      map: this.loader.load(cloud),
      transparent: true,
    });

    for (let i = 0; i < cloudLength; i++) {
      const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

      cloud.position.set(
        Math.random() * width - width / 2,
        400,
        Math.random() * height - height / 8 - 100
      );

      cloud.rotation.x = 0.6;
      cloud.rotation.y = 0;
      cloud.rotation.z = Math.random() * 360;
      cloud.material.opacity = 0.8;

      this.cloudParticles.push(cloud);
      this.scene.add(cloud);
    }
  }

  initRenderer() {
    const {
      scene: {
        fog: { color },
      },
      size: { width, height },
    } = this;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(color);
    this.renderer.setSize(width, height);
  }

  appendDom() {
    this.target.appendChild(this.renderer.domElement);
  }

  changePointLight(isShining) {
    const { pointLight1, pointLight2 } = this;
    let random = Math.random();

    if (isShining) {
      this.pointLight = pointLight1;
      random = 1;
    }

    if (random > 0.95) {
      if (random > 0.98 && this.pointLight === pointLight1) {
        this.pointLight = pointLight2;
        pointLight1.power = 0;
      } else {
        this.pointLight = pointLight1;
        pointLight2.power = 0;
      }
    }
  }

  animate() {
    const {
      // size: { width, height },
      cloudParticles,
      rainGeometry,
      // pointLight,
      renderer,
      scene,
      camera,
    } = this;
    // const isLightning = !!this.lightningTimer;

    // if (!isLightning) {
    //   this.changePointLight();
    // }

    cloudParticles.forEach((v) => {
      v.position.x -= 0.1;
      if (v.position.x < -700) {
        v.position.x = 700;
      }
    });

    rainGeometry.verticesNeedUpdate = true;
    rainGeometry.vertices.forEach((p) => {
      const rangeY = { min: Math.random() * 200 - 340, max: 200 };
      const rangeZ = { min: -50, max: 10 };

      p.velocity -= 0.75;

      if (rangeZ.min < p.originalZ && p.originalZ < rangeZ.max) {
        p.y += p.velocity / 2;
      } else {
        p.y += p.velocity;
      }

      if (p.y < rangeY.min) {
        p.y = rangeY.max;
        p.velocity = 0;
      }
    });

    // if (isLightning || Math.random() > 0.8) {
    //   if (isLightning || pointLight.power < 100) {
    //     pointLight.position.set(
    //       Math.random() * width - width / 2,
    //       Math.random() * height,
    //       0
    //     );
    //   }
    //   pointLight.power = Math.random() * 500 + (isLightning ? 100 : 50);
    // }
    renderer.render(scene, camera);
    requestAnimationFrame(() => {
      this.animate();
    });
  }
}
