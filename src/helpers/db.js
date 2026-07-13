import fs from "fs";

/**
 * Reads an NDJSON file and parses each line.
 * Automatically detects and migrates old LowDB JSON formats.
 * 
 * @param {string} filePath 
 * @returns {Array<object>}
 */
export function readNdjson(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const trimmed = content.trim();

    // Check for backward-compatible migration from old LowDB sync format (JSON object)
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
            const oldData = JSON.parse(trimmed);
            if (oldData && Array.isArray(oldData.sessions)) {
                const sessions = oldData.sessions;
                writeNdjson(filePath, sessions);
                console.log(`Migrated database at ${filePath} to NDJSON format.`);
                return sessions;
            }
        } catch (e) {
            // Not JSON or parse failed, fallback to NDJSON processing
        }
    }

    return content
        .split("\n")
        .filter(line => line.trim() !== "")
        .map((line, idx) => {
            try {
                return JSON.parse(line);
            } catch (e) {
                console.error(`Failed to parse DB line ${idx + 1}: "${line}"`, e);
                return null;
            }
        })
        .filter(Boolean);
}

/**
 * Appends a single object as a JSON line to the NDJSON file.
 * 
 * @param {string} filePath 
 * @param {object} data 
 */
export function appendNdjson(filePath, data) {
    fs.appendFileSync(filePath, JSON.stringify(data) + "\n", "utf-8");
}

/**
 * Overwrites the NDJSON file with the list of objects.
 * 
 * @param {string} filePath 
 * @param {Array<object>} list 
 */
export function writeNdjson(filePath, list) {
    const content = list.map(item => JSON.stringify(item)).join("\n") + "\n";
    fs.writeFileSync(filePath, content, "utf-8");
}
