// Array of gif URLs from your gifs folder
const gifs = [
    'gifs/1_1_Final_gold_shrine_video_3k0001-0300_AdobeExpress.gif',
    'gifs/doja_AdobeExpress.gif',
    'gifs/french_AdobeExpress.gif',
    'gifs/Gold_Love_Potion_video__in_3k0001-0300_AdobeExpress.gif',
    'gifs/google_AdobeExpress.gif'
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

function createGif(gifUrl, container) {
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
    img.src = gifUrl;
    img.alt = 'Portfolio work';

    gifDiv.appendChild(img);
    container.appendChild(gifDiv);

    // Make draggable
    makeDraggable(gifDiv);
}

// Drag functionality
function makeDraggable(element) {
    let isDragging = false;
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
            element.style.zIndex = 100;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

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
        }
    }
}

function initializeGifs() {
    const container = document.getElementById('gif-container');

    gifs.forEach(gif => {
        createGif(gif, container);
    });
}

// Navigation info box functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const infoType = link.getAttribute('data-info');
        const infoBox = document.getElementById(`info-box-${infoType}`);

        // Show on hover
        link.addEventListener('mouseenter', () => {
            hideAllInfoBoxes();
            infoBox.classList.add('active');
        });

        // Also show on click
        link.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllInfoBoxes();
            infoBox.classList.add('active');
        });
    });

    // Hide when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('nav') && !e.target.closest('.info-box')) {
            hideAllInfoBoxes();
        }
    });
}

function hideAllInfoBoxes() {
    document.querySelectorAll('.info-box').forEach(box => {
        box.classList.remove('active');
    });
}

// Initialize when page loads
window.addEventListener('load', () => {
    initializeGifs();
    setupNavigation();
});

// Optionally refresh positions on window resize
window.addEventListener('resize', () => {
    const container = document.getElementById('gif-container');
    container.innerHTML = '';
    initializeGifs();
});
