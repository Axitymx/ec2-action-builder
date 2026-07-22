const defaultInputs: Record<string, string> = {
    INPUT_MANUAL_STOP: "false",
    INPUT_ACTION: "start",
    INPUT_PRE_RUNNER_SCRIPT: "",
    INPUT_AWS_ACCESS_KEY_ID: "test-access-key-id",
    INPUT_AWS_SECRET_ACCESS_KEY: "test-secret-access-key",
    INPUT_AWS_SESSION_TOKEN: "",
    INPUT_AWS_REGION: "us-west-2",
    INPUT_AWS_IAM_ROLE_ARN: "",
    INPUT_GITHUB_TOKEN: "test-github-token",
    INPUT_GITHUB_ACTION_RUNNER_VERSION: "",
    INPUT_EC2_INSTANCE_TYPE: "c5.large",
    INPUT_EC2_AMI_ID: "ami-1234567890abcdef0",
    INPUT_EC2_ROOT_DISK_SIZE_GB: "0",
    INPUT_EC2_ROOT_DISK_EBS_CLASS: "gp2",
    INPUT_EC2_INSTANCE_IAM_ROLE: "",
    INPUT_EC2_INSTANCE_TAGS: "",
    INPUT_EC2_INSTANCE_TTL: "60",
    INPUT_EC2_SECURITY_GROUP_ID: "sg-1234567890abcdef0",
    INPUT_EC2_SUBNET_ID: "subnet-1234567890abcdef0",
    INPUT_EC2_SPOT_INSTANCE_STRATEGY: "none"
};

const runExternalIntegrationTests = ["1", "true", "yes"].includes(
    (process.env.RUN_EXTERNAL_INTEGRATION_TESTS || "").toLowerCase()
);

export { runExternalIntegrationTests };
