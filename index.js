const webp = require('webp-converter');
const fs = require('fs');
const path = require('path');

// Grant permission to the webp executables
webp.grant_permission();

const qualityArgIndex = process.argv.findIndex((arg) => arg.includes('-q') || arg.includes('--quality'));
const quality = qualityArgIndex >= 0 ? process.argv[qualityArgIndex + 1] : '80';
const inputFiles = qualityArgIndex >= 0 ? process.argv.filter((_, idx) => ![qualityArgIndex, qualityArgIndex + 1].includes(idx)).slice(2) : process.argv.slice(2);
const outputDir = path.join(process.env.HOME, 'Downloads/generated-webp');

if (inputFiles.length === 0) {
    console.error("Please provide at least one input image path.");
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

inputFiles.forEach(inputFilePath => {
    if (!fs.existsSync(inputFilePath)) {
        console.error(`Input file does not exist: ${inputFilePath}`);
        return;
    }

    const inputExtension = path.extname(inputFilePath).toLowerCase();
    if (inputExtension !== '.png' && inputExtension !== '.jpg' && inputExtension !== '.jpeg') {
        console.error(`Input file must be a PNG or JPG image: ${inputFilePath}`);
        return;
    }

    const inputFileName = path.basename(inputFilePath, inputExtension);
    const outputFilePath = path.join(outputDir, `${inputFileName}.webp`);

    const result = webp.cwebp(inputFilePath, outputFilePath, `-q ${quality}`, "-v");
    result.then((_) => {
        console.log('\x1b[36m%s\x1b[0m', `\nSuccess Converted`);
        console.log(`${inputFilePath}\nto\n${outputFilePath}`)
    }).catch(err => {
        console.error(`Failed to convert ${inputFilePath}:`, err);
    });
});
