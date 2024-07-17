import { ConfigInterface } from "../config/config";
import * as github from "@actions/github";
import { GithubClient } from "../github/github";
import * as core from "@actions/core";

export class UserData {
  config: ConfigInterface;

  constructor(config: ConfigInterface) {
    this.config = config;
  }

  async getUserData(): Promise<string> {
    const ghClient = new GithubClient(this.config);
    const githubActionRunnerVersion = await ghClient.getRunnerVersion();
    const runnerRegistrationToken = await ghClient.getRunnerRegistrationToken();
    if (!this.config.githubActionRunnerLabel)
      throw Error("failed to object job ID for label");

    if (this.config.preRunnerScript) {
      core.info("Running Pre-runner Script");
    }

    const cmds = [
      "#!/bin/bash",
      "yum install git -y",
      "sudo yum install docker git libicu -y",
      "sudo systemctl enable docker",
      `shutdown -P +${this.config.ec2InstanceTtl}`,
      "CURRENT_PATH=$(pwd)",
      this.config.preRunnerScript
        ? `echo "${this.config.preRunnerScript}" > $CURRENT_PATH/pre_runner_script.sh
          chmod +x $CURRENT_PATH/pre_runner_script.sh
          sh $CURRENT_PATH/pre_runner_script.sh`
        : "",
      `echo "shutdown -P +1" > $CURRENT_PATH/shutdown_script.sh`,
      "chmod +x $CURRENT_PATH/shutdown_script.sh",
      this.config.manualStop
        ? ""
        : "export ACTIONS_RUNNER_HOOK_JOB_COMPLETED=$CURRENT_PATH/shutdown_script.sh",
      "mkdir -p actions-runner && cd actions-runner",
      this.config.manualStop
        ? ""
        : 'echo "ACTIONS_RUNNER_HOOK_JOB_COMPLETED=$CURRENT_PATH/shutdown_script.sh" > .env',
      `GH_RUNNER_VERSION=${githubActionRunnerVersion}`,
      'case $(uname -m) in aarch64) ARCH="arm64" ;; amd64|x86_64) ARCH="x64" ;; esac && export RUNNER_ARCH=${ARCH}',
      "curl -O -L https://github.com/actions/runner/releases/download/v${GH_RUNNER_VERSION}/actions-runner-linux-${RUNNER_ARCH}-${GH_RUNNER_VERSION}.tar.gz",
      "tar xzf ./actions-runner-linux-${RUNNER_ARCH}-${GH_RUNNER_VERSION}.tar.gz",
      "export RUNNER_ALLOW_RUNASROOT=1",
      `RUNNER_NAME=${this.config.githubJobId}-$(hostname)-ec2`,
      '[ -n "$(command -v yum)" ] && yum install libicu -y',
      `./config.sh --unattended ${
        this.config.manualStop ? "" : "--ephemeral"
      } --url https://github.com/${github.context.repo.owner}/${
        github.context.repo.repo
      } --token ${runnerRegistrationToken.token} --labels ${
        this.config.githubActionRunnerLabel
      } --name $RUNNER_NAME`,
      "./run.sh",
    ];

    return Buffer.from(cmds.join("\n")).toString("base64");
  }
}
