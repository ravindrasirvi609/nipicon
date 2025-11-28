import React from "react";

const Testimonials = () => {
  return (
    <div className="bg-light text-primary px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Attendee Reviews */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">
            Attendee Reviews
          </h2>
          <div className="space-y-8">
            {/* Review 1 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-lg leading-relaxed text-justify italic">
                &quot;The conference was a fantastic experience. The sessions
                were incredibly insightful, and I made valuable connections with
                industry experts.&quot;
              </p>
              <p className="mt-4 text-right font-semibold">
                - Shivina Bhatia, BITS Pilani
              </p>
            </div>
            {/* Review 2 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-lg leading-relaxed text-justify italic">
                &quot;Attending this conference has been a game-changer for my
                research. The workshops and discussions were highly relevant and
                well-organized.&quot;
              </p>
              <p className="mt-4 text-right font-semibold">
                - Shruti Morankar, MET College of Pharmacy, Nashik
              </p>
            </div>
            {/* Review 3 */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <p className="text-lg leading-relaxed text-justify italic">
                &quot;I was impressed by the quality of the presentations and
                the level of expertise displayed by the speakers. It was a truly
                enriching experience.&quot;
              </p>
              <p className="mt-4 text-right font-semibold">
                - Apurva Wankhede School of Pharmacy, Dr. Vishwanath Karad MIT
                World Peace University, Pune
              </p>
            </div>
          </div>
        </div>

        {/* Video Testimonials */}
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-secondary text-center">
            Video Testimonials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video 1 */}
            <div className="flex justify-center">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/kx5z0XNhVYk?si=6GdofroHdYcFlA7e"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {/* Video 2 */}
            <div className="flex justify-center">
              <iframe
                width="300"
                height="200"
                src="https://www.youtube.com/embed/l0Uw3pRS0yI?si=sTjre_d6FhPt_-Gl"
                title="Video Testimonial 2"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            {/* Video 3 */}
            <div className="flex justify-center">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/CX1P2K0XtMw?si=_VeGfIEiJDJXHBxf"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
