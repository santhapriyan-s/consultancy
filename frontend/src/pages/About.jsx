
import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Check, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section
 
  className="about-hero py-20 h-[500px] bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/p.jpg')" }}


>
  <div className="container mx-auto px-4 text-center">
    <div className="max-w-3xl mx-auto text-black">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">About SR Electricals</h1>
      <p className="text-xl mb-8">
        Your trusted partner for quality electrical solutions since 1995
      </p>
    </div>
  </div>
</section>


      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 1995 by Mr. S. Ramesh, SR Electricals began as a small electrical shop in the heart of the city. With a vision to provide quality electrical products and exceptional customer service, we've grown to become one of the region's most trusted electrical suppliers.
              </p>
              <p className="text-gray-700 mb-4">
                Over the past 30 years, we've expanded our product range to include everything from basic electrical supplies to cutting-edge smart home solutions. Our commitment to quality and customer satisfaction remains unwavering as we continue to evolve with changing technologies.
              </p>
              <p className="text-gray-700">
                Today, SR Electricals serves thousands of customers, from homeowners to large commercial projects, providing them with reliable electrical products that meet the highest safety standards.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/v.jpg" 
                alt="SR Electricals store" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400/e2e8f0/1e293b?text=SR+Electricals+Store';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              We're guided by our commitment to excellence, safety, and customer satisfaction in everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-srblue h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on the quality of our products. Every item we sell meets rigorous safety and performance standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-srorange h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Centric</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. We strive to exceed expectations with exceptional service and support.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-srblue h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously update our inventory with the latest electrical technologies and energy-efficient solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Meet the experts who drive our mission forward every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 px-4 sm:px-6 lg:px-8">
  {[
    { name: 'Sureshkumar', role: 'Founder', image: '/team-1.jpg' },
    { name: 'Rajaganesh', role: 'Worker', image: '/team-3.jpg' },
    { name: 'Meena', role: 'Worker', image: '/team-4.jpg' }
  ].map((member, index) => (
    <div 
      key={index} 
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={member.image} 
          alt={member.name} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/600x600/e2e8f0/1e293b?text=${member.name.charAt(0)}`;
          }}
          loading="lazy"
        />
      </div>
      <div className="p-4 text-center flex-grow flex flex-col justify-center">
        <h3 className="text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
        <p className="text-gray-600">{member.role}</p>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Achievements */}
      <section className="bg-srblue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="max-w-3xl mx-auto">
              Recognized for excellence in service and product quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">25+</div>
              <p>Years in Business</p>
            </div>
            
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">10K+</div>
              <p>Happy Customers</p>
            </div>
            
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">500+</div>
              <p>Products</p>
            </div>
            
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">5</div>
              <p>Industry Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Have questions or need assistance? Our team is here to help!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <Phone className="h-10 w-10 mx-auto mb-4 text-srblue" />
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">+91 9150532902</p>
              <p className="text-gray-600">Monday - Saturday: 9AM - 8PM</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <Mail className="h-10 w-10 mx-auto mb-4 text-srblue" />
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">srisrelectrical@gmail.com</p>
              <p className="text-gray-600">We respond within 24 hours</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <MapPin className="h-10 w-10 mx-auto mb-4 text-srblue" />
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Sri Pavun Complex,High School road,Chinnalapatti,Dindigul-624301</p>
              <p className="text-gray-600">Showroom: 10AM - 7PM</p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/contact">
              <Button className="bg-srblue hover:bg-blue-700 px-8 py-2">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
