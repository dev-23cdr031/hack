"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Award, GraduationCap, Palette } from "lucide-react"

export default function HemapriyaResume() {
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
              <h1 className="text-4xl font-bold mb-2">Hemapriya VS</h1>
              <p className="text-xl text-purple-100 mb-4">Senior UI/UX Designer & Frontend Developer</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>hemapriyavs.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 72003 00816</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>, dharmapuri, India</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin.com/in/hemapriya</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>hemapriyavs.github</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>hemapriya.design</span>
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
              Creative UI/UX Designer and Frontend Developer with 3+ years of experience creating delightful user
              experiences through thoughtful design and seamless interactions. Expert in blending creativity with
              functionality to build interfaces that users love and businesses need. Proven track record of improving
              conversion rates by 45% through user-centered design and leading design for 15+ web and mobile
              applications. Skilled in design systems, user research, and modern frontend technologies with a passion
              for accessibility and inclusive design.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Design & Development Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    UI/UX Design
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• UI/UX, Adobe XD, Sketch</div>
                    <div>• User Research & Testing</div>
                    <div>• Wireframing & Prototyping</div>
                    <div>• Design Systems & Style Guides</div>
                    <div>• Information Architecture</div>
                    <div>• Accessibility (WCAG 2.1)</div>
                    <div>• Usability Testing & A/B Testing</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-pink-700 mb-2">Frontend Development</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• React, Next.js, Vue.js</div>
                    <div>• TypeScript, JavaScript (ES6+)</div>
                    <div>• HTML5, CSS3, SASS/SCSS</div>
                    <div>• Tailwind CSS, Styled Components</div>
                    <div>• Framer Motion, GSAP</div>
                    <div>• Responsive Web Design</div>
                    <div>• Performance Optimization</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-rose-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-rose-700 mb-2">Tools & Technologies</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• React Native, Flutter</div>
                    <div>• Git, GitHub, GitLab</div>
                    <div>• Webpack, Vite, Parcel</div>
                    <div>• Jest, Cypress, Storybook</div>
                    <div>• Adobe Creative Suite</div>
                    <div>• Principle, InVision, Marvel</div>
                    <div>• Zeplin, Abstract, Avocode</div>
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
                      <h3 className="text-xl font-semibold text-gray-800">Senior UI/UX Designer & Design Lead</h3>
                      <p className="text-purple-600 font-medium">DesignCraft Studio</p>
                    </div>
                    <span className="text-gray-500 text-sm">2024</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Led design for 15+ web and mobile applications serving 500k+ users</li>
                    <li>• Improved conversion rates by 45% through user-centered design and A/B testing</li>
                    <li>• Guideed team of 4 junior designers and established design review processes</li>
                    <li>• Created comprehensive design system reducing development time by 40%</li>
                    <li>• Conducted user research and usability testing for 8 major product launches</li>
                    <li>• Collaborated with product managers and engineers in agile environment</li>
                    <li>• Implemented accessibility standards achieving WCAG 2.1 AA compliance</li>
                    <li>• Presented design solutions to C-level executives and stakeholders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Frontend Developer & UI Designer</h3>
                      <p className="text-pink-600 font-medium">TechFlow Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2020 - January 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed responsive interfaces and implemented design systems for 6 products</li>
                    <li>• Increased user engagement by 35% through improved UX design and interactions</li>
                    <li>• Built reusable component library used across multiple projects</li>
                    <li>• Optimized frontend performance reducing load times by 50%</li>
                    <li>• Collaborated with backend developers to integrate APIs and data flows</li>
                    <li>• Conducted design workshops and user experience training sessions</li>
                    <li>• Maintained design consistency across web and mobile platforms</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-rose-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">UI/UX Designer</h3>
                      <p className="text-rose-600 font-medium">Creative Digital Agency</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2020 - May 2020</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Designed user interfaces for client projects across various industries</li>
                    <li>• Created wireframes, prototypes, and high-fidelity mockups</li>
                    <li>• Conducted user interviews and created user personas</li>
                    <li>• Collaborated with clients to understand business requirements</li>
                    <li>• Delivered pixel-perfect designs within tight deadlines</li>
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
                    <h3 className="text-xl font-semibold text-gray-800">Bachelor of Design in Visual Communication</h3>
                    <p className="text-purple-600 font-medium">National Institute of Design, Mumbai</p>
                  </div>
                  <span className="text-gray-500 text-sm">2016 - 2020</span>
                </div>
                <p className="text-gray-700 mb-2">CGPA: 8.8/10 | Specialization: Digital Design & User Experience</p>
                <p className="text-gray-700">
                  Relevant Coursework: Human-Computer Interaction, Design Thinking, Typography, Color Theory,
                  Information Design, Digital Media, User Research Methods
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Featured Design Projects
            </h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Travel Booking App Redesign</h3>
                  <p className="text-gray-700 mb-3">
                    Complete UX overhaul of a travel booking platform, improving conversion rates by 45% through
                    user-centered design and streamlined booking flow. Conducted extensive user research and testing.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">UI/UX</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">User Research</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Prototyping</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">A/B Testing</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">React</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 45% conversion increase • 60% reduction in booking abandonment • 100k+ monthly users
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-pink-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">E-learning Dashboard</h3>
                  <p className="text-gray-700 mb-3">
                    Interactive learning management system with progress tracking, gamification elements, and adaptive
                    UI that personalizes based on user behavior and learning patterns.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">React</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">TypeScript</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">D3.js</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Tailwind CSS</span>
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">Framer Motion</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 40% increase in course completion • Adaptive learning interface • 25k+ students
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-rose-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Healthcare Mobile App</h3>
                  <p className="text-gray-700 mb-3">
                    Patient-centered mobile application for appointment booking, medical records, and telemedicine
                    consultations with focus on accessibility and elderly user experience.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">React Native</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">Accessibility</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">User Testing</span>
                    <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs rounded">Prototyping</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • WCAG 2.1 AA compliant • 90% user satisfaction • Featured in design awards
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Achievements & Recognition
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Awards & Honors</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Design Excellence Award - UX India Conference 2023</li>
                    <li>• Dribbble Top Shot - Featured design with 10k+ likes</li>
                    <li>• Best Mobile App Design - Mumbai Design Awards 2022</li>
                    <li>• Designer of the Year - DesignCraft Studio 2023</li>
                    <li>• Featured in Design Inspiration - Behance (5 projects)</li>
                    <li>• Awwwards Site of the Day - 2 projects</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-purple-500" />
                    <h3 className="font-semibold text-gray-800">Professional Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• KEC UX Design Professional Certificate (2023)</li>
                    <li>• Adobe Certified Expert - Photoshop & Illustrator (2022)</li>
                    <li>• UI/UX Advanced Certification (2022)</li>
                    <li>• Accessibility Specialist Certification (2023)</li>
                    <li>• Design Thinking Facilitator - IDEO (2021)</li>
                    <li>• Certified Scrum Product Owner (2023)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Design Philosophy & Approach */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Design Philosophy & Approach
            </h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Design Principles</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• User-centered design approach</li>
                      <li>• Accessibility and inclusive design</li>
                      <li>• Data-driven design decisions</li>
                      <li>• Iterative design and testing</li>
                      <li>• Collaborative design process</li>
                      <li>• Sustainable and ethical design</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Design Process</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Research & Discovery</li>
                      <li>• User Personas & Journey Mapping</li>
                      <li>• Ideation & Concept Development</li>
                      <li>• Wireframing & Prototyping</li>
                      <li>• Visual Design & Interaction</li>
                      <li>• Testing & Iteration</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Speaking & Community */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-purple-200 pb-2">
              Speaking & Community Involvement
            </h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Conference Speaker</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• "Designing for Accessibility" - UX India Conference 2023</li>
                    <li>• "The Future of Design Systems" - Design+Research Conference 2022</li>
                    <li>• "Mobile-First Design Strategies" - Mumbai Design Meetup 2022</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Community Contributions</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Design System Creator - Open source component library (3k+ downloads)</li>
                    <li>• Guide at ADPList - Helping 20+ aspiring designers</li>
                    <li>• Design Workshop Facilitator - Conducted 15+ workshops</li>
                    <li>• Design Blog Writer - 50+ articles on Medium (10k+ followers)</li>
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
                  <li>• Hindi (Native)</li>
                  <li>• Marathi (Conversational)</li>
                  <li>• Tamil (Basic)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Interests & Hobbies</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Digital Art & Illustration</li>
                  <li>• Photography & Visual Storytelling</li>
                  <li>• Design Thinking Workshops</li>
                  <li>• Sustainable Design Practices</li>
                  <li>• Travel & Cultural Research</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
