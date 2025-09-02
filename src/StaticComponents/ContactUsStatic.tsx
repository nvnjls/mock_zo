import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Send, Contact } from 'lucide-react';

const ContactUsStatic = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        grade: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section id="contact" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                        Start Your Learning Journey
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ready to boost your grades and confidence? Get in touch with us today to find the perfect tutor match and begin your path to academic success.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                We're here to help you succeed. Contact us to discuss your learning goals, ask questions about our tutoring services, or schedule your free consultation.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-blue-100 p-3 rounded-xl">
                                    <Phone className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                                    <p className="text-gray-600">Call us for immediate assistance</p>
                                    <a href="tel:+1234567890" className="text-blue-600 hover:text-blue-700 font-medium">
                                        (123) 456-7890
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-green-100 p-3 rounded-xl">
                                    <Mail className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                                    <p className="text-gray-600">Send us a detailed message</p>
                                    <a href="mailto:hello@edumentor.com" className="text-blue-600 hover:text-blue-700 font-medium">
                                        hello@edumentor.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-purple-100 p-3 rounded-xl">
                                    <MessageCircle className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Live Chat</h4>
                                    <p className="text-gray-600">Chat with our support team</p>
                                    <span className="text-green-600 font-medium">Online now</span>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-orange-100 p-3 rounded-xl">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Hours</h4>
                                    <div className="text-gray-600 space-y-1">
                                        <p>Monday - Friday: 8:00 AM - 10:00 PM</p>
                                        <p>Saturday - Sunday: 10:00 AM - 8:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                            <h4 className="font-bold text-gray-900 mb-3">Free Consultation Available</h4>
                            <p className="text-gray-600 mb-4">
                                Not sure where to start? Book a free 15-minute consultation to discuss your learning goals and get personalized recommendations.
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
                                Schedule Free Call
                            </button>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="(123) 456-7890"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="grade" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Grade Level
                                    </label>
                                    <select
                                        id="grade"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="">Select grade level</option>
                                        <option value="elementary">Elementary School</option>
                                        <option value="middle">Middle School</option>
                                        <option value="high">High School</option>
                                        <option value="college">College/University</option>
                                        <option value="adult">Adult Learning</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject of Interest *
                                </label>
                                <select
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="">Choose a subject</option>
                                    <option value="mathematics">Mathematics</option>
                                    <option value="science">Science (Biology, Chemistry, Physics)</option>
                                    <option value="english">English & Literature</option>
                                    <option value="social-studies">Social Studies</option>
                                    <option value="computer-science">Computer Science</option>
                                    <option value="languages">Foreign Languages</option>
                                    <option value="test-prep">Test Preparation</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                    placeholder="Tell us about your learning goals, challenges, or any questions you have..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                            >
                                <Send className="h-5 w-5" />
                                <span>Send Message</span>
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            We'll respond to your message within 24 hours during business days.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactUsStatic;