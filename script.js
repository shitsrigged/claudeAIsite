// Google Sheets URL - Replace with your published sheet URL
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTfknahyT_elgMF_uoR--PmOmFjjAf_JDcJzjg9ygFjhsAi6CjAGDr1zLAJ6QKWTRwZVLE1yctGqrsr/pub?output=csv';

// Fallback gif database (used if Google Sheets fails to load)
const fallbackGifs = [
    {
        url: 'gifs/1_1_Final_gold_shrine_video_3k0001-0300_AdobeExpress.gif',
        name: 'Gold Shrine',
        link: 'https://youtube.com/watch?v=EXAMPLE1',
        directedBy: '',
        producedBy: '',
        client: '',
        year: '2024'
    },
    {
        url: 'gifs/doja_AdobeExpress.gif',
        name: 'Doja Project',
        link: '',
        directedBy: 'Director Name',
        producedBy: '',
        client: 'Client Name',
        year: ''
    },
    {
        url: 'gifs/french_AdobeExpress.gif',
        name: 'French',
        link: 'https://youtube.com/watch?v=EXAMPLE3',
        directedBy: '',
        producedBy: 'Producer Name',
        client: '',
        year: '2024'
    },
    {
        url: 'gifs/Gold_Love_Potion_video__in_3k0001-0300_AdobeExpress.gif',
        name: 'Gold Love Potion',
        link: '',
        directedBy: '',
        producedBy: '',
        client: '',
        year: ''
    },
    {
        url: 'gifs/google_AdobeExpress.gif',
        name: 'Google',
        link: 'https://youtube.com/watch?v=EXAMPLE5',
        directedBy: 'Director Name',
        producedBy: 'Producer Name',
        client: 'Client Name',
        year: '2024'
    }
];

// Global variable to store loaded gifs
let gifs = [];

// Client logos
const clientLogos = [
    'client logos/adobe_logo.png',
    'client logos/amazon_logo.png',
    'client logos/apple_logo.png',
    'client logos/atlassian_logo.png',
    'client logos/google_logo.png',
    'client logos/intel_logo.png',
    'client logos/meta_logo.png',
    'client logos/nvidia_logo.png',
    'client logos/samsung_logo.png',
    'client logos/tesla_logo.png'
];

// Awards
const awards = [
    'awards/cannes_lion_logo.png',
    'awards/emmy_logo.png',
    'awards/oscar_logo.png',
    'awards/trophy_logo.png'
];

