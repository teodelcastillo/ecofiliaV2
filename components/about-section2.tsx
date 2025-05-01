import Image from "next/image"
import { Github, Linkedin, Twitter } from "lucide-react"

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">About Us</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Meet the team behind Ecofilia's mission to create sustainable solutions for a better world.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl py-12">
          {/* Team Member 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/SOFI.png" alt="Sofia del Castillo" width={160} height={160} className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Sofia del Castillo</h3>
            <p className="text-green-600 font-medium mb-2">Co-founder, Chief Sustainability Officer (CSO)</p>
            <p className="text-muted-foreground mb-4">
            A seasoned sustainability professional with over 8 years of global experience driving climate action and advancing environmental, social, and governance (ESG) goals. Sofía holds a Master’s degree in Climate, Land Use, and Ecosystem Services and has collaborated with leading organizations such as the Inter-American Development Bank, the United Nations, and government institutions. Her expertise spans climate finance, policy design, and sustainability, where she has led projects involving capacity building, international negotiations, stakeholder engagement, and multimillion-dollar funding proposals. With a deep commitment to creating a more sustainable future, Sofía leverages innovative solutions to bridge technology and sustainability, driving measurable impact and promoting resilience in public and private sectors.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/gon.png" alt="Gonzalo Gambertoglio" width={160} height={160} className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Gonzalo Gambertoglio</h3>
            <p className="text-green-600 font-medium mb-2">Co-founder, Chief Executive Officer (CEO)</p>
            <p className="text-muted-foreground mb-4">
            An entrepreneurial Sales and Operations leader with over 12 years of experience spanning multinational corporations and business ownership. Gonzalo Gambertoglio holds an MBA and a Bachelor's in Business Administration. His corporate tenure includes roles at Coca-Cola, Mattel, and Danone, where he excelled in business development, franchise management, and key account leadership, driving strategic initiatives and operational efficiencies. As Co-Managing Partner of Ammos Vacation Rentals, Gonzalo has successfully restructured the business, scaling operations while implementing innovative sales, customer service, and financial processes. He brings a strategic vision and hands-on expertise in transforming challenges into growth opportunities.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full mb-4">
              <Image src="/teo.png" alt="Teodoro del Castillo" width={160} height={160} className="object-cover" />
            </div>
            <h3 className="text-xl font-bold">Teodoro del Castillo</h3>
            <p className="text-green-600 font-medium mb-2">Co-Founder - Chief Technology Officer (CTO)</p>
            <p className="text-muted-foreground mb-4">

            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-500 hover:text-green-600">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
