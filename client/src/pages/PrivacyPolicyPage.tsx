import React from 'react';

import { Box, Button, Text, } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage = () => {

    return (
        <div>
            <Navbar />
            <Box
                backgroundColor="#212121"
                borderRadius="md"
                p="6"
                maxW="800px"
                mx="auto"
                my="10"
                textColor="white"
            >
                <Text fontSize="xl" fontWeight="bold" mb="4" color="white">Privacy Policy</Text>
                <Text mb="4">Last updated: 2024-05-26</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">1. Introduction</Text>
                <Text mb="4">
                    Welcome to MentorAi. This privacy policy outlines how we collect, use, and protect your personal information when you use our services.
                    By accessing our website, you agree to the terms of this privacy policy.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">2. Information We Collect</Text>
                <Text mb="4">
                    We may collect the following types of information:
                </Text>
                <Text mb="2" ml="4">- Personal identification information (Name, email address, phone number, etc.)</Text>
                <Text mb="2" ml="4">- Usage data (Pages visited, time spent on site, etc.)</Text>
                <Text mb="2" ml="4">- Cookies and tracking data</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">3. How We Use Your Information</Text>
                <Text mb="4">
                    MentorAi uses the collected data for various purposes:
                </Text>
                <Text mb="2" ml="4">- To provide and maintain our services</Text>
                <Text mb="2" ml="4">- To notify you about changes to our services</Text>
                <Text mb="2" ml="4">- To allow you to participate in interactive features of our service when you choose to do so</Text>
                <Text mb="2" ml="4">- To provide customer support</Text>
                <Text mb="2" ml="4">- To gather analysis or valuable information so that we can improve our service</Text>
                <Text mb="2" ml="4">- To monitor the usage of our service</Text>
                <Text mb="2" ml="4">- To detect, prevent and address technical issues</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">4. Data Protection</Text>
                <Text mb="4">
                    We are committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, we have put in place suitable physical, electronic, and managerial procedures to safeguard and secure the information we collect online.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">5. Cookies</Text>
                <Text mb="4">
                    Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">6. Links to Other Websites</Text>
                <Text mb="4">
                    Our website may contain links to other websites of interest. However, once you have used these links to leave our site, you should note that we do not have any control over that other website. Therefore, we cannot be responsible for the protection and privacy of any information which you provide whilst visiting such sites and such sites are not governed by this privacy statement. You should exercise caution and look at the privacy statement applicable to the website in question.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">7. Controlling Your Personal Information</Text>
                <Text mb="4">
                    You may choose to restrict the collection or use of your personal information in the following ways:
                </Text>
                <Text mb="2" ml="4">- Whenever you are asked to fill in a form on the website, look for the box that you can click to indicate that you do not want the information to be used by anybody for direct marketing purposes</Text>
                <Text mb="2" ml="4">- If you have previously agreed to us using your personal information for direct marketing purposes, you may change your mind at any time by writing to or emailing us at [email address]</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4">8. Contact Us</Text>
                <Text mb="4">
                    If you have any questions about this Privacy Policy, please contact us:
                </Text>
                <Text mb="2" ml="4">- By email: [email address]</Text>
                <Text mb="2" ml="4">- By visiting this page on our website: [website URL]</Text>
                <Text mb="2" ml="4">- By phone number: [phone number]</Text>
                <Text mb="2" ml="4">- By mail: [physical address]</Text>
            </Box>
        </div>
    );
};

export default PrivacyPolicyPage;
