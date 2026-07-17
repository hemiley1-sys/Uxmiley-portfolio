import { Router, type IRouter } from "express";
import healthRouter from "./health";
import heroRouter from "./content/hero";
import aboutRouter from "./content/about";
import skillsRouter from "./content/skills";
import projectsRouter from "./content/projects";
import experiencesRouter from "./content/experiences";
import testimonialsRouter from "./content/testimonials";
import articlesRouter from "./content/articles";
import contactRouter from "./content/contact";

const router: IRouter = Router();

router.use(healthRouter);
router.use(heroRouter);
router.use(aboutRouter);
router.use(skillsRouter);
router.use(projectsRouter);
router.use(experiencesRouter);
router.use(testimonialsRouter);
router.use(articlesRouter);
router.use(contactRouter);

export default router;
