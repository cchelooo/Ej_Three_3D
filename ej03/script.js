// Escena y cámara
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 35;

// Renderizador
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 1); // Fondo blanco
document.getElementById('container').appendChild(renderer.domElement);

// Control de órbita
let controls = new THREE.OrbitControls(camera, renderer.domElement);

// Datos del gráfico (puedes cambiarlos para probar con otros valores)
let data = [5, 10, 15, 20, 25, 30];
let barWidth = 2;
let barDepth = 2;
let barSpacing = 3;

// Crear barras 3D
let bars = [];
for (let i = 0; i < data.length; i++) {
  let geometry = new THREE.BoxGeometry(barWidth, data[i], barDepth);
  let material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
  let bar = new THREE.Mesh(geometry, material);

  // Posicionar las barras
  bar.position.x = i * barSpacing - (data.length * barSpacing) / 2;
  bar.position.y = data[i] / 2;

  // Añadir la barra a la escena
  bars.push(bar);
  scene.add(bar);
}

// Animar barras al cargar la página
let animateBars = () => {
  bars.forEach((bar, i) => {
    bar.scale.y = 0; // Iniciar con escala 0
    setTimeout(() => {
      bar.scale.y = 1; // Animación sencilla
    }, i * 200);
  });
};

// Función de renderizado
let animate = function () {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

// Interactividad: cambiar color de una barra al hacer clic
window.addEventListener('click', (event) => {
  let mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  let raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  let intersects = raycaster.intersectObjects(bars);

  if (intersects.length > 0) {
    let clickedBar = intersects[0].object;
    clickedBar.material.color.set(Math.random() * 0xffffff); // Cambiar color al hacer clic
  }
});

// Iniciar animación de barras
animateBars();
animate();

// Redimensionar la ventana correctamente
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
