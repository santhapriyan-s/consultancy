import React from 'react';
import { CheckCircle, Users, Award, Clock, Phone, MapPin, Mail } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="about-hero flex items-center justify-center">
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About SR Electricals
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Your trusted partner for quality electrical products since 2005
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                SR Electricals was founded in 2005 by Srinivas Reddy, a passionate electrical engineer with a vision to provide high-quality electrical products at affordable prices. What began as a small shop in the heart of the city has now grown into one of the region's most trusted electrical supply companies.
              </p>
              <p className="text-gray-700 mb-4">
                Throughout our journey, we have remained committed to our founding principles: quality, reliability, and exceptional customer service. We take pride in offering products that meet the highest safety standards and help our customers create safer, more efficient electrical systems.
              </p>
              <p className="text-gray-700">
                Today, SR Electricals serves thousands of customers, from homeowners to large commercial projects. Our team of experts is dedicated to providing personalized advice and solutions tailored to your specific needs.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-gray-100 p-6 rounded-lg h-full flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                  alt="SR Electricals Store" 
                  className="rounded-lg max-h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-brand-purple mb-4">
                <CheckCircle size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                We partner with trusted manufacturers and conduct thorough quality checks to ensure every product meets our high standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-brand-purple mb-4">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to exceed expectations with personalized service and expert advice.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-brand-purple mb-4">
                <Award size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We continuously improve our products, services, and knowledge to deliver excellence in every interaction.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-brand-purple mb-4">
                <Clock size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliability</h3>
              <p className="text-gray-600">
                Count on us for prompt delivery, transparent pricing, and dependable products that stand the test of time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="bg-gray-50 rounded-lg overflow-hidden text-center">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Srinivas Reddy" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Srinivas Reddy</h3>
                <p className="text-brand-purple mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  With over 20 years of experience in electrical engineering, Srinivas leads SR Electricals with a vision for innovation and excellence.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden text-center">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80" 
                alt="Priya Sharma" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Priya Sharma</h3>
                <p className="text-brand-purple mb-2">Operations Director</p>
                <p className="text-gray-600 text-sm">
                  Priya ensures smooth operations across all departments, maintaining SR Electricals' high standards of service.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden text-center">
              <img 
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" 
                alt="Rajesh Kumar" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Rajesh Kumar</h3>
                <p className="text-brand-purple mb-2">Technical Expert</p>
                <p className="text-gray-600 text-sm">
                  With a deep understanding of electrical systems, Rajesh provides expert advice and solutions to our customers.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg overflow-hidden text-center">
              <img 
                src="https://images.unsplash.com/photo-1573496267526-08a69e8b197e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80" 
                alt="Ananya Patel" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">Ananya Patel</h3>
                <p className="text-brand-purple mb-2">Customer Relations</p>
                <p className="text-gray-600 text-sm">
                  Ananya leads our customer service team, ensuring every client receives personalized attention and assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "SR Electricals has been our go-to supplier for all electrical needs. Their products are reliable, and their staff is knowledgeable and helpful. Highly recommend!"
              </p>
              <div className="mt-4">
                <h3 className="font-semibold">Ramesh Joshi</h3>
                <p className="text-gray-400 text-sm">Homeowner</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "As a contractor, I need reliable suppliers. SR Electricals consistently delivers quality products on time. Their team goes above and beyond to ensure customer satisfaction."
              </p>
              <div className="mt-4">
                <h3 className="font-semibold">Sunil Mehta</h3>
                <p className="text-gray-400 text-sm">Electrical Contractor</p>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                "The team at SR Electricals provided expert advice for our office renovation project. They recommended energy-efficient solutions that have significantly reduced our electricity bills."
              </p>
              <div className="mt-4">
                <h3 className="font-semibold">Neha Gupta</h3>
                <p className="text-gray-400 text-sm">Office Manager</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
              <p className="text-gray-700 mb-8">
                Have questions or need assistance? Our team is here to help. Reach out to us through any of the channels below:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-brand-soft-gray p-3 rounded-full mr-4">
                    <MapPin className="text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Visit Us</h3>
                    <p className="text-gray-600">123 Electric Road, Power City, PC 12345</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-brand-soft-gray p-3 rounded-full mr-4">
                    <Phone className="text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-gray-600">+123 456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-brand-soft-gray p-3 rounded-full mr-4">
                    <Mail className="text-brand-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-gray-600">info@srelectricals.com</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <form className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                      required
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-brand-purple text-white font-medium rounded-md hover:bg-brand-deep-purple transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-gray-100">
        <div className="h-96 w-full">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2146271426006!2d-73.98776528459448!3d40.757978942832716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25855c6480299%3A0x55194ec5a1ae072e!2sTimes%20Square!5e0!3m2!1sen!2sus!4v1645649838232!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="SR Electricals Location"
          ></iframe>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
