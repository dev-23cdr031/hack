"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Award, GraduationCap, Server } from "lucide-react"

export default function DevDharrshanResume() {
  const downloadResume = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dev Dharrshan S</h1>
              <p className="text-xl text-blue-100 mb-4">Senior Backend Developer & System Architect</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>devdharrshans.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43211</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Virudhunagar,Tamil nadu,India</span>
                </div>
              </div>
              {/* Social links removed as requested */}

              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4 opacity-0" />
                  <span className="opacity-0">linkedin removed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4 opacity-0" />
                  <span className="opacity-0">github removed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4 opacity-0" />
                  <span className="opacity-0">website removed</span>
                </div>
              </div>

            </div>
            <Button onClick={downloadResume} className="bg-white text-blue-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Experienced Backend Developer and System Architect with 4+ years of expertise in building scalable,
              high-performance distributed systems. Specialized in microservices architecture, cloud-native
              applications, and handling millions of users. Proven track record of leading backend architecture for
              fintech platforms serving 500k+ users, optimizing system performance by 60%, and guideing development
              teams. Expert in modern backend technologies, DevOps practices, and database optimization.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                    <Server className="w-4 h-4" />
                    Backend Development
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Node.js, Express.js, Fastify</div>
                    <div>• Python, Django, FastAPI</div>
                    <div>• Java, Spring Boot</div>
                    <div>• Go, Gin Framework</div>
                    <div>• Microservices Architecture</div>
                    <div>• RESTful APIs, GraphQL</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-cyan-700 mb-2">Databases & Storage</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• PostgreSQL, MySQL</div>
                    <div>• MongoDB, DynamoDB</div>
                    <div>• Redis, Memcached</div>
                    <div>• Elasticsearch, Apache Solr</div>
                    <div>• Database Design & Optimization</div>
                    <div>• Data Modeling & Migration</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-indigo-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-indigo-700 mb-2">Cloud & DevOps</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• AWS (EC2, Lambda, RDS, S3)</div>
                    <div>• Docker, Kubernetes</div>
                    <div>• CI/CD (Jenkins, GitHub Actions)</div>
                    <div>• Terraform, CloudFormation</div>
                    <div>• Monitoring (Prometheus, Grafana)</div>
                    <div>• Load Balancing & Auto-scaling</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
              Professional Experience
            </h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Senior Backend Developer & Tech Lead</h3>
                      <p className="text-blue-600 font-medium">TechFlow Systems</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Led backend architecture for fintech platform serving 500k+ active users</li>
                    <li>• Designed and implemented microservices architecture reducing system latency by 60%</li>
                    <li>• Built high-throughput payment processing system handling 10k+ transactions/minute</li>
                    <li>• Guideed team of 5 junior developers and conducted technical interviews</li>
                    <li>• Implemented automated testing and CI/CD pipelines improving deployment frequency by 300%</li>
                    <li>
                      • Optimized database queries and implemented caching strategies reducing response time by 70%
                    </li>
                    <li>• Collaborated with product and frontend teams to define API specifications</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Backend Software Engineer</h3>
                      <p className="text-cyan-600 font-medium">DataCorp Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2020 - December 2020</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed APIs and microservices for data processing pipelines handling 1TB+ daily data</li>
                    <li>• Implemented real-time data streaming using Apache Kafka and Redis</li>
                    <li>• Built automated data validation and quality assurance systems</li>
                    <li>• Optimized ETL processes reducing processing time from hours to minutes</li>
                    <li>• Collaborated with data science team to deploy ML models in production</li>
                    <li>• Maintained 99.9% uptime for critical data processing services</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-indigo-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Junior Backend Developer</h3>
                      <p className="text-indigo-600 font-medium">StartupTech Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">July 2019 - May 2020</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed RESTful APIs using Node.js and Express.js for e-commerce platform</li>
                    <li>• Implemented user authentication and authorization systems</li>
                    <li>• Worked with PostgreSQL database design and optimization</li>
                    <li>• Participated in code reviews and agile development processes</li>
                    <li>• Contributed to open-source projects and internal tool development</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Education</h2>
            <Card className="border-l-4 border-blue-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Bachelor of Engineering in Computer Science and design</h3>
                    <p className="text-blue-600 font-medium">kongu engineering college,Perundurai,Erode</p>
                  </div>
                  <span className="text-gray-500 text-sm">2023 - 2027</span>
                </div>
                <p className="text-gray-700">
                  CGPA: 9.2/10 | Relevant Coursework: Data Structures & Algorithms, Database Management Systems,
                  Computer Networks, Operating Systems, Software Engineering, Distributed Systems
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">Key Projects</h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">E-commerce Microservices Platform</h3>
                  <p className="text-gray-700 mb-3">
                    Scalable microservices architecture handling 100k+ daily transactions with user management,
                    inventory, payments, and real-time notifications. Implemented event-driven architecture with message
                    queues.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Node.js</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">PostgreSQL</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Redis</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Docker</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">AWS</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 99.9% uptime • Sub-100ms response time • Handles 10k concurrent users
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-cyan-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Chat System</h3>
                  <p className="text-gray-700 mb-3">
                    High-performance chat system supporting 10k+ concurrent users with WebSocket connections, message
                    persistence, file sharing, and real-time presence indicators.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Socket.io</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Node.js</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">MongoDB</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Redis</span>
                    <span className="px-2 py-1 bg-cyan-100 text-cyan-700 text-xs rounded">Kubernetes</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 10k+ concurrent connections • Real-time message delivery • Horizontal scaling
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
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
                    <li>• AWS Certified Solutions Architect Professional (2023)</li>
                    <li>• Hackathon Winner - Backend Challenge 2022</li>
                    <li>• Tech Lead of the Year - TechFlow Systems 2023</li>
                    <li>• Best Final Year Project - VTU 2019</li>
                    <li>• Open Source Contributor - Node.js Performance Library (2k+ stars)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Professional Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AWS Certified Solutions Architect Professional</li>
                    <li>• AWS Certified Developer Associate</li>
                    <li>• Certified Kubernetes Administrator (CKA)</li>
                    <li>• MongoDB Certified Developer</li>
                    <li>• Docker Certified Associate</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• English (Fluent)</li>
                  <li>• Tamil (Native)</li>
                  <li>• Hindi (Conversational)</li>
                  <li>• Kannada (Basic)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Interests</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Distributed Systems Architecture</li>
                  <li>• Cloud-Native Technologies</li>
                  <li>• Open Source Contributions</li>
                  <li>• Technical Writing & Guideing</li>
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
