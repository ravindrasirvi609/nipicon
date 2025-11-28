import React from "react";

const LatestNews = () => {
  return (
    <div className="bg-light text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Latest News and Updates
        </h1>

        <div className="space-y-8">
          {/* News Item 1 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">
              Pioneering the Future of Drug Discovery: AI and Machine Learning
              Take Center Stage at International Conference
            </h2>
            <p className="text-lg leading-relaxed text-justify mb-4">
              The Department of Pharmaceutical Chemistry at JSS College of
              Pharmacy, Ooty, in collaboration with the Operant Pharmacy
              Federation, is proud to announce the International Research
              Conference on &quot;Recent Advances in Artificial Intelligence and
              Machine Learning Driven Drug Discovery.&quot;
            </p>
            <a href="/news/1" className="text-accent hover:text-secondary">
              Read more
            </a>
          </div>

          {/* News Item 2 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">
              International Conference to Explore the Role of AI and Machine
              Learning in Drug Discovery
            </h2>
            <p className="text-lg leading-relaxed text-justify mb-4">
              The International Research Conference on &quot;Recent Advances in
              Artificial Intelligence and Machine Learning Driven Drug
              Discovery,&quot; hosted by the Department of Pharmaceutical
              Chemistry at JSS College of Pharmacy, Ooty, and Operant Pharmacy
              Federation, is set to be a groundbreaking event.
            </p>
            <a href="/news/2" className="text-accent hover:text-secondary">
              Read more
            </a>
          </div>

          {/* News Item 3 */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-secondary">
              JSS College of Pharmacy to Host International Conference on
              AI-Driven Drug Discovery{" "}
            </h2>
            <p className="text-lg leading-relaxed text-justify mb-4">
              The Department of Pharmaceutical Chemistry at JSS College of
              Pharmacy, Ooty, in partnership with the Operant Pharmacy
              Federation, is excited to host the International Research
              Conference on &quot;Recent Advances in Artificial Intelligence and
              Machine Learning Driven Drug Discovery.&quot;
            </p>
            <a href="/news/3" className="text-accent hover:text-secondary">
              Read more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestNews;
