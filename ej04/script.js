// Configuración inicial del gráfico 3D
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Configuración de controles
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(5, 5, 10);
controls.update();

// Ejes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Función para crear etiquetas de texto 3D
function createText(text, size, position, color) {
  const loader = new THREE.FontLoader();
  loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new THREE.TextGeometry(text, {
      font: font,
      size: size,
      height: 0.05,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: color });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(position.x, position.y, position.z);
    scene.add(textMesh);
  });
}

// Etiquetas para los ejes
createText('X', 0.4, { x: 4.5, y: -0.5, z: 0 }, 0xff0000); // Etiqueta para el eje X
createText('Y', 0.4, { x: -0.5, y: 5, z: 0 }, 0x00ff00); // Etiqueta para el eje Y
createText('Z', 0.4, { x: -0.5, y: -0.5, z: 4.5 }, 0x0000ff); // Etiqueta para el eje Z

// Crear las barras con animación de crecimiento
const barData = [2, 3, 5, 1, 4];
const barWidth = 0.5;
const barSpacing = 1.0;
const bars = [];

// Creación de las barras
barData.forEach((height, index) => {
  const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth); // La altura se controlará dinámicamente
  const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 });
  const bar = new THREE.Mesh(geometry, material);

  bar.position.set(index * barSpacing, 0.5, 0); // Posicionar barra en la base (mitad de la altura inicial)
  bars.push({ mesh: bar, targetHeight: height, currentHeight: 0.1 });
  scene.add(bar);

  // Etiquetas de texto 3D para mostrar el valor de la barra
  createText(height.toString(), 0.3, { x: index * barSpacing - 0.2, y: height + 0.2, z: 0 }, 0xffffff);
});

// Animación de crecimiento de las barras
function growBars() {
  let allBarsGrown = true;

  bars.forEach((barData) => {
    if (barData.currentHeight < barData.targetHeight) {
      allBarsGrown = false;
      barData.currentHeight += 0.05; // Incremento de la altura de la barra
      barData.currentHeight = Math.min(barData.currentHeight, barData.targetHeight); // Asegurar que no supere la altura objetivo
      barData.mesh.scale.y = barData.currentHeight; // Escalar la altura de la barra
      barData.mesh.position.y = barData.currentHeight / 2; // Ajustar la posición de la barra para que crezca desde la base
    }
  });

  // Continuar animando hasta que todas las barras hayan crecido
  if (!allBarsGrown) {
    requestAnimationFrame(growBars);
  }
}

// Función de animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Iniciar la animación
growBars();
animate();

// Ajustar el tamaño del gráfico si cambia el tamaño de la ventana
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
