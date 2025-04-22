'use client';
import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

const PrivacyPolicy: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isRead, setIsRead] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setIsRead(true);
          localStorage.setItem('privacyPolicyRead', 'true');
          if (window.opener && !window.opener.closed) {
            window.opener.postMessage('privacyPolicyRead', '*');
          }
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (content) {
        content.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleClose = () => {
    router.back();
  };
  return (
    <div className="min-h-screen bg-[url('https://tat-image.sgp1.cdn.digitaloceanspaces.com/workation_2024/3eda25d9b40019dd839f673118c9e5bf.png')] bg-bottom bg-cover flex items-center justify-center p-4">
      <div className='w-full max-w-4xl mx-auto bg-white border rounded-xl p-4 sm:p-8 my-8 mt-20'>
        <div className='flex justify-center mb-6'>
          <h1 className='text-xl sm:text-2xl font-bold text-center'>
            Privacy Policies
          </h1>
        </div>
        <div
          ref={contentRef}
          className='space-y-4 text-sm sm:text-base max-h-[60vh] overflow-y-auto'
        >
          <p>
            &emsp;
            <a
              className='underline text-blue-700 hover:text-blue-500 break-all hyphens-auto'
              href='www.amazinghorachan.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              www.amazinghorachan.com
            </a>{' '}
            <a>or </a>
            <a
              className='underline text-blue-700 hover:text-blue-500 break-all hyphens-auto'
              href='https://amazinghorachan.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              https://amazinghorachan.com
            </a>{' '}
            is owned and operated by Amazing Horachan 2025 Campaign. These
            privacy policies describe how we collect, use, disclose, process,
            and protect personally identifiable information ("personal
            information") that you ("user") may provide to participate in an
            activity on
            <a
              className='underline text-blue-700 hover:text-blue-500 break-all hyphens-auto'
              href='www.amazinghorachan.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              www.amazinghorachan.com
            </a>
            . Personal information refers to information that can be used to
            identify people or information details and other information that
            the organization possesses or has tendency to access whether it is
            true or not. Website reference includes all other relevant
            information including but not limited to the website for
            communication devices and application. When you visit or use the
            website, you agree and consent to allow us to collect, use,
            disclose, and process your personal information according to these
            privacy policies and or the conditions of the website. If you do not
            agree with privacy policies below, please leave the website
            immediately.
          </p>
          <p>
            &emsp;If we make corrections that lead to changing our ways of
            collecting and using your personal information, those changes will
            be notified in these privacy policies and starting date will be
            announced at the top of the privacy policies. Consequently, you
            should examine these privacy policies periodically to help you
            understand our latest policies and principles. Amazing Horachan 2025
            will obviously announce above-mentioned important changes before
            making any changes. If you do not agree with these changes or
            modification of privacy policies, please do not continue to use this
            website. You will consent to allow us to modify privacy policies
            when you use the website after starting date of privacy policies
            modification.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            1. Information we collect
          </h2>
          <p>
            &emsp;We collect your personal information from the way you use the
            website. The mentioned personal information includes but not limited
            to your name, user’s information, login information of Amazing
            Horachan 2025 Campaign, addresses, phone numbers, and emails. In
            addition, we also collect non-personally identifiable information
            (that cannot be used to identify you) including but not limited to
            IP address information, geographic location information, types of
            operating systems, nationalities, search settings and general
            information related to the use of the Internet.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            2. How we use information
          </h2>
          <p>
            &emsp;We may use your personal information and other information
            that are collected through the website. For the following purposes:
          </p>
          <ul className='list-disc pl-5'>
            <li>For identifying participants with us.</li>
            <li>To analyze for future development of the campaign.</li>
            <li>
              For contact with you regarding usage and / or visits and
              participation on the website including any inquiriesand / or
              requests that you submit via the website or otherwise.
            </li>
            <li>
              Publish your comments like Travel agent digitally and / or
              publicly accessible publications
            </li>
            <li>Our enforcement of terms and conditions</li>
            <li>For other purposes you have been informed while collecting</li>
          </ul>

          <h2 className='text-lg sm:text-xl font-semibold'>
            3. Sharing and transferring your personal information.
          </h2>
          <p>
            &emsp;Your personal information will / may be disclosed by Amazing
            Horachan 2025 to its affiliated companies of Amazing Horachan 2025
            Campaign. Furthermore, Amazing Horachan 2025 Campaign may also
            disclose your personal information to third persons such as service
            providers, distributors, or distributing agents for one or more
            purposes as mentioned above from time to time.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>4. Consent</h2>
          <p>
            &emsp;As stated above. When viewing and using the site, registering
            for events from the website, pressing "confirm" or equivalent or
            when you create a new account on your website:
          </p>
          <ul className='list-disc pl-5'>
            <li>
              Allow the Amazing Horachan 2025 Campaign to collect, use, disclose
              and / or process personal information as described for the
              purposes described above.
            </li>
          </ul>

          <h2 className='text-lg sm:text-xl font-semibold'>
            5. Withdrawal of consent
          </h2>
          <p>
            &emsp;You may withdraw your consent for the collection, use, or
            disclosure of your personal information at any time by informing us
            in advance appropriately. If you want to withdraw your consent,
            please let us know. Follow the contact details listed below. We will
            stop collecting, using, or disclosing your personal information upon
            receiving your notice of consent to withdrawal or at the end of the
            campaign period, your personal information will be automatically
            logged out unless required by law. If we have a legitimate business
            purpose or legal purpose to maintain the information and you agree
            that we will not be responsible forany loss or damage arising out of
            or relating to the termination of such information.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            6. Protecting your privacy
          </h2>
          <p>
            &emsp;We protect the personal information under our possession or
            control by managing appropriate security which includes physical,
            technical and organizational procedures in order to prevent access,
            collection, use, disclosure, copying, modification, disposal or
            similar risks.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            7. Links to other websites
          </h2>
          <p>
            &emsp;Our website may contain links to other interesting sites. If
            you use these links to leave our website, you should know that we
            cannot control those websites. Please note that we are not
            responsible for the privacy principles of other sites. We recommend
            that you read the privacy announcement on each site that contains
            personal information when you visit the site.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            8. Registration and membership
          </h2>
          <p>
            &emsp;This site allows you to create an account on a member
            registration based on the information you provide. When you give
            information, register, and create your account. You assure that:
          </p>
          <ul className='list-disc pl-5'>
            <li>You are at least 18 years old.</li>
            <li>
              Your information is correct, factual based on the current status
              and complete according to the registration form on the website.
              (&quot;Registration Information&quot;)
            </li>
            <li>
              You will update this registration information to make it true,
              accurate and complete.
            </li>
          </ul>
          <p>
            &emsp;We are fully responsible for all activities related to
            username or password. Your password is for your personal use only
            and you agree to keep your password strictly confidential. You agree
            to immediately notify Amazing Horachan 2025 Campaign about
            unauthorized use of your password or account or other security
            infringement to increase more security. Make sure you sign out after
            using this site each time. You agree that the Amazing Horachan 2025
            Campaign will not be responsible for any loss or damage occurring to
            us, to you or to a third party due to your failure to comply with
            this requirement.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            9. Acceptance of Privacy Policy Changes
          </h2>
          <p>
            &emsp;When you use our website or services, you consent to allow us
            to collect, use, disclose, and process your personal information. As
            defined in these privacy policies, we reserve the right to collect,
            use, disclose and process your personal information. According to
            these privacy policies, Amazing Horachan 2025 Campaign may change
            these privacy policies from time to time. As described at the
            beginning of this Privacy Policy, we will display the changes on
            this website to notify you.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>
            10. Enforcement Order
          </h2>
          <p>
            &emsp;In case of a disagreement between the website&apos;s terms and
            the privacy policy, we will strictly adhere to the terms of the
            website if you accept the terms of our website.
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>11. Contact Us</h2>
          <p>
            &emsp;If you have any question or request that related to this
            privacy policy. Please, contact our data protection officer by the
            <li>email: mutelutravel@gmail.com</li>
          </p>

          <h2 className='text-lg sm:text-xl font-semibold'>12. Cookies</h2>
          <p>
            &emsp;&quot;Cookies&quot; are small pieces of information that are
            stored by your browser on your computer&apos;s hard drive.{' '}
            <a
              className='underline text-blue-700 hover:text-blue-500 break-all hyphens-auto'
              href='www.amazinghorachan.com'
              target='_blank'
              rel='noopener noreferrer'
            >
              www.amazinghorachan.com
            </a>{' '}
            uses cookies in several ways. We use cookies to allow you to login
            without having to type your login name each time. Instead, only your
            password is needed to access the system. We also use cookies to
            track usage of the &quot;Guest&quot; path. Most Web browsers
            automatically accept cookies, but if you prefer, you can edit your
            browser options to block them in the future.
          </p>
        </div>
        <div className='mt-8 flex justify-center'>
            
          <button
            className={`w-full max-w-xs ${
              isRead ? 'bg-green-500' : 'bg-gray-400'
            }`}
            disabled={!isRead}
            onClick={handleClose}
          >
            {isRead
              ? 'Close and Return to Registration'
              : 'Please read the entire policy'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PrivacyPolicy;