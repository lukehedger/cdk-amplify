import {
  App,
  CustomRule,
  GitHubSourceCodeProvider,
} from "@aws-cdk/aws-amplify";
import { BuildSpec } from "@aws-cdk/aws-codebuild";
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
      buildSpec: BuildSpec.fromObject({
        version: 1,
        applications: [
          {
            appRoot: "app",
            frontend: {
              artifacts: {
                baseDirectory: "public",
                files: ["**/*"],
              },
              cache: {
                paths: ["node_modules/**/*"],
              },
              customHeaders: [
                {
                  headers: [
                    {
                      key: "Content-Security-Policy",
                      value: "default-src self",
                    },
                    {
                      key: "Strict-Transport-Security",
                      value: "max-age=31536000; includeSubDomains",
                    },
                    {
                      key: "X-Content-Type-Options",
                      value: "nosniff",
                    },
                    {
                      key: "X-Frame-Options",
                      value: "SAMEORIGIN",
                    },
                    { key: "X-XSS-Protection", value: "1; mode=block" },
                  ],
                  pattern: "**/*",
                },
              ],
              phases: {
                preBuild: {
                  commands: ["yarn install --ignore-engines"],
                },
                build: {
                  commands: ["yarn build"],
                },
                test: {
                  commands: ["yarn test"],
                },
              },
            },
          },
        ],
      }),
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