function getRandomSize() {
    const isMobile = window.innerWidth <= 768;
    const sizes = isMobile ? [100, 120, 150, 180] : [150, 200, 250, 300, 350];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

function getRandomPosition() {
    const isMobile = window.innerWidth <= 768;
    const padding = isMobile ? 10 : 50;
    const maxSize = isMobile ? 200 : 400;

    // Calculate total available height: at least 2 full screens worth
    const baseHeight = window.innerHeight - 120; // Account for bottom sections
    const totalHeight = baseHeight * 2; // Always allow 2 screens worth of scrolling

    const x = Math.random() * (window.innerWidth - maxSize) + padding;
    // Ensure gif doesn't go below the available space by subtracting maxSize from totalHeight
    const y = Math.random() * (totalHeight - maxSize);
    return { x, y };
}

function getRandomZIndex() {
    return Math.floor(Math.random() * 20) + 1;
}

function createGif(gifData, container) {
    const size = getRandomSize();
    const position = getRandomPosition();
    const zIndex = getRandomZIndex();

    const gifDiv = document.createElement('div');
    gifDiv.className = 'gif-item';
    gifDiv.style.left = position.x + 'px';
    gifDiv.style.top = position.y + 'px';
    gifDiv.style.width = size + 'px';
    gifDiv.style.height = size + 'px';
    gifDiv.style.zIndex = zIndex;

    // Store base position for floating animation
    gifDiv._baseX = position.x;
    gifDiv._baseY = position.y;
    gifDiv._floatPhase = Math.random() * Math.PI * 2; // Random starting phase
    gifDiv._floatSpeedX = 0.0005 + Math.random() * 0.001; // Random speed
    gifDiv._floatSpeedY = 0.0008 + Math.random() * 0.001;
    gifDiv._floatAmplitudeX = (2 + Math.random() * 3) * 1.15; // 2.3-5.75px horizontal movement (15% increase)
    gifDiv._floatAmplitudeY = (3 + Math.random() * 5) * 1.15; // 3.45-9.2px vertical movement (15% increase)
    gifDiv._isDragging = false;

    const img = document.createElement('img');
    img.src = gifData.url;
    img.alt = gifData.name;

    // Create info box that appears next to the gif
    const infoBox = document.createElement('div');
    infoBox.className = 'gif-info-box';

    let infoHTML = '';

    if (gifData.name && gifData.name.trim() !== '') {
        infoHTML += `<h3>${gifData.name}</h3>`;
    }

    if (gifData.directedBy && gifData.directedBy.trim() !== '') {
        infoHTML += `<p><strong>Directed by:</strong> ${gifData.directedBy}</p>`;
    }

    if (gifData.producedBy && gifData.producedBy.trim() !== '') {
        infoHTML += `<p><strong>Produced by:</strong> ${gifData.producedBy}</p>`;
    }

    if (gifData.client && gifData.client.trim() !== '') {
        infoHTML += `<p><strong>Client:</strong> ${gifData.client}</p>`;
    }

    if (gifData.year && gifData.year.trim() !== '') {
        infoHTML += `<p><strong>Year:</strong> ${gifData.year}</p>`;
    }

    if (gifData.link && gifData.link.trim() !== '') {
        infoHTML += `<a href="${gifData.link}" target="_blank" class="view-link">View Project →</a>`;
    }

    infoBox.innerHTML = infoHTML;

    gifDiv.appendChild(img);
    gifDiv.appendChild(infoBox);
    container.appendChild(gifDiv);

    // Prevent iOS context menu (share/save/copy)
    gifDiv.addEventListener('contextmenu', (e) => e.preventDefault());
    img.addEventListener('contextmenu', (e) => e.preventDefault());

    // Make the gif draggable
    makeDraggable(gifDiv);

    // Store reference to infoBox for timeout management
    gifDiv._infoBox = infoBox;
    gifDiv._hideTimeoutId = null;
    gifDiv._justTouched = false;

    function clearInfoBoxTimeout() {
        if (gifDiv._hideTimeoutId) {
            clearTimeout(gifDiv._hideTimeoutId);
            gifDiv._hideTimeoutId = null;
        }
    }

    function showInfoBox() {
        clearInfoBoxTimeout();
        infoBox.classList.add('active');
        infoBox.classList.remove('dither-fade');
        gifDiv._hideTimeoutId = setTimeout(() => {
            infoBox.classList.add('dither-fade');
            setTimeout(() => {
                infoBox.classList.remove('active');
                infoBox.classList.remove('dither-fade');
            }, 500);
        }, 3000);
    }

    function hideInfoBox() {
        clearInfoBoxTimeout();
        infoBox.classList.add('dither-fade');
        setTimeout(() => {
            infoBox.classList.remove('active');
            infoBox.classList.remove('dither-fade');
        }, 500);
    }

    // Show info box on hover (desktop only)
    gifDiv.addEventListener('mouseenter', () => {
        clearInfoBoxTimeout();
        infoBox.classList.add('active');
        infoBox.classList.remove('dither-fade');
    });

    gifDiv.addEventListener('mouseleave', () => {
        clearInfoBoxTimeout();
        gifDiv._hideTimeoutId = setTimeout(() => {
            infoBox.classList.add('dither-fade');
            setTimeout(() => {
                infoBox.classList.remove('active');
                infoBox.classList.remove('dither-fade');
            }, 500);
        }, 1000);
    });

    // Click handler (desktop only - blocked after touch events)
    gifDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Ignore clicks that came right after touch events (ghost clicks)
        if (gifDiv._justTouched) {
            return; // Don't reset the flag here - let the timeout handle it
        }

        // Toggle: if active, hide it; if not active, show it
        if (infoBox.classList.contains('active')) {
            hideInfoBox();
        } else {
            showInfoBox();
        }
    });

    // Store references for touch handling
    gifDiv._showInfoBox = showInfoBox;
    gifDiv._hideInfoBox = hideInfoBox;
}

