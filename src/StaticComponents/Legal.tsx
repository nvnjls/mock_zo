// LegalPage.tsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

/**
 * Replace 'MyCompany' with your registered company name once available
 */
const COMPANY_NAME = "MyCompany"; // <-- Update this after registration

interface LegalPageProps {
    isOpen: boolean;
    onClose: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ isOpen, onClose }) => {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="max-w-5xl w-full bg-white rounded-xl p-6 shadow-xl">
                                <Dialog.Title as="h1" className="text-3xl font-bold text-blue-800 mb-2">
                                    {COMPANY_NAME} Legal Information
                                </Dialog.Title>
                                <p className="text-lg text-gray-500 mb-8">
                                    Last Updated: Sep 10, 2025
                                </p>
                                <div className="space-y-12">
                                    {/* Privacy Policy */}
                                    <section>
                                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Privacy Policy</h2>
                                        <p>
                                            At {COMPANY_NAME}, user privacy is our top priority. We only collect data essential for site optimization, analysis, user experience, and support. No data is sold or misused.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Data We Collect</h3>
                                        <ul className="list-disc list-inside text-gray-700 mb-4">
                                            <li>Name, email, phone number</li>
                                            <li>ISP, IP, device and browser info, location, language, session and usage data</li>
                                            <li>Interaction events: clicks, scrolls, session time, mouse movements</li>
                                            <li>Demographic data for analysis and platform improvement</li>
                                        </ul>
                                        <p>
                                            Mandatory data is required for services; optional data can be withheld without affecting access. Third-party personal data shared or published is your responsibility.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Cookies & Tracking</h3>
                                        <p>
                                            {COMPANY_NAME} uses cookies for preferences, analytics, and improvement. Third-party ad networks may use cookies or scripts, which are not controlled by us. Refer to their respective privacy policies.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Managing and Deleting Data</h3>
                                        <p>
                                            Access, update, or request deletion of your data via Account Settings. Essential business, legal, or fraud prevention data may be retained (per law). Data contributed publicly may remain visible, but personal identifiers are removed. Backup copies may persist for safety.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Security</h3>
                                        <p>
                                            We use industry-standard security protocols to protect your data from unauthorized access or alteration.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Policy Changes</h3>
                                        <p>
                                            This Privacy Policy may be updated without prior notice. Changes marked as "Last Updated" at the top. Continued site use implies acceptance.
                                        </p>
                                    </section>

                                    {/* Terms and Conditions */}
                                    <section>
                                        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Terms and Conditions</h2>
                                        <p>
                                            Welcome to {COMPANY_NAME}. By using this website, you agree to be bound by these terms. Discontinue use if you do not agree.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Definitions</h3>
                                        <p>
                                            'User', 'You', 'Your' refer to any person accessing our site. '{COMPANY_NAME}', 'Company', 'We', 'Our', 'Us' refer to our organization. All references are interchangeable as context demands.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Cookies Consent</h3>
                                        <p>
                                            By using our services, you consent to {COMPANY_NAME}'s use of cookies for user experience, navigation, and service optimization.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Non-Circumvention</h3>
                                        <p>
                                            All paid mentoring, sessions, or platform services must occur on {COMPANY_NAME}. Off-platform arrangements or payments are strictly prohibited.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Fees & Payment Policies</h3>
                                        <ul className="list-disc list-inside mb-4">
                                            <li>All payments processed via secure third-party gateways.</li>
                                            <li>Service fees applied per transaction; details disclosed before booking.</li>
                                            <li>Accurate billing info required to complete purchases.</li>
                                        </ul>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Hyperlinking</h3>
                                        <p>
                                            Accredited, governmental, and news organizations may link to our website per fair use policies. Conditional linking from other entities may be granted upon approval.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">iFrames and Content Liability</h3>
                                        <ul className="list-disc list-inside mb-4">
                                            <li>No framing or visual alteration allowed without written permission.</li>
                                            <li>{COMPANY_NAME} is not responsible for content on external sites linking here.</li>
                                        </ul>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Reservation of Rights & Link Removal</h3>
                                        <p>
                                            We reserve the right to modify policies or request link removal at any time. Requests can be sent to [support@mycompany.com].
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Disclaimer</h3>
                                        <p>
                                            {COMPANY_NAME} excludes all warranties relative to the site's use except as required by law. No waiver is valid unless in writing.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Governing Law</h3>
                                        <p>
                                            These terms are governed by the laws of India.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Entire Agreement</h3>
                                        <p>
                                            These terms apply collectively and entirely to the use of {COMPANY_NAME} services, superseding previous terms.
                                        </p>
                                        <h3 className="mt-6 mb-2 text-xl font-medium text-gray-700">Contact Information</h3>
                                        <p>
                                            For inquiries, email: support@mycompany.com
                                        </p>
                                    </section>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LegalPage;
