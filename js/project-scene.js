document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('project-3d-scene');
    if (!container) return;

    // Clear previous canvas if any
    container.innerHTML = '';

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa); // Clean website background
    // scene.fog = new THREE.Fog(0xf8f9fa, 20, 80); // Too thick
    scene.fog = new THREE.Fog(0xf8f9fa, 60, 150); // Lighter, distant fog

    // Camera - Adjusted to frame the whole 18-story tower
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(50, 40, 50); // Moved further back (was 40,40,40)
    camera.lookAt(0, 22, 0); // Look at the vertical center (approx 45/2)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Softer shadows
    container.appendChild(renderer.domElement);

    // --- Materials (High Contrast for Visibility) ---
    const materials = {
        steel: new THREE.MeshStandardMaterial({ color: 0xdc353e, roughness: 0.3, metalness: 0.4 }), // Red Structural Steel
        concrete: new THREE.MeshPhongMaterial({ color: 0xffcd38, transparent: true, opacity: 0.9, side: THREE.DoubleSide }), // Yellow Floors (More opaque)
        glass: new THREE.MeshPhongMaterial({ color: 0xaaccff, transparent: true, opacity: 0.15, depthWrite: false, side: THREE.DoubleSide }), // Blueish tinted glass
        core: new THREE.MeshLambertMaterial({ color: 0x555555 }), // Darker Grey Core
        mech: new THREE.MeshLambertMaterial({ color: 0x28a745 }) // Green mechanical units on roof
    };

    const buildingGroup = new THREE.Group();

    // Procedural Building Params
    const floors = 18;
    const floorH = 2.5;
    const width = 12;
    const depth = 18;

    // --- Generate Floors ---
    for (let i = 0; i < floors; i++) {
        const y = i * floorH;

        // 1. Floor Slab (Yellow/Transparent)
        const slabGeo = new THREE.BoxGeometry(width, 0.2, depth);
        const slab = new THREE.Mesh(slabGeo, materials.concrete);
        slab.position.y = y;
        slab.receiveShadow = true;
        slab.castShadow = true;
        buildingGroup.add(slab);

        // ... (Columns logic is fine, reused below in full script context if needed, but assuming replace covers block)


        // 2. Structural Columns (Red Steel)
        // Grid pattern for columns
        const colGeo = new THREE.BoxGeometry(0.6, floorH, 0.6);
        const colPositions = [
            [-width / 2 + 1, -depth / 2 + 1], [width / 2 - 1, -depth / 2 + 1],
            [-width / 2 + 1, depth / 2 - 1], [width / 2 - 1, depth / 2 - 1],
            [-width / 2 + 1, 0], [width / 2 - 1, 0], // Mid section
            [0, -depth / 2 + 1], [0, depth / 2 - 1]   // Edge mids
        ];

        colPositions.forEach(pos => {
            const col = new THREE.Mesh(colGeo, materials.steel);
            col.position.set(pos[0], y + floorH / 2, pos[1]);
            buildingGroup.add(col);
        });

        // 3. Central Core (Elevator/Stairs) - Grey
        if (i < floors + 1) { // Extends to roof
            const coreGeo = new THREE.BoxGeometry(4, floorH, 5);
            const core = new THREE.Mesh(coreGeo, materials.core);
            core.position.set(0, y + floorH / 2, -3); // Offset core
            buildingGroup.add(core);

            // Add simple stairs inside core (implied by slight protrusions)
            const stairGeo = new THREE.BoxGeometry(3, 0.2, 1.5);
            const stair = new THREE.Mesh(stairGeo, materials.core);
            stair.position.set(0, y + floorH * 0.5, -3);
            stair.rotation.x = Math.PI / 8;
            buildingGroup.add(stair);
        }
    }

    // --- Exterior Shell (Ghostly) ---
    const shellGeo = new THREE.BoxGeometry(width + 0.4, floors * floorH, depth + 0.4);
    const shell = new THREE.Mesh(shellGeo, materials.glass);
    shell.position.y = (floors * floorH) / 2 - floorH / 2;
    buildingGroup.add(shell);

    // --- Wireframe Edges for Technical Look ---
    // --- Wireframe Edges for Technical Look ---
    const edges = new THREE.EdgesGeometry(shellGeo);
    // Darker, more opaque lines
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x111111, opacity: 0.3, transparent: true }));
    line.position.y = (floors * floorH) / 2 - floorH / 2;
    buildingGroup.add(line);

    // --- Roof Mechanicals (LOD Details) ---
    const roofY = floors * floorH;
    const mechGeo = new THREE.BoxGeometry(3, 2, 3);
    const mech1 = new THREE.Mesh(mechGeo, materials.mech); // Green unit from user image style
    mech1.position.set(2, roofY + 1, 2);
    buildingGroup.add(mech1);

    const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 8);
    const pipe = new THREE.Mesh(pipeGeo, materials.steel);
    pipe.rotation.z = Math.PI / 2;
    pipe.position.set(0, roofY + 0.5, -2);
    buildingGroup.add(pipe);


    scene.add(buildingGroup);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(50, 80, 50);
    spotLight.angle = 0.3;
    spotLight.penumbra = 0.2;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const fillLight = new THREE.DirectionalLight(0xdc353e, 0.3); // Reddish fill from below
    fillLight.position.set(-20, 0, -20);
    scene.add(fillLight);

    // --- Grid Base ---
    const gridHelper = new THREE.GridHelper(60, 60, 0xdddddd, 0xf0f0f0);
    scene.add(gridHelper);

    // --- Controls ---
    let controls;
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2.0;

        // Stop auto rotation when user interacts
        controls.addEventListener('start', () => {
            controls.autoRotate = false;
        });
    }

    // --- Animation ---
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);

        if (controls) {
            controls.update();
        } else {
            // Fallback manual rotation if controls fail to load
            buildingGroup.rotation.y += 0.003;
        }

        // Subtle floating (always active)
        buildingGroup.position.y = Math.sin(time) * 0.5;
        time += 0.01;

        renderer.render(scene, camera);
    }

    animate();

    // Handle Resize
    window.addEventListener('resize', () => {
        if (container) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
});
