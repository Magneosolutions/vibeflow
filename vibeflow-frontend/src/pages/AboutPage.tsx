import React from 'react';
import mongoDbLogo from '../assets/MongoDB_logo.png';
import googleCloudLogo from '../assets/googlecloud.png';
import gracePhoto from '../assets/grace.png';
import duanePhoto from '../assets/duane.jpeg';

const AboutPage: React.FC = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-brand-primary mb-8">
          About VibeFlow
        </h1>

        <div className="bg-white shadow-xl rounded-lg p-8 space-y-10"> {/* Increased space-y */}
          <div>
            <p className="text-lg leading-relaxed">
              VibeFlow was proudly developed as an entry for the  
              <strong>MongoDB & Google Cloud AI in Action Challenge</strong>. 
              What makes VibeFlow particularly unique is its development journey: 
              it was built from the ground up with the dedicated assistance of 
              Google's Gemini AI, guiding every step from initial concept to full deployment.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">Core Technologies</h2>
            <div className="flex justify-center items-center space-x-8 mb-6">
              <img src={mongoDbLogo} alt="MongoDB Logo" className="h-12" />
              <img src={googleCloudLogo} alt="Google Cloud Logo" className="h-16" />
            </div>
            <p className="text-lg leading-relaxed">
              Our application leverages the robust capabilities of Google Cloud for hosting 
              both its frontend and backend services. We utilize MongoDB Atlas to seamlessly 
              ingest and manage relevant public datasets. Gemini then provides the 
              analytical power to understand user ideas and generate insightful, actionable 
              recommendations.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">The Problem We Solve</h2>
            <p className="text-lg leading-relaxed">
              VibeFlow aims to address a common hurdle faced by "vibecoders" – creative 
              individuals brimming with innovative app ideas but often unsure how to effectively 
              vet these concepts or where to begin their development journey. VibeFlow serves 
              as an intelligent co-pilot, offering guidance by:
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-lg leading-relaxed">
              <li>
                Illuminating available public datasets that align with their app concept.
              </li>
              <li>
                Providing curated educational links to help build a strong foundational 
                understanding for their idea.
              </li>
              <li>
                Assisting in transforming a nascent "vibe" into a more concrete and 
                actionable development plan.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">The Team</h2> {/* Centered title, increased mb */}
            <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-12">
              <div className="text-center">
                <img 
                  src={gracePhoto} 
                  alt="Grace Esteban" 
                  className="w-40 h-40 rounded-full object-cover mx-auto shadow-lg mb-3" 
                />
                <h3 className="text-xl font-semibold text-gray-700">Grace Esteban, MA Ed</h3>
                <p className="text-md text-brand-primary">Vibecoder Extraordinaire</p>
              </div>
              <div className="text-center">
                <img 
                  src={duanePhoto} 
                  alt="Duane Snider" 
                  className="w-40 h-40 rounded-full object-cover mx-auto shadow-lg mb-3" 
                />
                <h3 className="text-xl font-semibold text-gray-700">Duane Snider</h3>
                <p className="text-md text-brand-primary">The Quintessential Geek<br /></p>
              </div>
            </div>
          </div>
          
          <p className="text-center text-md text-gray-600 pt-6">
            Thank you for exploring VibeFlow!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
