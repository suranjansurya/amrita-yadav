import { execSync } from 'child_process';

console.log("Running npm install with IPv4 DNS forcing...");
try {
  const output = execSync('npm install --dns-result-order=ipv4first --no-audit --no-fund', {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, NODE_OPTIONS: '--dns-result-order=ipv4first' }
  });
  console.log("Success:\n", output);
} catch (err) {
  console.error("Error stdout:\n", err.stdout);
  console.error("Error stderr:\n", err.stderr);
}
