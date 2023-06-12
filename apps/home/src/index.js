import * as content from "./scripts/utilities/content.js";

const LOCAL_GALLERY_URL = "/apps/home/resources/images/gallery";
const GALLERY_EXT = ".jpg";

// TODO: perform network request only on scroll (infinite scrolling)

for (let i = 1; i < 16; i++) {
        let img = document.createElement("img");
        img.classList.add("fade-in");

        let imgContainer = document.createElement("div");
        imgContainer.classList.add("gallery-item", "fade-in");
        document.getElementById("gallery-container").append(imgContainer);

        imgContainer.append(img);
        
        img.src = LOCAL_GALLERY_URL + "/" + i + GALLERY_EXT;
}

(function initIntro() {
    let boldedName = document.createElement("strong");
    boldedName.classList.add("bio-heading-1");
    boldedName.textContent = content.CONTENT_INTRO_NAME;

    let introDescription = document.createElement("span");
    introDescription.classList.add('bio-heading-2');
    introDescription.innerText = content.CONTENT_INTRO_DESC;

    let introHeader = document.createElement("div");
    introHeader.append(boldedName);
    introHeader.append(introDescription);

    let introShortDescription = document.createElement("div");
    introShortDescription.classList.add("bio-heading-3", "italic");
    introShortDescription.innerText = content.CONTENT_INTRO_SHORT_DESC;

    let introEmploymentCompany = document.createElement("a");
    introEmploymentCompany.classList.add("bio-heading-2", "font-ubuntu");
    introEmploymentCompany.href = "https://www.capgemini.com/";
    introEmploymentCompany.target ="_blank";
    introEmploymentCompany.innerText = content.CONTENT_INTRO_EMPLOYMENT_COMPANY;

    let introEmploymentDescription = document.createElement("span");
    introEmploymentDescription.classList.add("bio-heading-3");
    introEmploymentDescription.innerText = content.CONTENT_INTRO_EMPLOYMENT_DESC;

    let introEmployment = document.createElement("div");
    introEmployment.append(introEmploymentDescription);
    introEmployment.append(introEmploymentCompany);

    let intro = document.getElementById("intro-container");
    intro.classList.add("section-container");
    intro.append(introHeader);
    intro.append(introShortDescription);
    intro.append(introEmployment);
})();

(function initProjects() {
    let projectsHeader = document.createElement("h1");
    projectsHeader.innerText = "Projects";

    let boggleSolverLink = document.createElement("a");
    boggleSolverLink.href = "/apps/bogglesolver/src/index.html";
    boggleSolverLink.target = "_blank";
    boggleSolverLink.innerText = "Boggle Solver";

    let coinstashLink = document.createElement("a");
    coinstashLink.href = "https://github.com/dfloren/CoinStash-public";
    coinstashLink.target = "_blank";
    coinstashLink.innerText = "Coin Stash";

    let projects = document.getElementById("projects-container");
    projects.append(projectsHeader);
    projects.append(boggleSolverLink);
    projects.append(coinstashLink);
})();