// Drag functionality
function makeDraggable(element) {
    let isDragging = false;
    let hasMoved = false;
    let startX;
    let startY;
    let startLeft;
    let startTop;
    let lastTrailTime = 0;
    let hueRotation = 0;
    let arpIndex = 0;
    let totalDistance = 0;
    let lastNoteDistance = 0;

    function createDragTrail() {
        const now = Date.now();
        if (now - lastTrailTime < 30) return; // Throttle trail creation
        lastTrailTime = now;

        const trail = document.createElement('div');
        trail.className = 'drag-trail';
        trail.style.position = 'absolute';
        trail.style.left = element.style.left;
        trail.style.top = element.style.top;
        trail.style.width = element.style.width;
        trail.style.height = element.style.height;
        trail.style.zIndex = 5;

        // Clone the image
        const originalImg = element.querySelector('img');
        if (originalImg) {
            const img = originalImg.cloneNode(true);
            img.style.filter = `invert(1) sepia(1) saturate(5) hue-rotate(${hueRotation}deg)`;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            trail.appendChild(img);
        }

        hueRotation = (hueRotation + 30) % 360;

        element.parentElement.appendChild(trail);

        setTimeout(() => {
            if (trail.parentElement) {
                trail.remove();
            }
        }, 600);
    }

    function playArpNote() {
        if (!audioContext || audioContext.state === 'suspended') return;

        // Play note from arpeggiator scale
        const frequency = arpeggiatorScale[arpIndex];
        playPianoNote(frequency, 0.15); // Shorter duration for arp notes

        // Move to next note in scale (bounce at ends)
        lastArpNote++;
        if (lastArpNote % 2 === 0) {
            arpIndex++; // Going up
            if (arpIndex >= arpeggiatorScale.length) {
                arpIndex = arpeggiatorScale.length - 2; // Bounce back
            }
        } else {
            arpIndex--; // Going down
            if (arpIndex < 0) {
                arpIndex = 1; // Bounce back
            }
        }
    }

    // Mouse events
    element.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        isDragging = true;
        hasMoved = false;
        hueRotation = Math.random() * 360; // Random starting hue

        // Disable floating animation while dragging
        element._isDragging = true;

        // Reset arpeggiator
        arpIndex = 0;
        totalDistance = 0;
        lastNoteDistance = 0;

        element.classList.add('dragging');
        element.dataset.originalZIndex = element.style.zIndex;
        element.style.zIndex = 9998;

        startLeft = parseFloat(element.style.left) || 0;
        startTop = parseFloat(element.style.top) || 0;
        startX = e.clientX;
        startY = e.clientY;

        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            hasMoved = true;
            createDragTrail();

            // Play arpeggiator notes based on distance traveled
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            totalDistance = distance;

            // Play note every 30 pixels
            if (totalDistance - lastNoteDistance > 30) {
                playArpNote();
                lastNoteDistance = totalDistance;
            }
        }

        element.style.left = (startLeft + deltaX) + 'px';
        element.style.top = (startTop + deltaY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        element.style.zIndex = element.dataset.originalZIndex || getRandomZIndex();

        // Re-enable floating and update base position
        element._isDragging = false;
        element._baseX = parseFloat(element.style.left) || element._baseX;
        element._baseY = parseFloat(element.style.top) || element._baseY;
    });

    // Touch events - super sensitive
    let touchStartTime = 0;

    element.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        touchStartTime = Date.now();
        isDragging = true;
        hasMoved = false;
        hueRotation = Math.random() * 360; // Random starting hue

        // Disable floating animation while dragging
        element._isDragging = true;

        // Reset arpeggiator
        arpIndex = 0;
        totalDistance = 0;
        lastNoteDistance = 0;

        element.classList.add('dragging');
        element.dataset.originalZIndex = element.style.zIndex;
        element.style.zIndex = 9998;

        startLeft = parseFloat(element.style.left) || 0;
        startTop = parseFloat(element.style.top) || 0;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        console.log('Touch start on gif:', startX, startY);
    }, { passive: false });

    element.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const touch = e.touches[0];
        const deltaX = touch.clientX - startX;
        const deltaY = touch.clientY - startY;

        hasMoved = true;
        createDragTrail(); // Create rainbow trail on touch drag

        // Play arpeggiator notes based on distance traveled
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        totalDistance = distance;

        // Play note every 30 pixels
        if (totalDistance - lastNoteDistance > 30) {
            playArpNote();
            lastNoteDistance = totalDistance;
        }

        element.style.left = (startLeft + deltaX) + 'px';
        element.style.top = (startTop + deltaY) + 'px';

        console.log('Touch move:', deltaX, deltaY);
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        e.preventDefault(); // Prevent ghost click
        e.stopPropagation();

        isDragging = false;
        element.classList.remove('dragging');
        element.style.zIndex = element.dataset.originalZIndex || getRandomZIndex();

        // Re-enable floating and update base position
        element._isDragging = false;
        element._baseX = parseFloat(element.style.left) || element._baseX;
        element._baseY = parseFloat(element.style.top) || element._baseY;

        // Quick tap = show info (only if we didn't drag)
        if (!hasMoved) {
            // Set flag FIRST to block any ghost click event
            element._justTouched = true;
            setTimeout(() => {
                element._justTouched = false;
            }, 800); // Longer timeout to catch all ghost clicks

            // Small delay to ensure flag is set before any ghost click
            setTimeout(() => {
                // Toggle info box directly (no synthetic click)
                if (element._infoBox && element._infoBox.classList.contains('active')) {
                    if (element._hideInfoBox) element._hideInfoBox();
                } else {
                    if (element._showInfoBox) element._showInfoBox();
                }
            }, 0);
        }
    }, { passive: false });

    element.addEventListener('touchcancel', () => {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        element.style.zIndex = element.dataset.originalZIndex || getRandomZIndex();
    }, { passive: false });
}

// Fetch gif data from Google Sheets
async function loadGifData() {
    try {
        const response = await fetch(GOOGLE_SHEET_URL);
        const text = await response.text();

        // Parse CSV data
        const rows = text.split('\n').slice(1); // Skip header row
        gifs = rows.filter(row => row.trim()).map(row => {
            const [url, name, link, directedBy, producedBy, client, year] = row.split(',').map(cell => cell.trim());
            return {
                url: url || '',
                name: name || '',
                link: link || '',
                directedBy: directedBy || '',
                producedBy: producedBy || '',
                client: client || '',
                year: year || ''
            };
        });

        console.log('Loaded gifs from Google Sheets:', gifs);
    } catch (error) {
        console.warn('Failed to load from Google Sheets, using fallback data:', error);
        gifs = fallbackGifs;
    }
}

