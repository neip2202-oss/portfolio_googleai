import fs from 'fs';
let c = fs.readFileSync('src/App.tsx', 'utf8');

const imageParser = `
const getImageUrl = (url: string) => {
    if (!url) return url;
    if (typeof url !== 'string') return url;
    if (url.startsWith('data:')) return url;
    const driveMatch = url.match(/drive\\.google\\.com\\/file\\/d\\/([^/?]+)/);
    if (driveMatch && driveMatch[1]) return \`https://drive.google.com/uc?export=view&id=\${driveMatch[1]}\`;
    return url;
};
`;

if (!c.includes('const getImageUrl')) {
    c = c.replace(
        "const getExternalEmbedUrl = (url: string) => {",
        imageParser + "\\nconst getExternalEmbedUrl = (url: string) => {"
    );
}

const replacements = [
    ['src={project.media.thumbnail}', 'src={getImageUrl(project.media.thumbnail)}'],
    ['src={selectedProject.media.thumbnail}', 'src={getImageUrl(selectedProject.media.thumbnail)}'],
    ['src={aboutData.profileImage}', 'src={getImageUrl(aboutData.profileImage)}'],
    ['src={game.image}', 'src={getImageUrl(game.image)}'],
    ['src={game.iconUrl}', 'src={getImageUrl(game.iconUrl)}'],
    ['src={item.iconImg}', 'src={getImageUrl(item.iconImg)}'],
    ['src={tool.customIcon}', 'src={getImageUrl(tool.customIcon)}'],
    ['src={customIcon}', 'src={getImageUrl(customIcon)}'],
    ['src={selectedProject.media.externalImage}', 'src={getImageUrl(selectedProject.media.externalImage)}'],
    ['src={currentSlide}', 'src={getImageUrl(currentSlide)}']
];

replacements.forEach(([target, replacement]) => {
    c = c.replaceAll(target, replacement);
});

const sectionIconsTargets = ['tech', 'timeline', 'activitiesLeft', 'certifications', 'activities'];
sectionIconsTargets.forEach(key => {
    c = c.replaceAll(`src={sectionIcons.${key}}`, `src={getImageUrl(sectionIcons.${key})}`);
});

fs.writeFileSync('src/App.tsx', c);
console.log('Image parser injected successfully');
