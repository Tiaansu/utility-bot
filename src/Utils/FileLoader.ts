import { globSync } from "glob";
import path from "path";

export default async function loadFiles(directory: string) {
    const files = globSync(`${path.join(__dirname.split(path.sep).join('/'), `/../${directory}`).replace(/\\/g, '/')}/**/*{.ts,.js}`);
    files.forEach((file) => delete require.cache[require.resolve(file)]);
    return files;
}