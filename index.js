const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const waitForUrl = async (url, MAX_TIMEOUT) => {
  const iterations = MAX_TIMEOUT / 2;
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url);
      return;
    } catch (e) {
      console.log("Url unavailable, retrying...");
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`);
};

const run = async () => {
  try {
    //const commit = github.context.payload.pull_request.head.sha;
    const PR_NUMBER = github.context.payload.number;
    const MAX_TIMEOUT = Number(core.getInput("site_name")) || 60;
    const siteName = core.getInput("site_name");
    if (!siteName) {
      core.setFailed("Required field `site_name` was not provided");
    }
    // const url = `https://${commit}--${siteName}.netlify.app`;
    const url = `https://deploy-preview-${PR_NUMBER}--${siteName}.netlify.com`;
    core.setOutput("url", url);
    console.log(`Waiting for a 200 from: ${url}`);
    await waitForUrl(url, MAX_TIMEOUT);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
