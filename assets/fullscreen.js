document.addEventListener("DOMContentLoaded", function () {
  const viewerImage = document.getElementById("viewer-image");
  const copyrightInfo = document.getElementById("copyright-info");
  const prevButton = document.getElementById("prev-image");
  const nextButton = document.getElementById("next-image");
  const imageViewerContainer = document.getElementById("image-viewer-container");
  let allData = [];
  let currentIndex = -1;
  const highResSuffix = "_UHD.jpg";
  let touchStartX = 0;
  const swipeThreshold = 50;
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get("date");

  fetch("../../data/data.json")
    .then((response) => response.json())
    .then((data) => {
      allData = data;
      currentIndex = allData.findIndex((item) => item.image_date === date);
      if (currentIndex === -1) {
        console.error("未找到对应的日期:", date);
        return;
      }
      displayImage(currentIndex);
    })
    .catch((error) => console.error("Error fetching data:", error));

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

  function updateURL(index) {
    const newDate = allData[index].image_date;
    window.history.pushState({}, "", `fullscreen?date=${newDate}`);
  }

  prevButton.addEventListener("click", () => {
    if (allData.length > 0) {
      currentIndex = (currentIndex + 1 + allData.length) % allData.length;
      displayImage(currentIndex);
      updateURL(currentIndex);
    }
  });

  nextButton.addEventListener("click", () => {
    if (allData.length > 0) {
      currentIndex = (currentIndex - 1) % allData.length;
      displayImage(currentIndex);
      updateURL(currentIndex);
    }
  });

  imageViewerContainer.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  });

  imageViewerContainer.addEventListener("touchend", (e) => {
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
          updateURL(currentIndex);
        }
      } else {
        if (allData.length > 0) {
          currentIndex = (currentIndex + 1) % allData.length;
          displayImage(currentIndex);
          updateURL(currentIndex);
        }
      }
    }
    touchStartX = 0;
  });
});
