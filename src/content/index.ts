import { basicsPosts } from "./posts-basics";
import { curlPosts } from "./posts-curls";
import { carePosts } from "./posts-care";
import { treatmentPosts } from "./posts-treatments";
import { pages } from "./pages";

export { categories } from "./categories";
export const seedContent = [...basicsPosts, ...curlPosts, ...carePosts, ...treatmentPosts, ...pages];
