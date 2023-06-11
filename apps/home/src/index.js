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
    let introHeader = document.createElement("h1");
    introHeader.innerText = "Daniel Florendo";

    let intro = document.getElementById("intro-container");
    intro.classList.add("section-container");
    intro.append(introHeader);
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
