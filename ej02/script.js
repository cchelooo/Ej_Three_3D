// Configuración de la escena de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,
  1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);
// Añadir luz oblicua desde arriba a la derecha
const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(5, 10, 5).normalize();
scene.add(light);
// Añadir una luz ambiental tenue
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
camera.position.set(10, 10, 10);
camera.lookAt(0, 0, 0);
// Habilitar controles de órbita
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
// Datos ficticios
const data = [4, 8, 15, 16, 23, 42];
// Crear escalas de D3
const xScale = d3.scaleBand()
  .domain(data.map((d, i) => i))
  .range([0, data.length * 2]);
const yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, 10]);
const colors = d3.scaleOrdinal(d3.schemeCategory10);
// Crear geometría para las barras
const bars = [];
data.forEach((d, i) => {
  const geometry = new THREE.BoxGeometry(1.5, yScale(d), 1.5);
  const materialArray = [
    new THREE.MeshLambertMaterial({ color: colors(i) }), // Material para los lados
    new THREE.MeshLambertMaterial({ color: colors(i) }),
    new THREE.MeshLambertMaterial({ color: colors(i) }),
    new THREE.MeshLambertMaterial({ color: colors(i) }),
    new THREE.MeshLambertMaterial({ color: colors(i) }),
    new THREE.MeshLambertMaterial({ color: d3.color(colors(i)).brighter(0.5) }) // Material para la cara superior
  ];
  const bar = new THREE.Mesh(geometry, materialArray);
  bar.position.x = xScale(i) - (data.length * 1.5) / 2;
  bar.position.y = yScale(d) / 2;
  scene.add(bar);
  bars.push(bar);
});
// Función de animación
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Actualizar controles
  renderer.render(scene, camera);
}
animate();
// Interacción del usuario: actualizar la altura de una barra al hacer clic
document.addEventListener('click', (event) => {
  const minHeight = 2; // Altura mínima actualizada
  const randomHeight = Math.max(Math.floor(Math.random() * 10) + 1, minHeight);
  const randomIndex = Math.floor(Math.random() * data.length);
  const selectedBar = bars[randomIndex];
  selectedBar.scale.y = yScale(randomHeight) / selectedBar.geometry.parameters.height;
  selectedBar.position.y = yScale(randomHeight) / 2;
});
