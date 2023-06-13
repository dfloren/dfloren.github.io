import * as content from "./scripts/utilities/content.js";

const LOCAL_GALLERY_URL = "/apps/home/resources/images/gallery";
const GALLERY_EXT = ".jpg";

function createStarGifImg() {
    let img = document.createElement("img");
    img.style.width = "50px";
    img.src = "../resources/images/star.gif";
    img.alt = "rotating star";

    return img;
}

function createSlidingPointerImg() {
    let rightArrowImg = document.createElement("img");
    rightArrowImg.classList.add("slide-left-right");
    rightArrowImg.src = "../resources/images/right-arrow.svg";
    rightArrowImg.alt = "yellow right arrow";
    rightArrowImg.style.width = "25px";
    rightArrowImg.style.paddingLeft = "5px";

    return rightArrowImg;
}

(function initRootContainer() {
    let rootContainer = document.getElementById("root-container");
    rootContainer.classList.add("font-noto-sans-japanese");
})();

(function initIntro() {
    let nameStrong = document.createElement("strong");
    nameStrong.classList.add("heading-1", "font-weight-bolder", "color-light-yellow", "fade-in");
    nameStrong.textContent = content.CONTENT_INTRO_NAME;

    let introDescriptionSpan = document.createElement("span");
    introDescriptionSpan.classList.add('heading-2');
    introDescriptionSpan.innerHTML = "&nbsp;" + content.CONTENT_INTRO_DESC;

    let introHeaderDiv = document.createElement("div");
    introHeaderDiv.classList.add("padding-20px");
    introHeaderDiv.append(nameStrong);
    introHeaderDiv.append(introDescriptionSpan);

    let introShortDescSpan = document.createElement("span");
    introShortDescSpan.classList.add("heading-3", "italic", "font-weight-300");
    introShortDescSpan.innerText = content.CONTENT_INTRO_SHORT_DESC;

    let introShortDescDiv = document.createElement("div");
    introShortDescDiv.classList.add("padding-20px");
    introShortDescDiv.append(introShortDescSpan);

    let introEmploymentCompanyAnchor = document.createElement("a");
    introEmploymentCompanyAnchor.classList.add("heading-2", "font-ubuntu", "color-purple", "display-inline-block", "slide-up-on-hover");
    introEmploymentCompanyAnchor.href = "https://www.capgemini.com/";
    introEmploymentCompanyAnchor.target ="_blank";
    introEmploymentCompanyAnchor.innerText = content.CONTENT_INTRO_EMPLOYMENT_COMPANY;

    let introEmploymentDescSpan = document.createElement("span");
    introEmploymentDescSpan.classList.add("heading-3", "font-weight-300");
    introEmploymentDescSpan.innerHTML = content.CONTENT_INTRO_EMPLOYMENT_DESC + "&nbsp;";

    let introEmploymentDiv = document.createElement("div");
    introEmploymentDiv.classList.add("padding-20px");
    introEmploymentDiv.append(introEmploymentDescSpan);
    introEmploymentDiv.append(introEmploymentCompanyAnchor);

    let intro = document.getElementById("intro-container");
    intro.classList.add("section-container");
    intro.append(introHeaderDiv);
    intro.append(introShortDescDiv);
    intro.append(introEmploymentDiv);
})();

