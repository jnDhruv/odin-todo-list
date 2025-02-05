import projectController from "./modules/controllers/projectController";
import sidebar from "./modules/ui/sidebar";
import loadProjectPage from "./modules/ui/loadProjectPage";

import './styles/layout.css';

sidebar.render();
loadProjectPage.init();