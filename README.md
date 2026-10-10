# pearljan08.github.io

Personal portfolio of Pearl Jan Sabanal, fullstack developer. Live at **https://pearljan08.github.io**.

Built with Vite, React 19, TypeScript and Tailwind CSS v4. It has no animation or icon libraries: reveals use CSS plus `IntersectionObserver`, the screenshot viewer is a native `<dialog>`, and the icons are inline SVG.

## Editing content

All copy lives in [`src/data/profile.ts`](src/data/profile.ts): intro, roles, projects, stack and links. Components only handle layout.

To add project screenshots, put them in `src/assets/` and reference them in a project's `shots`, including each image's `width` and `height`. Keep screenshots under ~1600px wide and save them as JPEG unless they're mostly flat color.

## Scripts

```bash
npm run dev       # local dev server at http://localhost:5173
npm run build     # type-check and build to dist/
npm run deploy    # build, then publish dist/ to the gh-pages branch
```
