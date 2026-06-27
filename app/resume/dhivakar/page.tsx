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
  Leaf,
} from "lucide-react"

export default function DhivakarResume() {
  const downloadResume = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Dhivakar V</h1>
              <p className="text-xl text-green-100 mb-4">Software Developer & Sustainability Engineer</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>dhivakarv.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 86755 57324</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Erode,Tamil Nadu,India</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin.com/in/dhivakar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>github.com/dhivakar</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>dhivakar.com</span>
                </div>
              </div>
            </div>
            <Button onClick={downloadResume} className="bg-white text-green-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Passionate Software Developer and Sustainability Engineer with 3+ years of experience building
              eco-friendly applications and leveraging technology to solve environmental challenges. Expert in
              developing data-driven solutions for renewable energy optimization, smart city infrastructure, and carbon
              footprint tracking. Proven track record of reducing energy consumption by 30% through smart algorithms and
              contributing to sustainable technology initiatives. Combines technical expertise with environmental
              consciousness to create impactful solutions.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Software Development
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Python, Django, Flask</div>
                    <div>• JavaScript, React, Node.js</div>
                    <div>• Java, Spring Framework</div>
                    <div>• PostgreSQL, MongoDB</div>
                    <div>• RESTful APIs, GraphQL</div>
                    <div>• Git, Docker, Linux</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-emerald-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-emerald-700 mb-2">Data Science & ML</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• TensorFlow, PyTorch</div>
                    <div>• Scikit-learn, Pandas, NumPy</div>
                    <div>• Jupyter Notebooks</div>
                    <div>• Time Series Analysis</div>
                    <div>• Predictive Modeling</div>
                    <div>• Data Visualization (Plotly, D3.js)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-teal-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-teal-700 mb-2 flex items-center gap-2">
                    <Leaf className="w-4 h-4" />
                    Sustainable Technology
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• IoT Systems & Sensors</div>
                    <div>• Energy Analytics</div>
                    <div>• Carbon Footprint Tracking</div>
                    <div>• Smart Grid Technologies</div>
                    <div>• Environmental Monitoring</div>
                    <div>• Green Computing Practices</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
              Professional Experience
            </h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Senior Data Engineer</h3>
                      <p className="text-green-600 font-medium">EcoTech Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">March 2022</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed ML models for environmental monitoring reducing energy consumption by 30%</li>
                    <li>• Built real-time data processing pipelines for renewable energy optimization</li>
                    <li>• Created carbon footprint tracking system used by 100+ organizations</li>
                    <li>• Implemented predictive analytics for smart grid load balancing</li>
                    <li>• Led sustainability analytics team of 4 engineers</li>
                    <li>• Collaborated with environmental scientists to develop climate impact models</li>
                    <li>• Published research on sustainable computing practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-emerald-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Software Developer</h3>
                      <p className="text-emerald-600 font-medium">GreenTech Innovations</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2021 - February 2022</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Built IoT applications for smart city infrastructure monitoring</li>
                    <li>• Developed web applications for environmental data visualization</li>
                    <li>• Implemented automated reporting systems for sustainability metrics</li>
                    <li>• Created mobile app for personal carbon footprint tracking (10k+ downloads)</li>
                    <li>• Optimized database queries for large-scale environmental datasets</li>
                    <li>• Participated in green hackathons and sustainability challenges</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-teal-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Junior Software Engineer</h3>
                      <p className="text-teal-600 font-medium">TechForGood Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2021 - May 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed Python scripts for environmental data analysis</li>
                    <li>• Contributed to open-source sustainability projects</li>
                    <li>• Built web scrapers for collecting environmental data</li>
                    <li>• Assisted in developing renewable energy monitoring systems</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">Education</h2>
            <Card className="border-l-4 border-green-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Bachelor of Technology in computer science and design
                    </h3>
                    <p className="text-green-600 font-medium">kongu engineering college,perundurai,erode</p>
                  </div>
                  <span className="text-gray-500 text-sm">2023-2027</span>
                </div>
                <p className="text-gray-700 mb-2">CGPA: 8.5/10 | Specialization: Environmental Data Science</p>
                <p className="text-gray-700">
                  Relevant Coursework: Environmental Monitoring, Data Structures, Machine Learning, IoT Systems,
                  Renewable Energy Systems, Climate Change Modeling
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">Key Projects</h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Green Energy Dashboard</h3>
                  <p className="text-gray-700 mb-3">
                    Real-time monitoring system for renewable energy sources with predictive analytics for energy
                    optimization and carbon footprint tracking. Integrated with IoT sensors and weather data APIs.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">IoT</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">TensorFlow</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">PostgreSQL</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 30% energy optimization • Real-time monitoring • Used by 50+ facilities
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-emerald-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Traffic Prediction System</h3>
                  <p className="text-gray-700 mb-3">
                    ML-powered traffic flow prediction system that reduces urban congestion by 30% and optimizes traffic
                    light timing for better fuel efficiency and reduced emissions.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">TensorFlow</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">OpenCV</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">FastAPI</span>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded">Redis</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 30% congestion reduction • Published research paper • Deployed in 3 cities
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-teal-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Carbon Footprint Tracker</h3>
                  <p className="text-gray-700 mb-3">
                    Mobile and web application for personal and organizational carbon footprint tracking with
                    recommendations for reducing environmental impact.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">React Native</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">Django</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">Machine Learning</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded">MongoDB</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 15k+ active users • 25% average carbon reduction • Featured in tech blogs
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
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
                    <li>• Sustainability Hackathon Winner - Climate Tech Challenge 2023</li>
                    <li>• Research Publication - IEEE Conference on Smart Cities 2022</li>
                    <li>• Green Tech Advocate - Speaker at 5+ conferences</li>
                    <li>• Environmental Impact Award - EcoTech Solutions 2023</li>
                    <li>• Best Student Project - Anna University 2021</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-green-500" />
                    <h3 className="font-semibold text-gray-800">Professional Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Certified Environmental Data Scientist (2023)</li>
                    <li>• AWS Certified Cloud Practitioner (2022)</li>
                    <li>• KEC Data Analytics Professional Certificate (2022)</li>
                    <li>• TensorFlow Developer Certificate (2022)</li>
                    <li>• LEED Green Associate (2021)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Research & Publications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
              Research & Publications
            </h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    "Machine Learning Approaches for Urban Traffic Optimization"
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    IEEE Conference on Smart Cities and Green Computing, 2022
                  </p>
                  <p className="text-sm text-gray-700">
                    Co-authored research on ML algorithms for reducing urban traffic congestion and emissions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">"IoT-Based Environmental Monitoring Systems"</h3>
                  <p className="text-sm text-gray-600 mb-2">Journal of Environmental Technology, 2023</p>
                  <p className="text-sm text-gray-700">
                    Research on scalable IoT solutions for real-time environmental data collection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-green-200 pb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• English (Fluent)</li>
                  <li>• Tamil (Native)</li>
                  <li>• Hindi (Conversational)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Interests</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Climate Change Technology</li>
                  <li>• Sustainable Software Development</li>
                  <li>• Environmental Data Science</li>
                  <li>• Green Computing Practices</li>
                  <li>• Renewable Energy Systems</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
