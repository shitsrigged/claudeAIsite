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
    const x = Math.random() * (window.innerWidth - maxSize) + padding;
    const y = Math.random() * (window.innerHeight - maxSize) + padding;
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

    let hideTimeout = null;
    let isPinned = false;

    // Show info box on hover
    gifDiv.addEventListener('mouseenter', () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }
        infoBox.classList.add('active');
    });

    gifDiv.addEventListener('mouseleave', () => {
        if (!isPinned) {
            hideTimeout = setTimeout(() => {
                infoBox.classList.add('dither-fade');
                setTimeout(() => {
                    infoBox.classList.remove('active');
                    infoBox.classList.remove('dither-fade');
                }, 500);
            }, 1000);
        }
    });

    // Click to pin/unpin the info box
    gifDiv.addEventListener('click', (e) => {
        e.stopPropagation();
        if (hideTimeout) {
            clearTimeout(hideTimeout);
        }

        if (isPinned) {
            isPinned = false;
            infoBox.classList.remove('active');
        } else {
            isPinned = true;
            infoBox.classList.add('active');
        }
    });
}

// Drag functionality
function makeDraggable(element) {
    let isDragging = false;
    let wasDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    element.addEventListener('mousedown', dragStart);
    element.addEventListener('touchstart', dragStart);

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }

        if (e.target === element || element.contains(e.target)) {
            isDragging = true;
            wasDragging = false;
            element.style.zIndex = 100;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            wasDragging = true;

            if (e.type === 'touchmove') {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            const currentLeft = parseFloat(element.style.left) || 0;
            const currentTop = parseFloat(element.style.top) || 0;

            element.style.left = (currentLeft + currentX - (xOffset - currentX)) + 'px';
            element.style.top = (currentTop + currentY - (yOffset - currentY)) + 'px';
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;

            // Reset wasDragging after a short delay to allow click handler to check it
            setTimeout(() => {
                wasDragging = false;
            }, 10);
        }
    }

    return { get wasDragging() { return wasDragging; } };
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

    logoDiv.appendChild(img);
    container.appendChild(logoDiv);

    // Animate the logo
    animateLogo(logoDiv, size);
}

function animateLogo(logoElement, size) {
    let x = parseFloat(logoElement.style.left);
    let y = parseFloat(logoElement.style.top);
    let dx = (Math.random() - 0.5) * 2; // Random X velocity
    let dy = (Math.random() - 0.5) * 2; // Random Y velocity
    const speed = 0.5;

    function animate() {
        const containerHeight = window.innerHeight - 120; // Account for bottom sections
        const containerWidth = window.innerWidth;

        x += dx * speed;
        y += dy * speed;

        // Bounce off edges with highly random direction
        if (x <= 0 || x >= containerWidth - size) {
            dx = (Math.random() * 6) - 3; // Random between -3 and 3
            x = Math.max(0, Math.min(x, containerWidth - size));
        }

        if (y <= 0 || y >= containerHeight - size) {
            dy = (Math.random() * 6) - 3; // Random between -3 and 3
            y = Math.max(0, Math.min(y, containerHeight - size));
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

// Initialize when page loads
window.addEventListener('load', async () => {
    await loadGifData();
    initializeGifs();
    setupNavigation();
    loadScrollingSections();
    setupScrollSectionHovers();
});

// Optionally refresh positions on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('gif-container');
    container.innerHTML = '';
    initializeGifs();
});
