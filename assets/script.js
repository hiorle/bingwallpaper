document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.getElementById('wallpapers-container');
    const paginationDiv = document.getElementById('pagination');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageNumbersDiv = document.getElementById('pageNumbers');

    const itemsPerPage = 36;
    let currentPage = 1;
    let allData = [];
    const suffix = '_UHD.jpg&rf=LaDigue_UHD.jpg&pid=hp&w=960&h=540&rs=1&c=4';
    const visiblePageLinks = 3;

    function displayWallpapers(page) {
        contentDiv.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentData = allData.slice(startIndex, endIndex);

        currentData.forEach(item => {
            const div = document.createElement('div');
            const img = document.createElement('img');
            img.src = item.image_urlbase + suffix;
            img.alt = `Bing Wallpaper`;
            div.addEventListener('click', () => {
                localStorage.setItem('fullscreenImageBaseUrl', item.image_urlbase);
                const viewerUrl = `fullscreen.html`;
                window.open(viewerUrl, '_blank');
            });
            const span = document.createElement('span');
            span.textContent = item.copyright;
            const br = document.createElement('br');
            div.appendChild(img);
            div.appendChild(span);
            div.appendChild(br);
            contentDiv.appendChild(div);
        });

        window.scrollTo(0, 0);
    }

    function updatePaginationButtons() {
        prevPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === Math.ceil(allData.length / itemsPerPage);

        pageNumbersDiv.innerHTML = '';
        const totalPages = Math.ceil(allData.length / itemsPerPage);

        let startPage = Math.max(1, currentPage - Math.floor(visiblePageLinks / 2));
        let endPage = Math.min(totalPages, currentPage + Math.floor(visiblePageLinks / 2));

        if (endPage - startPage + 1 < visiblePageLinks) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, visiblePageLinks);
            } else {
                startPage = Math.max(1, totalPages - visiblePageLinks + 1);
            }
        }

        if (startPage > 1) {
            const firstPageLink = document.createElement('button');
            firstPageLink.textContent = 1;
            firstPageLink.addEventListener('click', () => {
                currentPage = 1;
                displayWallpapers(currentPage);
                updatePaginationButtons();
            });
            pageNumbersDiv.appendChild(firstPageLink);

            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pageNumbersDiv.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageLink = document.createElement('button');
            pageLink.textContent = i;
            if (i === currentPage) {
                pageLink.classList.add('active');
            }
            pageLink.addEventListener('click', () => {
                currentPage = i;
                displayWallpapers(currentPage);
                updatePaginationButtons();
            });
            pageNumbersDiv.appendChild(pageLink);
        }

        if (endPage < totalPages) {
            if (totalPages - endPage > 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                pageNumbersDiv.appendChild(ellipsis);
            }

            const lastPageLink = document.createElement('button');
            lastPageLink.textContent = totalPages;
            lastPageLink.addEventListener('click', () => {
                currentPage = totalPages;
                displayWallpapers(currentPage);
                updatePaginationButtons();
            });
            pageNumbersDiv.appendChild(lastPageLink);
        }
    }

    fetch('data/data.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            displayWallpapers(currentPage);
            updatePaginationButtons();
            paginationDiv.style.display = 'flex';
        })
        .catch(error => console.error('Error fetching data:', error));

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayWallpapers(currentPage);
            updatePaginationButtons();
        }
    });

    nextPageButton.addEventListener('click', () => {
        const totalPages = Math.ceil(allData.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayWallpapers(currentPage);
            updatePaginationButtons();
        }
    });
});