const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd, retry = 0) {
    try {
        return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' });
    } catch (err) {
        console.error(`Error running command: ${cmd}`);
        console.error(err.stderr || err.message);
        if (retry > 0) {
            console.log(`Retrying in 2 seconds...`);
            const t = Date.now() + 2000;
            while (Date.now() < t) { } // simple busy wait for synchronous execution
            return run(cmd, retry - 1);
        }
        throw err;
    }
}

function ensureDir(filePath) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function processCommits(branchData) {
    console.log(`\n\n=== Processing Branch: ${branchData.branchName} ===`);
    run(`git checkout main`);

    // ensure branch is fresh
    try { run(`git branch -D ${branchData.branchName}`); } catch (e) { }

    run(`git checkout -b ${branchData.branchName}`);

    for (const commit of branchData.commits) {
        ensureDir(commit.file);
        if (commit.action === 'write') {
            fs.writeFileSync(PathClean(commit.file), commit.content, 'utf8');
        } else {
            fs.appendFileSync(PathClean(commit.file), commit.content, 'utf8');
        }

        run(`git add "${commit.file}"`);
        // Escape quotes in commit message
        const msg = commit.message.replace(/"/g, '\\"');
        run(`git commit -m "${msg}"`);
    }

    // push branch
    console.log(`Pushing branch ${branchData.branchName}...`);
    run(`git push -u origin ${branchData.branchName}`, 3);

    console.log(`Creating PR...`);
    const prTitle = branchData.prTitle.replace(/"/g, '\\"');
    const prBody = branchData.prBody.replace(/"/g, '\\"');

    try {
        const prCreateOutput = run(`gh pr create --title "${prTitle}" --body "${prBody}" --head ${branchData.branchName} --base main`);
        console.log(`PR Created:`, prCreateOutput.trim());

        // Auto-merge the PR
        console.log(`Merging PR...`);
        run(`gh pr merge ${branchData.branchName} --merge --delete-branch`);
        console.log(`PR Merged Successfully.`);
    } catch (e) {
        console.log(`Failed to create/merge PR using gh CLI. Falling back to manual merge.`);
        run(`git checkout main`);
        run(`git merge ${branchData.branchName}`);
        run(`git push origin main`);
        run(`git branch -d ${branchData.branchName}`);
    }
}

function PathClean(p) {
    return p.replace(/\//g, path.sep);
}

function main() {
    const plan = JSON.parse(fs.readFileSync('commit_plan.json', 'utf8'));

    // Ensure initial commit exists
    try {
        run(`git log -1`);
    } catch (e) {
        console.log('Creating initial repository setup commit...');
        fs.writeFileSync('README.md', '# Initialized Bitstack\\n');
        run('git add README.md');
        run('git commit -m "init: basic project scaffold"');
        run('git branch -M main');
        run('git push -u origin main');
    }

    for (const branchData of plan) {
        try {
            processCommits(branchData);
        } catch (err) {
            console.error(`Failed to process branch ${branchData.branchName}, skipping...`, err);
            // clean up just in case
            try { run(`git checkout main`); } catch (e) { }
        }
    }

    console.log('\\nAll branches processed and merged!');
}

main();
