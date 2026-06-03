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

const MATEMATICAS_COURSE_PACK = {
  "id": "matematica-unidad-1",
  "title": "Matemática Unidad 1: Nivelación Matemática",
  "theme": {
    "primary": "#10b981",
    "background": "#0b1f14",
    "chalkboard": true
  },
  "modules": {
    "modulo-1": {
      "title": "Módulo 1: Jerarquía de Operaciones y Agrupación",
      "content": `
<h3>Jerarquía de Operaciones (PEMDAS / PAPOMUDAS)</h3>
<p>Cuando resolvemos operaciones combinadas, debemos seguir un orden estricto de prioridad para obtener el resultado correcto:</p>
<ol>
    <li><b>PA:</b> Paréntesis (desde el más interno al más externo: redondos $()$, corchetes $[]$, llaves $\\{\\}$).</li>
    <li><b>PO:</b> Potencias y raíces.</li>
    <li><b>MU - DI:</b> Multiplicación y división (de izquierda a derecha).</li>
    <li><b>A - S:</b> Adición y sustracción (de izquierda a derecha).</li>
</ol>

<h3>Propiedades Clave</h3>
<ul>
    <li><b>Ley Distributiva:</b> Permite multiplicar un término por una suma o resta de la siguiente manera:
        <p>$$a \\cdot (b + c) = a \\cdot b + a \\cdot c$$</p>
    </li>
</ul>

<h3>Ejemplo Paso a Paso</h3>
<p>Resuelva la expresión: $$3 + 2 \\times (4 - 1)^2 \\div 3$$</p>
<ul>
    <li><b>Paso 1:</b> Resolver paréntesis:
        <p>$$(4 - 1) = 3 \\implies 3 + 2 \\times (3)^2 \\div 3$$</p>
    </li>
    <li><b>Paso 2:</b> Resolver potencias:
        <p>$$(3)^2 = 9 \\implies 3 + 2 \\times 9 \\div 3$$</p>
    </li>
    <li><b>Paso 3:</b> Multiplicación y división (de izquierda a derecha):
        <ul>
            <li>Multiplicar: $$2 \\times 9 = 18$$</li>
            <li>Dividir: $$18 \\div 3 = 6$$</li>
        </ul>
        <p>Queda: $$3 + 6$$</p>
    </li>
    <li><b>Paso 4:</b> Sumar al final:
        <p>$$3 + 6 = 9$$</p>
    </li>
</ul>
      `,
      "questions": [
        {
          "topic": "Jerarquía de Operaciones",
          "question": "¿Cuál es el resultado de la siguiente operación combinada?\n$$3 + 2 \\cdot (4 - 1)^2 \\div 3$$",
          "options": ["5", "9", "7", "11"],
          "correct": 1,
          "explanation": "1. Resolvemos el paréntesis: $$(4 - 1) = 3$$\n2. Resolvemos la potencia: $$3^2 = 9$$\n3. Realizamos la multiplicación y división de izquierda a derecha:\n$$2 \\cdot 9 = 18$$\n$$18 \\div 3 = 6$$\n4. Sumamos al final: $$3 + 6 = 9$$."
        },
        {
          "topic": "Jerarquía de Operaciones",
          "question": "Resuelve el siguiente ejercicio eliminando los signos de agrupación:\n$$5 + 3 \\cdot [2 \\cdot (8 - 5) - 4]$$",
          "options": ["11", "17", "23", "9"],
          "correct": 0,
          "explanation": "1. Resolvemos el paréntesis interno: $$(8 - 5) = 3$$\n2. Realizamos la multiplicación en el corchete: $$2 \\cdot 3 = 6$$\n3. Restamos en el corchete: $$6 - 4 = 2$$\n4. Multiplicamos el corchete por el factor externo: $$3 \\cdot 2 = 6$$\n5. Suma final: $$5 + 6 = 11$$."
        },
        {
          "topic": "Jerarquía de Operaciones",
          "question": "Calcule el resultado de:\n$$[2 \\cdot (5 - 3)^3] \\div 4 + 1$$",
          "options": ["3", "5", "7", "4"],
          "correct": 1,
          "explanation": "1. Paréntesis: $$(5 - 3) = 2$$\n2. Potencia: $$2^3 = 8$$\n3. Multiplicación: $$2 \\cdot 8 = 16$$\n4. División: $$16 \\div 4 = 4$$\n5. Suma: $$4 + 1 = 5$$."
        },
        {
          "topic": "Jerarquía de Operaciones",
          "question": "¿Cuál es el valor obtenido al resolver:\n$$18 \\div 3 \\cdot 2 - (5 - 2)^2$$",
          "options": ["3", "5", "12", "-3"],
          "correct": 0,
          "explanation": "1. Paréntesis: $$(5 - 2) = 3$$\n2. Potencia: $$3^2 = 9$$\n3. División y multiplicación de izquierda a derecha:\n$$18 \\div 3 = 6$$\n$$6 \\cdot 2 = 12$$\n4. Resta final: $$12 - 9 = 3$$."
        }
      ]
    },
    "modulo-2": {
      "title": "Módulo 2: Números Enteros y Regla de Signos",
      "content": `
<h3>El Conjunto de los Números Enteros ($\mathbb{Z}$)</h3>
<p>El conjunto $\mathbb{Z}$ incluye los números positivos, negativos y el cero: $$\mathbb{Z} = \\{..., -3, -2, -1, 0, 1, 2, 3, ...\\}$$</p>

<h3>Suma y Resta en $\mathbb{Z}$</h3>
<ul>
    <li><b>Signos Iguales:</b> Se suman sus valores absolutos y se conserva el signo común.
        <p>$$(-5) + (-3) = -8 \\quad \\text{y} \\quad 5 + 3 = 8$$</p>
    </li>
    <li><b>Signos Distintos:</b> Se resta el de menor valor absoluto al de mayor valor absoluto y se conserva el signo del número con mayor valor absoluto.
        <p>$$(-9) + 5 = -4 \\quad \\text{y} \\quad 9 + (-5) = 4$$</p>
    </li>
</ul>

<h3>Multiplicación y División en $\mathbb{Z}$ (Regla de Signos)</h3>
<p>Para multiplicar o dividir números enteros, se aplica la siguiente regla de signos:</p>
<table style="width: 100%; border-collapse: collapse; text-align: center; margin: 15px 0;">
    <thead>
        <tr style="border-bottom: 2px solid #fff;">
            <th style="padding: 8px;">Operación</th>
            <th style="padding: 8px;">Resultado</th>
            <th style="padding: 8px;">Ejemplo</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="padding: 8px; border: 1px solid #fff;">$(+) \\cdot (+)$ o $(+) \\div (+)$</td>
            <td style="padding: 8px; border: 1px solid #fff;"><b>$+$ (Positivo)</b></td>
            <td style="padding: 8px; border: 1px solid #fff;">$5 \\cdot 3 = 15$</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #fff;">$(-) \\cdot (-)$ o $(-) \\div (-)$</td>
            <td style="padding: 8px; border: 1px solid #fff;"><b>$+$ (Positivo)</b></td>
            <td style="padding: 8px; border: 1px solid #fff;">$(-5) \\cdot (-3) = 15$</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #fff;">$(+) \\cdot (-)$ o $(+) \\div (-)$</td>
            <td style="padding: 8px; border: 1px solid #fff;"><b>$-$ (Negativo)</b></td>
            <td style="padding: 8px; border: 1px solid #fff;">$5 \\cdot (-3) = -15$</td>
        </tr>
        <tr>
            <td style="padding: 8px; border: 1px solid #fff;">$(-) \\cdot (+)$ o $(-) \\div (+)$</td>
            <td style="padding: 8px; border: 1px solid #fff;"><b>$-$ (Negativo)</b></td>
            <td style="padding: 8px; border: 1px solid #fff;">$(-5) \\cdot 3 = -15$</td>
        </tr>
    </tbody>
</table>

<p><b>Ejemplo Combinado:</b> $$(-4) \\times (-9) \\div 3 = 36 \\div 3 = 12$$</p>
      `,
      "questions": [
        {
          "topic": "Números Enteros",
          "question": "¿Cuál es el resultado de la siguiente multiplicación y división combinada?\n$$(-4) \\cdot (-9) \\div (-3)$$",
          "options": ["12", "-12", "-36", "36"],
          "correct": 1,
          "explanation": "1. Multiplicamos de izquierda a derecha: $$(-4) \\cdot (-9) = 36$$ (negativo por negativo es positivo).\n2. Dividimos por el siguiente factor: $$36 \\div (-3) = -12$$ (positivo dividido por negativo es negativo)."
        },
        {
          "topic": "Números Enteros",
          "question": "Resuelve:\n$$(-2) \\cdot [(-5) \\cdot 3 + 10]$$",
          "options": ["-10", "10", "5", "-5"],
          "correct": 1,
          "explanation": "1. En el corchete: $$(-5) \\cdot 3 = -15$$\n2. Sumamos: $$-15 + 10 = -5$$\n3. Multiplicamos externamente: $$(-2) \\cdot (-5) = 10$$ (negativo por negativo da positivo)."
        },
        {
          "topic": "Números Enteros",
          "question": "Calcule el resultado de la expresión:\n$$-18 \\div [(-3) \\cdot (-2) + (-3)]$$",
          "options": ["-6", "6", "-3", "3"],
          "correct": 0,
          "explanation": "1. Resolvemos el producto en el corchete: $$(-3) \\cdot (-2) = 6$$\n2. Sumamos: $$6 + (-3) = 6 - 3 = 3$$\n3. Dividimos externamente: $$-18 \\div 3 = -6$$."
        }
      ]
    },
    "modulo-3": {
      "title": "Módulo 3: Números Racionales (Fracciones y Decimales)",
      "content": `
<h3>El Conjunto de los Números Racionales ($\mathbb{Q}$)</h3>
<p>Son todos aquellos números que pueden escribirse como una fracción $\\frac{a}{b}$, donde $a$ y $b$ son enteros, y $b \\neq 0$: $$\mathbb{Q} = \\left\\{\\frac{a}{b} \\ \\middle| \\ a, b \\in \\mathbb{Z}, b \\neq 0\\right\\}$$</p>

<h3>Operaciones con Fracciones</h3>
<ul>
    <li><b>Suma/Resta de Igual Denominador:</b> Se mantiene el denominador y se operan los numeradores:
        <p>$$\\frac{a}{c} \\pm \\frac{b}{c} = \\frac{a \\pm b}{c}$$</p>
    </li>
    <li><b>Suma/Resta de Distinto Denominador:</b> Buscamos mínimo común múltiplo o multiplicamos cruzado:
        <p>$$\\frac{3}{5} + \\frac{4}{9} = \\frac{3 \\cdot 9 + 4 \\cdot 5}{45} = \\frac{27 + 20}{45} = \\frac{47}{45}$$</p>
    </li>
    <li><b>Multiplicación:</b> Numerador por numerador y denominador por denominador:
        <p>$$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$$</p>
    </li>
    <li><b>División:</b> Multiplicar el dividendo por el recíproco del divisor:
        <p>$$\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$$</p>
    </li>
</ul>

<h3>Conversión de Decimal a Fracción</h3>
<ol>
    <li><b>Decimal Finito:</b> Numerador sin coma, denominador potencia de 10:
        <p>$$2,5 = \\frac{25}{10} = \\frac{5}{2}$$</p>
    </li>
    <li><b>Decimal Infinito Periódico:</b> Numerador con número completo menos parte no periódica, denominador tantos nueves como cifras periódicas:
        <p>$$0,\\overline{6} = \\frac{6 - 0}{9} = \\frac{6}{9} = \\frac{2}{3}$$</p>
    </li>
    <li><b>Decimal Infinito Semi-periódico:</b> Numerador con número completo menos parte no periódica, denominador con nueves y ceros:
        <p>$$0,1\\overline{6} = \\frac{16 - 1}{90} = \\frac{15}{90} = \\frac{1}{6}$$</p>
    </li>
</ol>
      `,
      "questions": [
        {
          "topic": "Números Racionales",
          "question": "Ordene de menor a mayor o compare las siguientes fracciones:\n$$\\frac{6}{7} \\quad \\text{y} \\quad \\frac{8}{9}$$",
          "options": [
            "\\frac{6}{7} > \\frac{8}{9}",
            "\\frac{6}{7} < \\frac{8}{9}",
            "\\frac{6}{7} = \\frac{8}{9}",
            "No se pueden comparar"
          ],
          "correct": 1,
          "explanation": "Multiplicando de forma cruzada:\n$$6 \\cdot 9 = 54$$\n$$8 \\cdot 7 = 56$$\nComo $$54 < 56$$, concluimos que: $$\\frac{6}{7} < \\frac{8}{9}$$."
        },
        {
          "topic": "Números Racionales",
          "question": "Convierta el decimal finito $$2,5$$ a su fracción irreductible correspondiente.",
          "options": ["\\frac{5}{2}", "\\frac{25}{10}", "\\frac{12}{5}", "\\frac{3}{2}"],
          "correct": 0,
          "explanation": "1. Como decimal finito, colocamos en el numerador el número sin coma: $$25$$\n2. Denominador: un uno con tantos ceros como decimales tenga (un cero): $$10$$\n$$\\frac{25}{10}$$\n3. Simplificamos por 5: $$\\frac{25 \\div 5}{10 \\div 5} = \\frac{5}{2}$$."
        },
        {
          "topic": "Números Racionales",
          "question": "Convierta el decimal infinito periódico $$0,\\overline{3}$$ a una fracción simplificada.",
          "options": ["\\frac{1}{3}", "\\frac{3}{10}", "\\frac{3}{90}", "\\frac{1}{9}"],
          "correct": 0,
          "explanation": "1. En el numerador se coloca el número completo sin coma ni barra menos la parte entera (no periódica): $$3 - 0 = 3$$\n2. En el denominador tantos nueves como dígitos bajo la barra periódica (un dígito): $$9$$\n$$\\frac{3}{9}$$\n3. Simplificamos por 3: $$\\frac{3 \\div 3}{9 \\div 3} = \\frac{1}{3}$$."
        }
      ]
    },
    "modulo-4": {
      "title": "Módulo 4: Potencias y Raíces (Propiedades)",
      "content": `
<h3>Potencias</h3>
<p>Es una forma abreviada de escribir una multiplicación repetida: $$a^n = a \\cdot a \\cdot a \\cdot ... \\cdot a \\quad \\text{($n$ veces)}$$</p>

<h3>Propiedades de Potencias</h3>
<ol>
    <li><b>Multiplicación de igual base:</b> $$a^n \\cdot a^m = a^{n+m}$$</li>
    <li><b>División de igual base:</b> $$a^n \\div a^m = a^{n-m}$$</li>
    <li><b>Potencia de una potencia:</b> $$(a^n)^m = a^{n \\cdot m}$$</li>
    <li><b>Exponente negativo:</b> $$a^{-n} = \\frac{1}{a^n} \\quad \\text{o} \\quad \\left(\\frac{a}{b}\\right)^{-n} = \\left(\\frac{b}{a}\\right)^n$$</li>
</ol>

<h3>Raíces y Propiedades</h3>
<ul>
    <li><b>Raíz de un producto:</b> $$\\sqrt[n]{a \\cdot b} = \\sqrt[n]{a} \\cdot \\sqrt[n]{b}$$</li>
    <li><b>Raíz de un cociente:</b> $$\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}$$</li>
    <li><b>Raíz de una raíz:</b> $$\\sqrt[m]{\\sqrt[n]{a}} = \\sqrt[m \\cdot n]{a}$$</li>
    <li><b>Suma y Resta de Radicales Semejantes:</b> Solo se pueden sumar o restar radicales con igual índice y subradical.
        <p>$$\\sqrt{75} - \\sqrt{27} = \\sqrt{25 \\cdot 3} - \\sqrt{9 \\cdot 3} = 5\\sqrt{3} - 3\\sqrt{3} = 2\\sqrt{3}$$</p>
    </li>
</ul>
      `,
      "questions": [
        {
          "topic": "Potencias y Raíces",
          "question": "Aplique propiedades de las potencias para simplificar la siguiente expresión:\n$$(-2) \\cdot (-2)^5 \\cdot (-2)^8 \\cdot (-2)^{10}$$",
          "options": ["(-2)^{24}", "(-2)^{23}", "2^{24}", "(-2)^{13}"],
          "correct": 0,
          "explanation": "Al multiplicar potencias de igual base se mantiene la base y se suman los exponentes (recordando que el primer término tiene exponente 1):\n$$(-2)^1 \\cdot (-2)^5 \\cdot (-2)^8 \\cdot (-2)^{10} = (-2)^{1+5+8+10} = (-2)^{24}$$."
        },
        {
          "topic": "Potencias y Raíces",
          "question": "¿Cuál es el valor simplificado de la siguiente potencia con exponente negativo?\n$$\\left(\\frac{3}{4}\\right)^{-3}$$",
          "options": ["\\frac{27}{64}", "\\frac{64}{27}", "-\\frac{27}{64}", "-\\frac{64}{27}"],
          "correct": 1,
          "explanation": "1. Invertimos la base para cambiar el signo del exponente: $$\\left(\\frac{3}{4}\\right)^{-3} = \\left(\\frac{4}{3}\\right)^3$$\n2. Elevamos al cubo numerador y denominador: $$\\frac{4^3}{3^3} = \\frac{64}{27}$$."
        },
        {
          "topic": "Potencias y Raíces",
          "question": "Simplifique la expresión radical:\n$$\\sqrt{75} - \\sqrt{27}$$",
          "options": ["2\\sqrt{3}", "3\\sqrt{2}", "8\\sqrt{3}", "\\sqrt{48}"],
          "correct": 0,
          "explanation": "1. Descomponemos los subradicales en factores con raíz cuadrada exacta: $$\\sqrt{75} = \\sqrt{25 \\cdot 3} = 5\\sqrt{3}$$, $$\\sqrt{27} = \\sqrt{9 \\cdot 3} = 3\\sqrt{3}$$\n2. Restamos los términos semejantes: $$5\\sqrt{3} - 3\\sqrt{3} = 2\\sqrt{3}$$."
        },
        {
          "topic": "Potencias y Raíces",
          "question": "Aplique propiedades de raíces para calcular la raíz de una raíz:\n$$\\sqrt{\\sqrt[3]{64}}$$",
          "options": ["2", "\\sqrt[5]{64}", "\\sqrt[6]{64}", "4"],
          "correct": 0,
          "explanation": "1. Multiplicamos los índices de las raíces: $$\\sqrt[2]{\\sqrt[3]{64}} = \\sqrt[6]{64}$$\n2. Resolvemos numéricamente: como $$2^6 = 64$$, entonces $$\\sqrt[6]{64} = 2$$."
        }
      ]
    },
    "modulo-5": {
      "title": "Módulo 5: Razones, Proporciones y Porcentajes",
      "content": `
<h3>Razones</h3>
<p>Comparación por cociente entre dos cantidades $a$ y $b$: $$\\text{Razón} = \\frac{a}{b} \\quad \\text{o} \\quad a : b \\quad (\\text{se lee: } a \\text{ es a } b)$$</p>
<p>Donde $a$ es el <b>antecedente</b> y $b$ es el <b>consecuente</b>.</p>

<h3>Proporciones</h3>
<p>Igualdad entre dos razones: $$\\frac{a}{b} = \\frac{c}{d} \\quad \\text{o} \\quad a : b = c : d$$</p>
<p><b>Teorema Fundamental:</b> El producto de los extremos es igual al producto de los medios: $$a \\cdot d = b \\cdot c$$</p>

<h3>Tipos de Proporcionalidad</h3>
<ul>
    <li><b>Proporcionalidad Directa:</b> Dos variables aumentan o disminuyen juntas de manera constante (el cociente $\\frac{y}{x} = k$ es constante).
        <p><i>Ejemplo:</i> Si 1 endulzante cuesta $2.400, 2 costarán $4.800, etc.</p>
    </li>
    <li><b>Proporcionalidad Inversa:</b> Al aumentar una variable, la otra disminuye (el producto $x \\cdot y = k$ es constante).
        <p><i>Ejemplo:</i> Si 5 obreros tardan 10 días ($5 \\cdot 10 = 50$), entonces 25 obreros tardarán 2 días ($25 \\cdot 2 = 50$).</p>
    </li>
</ul>

<h3>Porcentajes</h3>
<p>Un porcentaje es una razón con consecuente 100: $$p\\% = \\frac{p}{100}$$</p>
<p><b>Cálculo Práctico (Regla de Tres):</b> Para calcular el $20\\%$ de descuento en un precio de $\$15.990$:</p>
<p>$$\\text{Descuento} = 15.990 \\cdot \\frac{20}{100} = 15.990 \\cdot 0,2 = 3.198$$</p>
      `,
      "questions": [
        {
          "topic": "Razones y Proporciones",
          "question": "En una villa participan 125 mujeres y 350 hombres en un estudio. ¿Cuál es la razón simplificada entre las mujeres y el total de participantes?",
          "options": ["5 : 14", "5 : 19", "14 : 19", "25 : 70"],
          "correct": 1,
          "explanation": "1. Calculamos el total de personas: $$125 + 350 = 475$$\n2. Escribimos la razón de mujeres al total: $$\\frac{125}{475}$$\n3. Simplificamos por 25: $$\\frac{125 \\div 25}{475 \\div 25} = \\frac{5}{19}$$ o bien $$5 : 19$$."
        },
        {
          "topic": "Razones y Proporciones",
          "question": "Utilizando el teorema fundamental de las proporciones, encuentre el valor de \\(x\\) en:\n$$\\frac{3}{8} = \\frac{12}{x}$$",
          "options": ["32", "24", "36", "18"],
          "correct": 0,
          "explanation": "Por el Teorema Fundamental de las Proporciones (multiplicación cruzada):\n$$3 \\cdot x = 8 \\cdot 12$$\n$$3x = 96$$\n$$x = 96 \\div 3 = 32$$."
        },
        {
          "topic": "Razones y Proporciones",
          "question": "Si 5 obreros tardan 10 días en terminar una obra. ¿Cuántos obreros se necesitan para terminar la misma obra en 2 días si trabajan al mismo ritmo?",
          "options": ["1", "25", "10", "15"],
          "correct": 1,
          "explanation": "Es proporcionalidad inversa (menos días requiere más obreros). El producto es constante:\n$$5 \\cdot 10 = 50$$\nPara 2 días: $$x \\cdot 2 = 50 \\implies x = 25$$ obreros."
        },
        {
          "topic": "Razones y Proporciones",
          "question": "Calcule el 20% de descuento de un artículo cuyo precio normal es de $15.990.",
          "options": ["$3.198", "$12.792", "$2.990", "$3.500"],
          "correct": 0,
          "explanation": "El 20% de descuento se calcula multiplicando:\n$$15.990 \\cdot \\frac{20}{100} = 15.990 \\cdot 0,2 = 3.198$$."
        }
      ]
    }
  }
};

