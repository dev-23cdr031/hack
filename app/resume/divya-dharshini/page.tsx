"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Award, GraduationCap, Code } from "lucide-react"

export default function DivyaDharshiniResume() {
  const downloadResume = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Divya Dharshini S</h1>
              <p className="text-xl text-purple-100 mb-4">Full Stack Developer & UI/UX Designer</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>divyadharshis.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 63699 66349</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Namakkal,Tamil Nadu,India</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>https://www.linkedin.com/in/divyadharshini-subramanian-16a447370/</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>github.com/divyadharshini</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>divyadharshini.com</span>
                </div>
              </div>
            </div>
            <Button onClick={downloadResume} className="bg-white text-purple-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Passionate Full Stack Developer and UI/UX Designer with 3+ years of experience creating beautiful,
              functional digital experiences. Expert in bridging the gap between design and development, with a strong
              focus on user-centered solutions that drive business impact. Proven track record of improving user
              experience metrics by 55% and leading cross-functional teams to deliver high-quality products. Skilled in
              modern web technologies, design systems, and data-driven decision making.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Technical Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Frontend Development
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• React.js, Next.js, Vue.js</div>
                    <div>• TypeScript, JavaScript (ES6+)</div>
                    <div>• HTML5, CSS3, SASS/SCSS</div>
                    <div>• Tailwind CSS, Bootstrap</div>
                    <div>• Responsive Web Design</div>
                    <div>• Progressive Web Apps (PWA)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-pink-700 mb-2">UI/UX Design</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• UI/UX, Adobe XD, Sketch</div>
                    <div>• User Research & Testing</div>
                    <div>• Wireframing & Prototyping</div>
                    <div>• Design Systems & Style Guides</div>
                    <div>• Information Architecture</div>
                    <div>• Accessibility (WCAG 2.1)</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-700 mb-2">Backend & Tools</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Python, Django, Flask</div>
                    <div>• Node.js, Express.js</div>
                    <div>• PostgreSQL, MongoDB</div>
                    <div>• RESTful APIs, GraphQL</div>
                    <div>• Git, Docker, AWS</div>
                    <div>• Data Analysis (Pandas, NumPy)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Professional Experience
            </h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Senior Frontend Developer</h3>
                      <p className="text-purple-600 font-medium">TechCorp Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">March 2024</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Led the development of 5+ responsive web applications serving 100k+ users</li>
                    <li>• Improved user experience metrics by 40% through data-driven design decisions</li>
                    <li>• Implemented design system that reduced development time by 30%</li>
                    <li>• Guideed 3 junior developers and conducted code reviews</li>
                    <li>• Collaborated with product managers and designers to define technical requirements</li>
                    <li>• Optimized application performance, reducing load times by 50%</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">UI/UX Designer & Frontend Developer</h3>
                      <p className="text-pink-600 font-medium">Creative Studio</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2021 - February 2022</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Designed and developed user interfaces for 10+ mobile and web applications</li>
                    <li>• Conducted user research and usability testing for 3 major product launches</li>
                    <li>• Created comprehensive design systems and component libraries</li>
                    <li>• Increased user engagement by 35% through improved UX design</li>
                    <li>• Collaborated with cross-functional teams in Agile environment</li>
                    <li>• Focused on accessibility compliance and inclusive design practices</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Junior Web Developer</h3>
                      <p className="text-blue-600 font-medium">Digital Innovations</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2021 - May 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed responsive websites using HTML, CSS, and JavaScript</li>
                    <li>• Assisted in the migration of legacy systems to modern frameworks</li>
                    <li>• Participated in daily standups and sprint planning meetings</li>
                    <li>• Contributed to open-source projects and internal tool development</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">Education</h2>
            <Card className="border-l-4 border-purple-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Bachelor of Engineering  in Computer Science and design</h3>
                    <p className="text-purple-600 font-medium">kongu Engineering college,Perundurai</p>
                  </div>
                  <span className="text-gray-500 text-sm">2017 - 2021</span>
                </div>
                <p className="text-gray-700">
                  CGPA: 8.7/10 | Relevant Coursework: Data Structures, Algorithms, Database Management, Software
                  Engineering, Human-Computer Interaction
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">Key Projects</h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Interactive Portfolio Website</h3>
                  <p className="text-gray-700 mb-3">
                    A responsive portfolio website with smooth animations, dark/light mode toggle, and interactive
                    elements. Built with React and Framer Motion, featuring advanced CSS animations and optimized
                    performance.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Framer Motion</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">TypeScript</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • Achieved 95+ Lighthouse performance score • Implemented PWA features • 10k+ monthly visitors
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Sales Data Analyzer Dashboard</h3>
                  <p className="text-gray-700 mb-3">
                    A comprehensive dashboard for analyzing sales data with interactive charts, filters, and real-time
                    updates. Features predictive analytics and export capabilities for business intelligence.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Pandas</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Plotly</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Streamlit</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • Processed 1M+ data points • Reduced analysis time by 60% • Used by 50+ business analysts
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Achievements & Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Awards</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Best UI/UX Design Award - Chennai Design Conference 2023</li>
                    <li>• Hackathon Winner - Smart City Solutions Challenge 2022</li>
                    <li>• Employee of the Month - TechCorp Solutions (3 times)</li>
                    <li>• Dean's List - Anna University (2019, 2020)</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AWS Certified Developer Associate (2023)</li>
                    <li>• KEC UX Design Professional Certificate (2022)</li>
                    <li>• React Developer Certification - KEC (2022)</li>
                    <li>• Certified Scrum Master (CSM) - 2023</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
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
                <h3 className="font-semibold text-gray-800 mb-2">Interests</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Open Source Contribution</li>
                  <li>• Design Thinking Workshops</li>
                  <li>• Tech Blogging & Speaking</li>
                  <li>• Photography & Digital Art</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