function createLogo(container) {
    console.log('🎱 Creating 3D logo sphere...');

    // Initialize Three.js scene
    threeScene = new THREE.Scene();

    // Set up camera - orthographic for 2D-like rendering
    const aspect = window.innerWidth / window.innerHeight;
    threeCamera = new THREE.OrthographicCamera(
        -window.innerWidth / 2, window.innerWidth / 2,
        window.innerHeight / 2, -window.innerHeight / 2,
        0.1, 1000
    );
    threeCamera.position.z = 500;

    // Create renderer
    threeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.domElement.style.position = 'fixed';
    threeRenderer.domElement.style.top = '0';
    threeRenderer.domElement.style.left = '0';
    threeRenderer.domElement.style.pointerEvents = 'none'; // Don't block interactions with GIFs
    threeRenderer.domElement.style.zIndex = '9999';
    document.body.appendChild(threeRenderer.domElement);
    console.log('✅ Three.js renderer created');

    // Create sphere with logo texture
    const size = 200; // Initial size - larger for visibility
    const geometry = new THREE.SphereGeometry(size / 2, 64, 64); // Higher resolution for better texture

    // Load logo texture synchronously
    const textureLoader = new THREE.TextureLoader();
    logoTexture = textureLoader.load(
        'gp logo 2.png',
        (texture) => {
            console.log('✅ Logo texture loaded successfully');
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, 1); // Single logo wrapping around sphere
            texture.offset.set(0, 0); // No offset needed
            // Update all materials with the loaded texture
            logoSphere.userData.materials.forEach(mat => {
                mat.map = texture;
                mat.color.setHex(0xffffff); // Set to white to show texture properly
                mat.needsUpdate = true;
            });
            logoSphere.material.map = texture;
            logoSphere.material.color.setHex(0xffffff); // Set current material to white
            logoSphere.material.needsUpdate = true;
            console.log('✅ Texture applied with 1 logo');
        },
        (progress) => {
            console.log('Loading texture:', (progress.loaded / progress.total * 100).toFixed(0) + '%');
        },
        (error) => {
            console.error('❌ Error loading logo texture:', error);
        }
    );

    // Array of different materials with softer, matte appearance
    const materials = [
        new THREE.MeshLambertMaterial({
            map: logoTexture,
            color: 0xffffff // White to show texture
        }),
        new THREE.MeshStandardMaterial({
            map: logoTexture,
            color: 0xffffff,
            roughness: 0.9, // Very rough for matte appearance
            metalness: 0.0  // No metallic shine
        }),
        new THREE.MeshPhongMaterial({
            map: logoTexture,
            color: 0xffffff,
            shininess: 5, // Very low shininess for soft appearance
            specular: 0x111111 // Minimal specular highlight
        }),
        new THREE.MeshToonMaterial({
            map: logoTexture,
            color: 0xffffff // Cartoon shading for flat look
        })
    ];

    logoSphere = new THREE.Mesh(geometry, materials[0]);
    logoSphere.userData.currentMaterialIndex = 0;
    logoSphere.userData.materials = materials;
    logoSphere.userData.size = size;

    // Position sphere at center initially for debugging
    logoSphere.position.x = 0;
    logoSphere.position.y = 0;
    logoSphere.position.z = 0;

    console.log('Sphere position:', logoSphere.position);
    console.log('Sphere scale:', logoSphere.scale);

    threeScene.add(logoSphere);

    // Create shadow blob underneath sphere using canvas texture for better visibility
    const shadowSize = size * 0.8;

    // Create a canvas with radial gradient for soft shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.42)'); // Reduced from 0.6 (30% reduction)
    gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.21)'); // Reduced from 0.3
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);

    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMaterial = new THREE.SpriteMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.56, // Reduced from 0.8 (30% reduction)
        depthTest: false,
        depthWrite: false
    });

    const shadowBlob = new THREE.Sprite(shadowMaterial);
    shadowBlob.scale.set(shadowSize, shadowSize, 1);
    shadowBlob.position.x = 0;
    shadowBlob.position.y = -size / 2 - 20;
    shadowBlob.position.z = -100; // Behind sphere
    threeScene.add(shadowBlob);
    logoSphere.userData.shadowBlob = shadowBlob;
    logoSphere.userData.shadowSize = shadowSize;
    console.log('✅ Shadow sprite created at position:', shadowBlob.position);

    // Add softer lighting for 3D effect - 20% less intense
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Was 0.5
    threeScene.add(ambientLight);

    // Main directional light from top-right - 20% less intense
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.64); // Was 0.8
    directionalLight.position.set(300, 300, 400);
    threeScene.add(directionalLight);
    logoSphere.userData.mainLight = directionalLight; // Store for shadow calculations

    // Fill light from the left - 20% less intense
    const fillLight = new THREE.DirectionalLight(0x6688ff, 0.16); // Was 0.2
    fillLight.position.set(-300, 100, 300);
    threeScene.add(fillLight);

    // Soft rim light from behind - 20% less intense
    const rimLight = new THREE.DirectionalLight(0xff8844, 0.24); // Was 0.3
    rimLight.position.set(0, -200, -200);
    threeScene.add(rimLight);

    // Add softer point light that moves with the sphere - 20% less intense
    const pointLight = new THREE.PointLight(0xffffff, 0.24, 500); // Was 0.3
    pointLight.position.set(0, 150, 150);
    threeScene.add(pointLight);
    logoSphere.userData.pointLight = pointLight;

    // Store physics data
    logoSphere.userData.dx = (Math.random() - 0.5) * 4;
    logoSphere.userData.dy = (Math.random() - 0.5) * 4;
    logoSphere.userData.rotationX = 0;
    logoSphere.userData.rotationY = 0;
    logoSphere.userData.gyroX = 0;
    logoSphere.userData.gyroY = 0;

    console.log('Initial velocity:', logoSphere.userData.dx, logoSphere.userData.dy);

    // Set up gyroscope for mobile
    setupGyroscope();

    // Animate the logo
    animateLogo();
}