(function initProjects() {
    let projectsHeaderDiv = document.createElement("div");
    projectsHeaderDiv.classList.add("heading-1", "font-weight-300", "section-header");
    projectsHeaderDiv.innerText = "Projects";

    let projectsHeaderDescDiv = document.createElement("div");
    projectsHeaderDescDiv.classList.add("heading-3", "font-weight-300", "italic", "section-desc");
    projectsHeaderDescDiv.innerText = content.CONTENT_PROJ_SHORT_DESC;

    projectsHeaderDiv.append(projectsHeaderDescDiv);

    let boggleSolverAnchor = document.createElement("a");
    boggleSolverAnchor.classList.add("heading-2", "display-inline-block", "color-purple", "yellow-on-hover");
    boggleSolverAnchor.href = "/apps/bogglesolver/src/index.html";
    boggleSolverAnchor.target = "_blank";
    boggleSolverAnchor.innerText = "Boggle Solver";
    
    boggleSolverAnchor.append(createSlidingPointerImg());

    let boggleHeaderDiv = document.createElement("div");
    boggleHeaderDiv.classList.add("section-header");
    boggleHeaderDiv.append(boggleSolverAnchor);

    let boggleHeaderDescDiv = document.createElement("div");
    boggleHeaderDescDiv.classList.add("font-weight-300", "section-desc");
    boggleHeaderDescDiv.innerText = "A solver for the super noisy word game Boggle.";

    let boggleSolverVideo = document.createElement("video");
    boggleSolverVideo.classList.add("padding-20px");
    boggleSolverVideo.toggleAttribute("muted", true);
    boggleSolverVideo.toggleAttribute("playsinline", true);
    boggleSolverVideo.toggleAttribute("controls", true);
    boggleSolverVideo.toggleAttribute("loop", true);
    boggleSolverVideo.toggleAttribute("autoplay", true);

    let boggleSolverVideoSource = document.createElement("source");
    boggleSolverVideoSource.src = "../resources/videos/bogglesolverdemo.mp4";
    boggleSolverVideoSource.type = "video/mp4";

    boggleSolverVideo.append(boggleSolverVideoSource);

    let boggleSolverVideoDiv = document.createElement("div");
    boggleSolverVideoDiv.append(boggleSolverVideo);

    let coinStashAnchor = document.createElement("a");
    coinStashAnchor.classList.add("heading-2", "display-inline-block", "color-purple", "yellow-on-hover");
    coinStashAnchor.href = "https://github.com/dfloren/CoinStash-public";
    coinStashAnchor.target = "_blank";
    coinStashAnchor.innerText = "Coin Stash";

    coinStashAnchor.append(createSlidingPointerImg());

    let coinStashHeaderDiv = document.createElement("div");
    coinStashHeaderDiv.classList.add("section-header");
    coinStashHeaderDiv.append(coinStashAnchor);

    let coinStashHeaderDescDiv = document.createElement("div");
    coinStashHeaderDescDiv.classList.add("font-weight-300", "section-desc");
    coinStashHeaderDescDiv.innerText = "A cryptocurrency portfolio management system built with Django.";

    let coinStashVideo = document.createElement("video");
    coinStashVideo.classList.add("padding-20px");
    coinStashVideo.toggleAttribute("muted", true);
    coinStashVideo.toggleAttribute("playsinline", true);
    coinStashVideo.toggleAttribute("controls", true);
    coinStashVideo.toggleAttribute("loop", true);
    coinStashVideo.toggleAttribute("autoplay", true);

    let coinStashVideoSource = document.createElement("source");
    coinStashVideoSource.src = "../resources/videos/coinstashdemo.mp4";
    coinStashVideoSource.type = "video/mp4";

    coinStashVideo.append(coinStashVideoSource);

    let projects = document.getElementById("projects-container");
    projects.classList.add("section-container");
    projects.append(projectsHeaderDiv);
    projects.append(projectsHeaderDescDiv);

    projects.append(boggleHeaderDiv);
    projects.append(boggleHeaderDescDiv);
    projects.append(boggleSolverVideoDiv);

    projects.append(coinStashHeaderDiv)
    projects.append(coinStashHeaderDescDiv);
    projects.append(coinStashVideo);

})();


(function initGalleryHeader() {
    let galleryHeader = document.getElementById("gallery-header");

    galleryHeader.append(createStarGifImg());

    let headerSpan = document.createElement("span");
    headerSpan.classList.add("heading-1", "font-weight-300");
    headerSpan.innerText = "Gallery";
    galleryHeader.append(headerSpan);

    galleryHeader.append(createStarGifImg());
})();

// TODO: perform network request only on scroll (infinite scrolling)

for (let i = 1; i < 16; i++) {
        let img = document.createElement("img");
        img.classList.add("fade-in");

        let imgContainer = document.createElement("div");
        imgContainer.classList.add("masonry-item", "fade-in");
        document.getElementById("masonry-container").append(imgContainer);

        imgContainer.append(img);
        
        img.src = LOCAL_GALLERY_URL + "/" + i + GALLERY_EXT;
}