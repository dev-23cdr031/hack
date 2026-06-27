"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Mail, Phone, MapPin, Linkedin, Github, Globe, Award, GraduationCap, Brain } from "lucide-react"

export default function AnusreeResume() {
  const downloadResume = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white p-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">Anusree D</h1>
              <p className="text-xl text-yellow-100 mb-4">AI Solutions Engineer & Software Developer</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>anusreed.23csd@kongu.edu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>+91 90806 20644</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Tiruppur,Tamil nadu,India</span>
                </div>
              </div>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  <span>linkedin.com/in/anusreed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  <span>github.com/anusreed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>anusree.com</span>
                </div>
              </div>
            </div>
            <Button onClick={downloadResume} className="bg-white text-yellow-600 hover:bg-gray-100">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="p-8">
          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Passionate AI Solutions Engineer and Software Developer with 3+ years of experience building intelligent
              systems that solve real-world problems. Expert in machine learning, natural language processing, and
              computer vision with a proven track record of developing ML models for predictive analytics and automated
              decision systems. Skilled in full-stack development with focus on AI integration, having built
              applications serving 100k+ users. Recognized as Kaggle Expert and published researcher in international AI
              conferences.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-l-4 border-yellow-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Machine Learning & AI
                  </h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Python, R, Julia</div>
                    <div>• TensorFlow, PyTorch, Keras</div>
                    <div>• Scikit-learn, XGBoost, LightGBM</div>
                    <div>• OpenCV, PIL, Matplotlib</div>
                    <div>• Pandas, NumPy, SciPy</div>
                    <div>• Jupyter, KEC Colab</div>
                    <div>• MLOps, Model Deployment</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-amber-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-amber-700 mb-2">Software Development</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Python, JavaScript, Java</div>
                    <div>• React, Node.js, Express.js</div>
                    <div>• FastAPI, Django, Flask</div>
                    <div>• PostgreSQL, MongoDB, Redis</div>
                    <div>• RESTful APIs, GraphQL</div>
                    <div>• Git, Docker, Kubernetes</div>
                    <div>• AWS, KEC Cloud Platform</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-orange-700 mb-2">AI Specializations</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div>• Natural Language Processing</div>
                    <div>• Computer Vision</div>
                    <div>• Deep Learning & Neural Networks</div>
                    <div>• Reinforcement Learning</div>
                    <div>• Time Series Forecasting</div>
                    <div>• Chatbots & Conversational AI</div>
                    <div>• AutoML & Hyperparameter Tuning</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Professional Experience
            </h2>

            <div className="space-y-6">
              <Card className="border-l-4 border-yellow-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Senior AI Engineer</h3>
                      <p className="text-yellow-600 font-medium">InnovateTech AI</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2022</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Developed ML models for predictive analytics improving business decisions by 40%</li>
                    <li>• Built automated decision systems processing 1M+ data points daily</li>
                    <li>• Led AI research team of 3 engineers on computer vision projects</li>
                    <li>• Implemented NLP solutions for document processing reducing manual work by 80%</li>
                    <li>• Deployed ML models in production using MLOps best practices</li>
                    <li>• Collaborated with product teams to integrate AI capabilities into existing systems</li>
                    <li>• Guideed junior developers and conducted AI workshops</li>
                    <li>• Published 2 research papers in international AI conferences</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-amber-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Software Developer & ML Engineer</h3>
                      <p className="text-amber-600 font-medium">CodeCraft Solutions</p>
                    </div>
                    <span className="text-gray-500 text-sm">June 2021 - December 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Built web applications with integrated AI capabilities serving 50k+ users</li>
                    <li>• Developed recommendation systems improving user engagement by 60%</li>
                    <li>• Created chatbots using NLP techniques for customer service automation</li>
                    <li>• Implemented computer vision solutions for image classification and object detection</li>
                    <li>• Optimized ML model performance reducing inference time by 70%</li>
                    <li>• Collaborated with cross-functional teams in agile development environment</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">Junior Data Scientist</h3>
                      <p className="text-orange-600 font-medium">DataTech Analytics</p>
                    </div>
                    <span className="text-gray-500 text-sm">January 2021 - May 2021</span>
                  </div>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Analyzed large datasets to extract business insights and patterns</li>
                    <li>• Built predictive models for sales forecasting and customer behavior</li>
                    <li>• Created data visualization dashboards using Python and Tableau</li>
                    <li>• Participated in machine learning competitions and hackathons</li>
                    <li>• Contributed to open-source ML projects and research initiatives</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">Education</h2>
            <Card className="border-l-4 border-yellow-500">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Master of Technology in Artificial Intelligence
                    </h3>
                    <p className="text-yellow-600 font-medium">Indian Institute of Technology,bombay</p>
                  </div>
                  <span className="text-gray-500 text-sm">2027-2029</span>
                </div>
                <p className="text-gray-700 mb-2">
                  CGPA: 9.1/10 | Thesis: "Deep Learning Approaches for Medical Image Analysis"
                </p>
                <p className="text-gray-700">
                  Relevant Coursework: Machine Learning, Deep Learning, Computer Vision, Natural Language Processing,
                  Reinforcement Learning, AI Ethics
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-amber-500 mt-4">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Bachelor of Engineering in Computer Science and design</h3>
                    <p className="text-amber-600 font-medium">kongu Engineering college,Perundurai,Erode</p>
                  </div>
                  <span className="text-gray-500 text-sm">2023-2027</span>
                </div>
                <p className="text-gray-700">
                  CGPA: 8.7/10 | Relevant Coursework: Data Structures, Algorithms, Database Systems, Software
                  Engineering, Statistics
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Key Projects */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">Key AI Projects</h2>
            <div className="space-y-4">
              <Card className="border-l-4 border-yellow-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Document Summarizer</h3>
                  <p className="text-gray-700 mb-3">
                    Intelligent document processing system using advanced NLP to automatically summarize lengthy
                    documents, extract key insights, and generate actionable reports. Implemented using transformer
                    models and BERT.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">Transformers</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">BERT</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">FastAPI</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">React</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 95% accuracy in summarization • 80% time reduction • Used by 500+ professionals
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-amber-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Home Automation System</h3>
                  <p className="text-gray-700 mb-3">
                    IoT-based smart home system with AI-powered energy optimization, predictive maintenance, and voice
                    control integration for seamless home management and energy efficiency.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Python</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">IoT</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">TensorFlow</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Raspberry Pi</span>
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">MQTT</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 35% energy savings • Voice recognition 98% accuracy • Featured in IoT showcase
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Medical Image Analysis Platform</h3>
                  <p className="text-gray-700 mb-3">
                    Deep learning platform for medical image analysis using CNNs for disease detection and diagnosis
                    assistance. Achieved state-of-the-art accuracy in multiple medical imaging tasks.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">PyTorch</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">OpenCV</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">CNN</span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Medical Imaging</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    • 96% diagnostic accuracy • Published in medical journal • Used in 3 hospitals
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Research & Publications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Research & Publications
            </h2>
            <div className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    "Deep Learning Approaches for Automated Medical Diagnosis"
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    International Conference on Artificial Intelligence in Medicine, 2024
                  </p>
                  <p className="text-sm text-gray-700">
                    First author research on CNN architectures for medical image classification with 96% accuracy.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    "NLP Techniques for Document Summarization and Information Extraction"
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">Journal of Natural Language Processing, 2025</p>
                  <p className="text-sm text-gray-700">
                    Co-authored research on transformer-based models for document processing and summarization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Achievements & Certifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
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
                    <li>• AI Innovation Award - Kerala Tech Summit 2026</li>
                    <li>• Kaggle Expert - Top 5% in multiple ML competitions</li>
                    <li>• Best Research Paper - International AI Conference 2026</li>
                    <li>• Outstanding Graduate Student - IIT Kochi 2026</li>
                    <li>• KEC AI Challenge Winner - 2025</li>
                    <li>• Women in AI Leadership Award - 2023</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-yellow-500" />
                    <h3 className="font-semibold text-gray-800">Professional Certifications</h3>
                  </div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• TensorFlow Developer Certificate - KEC (2027)</li>
                    <li>• AWS Certified Machine Learning Specialty (2026)</li>
                    <li>• Deep Learning Specialization - Coursera (2026)</li>
                    <li>• Microsoft Azure AI Engineer Associate (2025)</li>
                    <li>• NVIDIA Deep Learning Institute Certification (2024)</li>
                    <li>• IBM Data Science Professional Certificate (2026)</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Technical Contributions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Technical Contributions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Open Source Projects</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• ML-Utils Library - 2k+ GitHub stars</li>
                    <li>• Document-AI Toolkit - 1.5k+ downloads</li>
                    <li>• Computer Vision Helpers - 800+ stars</li>
                    <li>• NLP Preprocessing Pipeline - 600+ forks</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Community Involvement</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• AI Guide - Helped 50+ students</li>
                    <li>• Tech Blog Writer - 25+ articles (5k+ readers)</li>
                    <li>• Conference Speaker - 8+ AI conferences</li>
                    <li>• Kaggle Contributor - 15+ public datasets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Additional Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-yellow-200 pb-2">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• English (Fluent)</li>
                  <li>• Malayalam (Native)</li>
                  <li>• Hindi (Conversational)</li>
                  <li>• Tamil (Basic)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Professional Interests</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Artificial General Intelligence</li>
                  <li>• Ethical AI Development</li>
                  <li>• Medical AI Applications</li>
                  <li>• AI for Social Good</li>
                  <li>• Quantum Machine Learning</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
