import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const sourceDir = path.join(root, "case-assets/bruteforce-ui");
const captureDir = path.join(root, "images/generated/bruteforce-ui");

await mkdir(captureDir, { recursive: true });

if (!existsSync(chrome)) {
    throw new Error(`Chrome executable not found: ${chrome}`);
}

const requested = process.argv.slice(2).length
    ? process.argv.slice(2).map((value) => Number(value))
    : Array.from({ length: 97 }, (_, index) => index + 1);

const captured = [];
const skipped = [];

for (const number of requested) {
    const id = String(number).padStart(2, "0");
    const html = path.join(sourceDir, `case-ui-${id}.html`);
    const png = path.join(captureDir, `case-capture-${id}.png`);

    if (!existsSync(html)) {
        skipped.push(`case-ui-${id}.html`);
        continue;
    }

    execFileSync(chrome, [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=3200",
        "--window-size=1440,900",
        `--screenshot=${png}`,
        `file://${html}`
    ], { stdio: "ignore" });

    captured.push(path.relative(root, png));
}

console.log(JSON.stringify({ captured, skipped }, null, 2));
