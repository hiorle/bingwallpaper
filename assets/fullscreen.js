document.addEventListener('DOMContentLoaded', function() {
    const viewerImage = document.getElementById('viewer-image');
    const copyrightInfo = document.getElementById('copyright-info');
    const prevButton = document.getElementById('prev-image');
    const nextButton = document.getElementById('next-image');
    const imageViewerContainer = document.getElementById('image-viewer-container');

    const baseUrl = localStorage.getItem('fullscreenImageBaseUrl');

    let allData = [];
    let currentIndex = -1;
    const highResSuffix = '_UHD.jpg';
    let touchStartX = 0;
    const swipeThreshold = 50;

    fetch('../../data/data.json')
        .then(response => response.json())
        .then(data => {
            allData = data;

            if (baseUrl) {
                localStorage.removeItem('fullscreenImageBaseUrl');
                currentIndex = allData.findIndex(item => item.image_urlbase === baseUrl);

                if (currentIndex === -1) {
                    console.error('Base URL not found in data.');
                    displayRandomImage();
                } else {
                    displayImage(currentIndex);
                }
            } else {
                displayRandomImage();
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    function displayImage(index) {
        if (index >= 0 && index < allData.length) {
            const item = allData[index];
            const highResUrl = item.image_urlbase + highResSuffix;
            viewerImage.src = highResUrl;
            copyrightInfo.textContent = item.copyright;

            preloadAdjacentImages(index);
        }
    }

    function preloadAdjacentImages(index) {
        if (allData.length > 1) {
            const prevIndex = (index - 1 + allData.length) % allData.length;
            const nextIndex = (index + 1) % allData.length;

            const prevImageUrl = allData[prevIndex].image_urlbase + highResSuffix;
            const nextImageUrl = allData[nextIndex].image_urlbase + highResSuffix;

            const prevImage = new Image();
            prevImage.src = prevImageUrl;

            const nextImage = new Image();
            nextImage.src = nextImageUrl;
        }
    }

    function displayRandomImage() {
        if (allData.length > 0) {
            currentIndex = Math.floor(Math.random() * allData.length);
            displayImage(currentIndex);
        } else {
            console.error('No data available to display a random image.');
        }
    }

    prevButton.addEventListener('click', () => {
        if (allData.length > 0) {
            currentIndex = (currentIndex - 1 + allData.length) % allData.length;
            displayImage(currentIndex);
        }
    });

    nextButton.addEventListener('click', () => {
        if (allData.length > 0) {
            currentIndex = (currentIndex + 1) % allData.length;
            displayImage(currentIndex);
        }
    });

    imageViewerContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, false);

    imageViewerContainer.addEventListener('touchend', (e) => {
        if (!touchStartX) {
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX > 0) {
                if (allData.length > 0) {
                    currentIndex = (currentIndex - 1 + allData.length) % allData.length;
                    displayImage(currentIndex);
                }
            } else {
                if (allData.length > 0) {
                    currentIndex = (currentIndex + 1) % allData.length;
                    displayImage(currentIndex);
                }
            }
        }
        touchStartX = 0;
    }, false);
});
