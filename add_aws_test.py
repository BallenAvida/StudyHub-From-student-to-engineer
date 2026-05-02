import json
import re
import os

filepath = 'data.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the JSON part
match = re.search(r'const\s+STUDY_DATA\s*=\s*(\{.*\});?$', content, re.DOTALL)
if not match:
    print("Could not find STUDY_DATA in data.js")
    exit(1)

json_str = match.group(1)
try:
    data = json.loads(json_str)
except Exception as e:
    print(f"Error parsing JSON: {e}")
    # Sometimes there are trailing commas or JS specifics, let's try a workaround if needed
    exit(1)

# AWS Part 1 Test
aws_part1 = {
    "title": "AWS Cloud Practitioner: Part 1 (Cloud Concepts & EC2)",
    "questions": [
        {
            "topic": "Module 1: Cloud Concepts",
            "question": "What is the primary benefit of cloud computing that allows you to pay only for the IT resources you consume?",
            "options": [
                {
                    "text": "Stop guessing capacity",
                    "explanation": "False. While stopping guessing capacity is a benefit (scaling on-demand), paying only for what you consume relates to the financial model.",
                    "isCorrect": False
                },
                {
                    "text": "Trade capital expense for variable expense",
                    "explanation": "¡CORRECT! (Prof: Exactly! You stop paying for massive Data Centers upfront (Capital Expense / CapEx) and instead pay for servers only when you use them like a utility bill (Variable Expense / OpEx).",
                    "isCorrect": True
                },
                {
                    "text": "Increase speed and agility",
                    "explanation": "False. Speed and agility refers to spinning up resources in minutes instead of waiting weeks for IT to rack servers.",
                    "isCorrect": False
                },
                {
                    "text": "Benefit from massive economies of scale",
                    "explanation": "False. Economies of scale means AWS buys in bulk and passes the savings to you, lowering your variable costs over time, but it doesn't define the 'pay as you go' model itself.",
                    "isCorrect": False
                }
            ]
        },
        {
            "topic": "Module 1: Cloud Concepts",
            "question": "Which cloud computing model requires the customer to manage the operating system, databases, and applications, while the cloud provider manages the underlying infrastructure (network, servers, virtualization)?",
            "options": [
                {
                    "text": "Infrastructure as a Service (IaaS)",
                    "explanation": "¡CORRECT! (Prof: Spot on! IaaS gives you the highest level of flexibility and management control over your IT resources. Think of Amazon EC2. AWS gives you the raw server, you do the rest!)",
                    "isCorrect": True
                },
                {
                    "text": "Platform as a Service (PaaS)",
                    "explanation": "False. PaaS removes the need for you to manage the underlying infrastructure (usually hardware and operating systems) and allows you to focus on the deployment and management of your applications.",
                    "isCorrect": False
                },
                {
                    "text": "Software as a Service (SaaS)",
                    "explanation": "False. SaaS provides you with a completed product that is run and managed by the service provider (like web-based email or Salesforce).",
                    "isCorrect": False
                },
                {
                    "text": "On-Premises (Private Cloud)",
                    "explanation": "False. On-premises means you are managing EVERYTHING, from the physical building and security to the servers and virtualization.",
                    "isCorrect": False
                }
            ]
        },
        {
            "topic": "Module 2: Compute in the Cloud",
            "question": "You have a batch processing job that can be interrupted and resumed without any issues. Which Amazon EC2 purchasing option will provide the most cost-effective solution?",
            "options": [
                {
                    "text": "On-Demand Instances",
                    "explanation": "False. On-Demand is for short-term, spiky, or unpredictable workloads that CANNOT be interrupted. It's the most expensive flexible option.",
                    "isCorrect": False
                },
                {
                    "text": "Reserved Instances",
                    "explanation": "False. Reserved instances give you a discount (up to 72%) but require a 1-year or 3-year commitment. It's for steady-state usage, not necessarily interruptible workloads.",
                    "isCorrect": False
                },
                {
                    "text": "Spot Instances",
                    "explanation": "¡CORRECT! (Prof: Bingo! Spot instances use spare AWS capacity at up to 90% discount. The catch? AWS can reclaim them with a 2-minute warning. Since your job can be interrupted, this is the perfect cost-saving choice!)",
                    "isCorrect": True
                },
                {
                    "text": "Dedicated Hosts",
                    "explanation": "False. Dedicated Hosts are physical servers fully dedicated to your use, usually for compliance or specific software licensing. They are the most expensive option.",
                    "isCorrect": False
                }
            ]
        },
        {
            "topic": "Module 2: Compute in the Cloud",
            "question": "What is the primary difference between Amazon EC2 and AWS Lambda?",
            "options": [
                {
                    "text": "EC2 is a managed database service, while Lambda is a compute service.",
                    "explanation": "False. EC2 is a compute service (virtual servers), not a database service.",
                    "isCorrect": False
                },
                {
                    "text": "EC2 requires you to provision and manage servers, while Lambda allows you to run code without provisioning or managing servers.",
                    "explanation": "¡CORRECT! (Prof: Yes! This is the essence of 'Serverless'. With EC2, you choose the OS, instance type, and manage the server. With Lambda, you just upload your code, and AWS executes it and scales it automatically. You only pay for the exact compute time used!)",
                    "isCorrect": True
                },
                {
                    "text": "EC2 is charged per millisecond, while Lambda is charged per hour.",
                    "explanation": "False. It's the other way around! EC2 is charged per second (or hour depending on OS), while Lambda is highly granular and charged per millisecond.",
                    "isCorrect": False
                },
                {
                    "text": "EC2 runs in a single Availability Zone, while Lambda runs globally by default.",
                    "explanation": "False. Both operate at the Regional level, though Lambda inherently runs across multiple AZs within a region for high availability.",
                    "isCorrect": False
                }
            ]
        },
        {
            "topic": "Module 2: Compute in the Cloud",
            "question": "Which AWS service is designed to automatically distribute incoming application traffic across multiple Amazon EC2 instances to ensure high availability?",
            "options": [
                {
                    "text": "Amazon Route 53",
                    "explanation": "False. Route 53 is AWS's DNS web service. It directs traffic to your application globally, but it doesn't balance loads across instances locally like an ELB does.",
                    "isCorrect": False
                },
                {
                    "text": "Auto Scaling",
                    "explanation": "False. Auto Scaling automatically adjusts the *number* of EC2 instances you have based on demand, but it doesn't distribute the traffic itself.",
                    "isCorrect": False
                },
                {
                    "text": "Elastic Load Balancing (ELB)",
                    "explanation": "¡CORRECT! (Prof: Spot on! The ELB is like a traffic cop standing in front of your servers, routing users to healthy EC2 instances so no single server gets overwhelmed.)",
                    "isCorrect": True
                },
                {
                    "text": "Amazon CloudFront",
                    "explanation": "False. CloudFront is a Content Delivery Network (CDN) that caches data globally closer to users, not a load balancer for compute traffic.",
                    "isCorrect": False
                }
            ]
        },
        {
            "topic": "Module 2: Compute in the Cloud",
            "question": "Which AWS service allows you to automatically add or remove EC2 instances to handle changes in demand?",
            "options": [
                {
                    "text": "Amazon Elastic Compute Cloud (Amazon EC2)",
                    "explanation": "False. EC2 is the service that provides the virtual servers, but you need another service to automatically scale them.",
                    "isCorrect": False
                },
                {
                    "text": "Elastic Load Balancing (ELB)",
                    "explanation": "False. ELB distributes traffic to the instances you already have. It does not create or destroy instances.",
                    "isCorrect": False
                },
                {
                    "text": "Amazon EC2 Auto Scaling",
                    "explanation": "¡CORRECT! (Prof: Exactly! Auto Scaling ensures you have the right number of instances. If demand spikes, it 'scales out' (adds instances). If demand drops, it 'scales in' (removes instances) to save you money.)",
                    "isCorrect": True
                },
                {
                    "text": "AWS Elastic Beanstalk",
                    "explanation": "False. Elastic Beanstalk is a PaaS service for deploying web applications. While it uses Auto Scaling under the hood, Auto Scaling is the core service responsible for adding/removing instances.",
                    "isCorrect": False
                }
            ]
        }
    ]
}

data['tests']['aws_part1'] = aws_part1

new_json_str = json.dumps(data, indent=2, ensure_ascii=False)
new_content = "const STUDY_DATA = " + new_json_str + ";\n"

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully added AWS Part 1 test to data.js")
