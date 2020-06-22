import "@aws-cdk/assert/jest";
import { App } from "@aws-cdk/core";
import { InfraStack } from "../infra";

let stack: InfraStack;

beforeAll(() => {
  const app = new App();

  stack = new InfraStack(app, "InfraStack");
});

test("Stack has Amplify App resource", () => {
  expect(stack).toHaveResourceLike("AWS::Amplify::App", {
    AutoBranchCreationConfig: {
      EnableAutoBranchCreation: true,
      EnableAutoBuild: true,
      EnablePullRequestPreview: true,
    },
    CustomRules: [
      {
        Source: "</^[^.]+$/>",
        Status: "200",
        Target: "/index.html",
      },
    ],
    Name: "CDKAmplifyApp",
    OauthToken:
      "{{resolve:secretsmanager:dev/Tread/GitHubToken:SecretString:::}}",
    Repository: "https://github.com/lukehedger/cdk-amplify",
  });
});