// Setup gyroscope/accelerometer for mobile devices
function setupGyroscope() {
    // Check if device motion is supported
    if (!window.DeviceOrientationEvent && !window.DeviceMotionEvent) {
        console.log('Device motion not supported');
        return;
    }

    // Request permission for iOS 13+
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ requires permission
        document.addEventListener('click', async () => {
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    console.log('✅ Gyroscope permission granted');
                    enableGyroscope();
                }
            } catch (error) {
                console.error('❌ Error requesting gyroscope permission:', error);
            }
        }, { once: true });
    } else {
        // Non-iOS or older iOS
        enableGyroscope();
    }
}

function enableGyroscope() {
    // Use device orientation for tilt-based movement
    window.addEventListener('deviceorientation', (event) => {
        if (!logoSphere) return;

        // beta is front-to-back tilt (-180 to 180)
        // gamma is left-to-right tilt (-90 to 90)
        const beta = event.beta;  // Y tilt
        const gamma = event.gamma; // X tilt

        if (beta !== null && gamma !== null) {
            // Map tilt to velocity (scale it down)
            logoSphere.userData.gyroX = gamma * 0.15;  // Left/right tilt affects X velocity
            logoSphere.userData.gyroY = beta * 0.15;   // Front/back tilt affects Y velocity
        }
    });

    console.log('✅ Gyroscope enabled');
}

