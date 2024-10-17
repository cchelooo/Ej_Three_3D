// Configuración de la escena de Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1,
  1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);
// Añadir una luz a la escena
const light = new THREE.PointLight(0xFFFFFF);
light.position.set(10, 10, 10);
scene.add(light);
// Crear un cubo básico
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshLambertMaterial({ color: 0x0077ff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
camera.position.z = 5;
// Datos ficticios
const data = [1, 2, 3, 4, 5];
// Crear escalas de D3
const xScale = d3.scaleBand()
  .domain(data.map((d, i) => i))
  .range([0, 2]);
const yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([0, 2]);
// Aplicar datos a la geometría del cubo usando D3
data.forEach((d, i) => {
  cube.scale.x = xScale.bandwidth();
  cube.scale.y = yScale(d);
  cube.scale.z = 1;
  cube.position.x = xScale(i) - 1;
  cube.position.y = yScale(d) / 2 - 1;
  cube.position.z = 0;
});
// Función de animación
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();