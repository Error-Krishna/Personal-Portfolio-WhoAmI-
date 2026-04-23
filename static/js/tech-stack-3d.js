document.addEventListener('DOMContentLoaded', function() {

    const container = document.getElementById('tech-stack-container');

    if (!container) return;



    // --- Configuration ---

    const config = {

        sphereRadius: 1.2,

        stickerSize: 1.4,

        attractionStrength: 0.015,

        repulsionStrength: 2.5,

        repulsionRadius: 6.0,     // Increased for larger cloud

        damping: 0.90,

        leatherRoughness: 0.5,

        leatherBumpScale: 0.04

    };



    // --- Tech Stack Data ---

    const techItems = [

        { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },

        { name: 'Django', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },

        { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },

        { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },

        { name: 'Three.js', url: 'https://global.discourse-cdn.com/standard17/uploads/threejs/original/2X/e/e4f86d2200d2d35c30f7b1494e96b9595ebc2751.png' },

        { name: 'Tailwind', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg' },

        { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },

        { name: 'HTML5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },

        { name: 'CSS3', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },

        { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },

        { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },

        { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },

        // New Additions

        { name: 'AWS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },

        { name: 'SQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },

        { name: 'n8n', url: 'https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png' }, // Official Repo Logo

        { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },

        { name: 'Linux', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },

        { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' }

    ];



    // --- Three.js Setup ---

    const scene = new THREE.Scene();

    

    // Moved camera back to 20 to fit all the new balls

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);

    camera.position.z = 20; 



    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);

    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.outputEncoding = THREE.sRGBEncoding;

    container.appendChild(renderer.domElement);



    // --- Lighting ---

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);

    scene.add(ambientLight);



    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);

    dirLight.position.set(5, 10, 10);

    scene.add(dirLight);

    

    const pointLight = new THREE.PointLight(0x00F0FF, 0.5);

    pointLight.position.set(-10, -5, 5);

    scene.add(pointLight);



    // --- Texture Generation ---

    function createLeatherTexture() {

        const canvas = document.createElement('canvas');

        canvas.width = 512;

        canvas.height = 512;

        const ctx = canvas.getContext('2d');

        

        ctx.fillStyle = '#f0f0f0';

        ctx.fillRect(0, 0, 512, 512);

        

        for (let i = 0; i < 80000; i++) {

            const x = Math.random() * 512;

            const y = Math.random() * 512;

            const grey = Math.floor(Math.random() * 50) + 180;

            ctx.fillStyle = `rgb(${grey},${grey},${grey})`;

            ctx.fillRect(x, y, 2, 2);

        }

        

        const texture = new THREE.CanvasTexture(canvas);

        texture.wrapS = THREE.RepeatWrapping;

        texture.wrapT = THREE.RepeatWrapping;

        return texture;

    }



    const leatherTexture = createLeatherTexture();

    const textureLoader = new THREE.TextureLoader();



    // --- Geometry Construction ---

    const sphereGeometry = new THREE.SphereGeometry(config.sphereRadius, 32, 32);

    

    // Curved Sticker

    const stickerGeometry = new THREE.PlaneGeometry(config.stickerSize, config.stickerSize, 32, 32);

    const posAttribute = stickerGeometry.attributes.position;

    const stickerRadius = config.sphereRadius + 0.01; 



    for ( let i = 0; i < posAttribute.count; i ++ ) {

        const x = posAttribute.getX( i );

        const y = posAttribute.getY( i );

        const z = Math.sqrt(stickerRadius * stickerRadius - x*x - y*y);

        posAttribute.setZ( i, z );

    }

    stickerGeometry.computeVertexNormals();





    // --- Create Objects ---

    const physicsGroups = [];



    techItems.forEach((item) => {

        // Run loop twice to create 2 balls for each tech

        for (let i = 0; i < 2; i++) {

            const group = new THREE.Group();



            // Ball

            const ballMaterial = new THREE.MeshStandardMaterial({

                color: 0xffffff,

                bumpMap: leatherTexture,

                bumpScale: config.leatherBumpScale,

                roughness: config.leatherRoughness,

                metalness: 0.1

            });

            const ballMesh = new THREE.Mesh(sphereGeometry, ballMaterial);

            group.add(ballMesh);



            // Stickers

            textureLoader.load(item.url, (logoTex) => {

                const stickerMaterial = new THREE.MeshBasicMaterial({

                    map: logoTex,

                    transparent: true,

                    side: THREE.DoubleSide

                });



                const frontSticker = new THREE.Mesh(stickerGeometry, stickerMaterial);

                group.add(frontSticker);



                const backSticker = new THREE.Mesh(stickerGeometry, stickerMaterial);

                backSticker.rotation.y = Math.PI;

                group.add(backSticker);

            });



            // Random Position Spread (Increased spread for more objects)

            group.position.set(

                (Math.random() - 0.5) * 15,

                (Math.random() - 0.5) * 15,

                (Math.random() - 0.5) * 8

            );



            scene.add(group);



            physicsGroups.push({

                mesh: group,

                ball: ballMesh,

                name: item.name,

                velocity: new THREE.Vector3(0, 0, 0),

                force: new THREE.Vector3(0, 0, 0),

                home: new THREE.Vector3(0, 0, 0)

            });

        }

    });



    // --- Interaction ---

    const raycaster = new THREE.Raycaster();

    const mouse = new THREE.Vector2(9999, 9999);

    const tooltip = document.getElementById('tooltip');



    function onMouseMove(event) {

        const rect = container.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;

        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;



        if(tooltip) {

            tooltip.style.left = `${event.clientX + 15}px`;

            tooltip.style.top = `${event.clientY - 15}px`;

        }

    }

    

    function onMouseLeave() {

        mouse.set(9999, 9999);

        if(tooltip) tooltip.style.opacity = 0;

    }



    container.addEventListener('mousemove', onMouseMove);

    container.addEventListener('mouseleave', onMouseLeave);



    // --- Animation Loop ---

    const dummyVector = new THREE.Vector3();



    function animate() {

        requestAnimationFrame(animate);



        raycaster.setFromCamera(mouse, camera);

        

        const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

        const mouse3D = new THREE.Vector3();

        raycaster.ray.intersectPlane(planeZ, mouse3D);



        // Tooltip

        const balls = physicsGroups.map(g => g.ball);

        const intersects = raycaster.intersectObjects(balls);

        

        if (intersects.length > 0 && tooltip) {

            const hitGroup = physicsGroups.find(g => g.ball === intersects[0].object);

            if(hitGroup) {

                tooltip.textContent = hitGroup.name;

                tooltip.style.opacity = '1';

                document.body.style.cursor = 'pointer';

            }

        } else if (tooltip) {

            tooltip.style.opacity = '0';

            document.body.style.cursor = 'default';

        }



        // Physics

        physicsGroups.forEach(item => {

            item.force.set(0, 0, 0);



            // Attraction

            dummyVector.copy(item.home).sub(item.mesh.position).multiplyScalar(config.attractionStrength);

            item.force.add(dummyVector);



            // Repulsion

            if (mouse.x < 100) { 

                const distToMouse = item.mesh.position.distanceTo(mouse3D);

                if (distToMouse < config.repulsionRadius) {

                    dummyVector.copy(item.mesh.position).sub(mouse3D).normalize();

                    const strength = (1 - distToMouse / config.repulsionRadius) * config.repulsionStrength;

                    dummyVector.multiplyScalar(strength);

                    item.force.add(dummyVector);

                }

            }



            // Collision

            physicsGroups.forEach(otherItem => {

                if (item === otherItem) return;



                const dist = item.mesh.position.distanceTo(otherItem.mesh.position);

                const minDist = (config.sphereRadius * 2) + 0.1; 



                if (dist < minDist) {

                    dummyVector.copy(item.mesh.position).sub(otherItem.mesh.position).normalize();

                    const pushFactor = (minDist - dist) * 0.15;

                    item.force.add(dummyVector.multiplyScalar(pushFactor));

                }

            });



            item.velocity.add(item.force);

            item.velocity.multiplyScalar(config.damping);

            item.mesh.position.add(item.velocity);



            item.mesh.rotation.x += item.velocity.y * 0.1 + 0.005;

            item.mesh.rotation.y += item.velocity.x * 0.1 + 0.005;

        });



        renderer.render(scene, camera);

    }



    animate();



    window.addEventListener('resize', () => {

        camera.aspect = container.clientWidth / container.clientHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);

    });

});