function animateLogo() {
    if (!logoSphere || !threeRenderer || !threeCamera) {
        console.error('❌ Missing Three.js components:', {
            logoSphere: !!logoSphere,
            threeRenderer: !!threeRenderer,
            threeCamera: !!threeCamera
        });
        return;
    }

    console.log('🎬 Starting logo animation...');

    const speed = 0.5;
    const containerHeight = window.innerHeight - 120; // Account for bottom sections
    const containerWidth = window.innerWidth;
    let frameCount = 0;

    function animate() {
        frameCount++;
        if (frameCount === 1) {
            console.log('✅ First animation frame rendered');
            console.log('Sphere visible:', logoSphere.visible);
            console.log('Sphere material:', logoSphere.material.type);
            console.log('Camera position:', threeCamera.position);
        }
        if (frameCount % 60 === 0) {
            console.log('Frame', frameCount, '- Sphere pos:', logoSphere.position.x.toFixed(2), logoSphere.position.y.toFixed(2));
        }
        // Get current position in screen space
        let x = logoSphere.position.x + window.innerWidth / 2;
        let y = -logoSphere.position.y + window.innerHeight / 2;
        const size = logoSphere.userData.size;

        // Apply gyroscope influence if available (mobile)
        const gyroInfluence = 0.3; // How much gyro affects movement
        const effectiveDx = logoSphere.userData.dx + (logoSphere.userData.gyroX * gyroInfluence);
        const effectiveDy = logoSphere.userData.dy + (logoSphere.userData.gyroY * gyroInfluence);

        // Update position with gyro-influenced velocity
        x += effectiveDx * speed;
        y += effectiveDy * speed;

        // Bounce off edges with random direction, material and color changes (no size change)
        if (x <= 0 || x >= containerWidth - size) {
            logoSphere.userData.dx = (Math.random() * 6) - 3; // Random between -3 and 3
            x = Math.max(0, Math.min(x, containerWidth - size));

            // Change material
            logoSphere.userData.currentMaterialIndex = (logoSphere.userData.currentMaterialIndex + 1) % logoSphere.userData.materials.length;
            logoSphere.material = logoSphere.userData.materials[logoSphere.userData.currentMaterialIndex];

            // Change logo color with random hue rotation
            logoSphere.material.color.setHSL(Math.random(), 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.3);
        }

        if (y <= 0 || y >= containerHeight - size) {
            logoSphere.userData.dy = (Math.random() * 6) - 3; // Random between -3 and 3
            y = Math.max(0, Math.min(y, containerHeight - size));

            // Change material
            logoSphere.userData.currentMaterialIndex = (logoSphere.userData.currentMaterialIndex + 1) % logoSphere.userData.materials.length;
            logoSphere.material = logoSphere.userData.materials[logoSphere.userData.currentMaterialIndex];

            // Change logo color with random hue rotation
            logoSphere.material.color.setHSL(Math.random(), 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.3);
        }

        // Update Three.js position (convert back to centered coordinates)
        logoSphere.position.x = x - window.innerWidth / 2;
        logoSphere.position.y = -y + window.innerHeight / 2;

        // Calculate rolling rotation based on velocity and sphere radius
        // The sphere rotates in the direction it's moving
        const radius = logoSphere.userData.size / 2;
        const circumference = 2 * Math.PI * radius;

        // Rotation amount is distance traveled / circumference (using gyro-influenced velocity)
        const distanceX = effectiveDx * speed;
        const distanceY = effectiveDy * speed;

        // Rotate around Y axis for horizontal movement (left/right)
        logoSphere.userData.rotationY += (distanceX / circumference) * (2 * Math.PI);

        // Rotate around X axis for vertical movement (up/down)
        logoSphere.userData.rotationX -= (distanceY / circumference) * (2 * Math.PI);

        // Apply rotations
        logoSphere.rotation.x = logoSphere.userData.rotationX;
        logoSphere.rotation.y = logoSphere.userData.rotationY;

        // Move point light with sphere for dynamic highlights
        if (logoSphere.userData.pointLight) {
            logoSphere.userData.pointLight.position.x = logoSphere.position.x + 100;
            logoSphere.userData.pointLight.position.y = logoSphere.position.y + 100;
            logoSphere.userData.pointLight.position.z = 150;
        }

        // Update shadow sprite to follow sphere and react to light direction
        if (logoSphere.userData.shadowBlob && logoSphere.userData.mainLight) {
            const shadowBlob = logoSphere.userData.shadowBlob;
            const light = logoSphere.userData.mainLight;

            // Calculate shadow offset based on light direction
            // Light is at fixed position (300, 300, 400)
            const lightToSphere = new THREE.Vector3(
                logoSphere.position.x - light.position.x,
                logoSphere.position.y - light.position.y,
                -light.position.z // Z distance from light
            );

            // Project shadow onto ground plane (XY plane at Z=-100)
            // Shadow is cast away from light source
            const shadowScale = 0.8; // How far shadow extends from ball
            const shadowOffsetX = (lightToSphere.x / lightToSphere.length()) * 30 * shadowScale;
            const shadowOffsetY = (lightToSphere.y / lightToSphere.length()) * 15 * shadowScale;

            // Position shadow: follow ball position + offset based on light
            shadowBlob.position.x = logoSphere.position.x + shadowOffsetX;
            shadowBlob.position.y = logoSphere.position.y - size / 2 - 5; // Very close under sphere

            // Keep shadow behind sphere in Z
            shadowBlob.position.z = -100;

            // Log occasionally for debugging
            if (frameCount % 120 === 0) {
                console.log('Shadow pos:', shadowBlob.position.x.toFixed(2), shadowBlob.position.y.toFixed(2), 'Ball pos:', logoSphere.position.x.toFixed(2), logoSphere.position.y.toFixed(2));
            }
        }

        // Render scene
        threeRenderer.render(threeScene, threeCamera);

        requestAnimationFrame(animate);
    }

    animate();
}

function initializeGifs() {
    const container = document.getElementById('gif-container');

    gifs.forEach(gif => {
        createGif(gif, container);
    });

    // Add the GP logo
    createLogo(container);
}

// Navigation info box functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const infoBoxTimers = new Map();

    navLinks.forEach(link => {
        const infoType = link.getAttribute('data-info');
        const infoBox = document.getElementById(`info-box-${infoType}`);

        // Show on hover
        link.addEventListener('mouseenter', () => {
            hideAllInfoBoxes();
            infoBox.classList.add('active');
            infoBox.classList.remove('dither-fade');
            startAutoClose(infoBox, infoBoxTimers);
        });

        // Also show on click
        link.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllInfoBoxes();
            infoBox.classList.add('active');
            infoBox.classList.remove('dither-fade');
            startAutoClose(infoBox, infoBoxTimers);
        });
    });

    // Close button functionality
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const infoBox = btn.closest('.info-box');
            clearTimeout(infoBoxTimers.get(infoBox));
            infoBox.classList.remove('active');
            infoBox.classList.remove('dither-fade');
        });
    });

    // Hide when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.info-box')) {
            hideAllInfoBoxes();
        }
    });
}

