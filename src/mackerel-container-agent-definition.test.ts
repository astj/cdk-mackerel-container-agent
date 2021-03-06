import {
  Ec2TaskDefinition,
  FargateTaskDefinition,
  NetworkMode,
} from "@aws-cdk/aws-ecs"
import { Stack } from "@aws-cdk/cdk"
import { MackerelContainerAgentDefinition } from "./mackerel-container-agent-definition"

describe("MackerelContainerAgentDefinition", () => {
  describe("EC2", () => {
    test("add to task definition with only required props", () => {
      const stack = new Stack()
      const taskDefinition = new Ec2TaskDefinition(stack, "TaskDefinition", {})
      const container = new MackerelContainerAgentDefinition(
        stack,
        "mackerel-container-agent",
        {
          apiKey: "keep-my-secret",
          taskDefinition,
        }
      )
      expect(stack.toCloudFormation()).toMatchSnapshot()
    })

    test("with roles", () => {
      const stack = new Stack()
      const taskDefinition = new Ec2TaskDefinition(stack, "TaskDefinition", {})
      const container = new MackerelContainerAgentDefinition(
        stack,
        "mackerel-container-agent",
        {
          apiKey: "keep-my-secret",
          roles: [
            { service: "My-service", role: "db" },
            { service: "My-service", role: "proxy" },
          ],
          taskDefinition,
        }
      )
      expect(stack.toCloudFormation()).toMatchSnapshot()
    })

    test("specify ignoreContainer", () => {
      const stack = new Stack()
      const taskDefinition = new Ec2TaskDefinition(stack, "TaskDefinition", {})
      const container = new MackerelContainerAgentDefinition(
        stack,
        "mackerel-container-agent",
        {
          apiKey: "keep-my-secret",
          ignoreContainer: "(mackerel|xray)",
          taskDefinition,
        }
      )
      expect(stack.toCloudFormation()).toMatchSnapshot()
    })
  })

  describe("EC2 (awsvpc)", () => {
    test("add to task definition", () => {
      const stack = new Stack()
      const taskDefinition = new Ec2TaskDefinition(stack, "TaskDefinition", {
        networkMode: NetworkMode.AwsVpc,
      })
      const container = new MackerelContainerAgentDefinition(
        stack,
        "mackerel-container-agent",
        {
          apiKey: "keep-my-secret",
          taskDefinition,
        }
      )
      expect(container.mountPoints).toHaveLength(0)
      expect(stack.toCloudFormation()).toMatchSnapshot()
    })
  })

  describe("Fargate", () => {
    test("add to task definition", () => {
      const stack = new Stack()
      const taskDefinition = new FargateTaskDefinition(
        stack,
        "TaskDefinition",
        {}
      )
      const container = new MackerelContainerAgentDefinition(
        stack,
        "mackerel-container-agent",
        {
          apiKey: "keep-my-secret",
          taskDefinition,
        }
      )
      expect(container.mountPoints).toHaveLength(0)
      expect(stack.toCloudFormation()).toMatchSnapshot()
    })
  })
})
