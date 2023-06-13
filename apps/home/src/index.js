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
    introHeaderDiv.classList.add("width-full", "margin-20px");
    introHeaderDiv.append(nameStrong);
    introHeaderDiv.append(introDescriptionSpan);

    let introShortDescSpan = document.createElement("span");
    introShortDescSpan.classList.add("heading-3", "italic", "font-weight-300");
    introShortDescSpan.innerText = content.CONTENT_INTRO_SHORT_DESC;

    let introShortDescDiv = document.createElement("div");
    introShortDescDiv.classList.add("width-full", "margin-20px");
    introShortDescDiv.append(introShortDescSpan);

    let introEmploymentCompanyAnchor = document.createElement("a");
    introEmploymentCompanyAnchor.classList.add("heading-2", "font-ubuntu", "color-purple", "slide-right", "display-inline-block");
    introEmploymentCompanyAnchor.href = "https://www.capgemini.com/";
    introEmploymentCompanyAnchor.target ="_blank";
    introEmploymentCompanyAnchor.innerText = content.CONTENT_INTRO_EMPLOYMENT_COMPANY;

    let introEmploymentDescSpan = document.createElement("span");
    introEmploymentDescSpan.classList.add("heading-3", "font-weight-300");
    introEmploymentDescSpan.innerHTML = content.CONTENT_INTRO_EMPLOYMENT_DESC + "&nbsp;";

    let introEmploymentDiv = document.createElement("div");
    introEmploymentDiv.classList.add("width-full", "margin-20px");
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
    projectsHeaderDiv.classList.add("heading-1", "font-weight-300", "width-full", "section-header");
    projectsHeaderDiv.innerText = "Projects";

    let projectsHeaderDescDiv = document.createElement("div");
    projectsHeaderDescDiv.classList.add("heading-3", "font-weight-300", "width-full", "section-desc");
    projectsHeaderDescDiv.innerText = content.CONTENT_PROJ_SHORT_DESC;

    projectsHeaderDiv.append(projectsHeaderDescDiv);

    let boggleSolverLink = document.createElement("a");
    boggleSolverLink.href = "/apps/bogglesolver/src/index.html";
    boggleSolverLink.target = "_blank";
    boggleSolverLink.innerText = "Boggle Solver";

    let coinstashLink = document.createElement("a");
    coinstashLink.href = "https://github.com/dfloren/CoinStash-public";
    coinstashLink.target = "_blank";
    coinstashLink.innerText = "Coin Stash";

    let projects = document.getElementById("projects-container");
    projects.classList.add("section-container");
    projects.append(projectsHeaderDiv);
    projects.append(projectsHeaderDescDiv);
    projects.append(boggleSolverLink);
    projects.append(coinstashLink);
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