function startAutoClose(infoBox, timersMap) {
    // Clear existing timer if any
    if (timersMap.has(infoBox)) {
        clearTimeout(timersMap.get(infoBox));
    }

    // Start 7 second timer
    const timer = setTimeout(() => {
        infoBox.classList.add('dither-fade');
        setTimeout(() => {
            infoBox.classList.remove('active');
            infoBox.classList.remove('dither-fade');
        }, 500);
    }, 7000);

    timersMap.set(infoBox, timer);
}

function hideAllInfoBoxes() {
    document.querySelectorAll('.info-box').forEach(box => {
        box.classList.remove('active');
        box.classList.remove('dither-fade');
    });
}

// Load scrolling sections
function loadScrollingSections() {
    // Load client logos - repeat multiple times to ensure smooth scrolling
    const logosContent = document.getElementById('logos-content');
    const logosDuplicate = document.getElementById('logos-content-duplicate');

    // Repeat logos 3 times in each section for smooth scrolling
    for (let i = 0; i < 3; i++) {
        clientLogos.forEach(logo => {
            const img = document.createElement('img');
            img.src = logo;
            img.alt = 'Client logo';
            logosContent.appendChild(img);

            const imgDup = document.createElement('img');
            imgDup.src = logo;
            imgDup.alt = 'Client logo';
            logosDuplicate.appendChild(imgDup);
        });
    }

    // Load awards - repeat multiple times for smooth scrolling
    const awardsContent = document.getElementById('awards-content');
    const awardsDuplicate = document.getElementById('awards-content-duplicate');

    // Repeat awards 5 times in each section for smooth scrolling
    for (let i = 0; i < 5; i++) {
        awards.forEach(award => {
            const img = document.createElement('img');
            img.src = award;
            img.alt = 'Award';
            awardsContent.appendChild(img);

            const imgDup = document.createElement('img');
            imgDup.src = award;
            imgDup.alt = 'Award';
            awardsDuplicate.appendChild(imgDup);
        });
    }
}

// Three.js scene for 3D logo sphere
let threeScene = null;
let threeCamera = null;
let threeRenderer = null;
let logoSphere = null;
let logoTexture = null;

// Audio context for piano notes
let audioContext = null;
let reverbNode = null;
let delayNode = null;
let delayFeedback = null;
let noteCount = 0;

// Arpeggiator scale (C major scale up and down)
const arpeggiatorScale = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.00, // G4
    440.00, // A4
    493.88, // B4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    698.46, // F5
    783.99, // G5
    880.00, // A5
    987.77, // B5
    1046.50 // C6
];
let lastArpNote = 0;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create reverb using convolver
        reverbNode = audioContext.createConvolver();

        // Create impulse response for reverb (simulates room)
        const sampleRate = audioContext.sampleRate;
        const reverbTime = 2; // 2 seconds reverb
        const reverbLength = sampleRate * reverbTime;
        const impulse = audioContext.createBuffer(2, reverbLength, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < reverbLength; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
            }
        }

        reverbNode.buffer = impulse;

        // Create space echo/delay
        delayNode = audioContext.createDelay(1.0);
        delayNode.delayTime.value = 0.375; // 375ms delay (space echo timing)

        delayFeedback = audioContext.createGain();
        delayFeedback.gain.value = 0.4; // Feedback amount

        // Connect delay feedback loop
        delayNode.connect(delayFeedback);
        delayFeedback.connect(delayNode);

        // Create wet/dry mix for reverb
        const reverbGain = audioContext.createGain();
        reverbGain.gain.value = 0.3; // 30% wet

        const delayGain = audioContext.createGain();
        delayGain.gain.value = 0.5; // 50% delay mix

        // Connect effects to output
        reverbNode.connect(reverbGain);
        reverbGain.connect(audioContext.destination);

        delayNode.connect(delayGain);
        delayGain.connect(audioContext.destination);
    }
}

function playPianoNote(frequency, duration = 0.3) {
    if (!audioContext || audioContext.state === 'suspended') {
        return; // Audio not ready, skip silently
    }

    noteCount++;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Every 7th note is a square wave
    oscillator.type = (noteCount % 7 === 0) ? 'square' : 'sine';
    oscillator.frequency.value = frequency;

    // ADSR envelope
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Connect: oscillator -> gain -> [dry + reverb + delay]
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination); // Dry
    gainNode.connect(reverbNode); // Reverb
    gainNode.connect(delayNode); // Space echo/delay

    oscillator.start(now);
    oscillator.stop(now + duration);
}

// Random color on hover/tap for scroll sections with piano notes
function setupScrollSectionHovers() {
    const scrollSections = document.querySelectorAll('.scroll-section');

    // Melodic scale notes: C5, E5, G5 (C major triad)
    const notes = [523.25, 659.25, 783.99];

    scrollSections.forEach((section, index) => {
        const noteFrequency = notes[index % notes.length];

        // Desktop: hover
        section.addEventListener('mouseenter', () => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            section.style.backgroundColor = randomColor;
            playPianoNote(noteFrequency);
        });

        section.addEventListener('mouseleave', () => {
            section.style.backgroundColor = 'white';
        });

        // Mobile: tap to change color and play note
        section.addEventListener('touchstart', async (e) => {
            // Resume audio if needed
            if (audioContext && audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            section.style.backgroundColor = randomColor;
            playPianoNote(noteFrequency);

            // Reset to white after 2 seconds
            setTimeout(() => {
                section.style.backgroundColor = 'white';
            }, 2000);
        });
    });
}

