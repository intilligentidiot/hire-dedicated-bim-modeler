// Three.js Scene Setup for Hero Section
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('canvas-container');
    if (!container) return; // Exit if container not found

    // 1. Scene Setup
    const scene = new THREE.Scene();

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 4. Object Creation (Wireframe Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(2.5, 0);
    const material = new THREE.MeshBasicMaterial({
        color: 0xdc353e, // Brand Primary Color
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    scene.add(icosahedron);

    // Add an inner solid core for depth
    const coreGeometry = new THREE.IcosahedronGeometry(1.5, 0);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0xa8232b, // Brand Accent Color
        wireframe: true,
        transparent: true,
        opacity: 0.3
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);


    // 5. Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotation
        icosahedron.rotation.x += 0.002;
        icosahedron.rotation.y += 0.002;

        core.rotation.x -= 0.002; // Counter-rotate core
        core.rotation.y -= 0.002;

        renderer.render(scene, camera);
    }
    animate();

    // 6. Handle Resize
    window.addEventListener('resize', () => {
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });

    // 7. Mouse Interaction (Parallax)
    container.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;

        icosahedron.rotation.x += y * 0.01;
        icosahedron.rotation.y += x * 0.01;
    });
});
