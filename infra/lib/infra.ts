import {
  App,
  CustomRule,
  GitHubSourceCodeProvider,
} from "@aws-cdk/aws-amplify";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const amplifyAppName = "CDKAmplifyApp";

    const amplifyApp = new App(this, amplifyAppName, {
      appName: amplifyAppName,
      autoBranchCreation: {
        autoBuild: true,
        environmentVariables: {
          API_ENV: "sandbox",
        },
        pullRequestPreview: true,
      },
      environmentVariables: {
        API_ENV: "production",
      },
      sourceCodeProvider: new GitHubSourceCodeProvider({
        oauthToken: SecretValue.secretsManager("dev/Tread/GitHubToken"),
        owner: "lukehedger",
        repository: "cdk-amplify",
      }),
    });

    amplifyApp.addCustomRule(CustomRule.SINGLE_PAGE_APPLICATION_REDIRECT);
  }
}
