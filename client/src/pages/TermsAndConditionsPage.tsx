import React from 'react';

import { Box, Text, } from '@chakra-ui/react';
import Navbar from '../components/Navbar';

const TermsAndConditionsPage = () => {

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
                textColor={"white"}
            >
                <Text fontSize="xl" fontWeight="bold" mb="4" color="white">Terms and Conditions</Text>
                <Text mb="4">Last updated: 2024-05-26</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">1. Introduction</Text>
                <Text mb="4" color="white">
                    Welcome to MentorAi. These terms and conditions outline the rules and regulations for the use of our website and services.
                    By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use MentorAi's website
                    if you do not accept all of the terms and conditions stated on this page.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">2. Intellectual Property Rights</Text>
                <Text mb="4" color="white">
                    Unless otherwise stated, MentorAi and/or its licensors own the intellectual property rights for all material on MentorAi.
                    All intellectual property rights are reserved. You may view and/or print pages from https://www.mentorai.com for your own
                    personal use subject to restrictions set in these terms and conditions.
                </Text>
                <Text mb="4" color="white">You must not:</Text>
                <Text mb="2" ml="4" color="white">- Republish material from https://www.mentorai.com</Text>
                <Text mb="2" ml="4" color="white">- Sell, rent or sub-license material from https://www.mentorai.com</Text>
                <Text mb="2" ml="4" color="white">- Reproduce, duplicate or copy material from https://www.mentorai.com</Text>
                <Text mb="4" ml="4" color="white">- Redistribute content from MentorAi (unless content is specifically made for redistribution)</Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">3. User Content</Text>
                <Text mb="4" color="white">
                    In these terms and conditions, “User Content” shall mean any audio, video text, images or other material you choose to display
                    on this website. By displaying User Content, you grant MentorAi a non-exclusive, worldwide irrevocable, sub-licensable license
                    to use, reproduce, adapt, publish, translate and distribute it in any and all media.
                </Text>
                <Text mb="4" color="white">
                    Your User Content must be your own and must not be infringing on any third party’s rights. MentorAi reserves the right to remove
                    any of your User Content from this website at any time without notice.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">4. No warranties</Text>
                <Text mb="4" color="white">
                    This website is provided "as is," with all faults, and MentorAi makes no express or implied representations or warranties, of any
                    kind related to this website or the materials contained on this website. Additionally, nothing contained on this website shall be
                    construed as providing consult or advice to you.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">5. Limitation of liability</Text>
                <Text mb="4" color="white">
                    In no event shall MentorAi, nor any of its officers, directors and employees, be held liable for anything arising out of or in any
                    way connected with your use of this website whether such liability is under contract.  MentorAi, including its officers, directors
                    and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related
                    to your use of this website.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">6. Indemnification</Text>
                <Text mb="4" color="white">
                    You hereby indemnify to the fullest extent MentorAi from and against any and all liabilities, costs, demands, causes of action,
                    damages and expenses (including reasonable attorney’s fees) arising out of or in any way related to your breach of any of the
                    provisions of these terms.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">7. Severability</Text>
                <Text mb="4" color="white">
                    If any provision of these terms is found to be invalid under any applicable law, such provisions shall be deleted without affecting
                    the remaining provisions herein.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">8. Variation of Terms</Text>
                <Text mb="4" color="white">
                    MentorAi is permitted to revise these terms at any time as it sees fit, and by using this website you are expected to review these
                    terms on a regular basis.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">9. Assignment</Text>
                <Text mb="4" color="white">
                    MentorAi is allowed to assign, transfer, and subcontract its rights and/or obligations under these terms without any notification.
                    However, you are not allowed to assign, transfer, or subcontract any of your rights and/or obligations under these terms.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">10. Entire Agreement</Text>
                <Text mb="4" color="white">
                    These terms constitute the entire agreement between MentorAi and you in relation to your use of this website, and supersede all
                    prior agreements and understandings.
                </Text>

                <Text fontSize="lg" fontWeight="bold" mt="4" color="white">11. Governing Law & Jurisdiction</Text>
                <Text mb="4" color="white">
                    These terms will be governed by and interpreted in accordance with the laws of Canada, and you submit to the non-exclusive
                    jurisdiction of the courts located in Canada for the resolution of any disputes.
                </Text>
            </Box>
        </div>
    );
};

export default TermsAndConditionsPage;