// Cursor trail effect (desktop only)
function setupCursorTrail() {
    // Only run on desktop
    if (window.innerWidth <= 768) return;

    let lastTrailTime = 0;
    const trailDelay = 20; // milliseconds between trail elements (tighter spacing)
    let hueRotation = 0; // For rainbow effect

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();

        // Throttle trail creation
        if (now - lastTrailTime < trailDelay) return;
        lastTrailTime = now;

        // Create trail element
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = e.pageX + 'px';
        trail.style.top = e.pageY + 'px';

        // Apply rainbow effect: sepia adds color, saturate intensifies, hue-rotate cycles through rainbow
        trail.style.filter = `invert(1) sepia(1) saturate(5) hue-rotate(${hueRotation}deg)`;

        // Increment hue for next trail element (cycle through rainbow)
        hueRotation = (hueRotation + 30) % 360;

        document.body.appendChild(trail);

        // Remove trail element after animation completes
        setTimeout(() => {
            trail.remove();
        }, 600);
    });
}

// Floating animation for all GIFs
function startFloatingAnimation() {
    let time = 0;

    function animate() {
        time++;

        // Animate all GIF items
        const gifs = document.querySelectorAll('.gif-item:not(.logo-item)');
        gifs.forEach(gif => {
            // Skip if being dragged
            if (gif._isDragging) return;

            // Calculate floating offset using sine waves for smooth, natural motion
            const offsetX = Math.sin(time * gif._floatSpeedX + gif._floatPhase) * gif._floatAmplitudeX;
            const offsetY = Math.sin(time * gif._floatSpeedY + gif._floatPhase * 1.3) * gif._floatAmplitudeY;

            // Add a second wave for more complex, organic movement
            const offsetX2 = Math.sin(time * gif._floatSpeedX * 0.7 + gif._floatPhase * 2) * (gif._floatAmplitudeX * 0.5);
            const offsetY2 = Math.cos(time * gif._floatSpeedY * 0.5 + gif._floatPhase * 1.7) * (gif._floatAmplitudeY * 0.6);

            // Apply subtle pulsing scale
            const scale = 1 + Math.sin(time * gif._floatSpeedY * 0.3 + gif._floatPhase) * 0.0115; // ±1.15% size change (15% increase)

            // Apply the floating offset to base position
            gif.style.left = (gif._baseX + offsetX + offsetX2) + 'px';
            gif.style.top = (gif._baseY + offsetY + offsetY2) + 'px';
            gif.style.transform = `scale(${scale})`;
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Initialize when page loads
window.addEventListener('load', async () => {
    await loadGifData();
    initializeGifs();
    setupNavigation();
    loadScrollingSections();
    setupScrollSectionHovers();
    setupCursorTrail();
    setupHoverVideo();

    // Start floating animation
    startFloatingAnimation();

    // Initialize audio immediately
    console.log('🎵 Initializing audio on page load...');
    initAudioContext();

    // Set up one-time user interaction to resume audio context
    const resumeAudio = async () => {
        if (audioContext && audioContext.state === 'suspended') {
            console.log('🔊 Resuming audio on user interaction...');
            await audioContext.resume();
            console.log('✅ Audio ready!');
        }
    };

    // Resume on ANY user interaction (only once)
    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('touchstart', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });
});

// Setup video hover functionality
function setupHoverVideo() {
    const video = document.getElementById('hover-video');
    if (!video) return;

    let isPlaying = false;

    // Desktop: Play video on mouse enter
    video.addEventListener('mouseenter', () => {
        video.play();
        isPlaying = true;
    });

    // Desktop: Pause video on mouse leave (stays at current position)
    video.addEventListener('mouseleave', () => {
        video.pause();
        isPlaying = false;
    });

    // Mobile: Toggle play/pause on touch
    video.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (isPlaying) {
            video.pause();
            isPlaying = false;
        } else {
            video.play();
            isPlaying = true;
        }
    });
}

// Optionally refresh positions on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('gif-container');
    container.innerHTML = '';
    initializeGifs();

    // Update Three.js renderer and camera
    if (threeRenderer && threeCamera) {
        threeRenderer.setSize(window.innerWidth, window.innerHeight);
        threeCamera.left = -window.innerWidth / 2;
        threeCamera.right = window.innerWidth / 2;
        threeCamera.top = window.innerHeight / 2;
        threeCamera.bottom = -window.innerHeight / 2;
        threeCamera.updateProjectionMatrix();
    }
});
