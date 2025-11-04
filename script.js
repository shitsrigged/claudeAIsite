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
        console.log('Showing info box and starting timer');
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
        console.log('Hiding info box');
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
            console.log('Ignoring click after touch (ghost click blocked)');
            return; // Don't reset the flag here - let the timeout handle it
        }

        console.log('Gif clicked, infoBox active?', infoBox.classList.contains('active'));

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
        console.log('Created drag trail at', trail.style.left, trail.style.top, 'hue:', hueRotation);

        setTimeout(() => {
            if (trail.parentElement) {
                trail.remove();
            }
        }, 600);
    }

    // Mouse events
    element.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        isDragging = true;
        hasMoved = false;
        hueRotation = Math.random() * 360; // Random starting hue

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
        }

        element.style.left = (startLeft + deltaX) + 'px';
        element.style.top = (startTop + deltaY) + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        element.classList.remove('dragging');
        element.style.zIndex = element.dataset.originalZIndex || getRandomZIndex();
    });

    // Touch events - super sensitive
    let touchStartTime = 0;

    element.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

        touchStartTime = Date.now();
        isDragging = true;
        hasMoved = false;
        hueRotation = Math.random() * 360; // Random starting hue

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

        element.style.left = (startLeft + deltaX) + 'px';
        element.style.top = (startTop + deltaY) + 'px';

        console.log('Touch move:', deltaX, deltaY);
    }, { passive: false });

    element.addEventListener('touchend', (e) => {
        if (!isDragging) return;

        e.preventDefault(); // Prevent ghost click
        e.stopPropagation();

        console.log('Touch end, hasMoved:', hasMoved);

        isDragging = false;
        element.classList.remove('dragging');
        element.style.zIndex = element.dataset.originalZIndex || getRandomZIndex();

        // Quick tap = show info (only if we didn't drag)
        if (!hasMoved) {
            console.log('Tap detected, showing info box directly');

            // Set flag FIRST to block any ghost click event
            element._justTouched = true;
            setTimeout(() => {
                element._justTouched = false;
                console.log('Cleared _justTouched flag');
            }, 800); // Longer timeout to catch all ghost clicks

            // Small delay to ensure flag is set before any ghost click
            setTimeout(() => {
                // Toggle info box directly (no synthetic click)
                if (element._infoBox && element._infoBox.classList.contains('active')) {
                    console.log('Hiding info box on tap');
                    if (element._hideInfoBox) element._hideInfoBox();
                } else {
                    console.log('Showing info box on tap');
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
    const size = getRandomSize();
    const position = getRandomPosition();

    const logoDiv = document.createElement('div');
    logoDiv.className = 'gif-item logo-item';
    logoDiv.style.left = position.x + 'px';
    logoDiv.style.top = position.y + 'px';
    logoDiv.style.width = size + 'px';
    logoDiv.style.height = size + 'px';
    logoDiv.style.zIndex = 9999; // Always on top

    const img = document.createElement('img');
    img.src = 'gp logo 2.png';
    img.alt = 'Gentle People Logo';

    // Prevent iOS context menu
    logoDiv.addEventListener('contextmenu', (e) => e.preventDefault());
    img.addEventListener('contextmenu', (e) => e.preventDefault());

    logoDiv.appendChild(img);
    container.appendChild(logoDiv);

    // Animate the logo
    animateLogo(logoDiv, size);
}

function animateLogo(logoElement, initialSize) {
    let x = parseFloat(logoElement.style.left);
    let y = parseFloat(logoElement.style.top);
    let dx = (Math.random() - 0.5) * 2; // Random X velocity
    let dy = (Math.random() - 0.5) * 2; // Random Y velocity
    let size = initialSize;
    const speed = 0.5;

    // Array of random CSS filter effects
    const effects = [
        'none',
        'invert(1)',
        'hue-rotate(90deg)',
        'hue-rotate(180deg)',
        'hue-rotate(270deg)',
        'saturate(3)',
        'contrast(2)',
        'brightness(1.5)',
        'sepia(1)',
        'grayscale(1)'
    ];

    function animate() {
        const containerHeight = window.innerHeight - 120; // Account for bottom sections
        const containerWidth = window.innerWidth;

        x += dx * speed;
        y += dy * speed;

        // Bounce off edges with highly random direction, size, and effect
        if (x <= 0 || x >= containerWidth - size) {
            dx = (Math.random() * 6) - 3; // Random between -3 and 3
            x = Math.max(0, Math.min(x, containerWidth - size));

            // Change size randomly
            const sizes = [150, 200, 250, 300, 350];
            size = sizes[Math.floor(Math.random() * sizes.length)];
            logoElement.style.width = size + 'px';
            logoElement.style.height = size + 'px';

            // Apply random visual effect
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            logoElement.querySelector('img').style.filter = randomEffect;
        }

        if (y <= 0 || y >= containerHeight - size) {
            dy = (Math.random() * 6) - 3; // Random between -3 and 3
            y = Math.max(0, Math.min(y, containerHeight - size));

            // Change size randomly
            const sizes = [150, 200, 250, 300, 350];
            size = sizes[Math.floor(Math.random() * sizes.length)];
            logoElement.style.width = size + 'px';
            logoElement.style.height = size + 'px';

            // Apply random visual effect
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            logoElement.querySelector('img').style.filter = randomEffect;
        }

        logoElement.style.left = x + 'px';
        logoElement.style.top = y + 'px';

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

// Random color on hover/tap for scroll sections
function setupScrollSectionHovers() {
    const scrollSections = document.querySelectorAll('.scroll-section');

    scrollSections.forEach(section => {
        // Desktop: hover
        section.addEventListener('mouseenter', () => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            section.style.backgroundColor = randomColor;
        });

        section.addEventListener('mouseleave', () => {
            section.style.backgroundColor = 'white';
        });

        // Mobile: tap to change color
        section.addEventListener('touchstart', (e) => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            section.style.backgroundColor = randomColor;

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

// Initialize when page loads
window.addEventListener('load', async () => {
    await loadGifData();
    initializeGifs();
    setupNavigation();
    loadScrollingSections();
    setupScrollSectionHovers();
    setupCursorTrail();
});

// Optionally refresh positions on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('gif-container');
    container.innerHTML = '';
    initializeGifs();
});
