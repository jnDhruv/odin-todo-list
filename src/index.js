import projectController from "./modules/controllers/projectController";
import sidebar from "./modules/ui/sidebar";
import loadProjectPage from "./modules/ui/loadProjectPage";

import "./styles/layout.css";

function assignEventListeners() {
  const githubButton = document.querySelector("#repo-redirect");
  githubButton.addEventListener("click", () =>
    window.open("https://github.com/jnDhruv/odin-todo-list", "_blank"),
  );

  const closeDiagButton = document.querySelectorAll(".close-dialog-button");
  closeDiagButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      button.parentElement.parentElement.reset();
      button.parentElement.parentElement.parentElement.close();
    });
  });
}

function init() {
  assignEventListeners();
  sidebar.render();
  loadProjectPage.init();
}

init();
