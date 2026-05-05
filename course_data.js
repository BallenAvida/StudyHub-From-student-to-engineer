const DEFAULT_COURSE_PACK = {
  "id": "aws-clf-c02-english",
  "title": "AWS Certified Cloud Practitioner (CLF-C02)",
  "theme": {
    "primary": "#ff9900",
    "background": "#232f3e"
  },
  "modules": {
    "domain-1": {
      "title": "Domain 1: Cloud Concepts",
      "content": "\n<h3>1.1 Define the benefits of the AWS Cloud</h3>\n<ul>\n    <li><b>Security:</b> AWS provides a highly secure infrastructure, ensuring data privacy and compliance.</li>\n    <li><b>Reliability:</b> AWS uses multiple Availability Zones (AZs) to ensure high availability and fault tolerance.</li>\n    <li><b>High Availability:</b> Systems remain accessible even if a component fails.</li>\n    <li><b>Elasticity:</b> The ability to scale computing resources up or down easily based on demand (e.g., Auto Scaling).</li>\n    <li><b>Agility:</b> Rapidly develop, test, and launch applications to innovate faster.</li>\n    <li><b>Pay-as-you-go pricing:</b> Replace large capital expenses (CapEx) with variable operational expenses (OpEx).</li>\n    <li><b>Scalability:</b> Handling growing amounts of work by adding resources.</li>\n    <li><b>Global Reach:</b> Deploy applications globally in minutes using the AWS Global Infrastructure.</li>\n    <li><b>Economies of Scale:</b> Lower costs due to massive scale.</li>\n</ul>\n\n<h3>1.2 Identify design principles of the AWS Cloud</h3>\n<ul>\n    <li><b>Well-Architected Framework:</b> A set of best practices across six pillars:\n        <ul>\n            <li>Operational Excellence</li>\n            <li>Security</li>\n            <li>Reliability</li>\n            <li>Performance Efficiency</li>\n            <li>Cost Optimization</li>\n            <li>Sustainability</li>\n        </ul>\n    </li>\n    <li><b>Design for failure:</b> Assume everything will fail and design architecture to handle component failures automatically.</li>\n    <li><b>Decoupling:</b> Separate components so they do not depend on each other tightly (e.g., using SQS, SNS).</li>\n    <li><b>Elasticity vs Scalability:</b> Scalability is about handling growth, elasticity is about matching resources to demand dynamically.</li>\n</ul>\n\n<h3>1.3 Understand the benefits of and strategies for migration</h3>\n<ul>\n    <li><b>Cloud Adoption Framework (CAF):</b> Helps organizations understand how cloud adoption transforms the way they work. Six perspectives: Business, People, Governance, Platform, Security, Operations.</li>\n    <li><b>Migration Strategies (The 7 Rs):</b>\n        <ul>\n            <li><b>Rehost (Lift and shift):</b> Move an application as-is to the cloud.</li>\n            <li><b>Replatform (Lift, tinker, and shift):</b> Make a few cloud optimizations to achieve a tangible benefit, without changing the core architecture.</li>\n            <li><b>Refactor / Re-architect:</b> Re-imagine how the application is architected and developed, typically using cloud-native features.</li>\n            <li><b>Repurchase:</b> Move to a different product, usually a SaaS offering.</li>\n            <li><b>Relocate:</b> Move infrastructure to AWS without purchasing new hardware, rewriting applications, or modifying operations (e.g., VMware Cloud on AWS).</li>\n            <li><b>Retain:</b> Do nothing for now.</li>\n            <li><b>Retire:</b> Decommission or remove applications that are no longer needed.</li>\n        </ul>\n    </li>\n</ul>\n\n<h3>1.4 Understand concepts of cloud economics</h3>\n<ul>\n    <li><b>Fixed Costs vs Variable Costs:</b> Transition from fixed on-premises costs to variable cloud costs.</li>\n    <li><b>TCO (Total Cost of Ownership):</b> A financial estimate to help evaluate direct and indirect costs related to an IT investment.</li>\n    <li><b>Right-sizing:</b> Choosing the most cost-effective instance that meets the performance requirements.</li>\n</ul>\n            ",
      "questions": [
        {
          "topic": "Cloud Concepts",
          "question": "Which AWS Cloud benefit refers to the ability to acquire resources as you need them and release resources when you no longer need them?",
          "options": [
            "Reliability",
            "Security",
            "Elasticity",
            "High availability"
          ],
          "correct": 2,
          "explanation": "Elasticity is the ability to scale computing resources up or down easily based on demand."
        },
        {
          "topic": "Cloud Concepts",
          "question": "A company wants to migrate an application to AWS without making any changes to its code. Which migration strategy is this?",
          "options": [
            "Replatform",
            "Refactor",
            "Rehost",
            "Repurchase"
          ],
          "correct": 2,
          "explanation": "Rehosting (lift and shift) involves moving applications without changing their architecture."
        },
        {
          "topic": "Cloud Concepts",
          "question": "Which design principle is part of the AWS Well-Architected Framework?",
          "options": [
            "Design for fixed capacity",
            "Design for failure",
            "Tightly couple components",
            "Provision for peak load"
          ],
          "correct": 1,
          "explanation": "Designing for failure is a key principle, ensuring systems can recover from component failures."
        }
      ]
    },
    "domain-2": {
      "title": "Domain 2: Security and Compliance",
      "content": "\n<h3>2.1 Understand the AWS Shared Responsibility Model</h3>\n<ul>\n    <li><b>AWS responsibility (\"Security OF the Cloud\"):</b> Protecting the global infrastructure (hardware, software, networking, facilities) that runs all AWS services.</li>\n    <li><b>Customer responsibility (\"Security IN the Cloud\"):</b> Securing customer data, managing IAM (Identity and Access Management), patching guest operating systems, configuring firewalls.</li>\n</ul>\n\n<h3>2.2 Understand AWS Cloud security, identity, and compliance concepts</h3>\n<ul>\n    <li><b>AWS IAM (Identity and Access Management):</b> Securely manage access to AWS services and resources. Use Multi-Factor Authentication (MFA) for the root user. Grant least privilege.</li>\n    <li><b>IAM Users, Groups, and Roles:</b> Users are individuals. Groups are collections of users. Roles are assumed by entities (users, applications, services) to obtain temporary credentials.</li>\n    <li><b>IAM Policies:</b> JSON documents that define permissions.</li>\n    <li><b>AWS WAF (Web Application Firewall):</b> Protects web applications from common web exploits (e.g., SQL injection, cross-site scripting).</li>\n    <li><b>AWS Shield:</b> Managed Distributed Denial of Service (DDoS) protection service. Shield Standard is free, Shield Advanced is paid and offers more features.</li>\n    <li><b>AWS KMS (Key Management Service):</b> Create and manage cryptographic keys to control their use across a wide range of AWS services.</li>\n    <li><b>Amazon Macie:</b> Uses machine learning to discover and protect sensitive data (like PII) in Amazon S3.</li>\n    <li><b>Amazon GuardDuty:</b> Intelligent threat detection service that continuously monitors for malicious activity and unauthorized behavior.</li>\n    <li><b>AWS Artifact:</b> Your go-to, central resource for compliance-related information that matters to you. Provides on-demand access to AWS security and compliance reports.</li>\n</ul>\n\n<h3>2.3 Identify AWS access management capabilities</h3>\n<ul>\n    <li><b>Principle of Least Privilege:</b> Giving a user only the minimum permissions needed to perform a specific task.</li>\n    <li><b>Root User:</b> The identity created when you first open your AWS account. Should only be used to create the first IAM admin user and then locked away with MFA.</li>\n</ul>\n            ",
      "questions": [
        {
          "topic": "Security",
          "question": "Under the AWS shared responsibility model, which of the following is the customer's responsibility?",
          "options": [
            "Physical security of data centers",
            "Patching infrastructure hardware",
            "Configuring security groups and firewalls",
            "Maintaining network infrastructure"
          ],
          "correct": 2,
          "explanation": "Customers are responsible for security IN the cloud, which includes configuring firewalls and security groups."
        },
        {
          "topic": "Security",
          "question": "Which AWS service is used to protect web applications from common web exploits such as SQL injection?",
          "options": [
            "AWS Shield",
            "AWS WAF",
            "Amazon GuardDuty",
            "Amazon Macie"
          ],
          "correct": 1,
          "explanation": "AWS WAF (Web Application Firewall) helps protect web applications from common web exploits."
        },
        {
          "topic": "Security",
          "question": "What is the best practice for securing the AWS account root user?",
          "options": [
            "Share the credentials with all administrators",
            "Enable Multi-Factor Authentication (MFA)",
            "Delete the root user",
            "Use the root user for daily tasks"
          ],
          "correct": 1,
          "explanation": "The root user should have MFA enabled and should not be used for everyday tasks."
        }
      ]
    },
    "domain-3": {
      "title": "Domain 3: Cloud Technology and Services",
      "content": "\n<h3>3.1 Define methods of deploying and operating in the AWS Cloud</h3>\n<ul>\n    <li><b>AWS Management Console:</b> Web-based interface for managing AWS resources.</li>\n    <li><b>AWS CLI (Command Line Interface):</b> Tool to manage AWS services from the command line.</li>\n    <li><b>AWS SDKs (Software Development Kits):</b> APIs tailored to your programming language or platform.</li>\n    <li><b>AWS CloudFormation:</b> Infrastructure as Code (IaC). Provision and manage resources using templates.</li>\n</ul>\n\n<h3>3.2 Define the AWS global infrastructure</h3>\n<ul>\n    <li><b>Regions:</b> Physical locations around the world with clusters of data centers.</li>\n    <li><b>Availability Zones (AZs):</b> One or more discrete data centers with redundant power, networking, and connectivity in an AWS Region.</li>\n    <li><b>Edge Locations:</b> Endpoints for AWS used for caching content (CloudFront) closer to users.</li>\n</ul>\n\n<h3>3.3 Identify core AWS compute services</h3>\n<ul>\n    <li><b>Amazon EC2 (Elastic Compute Cloud):</b> Virtual servers in the cloud.</li>\n    <li><b>AWS Lambda:</b> Serverless compute service that runs code in response to events.</li>\n    <li><b>Amazon ECS / EKS:</b> Container management services (Docker and Kubernetes).</li>\n</ul>\n\n<h3>3.4 Identify core AWS database services</h3>\n<ul>\n    <li><b>Amazon RDS (Relational Database Service):</b> Managed relational databases (MySQL, PostgreSQL, Oracle, SQL Server, Aurora).</li>\n    <li><b>Amazon DynamoDB:</b> Fast and flexible NoSQL database service for any scale.</li>\n    <li><b>Amazon Redshift:</b> Fast, simple, cost-effective data warehousing.</li>\n</ul>\n\n<h3>3.5 Identify core AWS network services</h3>\n<ul>\n    <li><b>Amazon VPC (Virtual Private Cloud):</b> Logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define.</li>\n    <li><b>Amazon Route 53:</b> Highly available and scalable cloud Domain Name System (DNS) web service.</li>\n    <li><b>Amazon CloudFront:</b> Global Content Delivery Network (CDN) service.</li>\n</ul>\n\n<h3>3.6 Identify core AWS storage services</h3>\n<ul>\n    <li><b>Amazon S3 (Simple Storage Service):</b> Object storage built to store and retrieve any amount of data from anywhere.</li>\n    <li><b>Amazon EBS (Elastic Block Store):</b> Block storage volumes for use with EC2 instances.</li>\n    <li><b>Amazon EFS (Elastic File System):</b> Simple, scalable file storage for use with EC2 instances.</li>\n</ul>\n            ",
      "questions": [
        {
          "topic": "Technology",
          "question": "Which AWS service provides a fully managed NoSQL database?",
          "options": [
            "Amazon RDS",
            "Amazon Redshift",
            "Amazon DynamoDB",
            "Amazon Aurora"
          ],
          "correct": 2,
          "explanation": "Amazon DynamoDB is a key-value and document database that delivers single-digit millisecond performance at any scale."
        },
        {
          "topic": "Technology",
          "question": "What is the primary function of Amazon Route 53?",
          "options": [
            "Content Delivery Network (CDN)",
            "Domain Name System (DNS) web service",
            "Load balancing traffic",
            "Virtual Private Cloud routing"
          ],
          "correct": 1,
          "explanation": "Amazon Route 53 is a highly available and scalable cloud DNS web service."
        },
        {
          "topic": "Technology",
          "question": "Which service allows you to run code without provisioning or managing servers?",
          "options": [
            "Amazon EC2",
            "AWS Lambda",
            "Amazon ECS",
            "AWS Elastic Beanstalk"
          ],
          "correct": 1,
          "explanation": "AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers."
        }
      ]
    },
    "domain-4": {
      "title": "Domain 4: Billing, Pricing, and Support",
      "content": "\n<h3>4.1 Compare AWS pricing models</h3>\n<ul>\n    <li><b>On-Demand:</b> Pay for compute or database capacity by the hour or second with no long-term commitments.</li>\n    <li><b>Reserved Instances (RIs):</b> Provide a significant discount (up to 75%) compared to On-Demand pricing and provide a capacity reservation when used in a specific AZ. Ideal for steady-state workloads.</li>\n    <li><b>Savings Plans:</b> Flexible pricing model offering lower prices compared to On-Demand pricing, in exchange for a specific usage commitment (measured in $/hour) for a 1 or 3-year period.</li>\n    <li><b>Spot Instances:</b> Request spare Amazon EC2 computing capacity for up to 90% off the On-Demand price. Can be interrupted. Good for flexible, fault-tolerant workloads.</li>\n</ul>\n\n<h3>4.2 Understand resources for billing, pricing, and support</h3>\n<ul>\n    <li><b>AWS Cost Explorer:</b> Tool to view and analyze your costs and usage. You can view data for up to the last 12 months, forecast costs, and get recommendations.</li>\n    <li><b>AWS Budgets:</b> Set custom budgets to alert you when your costs or usage exceed (or are forecasted to exceed) your budgeted amount.</li>\n    <li><b>AWS Pricing Calculator:</b> Estimate the cost for your architecture solution.</li>\n    <li><b>AWS Support Plans:</b>\n        <ul>\n            <li><b>Basic:</b> Free. Account and billing questions, service limit increases.</li>\n            <li><b>Developer:</b> Best practice guidance. Email access to Cloud Support Associates during business hours.</li>\n            <li><b>Business:</b> 24x7 phone, email, and chat access to Cloud Support Engineers. AWS Trusted Advisor full checks.</li>\n            <li><b>Enterprise:</b> Includes a Technical Account Manager (TAM) and Concierge Support Team.</li>\n        </ul>\n    </li>\n    <li><b>AWS Trusted Advisor:</b> Online tool that provides real-time guidance to help you provision your resources following AWS best practices (Cost Optimization, Performance, Security, Fault Tolerance, Service Limits).</li>\n    <li><b>AWS Organizations:</b> Centrally manage and govern your environment as you grow and scale your AWS resources. Offers Consolidated Billing.</li>\n</ul>\n            ",
      "questions": [
        {
          "topic": "Billing",
          "question": "Which EC2 pricing model provides the deepest discount for steady-state workloads and requires a 1 or 3-year commitment?",
          "options": [
            "On-Demand Instances",
            "Spot Instances",
            "Reserved Instances",
            "Dedicated Hosts"
          ],
          "correct": 2,
          "explanation": "Reserved Instances provide a significant discount compared to On-Demand pricing for steady-state workloads."
        },
        {
          "topic": "Billing",
          "question": "Which AWS tool provides real-time guidance following AWS best practices to help you optimize costs and improve security?",
          "options": [
            "AWS Cost Explorer",
            "AWS Budgets",
            "AWS Trusted Advisor",
            "AWS Pricing Calculator"
          ],
          "correct": 2,
          "explanation": "AWS Trusted Advisor provides real-time guidance on best practices across five categories, including cost optimization and security."
        },
        {
          "topic": "Billing",
          "question": "Which AWS Support plan provides access to a designated Technical Account Manager (TAM)?",
          "options": [
            "Basic Support",
            "Developer Support",
            "Business Support",
            "Enterprise Support"
          ],
          "correct": 3,
          "explanation": "The Enterprise Support plan is the only plan that includes a designated Technical Account Manager (TAM)."
        }
      ]
    }
  }
};
