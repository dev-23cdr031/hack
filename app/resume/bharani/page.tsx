"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
  Cloud,
} from "lucide-react"

export default function BharaniResume() {
  const downloadResume = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Bharani N</h1>
              <p className="text-xl text-cyan-100 mb-4">Senior Full Stack Developer & Cloud Solutions Architect</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>bharanin.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 79045 80284</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Tiruppur,Tamil Nadu,India</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin.com/in/bharani</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>github.com/bharani</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>bharani.com</span>
                </div>
              </div>
            </div>
            <Button onClick={downloadResume} className="bg-white text-cyan-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Experienced Full Stack Developer and Cloud Solutions Architect with 5+ years of expertise in building
              scalable cloud-native applications and modern web solutions. Expert in architecting robust systems that
              handle enterprise-level challenges while maintaining optimal performance and security. Proven track record
              of leading development of cloud-native applications serving 1M+ users, reducing infrastructure costs by
              40%, and guideing development teams. Specialized in microservices architecture, DevOps practices, and
              multi-cloud deployments.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-cyan-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Full Stack Development
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• React, Next.js, Vue.js, Angular</div>
                    <div>• Node.js, Express.js, Nest.js</div>
                    <div>• TypeScript, JavaScript (ES6+)</div>
                    <div>• Python, Django, FastAPI</div>
                    <div>• Java, Spring Boot</div>
                    <div>• HTML5, CSS3, SASS</div>
                    <div>• Tailwind CSS, Material-UI</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Cloud & DevOps
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• AWS (EC2, Lambda, S3, RDS, EKS)</div>
                    <div>• Microsoft Azure, KEC Cloud</div>
                    <div>• Docker, Kubernetes, Helm</div>
                    <div>• Terraform, CloudFormation</div>
                    <div>• Jenkins, GitHub Actions, GitLab CI</div>
                    <div>• Prometheus, Grafana, ELK Stack</div>
                    <div>• Nginx, Apache, Load Balancers</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-indigo-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-indigo-700 mb-2">Architecture & Databases</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Microservices Architecture</div>
                    <div>• Event-Driven Architecture</div>
                    <div>• PostgreSQL, MySQL, Oracle</div>
                    <div>• MongoDB, DynamoDB, Cassandra</div>
                    <div>• Redis, Memcached, ElastiCache</div>
                    <div>• GraphQL, RESTful APIs</div>
                    <div>• Message Queues (RabbitMQ, Kafka)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Professional Experience
            </h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Senior Full Stack Developer & Tech Lead</h3>
                      <p className="text-cyan-600 font-medium">CloudTech Enterprises</p>
                    </div>
                    <span className="text-gray-500 text-sm">March 2020</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Led development of cloud-native applications serving 1M+ users with 99.9% uptime</li>
                    <li>• Architected microservices infrastructure reducing system latency by 50%</li>
                    <li>• Implemented DevOps practices improving deployment frequency by 400%</li>
                    <li>• Reduced infrastructure costs by 40% through cloud optimization strategies</li>
                    <li>• Guideed team of 8 developers and established coding standards</li>
                    <li>• Built real-time analytics platform processing 10M+ events daily</li>
                    <li>• Designed disaster recovery solutions with RTO &lt; 15 minutes</li>
                    <li>• Led migration from monolith to microservices architecture</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">DevOps Engineer & Cloud Architect</h3>
                      <p className="text-blue-600 font-medium">TechFlow Systems</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2021 - February 2022</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Implemented CI/CD pipelines reducing deployment time from hours to minutes</li>
                    <li>• Designed and deployed cloud infrastructure using Infrastructure as Code</li>
                    <li>• Set up monitoring and alerting systems improving incident response by 60%</li>
                    <li>• Automated testing and deployment processes achieving 95% test coverage</li>
                    <li>• Managed multi-cloud environments across AWS, Azure, and GCP</li>
                    <li>• Implemented security best practices and compliance standards</li>
                    <li>• Optimized database performance improving query response time by 70%</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Full Stack Developer</h3>
                      <p className="text-indigo-600 font-medium">InnovateSoft Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">July 2022 - May 2023</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed responsive web applications using React and Node.js</li>
                    <li>• Built RESTful APIs and integrated third-party services</li>
                    <li>• Implemented user authentication and authorization systems</li>
                    <li>• Optimized application performance and implemented caching strategies</li>
                    <li>• Collaborated with UX designers to implement pixel-perfect interfaces</li>
                    <li>• Participated in code reviews and maintained high code quality standards</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">Education</h2>
            <Card className="border-l-4 border-cyan-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Bachelor of engineering in computer science and design
                    </h3>
                    <p className="text-cyan-600 font-medium">kongu Engineering college,perundurai,erode</p>
                  </div>
                  <span className="text-gray-500 text-sm">2023-2027</span>
                </div>
                <p className="text-gray-700 mb-2">
                  CGPA: 8.9/10 | Specialization: Cloud Computing & Distributed Systems
                </p>
                <p className="text-gray-700">
                  Relevant Coursework: Data Structures & Algorithms, Database Management Systems, Computer Networks,
                  Operating Systems, Software Engineering, Cloud Computing, Distributed Systems
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">Key Projects</h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Parking Management System</h3>
                  <p className="text-gray-700 mb-3">
                    IoT-enabled smart parking solution with real-time availability tracking, mobile app integration, and
                    automated payment processing for urban parking management. Deployed across 5 cities.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Node.js</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">IoT</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">AWS</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">MongoDB</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 50k+ parking spots managed • 90% user satisfaction • 30% revenue increase
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Cloud Cost Optimization Platform</h3>
                  <p className="text-gray-700 mb-3">
                    Enterprise cloud cost management platform with AI-powered recommendations, automated resource
                    optimization, and detailed analytics dashboard for multi-cloud environments.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">AWS</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Terraform</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Docker</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 40% cost reduction • Used by 100+ enterprises • $2M+ savings generated
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-indigo-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">E-commerce Microservices Platform</h3>
                  <p className="text-gray-700 mb-3">
                    Scalable e-commerce platform built with microservices architecture supporting 1M+ concurrent users,
                    real-time inventory management, and automated scaling.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Microservices</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Kubernetes</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">PostgreSQL</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Redis</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded">Kafka</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 1M+ concurrent users • 99.9% uptime • 50ms average response time
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Achievements & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Awards & Recognition</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Cloud Innovation Award - Best Cloud Solution 2022</li>
                    <li>• Tech Lead of the Year - CloudTech Enterprises 2023</li>
                    <li>• AWS Community Builder - 2022, 2023</li>
                    <li>• Speaker at 10+ cloud and DevOps conferences</li>
                    <li>• Open Source Contributor - 5+ popular projects</li>
                    <li>• Hackathon Winner - Smart City Challenge 2021</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-cyan-500" />
                    <h3 className="font-semibold text-gray-800">Professional Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AWS Certified Solutions Architect Professional (2023)</li>
                    <li>• AWS Certified DevOps Engineer Professional (2022)</li>
                    <li>• Microsoft Azure Solutions Architect Expert (2023)</li>
                    <li>• KEC Cloud Professional Cloud Architect (2022)</li>
                    <li>• Certified Kubernetes Administrator (CKA) (2022)</li>
                    <li>• Docker Certified Associate (2021)</li>
                    <li>• Terraform Associate Certification (2023)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Leadership & Guideing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Leadership & Guideing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Team Leadership</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Led cross-functional teams of 15+ members</li>
                    <li>• Managed $2M+ cloud infrastructure budget</li>
                    <li>• Established development best practices and standards</li>
                    <li>• Conducted technical interviews for 50+ candidates</li>
                    <li>• Implemented agile methodologies improving delivery by 60%</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Knowledge Sharing</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Guideed 20+ junior developers and interns</li>
                    <li>• Conducted 30+ technical workshops and training sessions</li>
                    <li>• Published 15+ technical articles (50k+ views)</li>
                    <li>• Created internal documentation and best practices guides</li>
                    <li>• Regular speaker at tech meetups and conferences</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Contributions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Technical Contributions
            </h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Open Source Projects</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Cloud-Config-Manager - Infrastructure automation tool (3k+ stars)</li>
                    <li>• React-Performance-Monitor - Performance monitoring library (2k+ downloads)</li>
                    <li>• Kubernetes-Cost-Optimizer - K8s resource optimization (1.5k+ stars)</li>
                    <li>• DevOps-Toolkit - Collection of DevOps utilities (800+ forks)</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Technical Publications</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• "Microservices Architecture Patterns" - Tech Blog Series (25k+ views)</li>
                    <li>• "Cloud Cost Optimization Strategies" - Industry White Paper</li>
                    <li>• "Kubernetes Best Practices" - Conference Presentation</li>
                    <li>• "DevOps Culture Transformation" - Case Study Publication</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-200 pb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• English (Fluent)</li>
                  <li>• Telugu (Native)</li>
                  <li>• Hindi (Conversational)</li>
                  <li>• Tamil (Basic)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Interests</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Cloud-Native Architecture</li>
                  <li>• DevOps & Site Reliability Engineering</li>
                  <li>• Serverless Computing</li>
                  <li>• Container Orchestration</li>
                  <li>• Infrastructure as Code</li>
                  <li>• Performance Optimization</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
